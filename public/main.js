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
    }
  });

  load_courses();

  $('a.logo').click(function(){
    load_courses();
  });

  $('a.logo').css('margin-left', $container.width()/2 -80);
  $('a.logo').css('margin-right', 0);

  $('body').keyup(function(e){
   if(e.keyCode == 13){
      //pressed space
      load_courses();
   }
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
  var $last_opened = $('');

  $container.isotope('remove', $oldItems);

  $.get('templates.html', function(templates) {
    course_template = $(templates).filter('#course_template').html();
  });

  var row_number = Math.floor(($container.width() - 15)/183);
  var number = row_number * 4 - 3;

  $.getJSON('/courses?n=' + number, function(data) {
    $.each(data, function(index, course_obj) {
      var course = course_obj["course"];
      var course_data = {
        number: course["department"] + " " + course["number"],
        name: course["name"],
        professors: course["professors"].split(",").join(", ").truncate(50, true),
        desc: course["desc"],
        skills: course["skills"].split(",").join(" ") + " " + course["areas"].split(",").join(" "),
        hours: course["hours"].split(",").join(", "),
        color1: course["colors"][0],
        color2: course["colors"][1],
        no_exam: course["no_exam"] ? 'no_exam' : '',
        reading_period: course["reading_period"] ? 'reading_period' : '',
        permission_required: course["permission_required"] ? "permission_required" : ''
      }

      var output = Mustache.render(course_template, course_data);
      if (index == 0){
        output = $(output).addClass("large");
      }
      $newItems = $newItems.add(output);
    })
    $container.isotope( 'insert', $newItems );
    $last_opened = $('.large');
    $container.find('.box').hover(
      function(){
        $(this).css("background-color", $(this).data('color-secondary'));
      },
      function(){
        $(this).css("background-color", $(this).data('color-primary'));
      }
    );

    $(".no_exam, .reading_period, .permission_required").tipTip({delay: 200});

  });

  $container.delegate( '.box', 'click', function(){
    $last_opened.removeClass('large');
    $(this).addClass('large');
    $container.isotope('reLayout');
    $last_opened = $(this);
  });
}