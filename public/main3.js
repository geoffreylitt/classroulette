var busy = false;
var numberOfRows;
var numberOfColumns;
var firstQuery = true;

 $(document).ready(function() {
  var $container = $('#container');

  var body_width = $('body').width();
  body_width = body_width - 15;
  var container_width = body_width - (body_width % 188) + 15;
  $container.width(container_width);

  $container.isotope({
    // options
    itemSelector : '.box',
    masonry : {
      columnWidth : 1
    },
    getSortData: {
      number : function($box){
        return boxNumber($box);
      }
    },
    sortBy: 'number',
    animationEngine: 'best-available',
    animationOptions: {
     duration: 400,
     easing: 'swing',
     queue: false
   }
  });

  $('a.logo').click(function(){
    load_courses();
    _gaq.push(['_trackEvent', 'Load courses', 'Logo', '', numberOfCourses()]);
    return false;
  });

  $(document).keydown(function(e){
   if(e.which == 32){
      //pressed space
      load_courses();
      _gaq.push(['_trackEvent', 'Load courses', 'Spacebar', '', numberOfCourses()]);
   }
  });

  $('a.logo').css('margin-left', $(window).width()/2 -98);
  $('a.logo').css('margin-right', 0);

  $container.delegate( '.box', 'click', function(){
    expandBox($(this), false);
  });

  $(window).smartresize(function(){
    $('a.logo').css('margin-left', $(window).width()/2 -98);

    $container = $('#container');
    var body_width = $('body').width();
    body_width = body_width - 15;
    var container_width = body_width - (body_width % 188) + 15;
    $container.width(container_width);
    $container.isotope('reLayout');

    numberOfRows = calculateNumberOfRows();
    numberOfColumns = calculateNumberOfColumns();

  });

  //override facebook share links to open in new window
  $("body").delegate("a.fb", "click", function(){
    window.open($(this).attr("href"), "", "width=655,height=430");
    return false;
  });


});

String.prototype.truncate =
     function(n,useWordBoundary){
         var toLong = this.length>n,
             s_ = toLong ? this.substr(0,n-1) : this;
         s_ = useWordBoundary && toLong ? s_.substr(0,s_.lastIndexOf(' ')) : s_;
         return  toLong ? s_ + '...' : s_;
      };

function load_courses(){
  if (busy){
    return false;
  }

  busy = true;

  var template;
  var $container = $('#container');
  var $newItems = $('');
  var $oldItems = $('.box');

  if($('#final_message').is(':visible')){
    $('#final_message').hide();
  }

  if($('#second_message').is(':visible')){
    $('#second_message').hide();
    setTimeout(function(){$('#final_message').show(500);}, 1500);
  }

  if($('#welcome_message').is(':visible')){
    $('#welcome_message').hide();
    if($('#recommendation').is(':visible')){
      $('#recommendation').hide();
    }
    document.title = "Yale Classroulette"; //reset title
    window.history.replaceState("dummy", "Yale Classroulette", "/"); //reset URL (hacky...)
    setTimeout(function(){$('#second_message').show(500);}, 1500);
  }

  $container.isotope('remove', $oldItems);

  var opts = {
  lines: 13, // The number of lines to draw
  length: 17, // The length of each line
  width: 6, // The line thickness
  radius: 18, // The radius of the inner circle
  rotate: 0, // The rotation offset
  color: '#ffffff', // #rgb or #rrggbb
  speed: 2.2, // Rounds per second
  trail: 60, // Afterglow percentage
  shadow: false, // Whether to render a shadow
  hwaccel: true, // Whether to use hardware acceleration
  className: 'spinner', // The CSS class to assign to the spinner
  zIndex: 2e9, // The z-index (defaults to 2000000000)
  top: 'auto', // Top position relative to parent in px
  left: 'auto' // Left position relative to parent in px
  };

  var spinner = new Spinner(opts).spin(document.body);

  $.get('template2.html', function(templates) {
    course_template = $(templates).filter('#course_template').html();
  });

  numberOfColumns = calculateNumberOfColumns();
  numberOfRows = calculateNumberOfRows();

  queryString = '/random?';
  recommendation_id = $('#container').data('courseid')
  if(firstQuery && typeof recommendation_id != 'undefined'){
    queryString += ('first_id=' + recommendation_id + '&');
  }
  queryString += ('n=' + numberOfCourses());
  $.getJSON(queryString, function(data) {
    $.each(data, function(index, course_obj) {
      var course = course_obj["course"];
      var course_data = {
        oci_id: course["oci_id"],
        number: course["department"] + " " + course["number"],
        name: course["name"],
        professors: course["professors"].split(",").join(", ").truncate(50, true),
        desc: course["desc"].split("\n").join("<br><br>"),
        skills: course["skills"].split(",").join(" ") + " " + course["areas"].split(",").join(" "),
        hours: course["hours"].split(",").join(", "),
        color1: courseColor(course["category"])[0],
        color2: courseColor(course["category"])[1],
        no_exam: course["no_exam"] ? 'no_exam' : '',
        reading_period: course["reading_period"] ? 'reading_period' : '',
        permission_required: course["permission_required"] ? "permission_required" : '',
        ybb_id: course["ybb_id"],
        semester: course["semester"],
        box_index: index
      }

      var output = Mustache.render(course_template, course_data);
      $newItems = $newItems.add(output);
    })

    spinner.stop();

    $container.isotope('insert', $newItems, function(){
      //alert("in the callback!");
      //this alert doesn't show up on firefox

      expandBox($("#box-0"), true);

      $container.find('.box').hover(
        function(){
          $(this).css("background-color", $(this).data('color-secondary'));
        },
        function(){
          $(this).css("background-color", $(this).data('color-primary'));
        }
      );

      $('a.oci').click(function(){
        window.open("http://students.yale.edu/oci/resultDetail.jsp?course=" + $(this).data("oci-id") + "&term=" + $(this).data("semester"), "_blank", 'width=600,height=400');
        return false;
      });

      $('a.ybb').click(function(){
        window.open("https://ybb.yale.edu/search/q?term=" + $(this).data("semester") + "&number=" + $(this).parents(".box").find("h2.number").text(), "_blank", 'width=1100,height=800');
        return false;
      });

      $(".no_exam, .reading_period, .permission_required").tipTip({delay: 200});

      busy = false;
      firstQuery = false;
    });
  });

}

function courseColor(category){
  var colors = [];
  switch(category){
    case 'arts':
      colors = ['#2D9C90', '#238A7F'];
      break;
    case 'lang':
      colors = ['#883636', '#772B2B'];
      break;
    case 'sosc':
      colors = ['#BB7A1E', '#AD6700'];
      break;
    case 'hums':
      colors = ['#366488', '#294F6D'];
      break;
    case 'sci':
      colors = ['#368836', '#297C29'];
      break;
    case 'other':
      colors = ['#883636', '#772B2B'];
      break;
    default:
      colors = ['#883636', '#772B2B'];
  }

  return colors;
}

function showAbout(){
  $('#about').show();

  return false;
}

function hideAbout(){
  $('#about').hide();
  return false;
}

function numberOfCourses(){
  return numberOfRows * numberOfColumns - 3;
}

function calculateNumberOfColumns(){
  return Math.floor(($('#container').width() - 15)/183);
}

function calculateNumberOfRows(){
  return Math.floor(($(window).height() - 65)/183);
}

function boxNumber($box){
  return parseInt($box.attr('id').split('-')[1]);
}

function realBoxNumber($box){
  var largeNumber = boxNumber($('.large'));
  var largeColumn = largeNumber % numberOfColumns;
  var thisNumber = boxNumber($box);
  var fixedNumber = thisNumber + 3; //reports "correct" box number if box is below the 2 rows occupied by large
  var thisFixedColumn = fixedNumber % numberOfColumns;

  var result, offsetFromLargeColumn, firstInRow, realOffsetInRow;

  if(largeNumber < thisNumber){
    if(largeNumber <= (fixedNumber - 2*numberOfColumns)){ //below the 2 rows occupied by large box
      offsetFromLargeColumn = (fixedNumber + 2) % numberOfColumns;
      if(offsetFromLargeColumn <= 1){ //below the 2 columns occupied by large box, and therefore screwed up
        firstInRow = Math.floor(fixedNumber / numberOfColumns) * numberOfColumns;
        realOffsetInRow = largeColumn + offsetFromLargeColumn;
        result = firstInRow + realOffsetInRow;
      }
      else if(thisFixedColumn >= largeColumn){ //is not to the left of the large box, so got shifted by the 2 screwed up boxes
        result = fixedNumber + 2;
      }
      else result = fixedNumber;
    }
    else if(thisNumber < largeNumber + numberOfColumns - 1) {
      result = thisNumber + 1;
    }
    else if(Math.floor((thisNumber + 1) / numberOfColumns) == (Math.floor(largeNumber / numberOfColumns) + 1)){
      result = fixedNumber;
    }
    else{ //should be impossible
      result = fixedNumber;
      console.log("impossible condition happened...");
    }
  }

  else result = thisNumber;

  return result;
}

function expandBox($box, init){

  var thisNumber = boxNumber($box);
  var thisRealNumber = init ? 0 : realBoxNumber($box);
  var swapTarget = thisRealNumber;
  var largeNumber;
  var $updatedItems;

  $largeBox = $('.large');

  if (!$box.hasClass('large')){

    $box.addClass('large');
    $largeBox.removeClass('large');

    if(!init){
      if(swapTarget >= (numberOfRows - 1) * numberOfColumns){ //in last row
        swapTarget = swapTarget - numberOfColumns;
      }

      if((swapTarget + 1) % numberOfColumns == 0){ //in rightmost column
        swapTarget = swapTarget - 1;
      }

      if (swapTarget != thisNumber){
        $box.attr('id', 'temp');
        $("#box-" + swapTarget).attr('id', "box-" + thisNumber);
        $box.attr('id', "box-" + swapTarget);
      }
    }

    $updatedItems = $box.add($("#box-" + thisNumber));
    $('#container').isotope('updateSortData', $updatedItems);
    $('#container').isotope({sortBy : 'number'});

  }
}