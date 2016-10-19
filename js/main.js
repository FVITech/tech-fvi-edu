! function() {

    var plusButtons = document.getElementsByClassName('plus-button');
    var sections = document.getElementsByTagName('section');
    var navItems = document.getElementsByClassName('smoothScroll');
    var landing = document.getElementsByClassName('page-landing');

    // on button click, change button style and show content
    for (var i = 0, x = plusButtons.length; i < x; i++) {
        plusButtons[i].addEventListener('click', function() {
            if (this.classList.contains('clicked-button')) {
                this.classList.remove('clicked-button');
                this.classList.remove('fixed-button');
                this.parentNode.style.padding = '100px 0 140px';
                $(this.parentNode.nextSibling.nextSibling).slideUp(600, 'easeInQuart');
            } else {
                this.classList.add('clicked-button');
                this.parentNode.style.padding = '20px 0';
                $(this.parentNode.nextSibling.nextSibling).slideDown(600, 'easeOutQuad');
            }
        });
    }

    window.addEventListener('scroll', function() {
        // on window scroll, fixed clicked button to screen
        for (var i = 0, x = plusButtons.length; i < x; i++) {
            if (plusButtons[i].classList.contains('clicked-button')) {
                var contentPosition = plusButtons[i].parentNode.nextSibling.nextSibling.getBoundingClientRect();
                if (contentPosition.top <= '40' && contentPosition.bottom >= '90') {
                    plusButtons[i].classList.add('fixed-button');
                } else {
                    plusButtons[i].classList.remove('fixed-button');
                }
            }
        }

        // on window scroll, add style to nav item if section is in view
        for (var j = 0, y = sections.length; j < y; j++) {
            if(landing[0].getBoundingClientRect().bottom < '86') {
                navItems[0].classList.remove('section-in-view');
                if(sections[j].getBoundingClientRect().top <= '43' && (sections[j].nextSibling.nextSibling.getBoundingClientRect().bottom > '43' || sections[j].getBoundingClientRect().bottom > '43')) {
                    navItems[j + 1].classList.add('section-in-view');
                    navItems[0].classList.remove('section-in-view');
                }
                else {
                    navItems[j + 1].classList.remove('section-in-view');
                }
            }
            else {
                navItems[0].classList.add('section-in-view');
                navItems[j + 1].classList.remove('section-in-view');
            }
        }
    });

    // mobile-menu show/hide
    if (window.innerWidth < '980') {
        $('#menu-button, #overlay, #menu-items li a').click(function() {
            if($('#menu-button').html() == 'MENU') {
                $('#menu-button').html('CLOSE');
            }
            else {
                $('#menu-button').html('MENU');
            }
            $('#overlay').fadeToggle();
            $('#menu-items').toggle(500);
        });
    }

}();
