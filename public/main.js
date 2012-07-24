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
    animationEngine: 'best-available',
    animationOptions: {
     duration: 400,
     easing: 'swing',
     queue: false
   }
  });

  $('a.logo').click(function(){
    load_courses();
    _gaq.push(['_trackEvent', 'Load courses', 'Logo', courseNumber()]);
    return false;
  });

  $('body').keydown(function(e){
   if(e.keyCode == 32){
      //pressed space
      load_courses();
      _gaq.push(['_trackEvent', 'Load courses', 'Spacebar', courseNumber()]);
      return false;
   }
  });

  $('a.logo').css('margin-left', $(window).width()/2 -98);
  $('a.logo').css('margin-right', 0);

  $container.delegate( '.box', 'click', function(){
    if ($(this).attr('id') != 'large'){
      $('#large').attr('id', '');;
      $(this).attr('id', 'large');
      $container.isotope('reLayout');
    }
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
        permission_required: course["permission_required"] ? "permission_required" : ''
      }

      var output = Mustache.render(course_template, course_data);
      if (index == 0){
        output = $(output).attr('id', 'large');
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
    }
)
    $(".no_exam, .reading_period, .permission_required").tipTip({delay: 200});

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
  var row_number = Math.floor(($container.width() - 15)/183);
  var number_of_rows = Math.floor(($(window).height() - 65)/183);
  var number = row_number * number_of_rows - 3;
  return number;
}