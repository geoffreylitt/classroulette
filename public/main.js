var busy;

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
    _gaq.push(['_trackEvent', 'Load courses', 'Logo', '', courseNumber()]);
    return false;
  });

  $('body').keydown(function(e){
   if(e.keyCode == 32){
      //pressed space
      load_courses();
      _gaq.push(['_trackEvent', 'Load courses', 'Spacebar', '', courseNumber()]);
      return false;
   }
  });

  $('a.logo').css('margin-left', $(window).width()/2 -98);
  $('a.logo').css('margin-right', 0);

  $container.delegate( '.box', 'click', function(){
    expandBox($(this));
  });

  $(window).smartresize(function(){
    $('a.logo').css('margin-left', $(window).width()/2 -98);

    $container = $('#container');
    var body_width = $('body').width();
    body_width = body_width - 15;
    var container_width = body_width - (body_width % 188) + 15;
    $container.width(container_width);
    $container.isotope('reLayout');
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
    $('#final_message').show();
  }

  if($('#welcome_message').is(':visible')){
    $('#welcome_message').hide();
    $('#second_message').show();
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

  $.get('templates.html', function(templates) {
    course_template = $(templates).filter('#course_template').html();
  });

  $.getJSON('/courses?n=' + courseNumber(), function(data) {
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
        box_index: index + 1
      }

      var output = Mustache.render(course_template, course_data);
      if (index == 0){
        output = $(output).addClass('large');
      }
      $newItems = $newItems.add(output);
    })

    spinner.stop();

    $container.isotope( 'insert', $newItems );

    $container.find('.box').hover(
      function(){
        $(this).css("background-color", $(this).data('color-secondary'));
      },
      function(){
        $(this).css("background-color", $(this).data('color-primary'));
      }
    );

    $('a.oci').click(function(){
      window.open("http://students.yale.edu/oci/resultDetail.jsp?course=" + $(this).data("oci-id") + "&term=201203", "_blank", 'width=600,height=400');
      return false;
    });

    $('a.ybb').click(function(){
      window.open("http://yalebluebook.com/details/" + $(this).data("ybb-id"), "_blank", 'width=800,height=800');
      return false;
    });

    $(".no_exam, .reading_period, .permission_required").tipTip({delay: 200});

    busy = false;

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

  $('#about input').iToggle({
    keepLabel: true,
    speed: 200,
    onClick: function(){
      //Function here
    },
    onClickOn: function(){
      //Function here
    },
    onClickOff: function(){
      //Function here
    },
    onSlide: function(){
      //Function here
    },
    onSlideOn: function(){
      //Function here
    },
    onSlideOff: function(){
      //Function here
    }
  });

  return false;
}

function hideAbout(){
  $('#about').hide();
  return false;
}

function courseNumber(){
  $container = $("#container");
  var number = rowNumber()* columnNumber() - 3;
  return number;
}

function columnNumber(){
  return Math.floor(($container.width() - 15)/183);
}

function rowNumber(){
  return Math.floor(($(window).height() - 65)/183);
}

function boxNumber($box){
  return parseInt($box.attr('id').split('-')[1]);
}

function realBoxNumber($box){ //if there was no large, what number on the grid is this box?
  var thisNumber= boxNumber($box);
  var largeNumber = boxNumber($('.large'));
  var result;

  if (largeNumber < thisNumber){ //if large is before this box
    if (largeNumber < (thisNumber - columnNumber() + 2)){ //if not on this row
      result = thisNumber + 3;
    }
    else{ //if on this row
      result = thisNumber + 1;
    }
  }
  else{
    result = thisNumber;
  }
  return result;
}

function saneBoxNumber($box){ //compensates for Isotope's weird sorting, what normal number should this box have
  var largeNumber = boxNumber($(".large"));
  var largeRow = realRow($(".large"));
  var largeColumn = (largeNumber - 1) % columnNumber(); //zero-indexed
  var thisRow = realRow($box);
  var thisColumn = (realBoxNumber($box) - 1) & columnNumber();
  var result = boxNumber($box);

  if (largeRow < (thisRow - 1)){ //large box is above the row above this box's row
    var realNumber = boxNumber($box) + 3;
    var mod = (realNumber + 1) % columnNumber();
    if(mod == 0){//second to last in row (dragged along by large box above)
      result = ((thisRow - 1) * columnNumber()) - 3 + largeColumn + 1;
    }
    else if (mod == 1){//last in row, also dragged along
      result = ((thisRow - 1) * columnNumber()) - 3 + largeColumn + 2;
    }
    else if (largeColumn < thisColumn){ //large is to left of this, messed up a bit
      result = result + 2;
    }
    //if large is to right, everything's fine
  }

  return result;
}

function realRow($box){
  var realNumber = realBoxNumber($box);
  return Math.floor((realNumber - 1)/columnNumber()) + 1;
}

function expandBox($box){
  var thisNumber= saneBoxNumber($box);
  var thisInsaneNumber = boxNumber($box);
  var largeNumber = boxNumber($(".large"));
  var largeRow = realRow($(".large"));
  var largeColumn = (largeNumber - 1) % columnNumber(); //zero-indexed
  var thisRow = realRow($box);
  var realNumber = realBoxNumber($box);
  var swapNumber = thisNumber; //number of the box to swap with
  var swapped = false;
  console.log('-----Expanding ', thisNumber, '-----');

  if (!$box.hasClass('large')){

    //for boxes in last row
    if(thisRow == rowNumber()){
      console.log("in last row");
      thisRow = thisRow - 1;
      swapped = true;
      if(largeNumber < thisNumber - columnNumber() + 2){ //large box is before the swap point
        console.log("large box before swap point");
        swapNumber = swapNumber - columnNumber() + 3;
      }
      else{
        console.log("large box after swap point");
        swapNumber = swapNumber - columnNumber() + 1;
      }

    }

    //for boxes in rightmost column
    if(realNumber % columnNumber() == 0){
      console.log("in last column");
      swapped = true;
      if(largeNumber > thisNumber){ //large box is after this box
        console.log("large box is after this box");
        swapNumber = swapNumber - 1;
      }
      else if (largeRow < thisRow){ //large box is above this row
        console.log("large box above this row");
        if (largeColumn == 0){
          swapNumber = (thisRow * columnNumber());
        }
        else if (largeColumn == 1){
          swapNumber = (thisRow * columnNumber() - 1)
        }
        swapNumber = swapNumber + 2;
      }
      //no swap needed if in this row
    }

    if (swapped){
      $box.attr('id', 'temp');
      $('#box-' + swapNumber).attr('id', 'box-' + thisInsaneNumber);
      $box.attr('id', 'box-' + swapNumber);
      $box.attr('data-original', thisInsaneNumber);

      console.log('swapped', thisInsaneNumber, 'for', swapNumber);

      $('#box-' + largeNumber).removeClass('large');
      $box.addClass('large');

      $('#container').isotope( 'updateSortData', $('.box'));
      $('#container').isotope({sortBy : 'number'});
    }
    else {
      $('#box-' + largeNumber).removeClass('large');
      $box.addClass('large');
      $('#container').isotope('reLayout');
    }
    //swap them!



  }
}

