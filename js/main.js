! function() {

    var plusButtons = document.getElementsByClassName('plus-button');
    var banners = document.getElementsByClassName('banner');
    var navItems = document.getElementsByClassName('smoothScroll');
    var landing = document.getElementsByClassName('page-landing');

    // on button click, change button style and show content
    for (var i = 0, x = plusButtons.length; i < x; i++) {
        $(plusButtons[i]).on('click', function() {
            var button = this;
            var banner = (this.parentNode.classList.contains('banner')) ? this.parentNode : (function() {alert("expected button's parentNode to be a banner, but it was not.")})();
            // if button is clicked and content is displayed
            if (button.classList.contains('clicked-button')) {
                // topPadding is the nav height, so it scrolls past the nav
                var topPadding = (window.innerWidth >= '980') ? -51 : 0;
                var $banner = $(banner);
                // first, scroll to top of banner, then change buton style and slideUp the content
                $('body').animate({
                    scrollTop: $banner.offset().top + topPadding
                }, 500, 'easeInQuart', function() {
                    button.classList.remove('clicked-button');
                    $(button).css({
                        'top': '0px',
                        'transition': '.6s'
                    });
                    banner.style.padding = '100px 0 140px';
                    banner.style.boxShadow = '0 0 20px 0 #111';
                    banner.childNodes[1].style.paddingBottom = '20px';
                    $(banner.nextSibling.nextSibling).slideUp(600, 'easeInOutCubic');
                });
            }
            // else content must be hidden, so slideDown the content
            else {
                button.classList.add('clicked-button');
                banner.style.padding = '20px 0';
                banner.style.boxShadow = '0 -5px 20px -2px #111';
                banner.childNodes[1].style.paddingBottom = '0';
                $(banner.nextSibling.nextSibling).slideDown(600, 'easeOutQuad');
            }
        });
    }

    window.addEventListener('scroll', function() {

        // on window scroll, fixed clicked button to screen
        for (var i = 0, x = plusButtons.length; i < x; i++) {
            if (plusButtons[i].classList.contains('clicked-button')) {
                var contentPosition = plusButtons[i].parentNode.nextSibling.nextSibling.getBoundingClientRect();
                var bottomPadding = (window.innerWidth >= '980') ? '96' : '83';
                var topPadding = (window.innerWidth >= '980') ? 51 : 38;
                if (contentPosition.top <= String(topPadding) && contentPosition.bottom >= bottomPadding) {
                    $(plusButtons[i]).css({
                        'top': (-(contentPosition.top) + topPadding) + 'px',
                        'transition': '0s'
                    });
                } else {
                    $(plusButtons[i]).css({
                        'top': '0px',
                        'transition': '0s'
                    });
                }
            }
        }

        // on window scroll, add style to nav item if section is in view
        if (window.innerWidth >= '980') {
            var topPadding = (window.innerWidth >= '980') ? '51' : '0';
            for (var j = 0, y = banners.length; j < y; j++) {
                if (landing[0].getBoundingClientRect().bottom < '86') {
                    navItems[0].classList.remove('section-in-view');
                    if (banners[j].getBoundingClientRect().top <= topPadding && (banners[j].nextSibling.nextSibling.getBoundingClientRect().bottom > topPadding || banners[j].getBoundingClientRect().bottom > topPadding)) {
                        navItems[j + 1].classList.add('section-in-view');
                        navItems[0].classList.remove('section-in-view');
                    } else {
                        navItems[j + 1].classList.remove('section-in-view');
                    }
                } else {
                    navItems[0].classList.add('section-in-view');
                    navItems[j + 1].classList.remove('section-in-view');
                }
            }
        } else {
            navItems[0].classList.remove('section-in-view');
        }

        // fade-out down-arrow in landing page when scroll
        if (window.scrollY > '20') {
            $('.arrow-down').fadeOut(400);
        } else {
            $('.arrow-down').slideDown(400);
        }

    });

    $('.arrow-down').click(function() {
        if ($(this).hasClass('clicked-button')) {
            $(plusButtons[0]).click();
        }
    });


    // Small screens adjustments below
    if (window.innerWidth < '980') {
        navItems[0].classList.remove('section-in-view');
    }

    // mobile-menu show/hide
    if (window.innerWidth < '980') {
        $('#menu-button, #overlay, #menu-items li a').click(function() {
            if ($('#menu-button').html().includes('MENU')) {
                $('#menu-button').html('<i class="fa fa-bars" aria-hidden="true"></i> CLOSE');
            } else {
                $('#menu-button').html('<i class="fa fa-bars" aria-hidden="true"></i> MENU');
            }
            $('#overlay').fadeToggle();
            $('#menu-items').toggle(500);
        });
    }

}();
