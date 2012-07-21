 $(document).ready(function() {
    var $container = $('#container');
    var $last_opened = $('');
    var template;
    var $newItems = $('');

    $container.isotope({
      // options
      itemSelector : '.box',
      masonry : {
        columnWidth : 1
      }
    });

  $.get('templates.html', function(templates) {
    course_template = $(templates).filter('#course_template').html();
  });

  $.getJSON('/courses', function(data) {
    $.each(data, function(index, course_obj) {
      var course = course_obj["course"];
      var course_data = {
        number: course["department"] + " " + course["number"],
        name: course["name"],
        professors: course["professors"].split(",").join(", ").truncate(50, true),
        desc: course["desc"],
        skills: course["skills"].split(",").join(" ") + " " + course["areas"].split(",").join(" "),
        hours: course["hours"].split(",").join(", ")
      }

      var output = Mustache.render(course_template, course_data);
      if (index == 0){
        output = $(output).addClass("large");
        $last_opened = output
      }
      $newItems = $newItems.add(output);

    })

    $container.isotope( 'insert', $newItems );
    $container.find('.box').hover(
      function(){
        $(this).css("background-color", "#294F6D");
      },
      function(){
        $(this).css("background-color", "#366488");
      }
    );
 });

  $container.delegate( '.box', 'click', function(){
    $(this).toggleClass('large');
    $last_opened.toggleClass('large');
    $last_opened = $(this);
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