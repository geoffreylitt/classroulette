$(document).ready(function () {
    
    //container setup
    var $container = $('#container');
    $container.isotope({
        // options
        itemSelector: '.box',
        masonry: {
            columnWidth: 1
        },
        getSortData: {
            number: function ($box) {
                return parseInt($box.attr('id').split('-')[1]);
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

    //spacebar control
    $('body').keydown(function (e) {
        if (e.keyCode == 32) {
            //pressed space
            $('.topbar').removeClass('hide');
            $('.logoContainer').addClass('hide');
            load_courses();
            return false;
        }
    });

    //top navigation bar control
    $("#refresh").click(function () {
        load_courses();
    });

    //box navigation control
    $container.delegate('.box', 'click', function () {
        if (!$(this).hasClass('large')) {
            $('.large').removeClass('large');
            $(this).addClass('large');
            $container.isotope('reLayout');
        }
    });
});

//object literal extensions
Array.prototype.first = function () {
    return this[0];
};

String.prototype.truncate = function (n, useWordBoundary) {
    var toLong = this.length > n,
        s_ = toLong ? this.substr(0, n - 1) : this;
    s_ = useWordBoundary && toLong ? s_.substr(0, s_.lastIndexOf(' ')) : s_;
    return toLong ? s_ + '...' : s_;
};

//main load courses function
function load_courses() {

    //start loading animation
    $('.wheel').addClass('wheel2');
    $('.wheel').removeClass('hide');
    
    //setup template variables
    var template;
    var $container = $('#container');
    var $newItems = $('');
    var $oldItems = $('.box');

    $container.isotope('remove', $oldItems);


    $.get('template.html', function (templates) {
        course_template = $(templates).filter('#course_template').html();
    });

    $.getJSON('/courses?n=' + courseNumber(), function (data) {
        $.each(data, function (index, course_obj) {
            var course = course_obj["course"];
            
            //array of all areas and skills
            var all = course["skills"].split(",").concat(course["areas"].split(","));
            all = $.unique(all);
            
            //base string of full icon HTML
            var iconstring = '';

            //compose full icon HTML
            $.each(all, function (index, value) {
                if (value != "") {
                    iconstring = iconstring + '<a href="#" class="tool" rel="tooltip" title="'+courseChoose(value)[2]+'"><img class="icon" src="' + courseChoose(value)[0] + '"></a>';
                }
            });
            
            //primary skill
            var skill1 = all.first();
            if (skill1 === '') {
                skill1 = all[1];
            };
            
            //Mustache data
            var course_data = {
                oci_id: course["oci_id"],
                number: course["department"] + " " + course["number"],
                name: course["name"],
                professors: course["professors"].split(",").join(", ").truncate(50, true),
                desc: course["desc"].split("\n").join("<br><br>"),
                skills: all,
                skillsall: course["skills"].split(",").join(" ") + " " + course["areas"].split(",").join(" "),
                hours: course["hours"].split(",").join(", "),
                icon: iconstring,
                color1: courseChoose(skill1)[1],
                no_exam: course["no_exam"] ? 'no_exam' : '',
                reading_period: course["reading_period"] ? 'reading_period' : '',
                permission_required: course["permission_required"] ? "permission_required" : '',
                ybb_id: course["ybb_id"],
                box_index: index
            }

            //Mustache render
            var output = Mustache.render(course_template, course_data);
            if (index == 0) {
                output = $(output).addClass('large');
            }
            $newItems = $newItems.add(output);
        })
        
        $('.wheel').addClass('hide');
        
        //adjust isotope
        $container.isotope('insert', $newItems);


        //link navigation
        $('a.oci').click(function () {
            window.open("http://students.yale.edu/oci/resultDetail.jsp?course=" + $(this).data("oci-id") + "&term=201203", "_blank", 'width=600,height=400');
            return false;
        });

        $('a.ybb').click(function () {
            window.open("http://yalebluebook.com/details/" + $(this).data("ybb-id"), "_blank", 'width=800,height=800');
            return false;
        });
        
        $('.box p').dotdotdot();
        
        
        //TODO: add tooltips

    });

}


//course abbreviation -> Mustache data
function courseChoose(category) {
    var icon;
    switch (category) {
    case 'WR':
        icon = ['images/icons/writing.png', '#f9847a', 'Writing'];
        break;
    case 'L1':
        icon = ['images/icons/lang.png', '#fbcd5e', 'Level 1'];
        break;
    case 'L2':
        icon = ['images/icons/lang.png', '#fbcd5e', 'Level 2'];
        break;
    case 'L3':
        icon = ['images/icons/lang.png', '#fbcd5e', 'Level 3'];
        break;
    case 'L4':
        icon = ['images/icons/lang.png', '#fbcd5e', 'Level 4'];
        break;
    case 'L5':
        icon = ['images/icons/lang.png', '#fbcd5e', 'Level 5'];
        break;
    case 'So':
        icon = ['images/icons/socs.png', '#a8dac9', 'Social Science'];
        break;
    case 'Hu':
        icon = ['images/icons/hums.png', '#a191c2', 'Humanities'];
        break;
    case 'Sc':
        icon = ['images/icons/sci.png', '#cedf7f', 'Science'];
        break;
    case 'QR':
        icon = ['images/icons/math.png', '#ebf2df', 'Quantitative Reasoning'];
        break;
    default:
        icon = ['images/icons/socs.png', '#a8dac9', 'Social Science'];
    }

    return icon;
}

//TODO: responsive
function courseNumber() {
    return 10;
}
