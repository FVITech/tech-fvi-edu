!function() {
    const g = require('./globals');

    function homeButtonSetup(navItems, page) {
        // switch to home page
        $('.programs-container').fadeOut(function() {
            window.scrollTo(0, 0);
            $('.page-landing.home').fadeIn(function() {
                // reset things to default
                $('#overlay, .apply-pop-up').hide();
                $('.plus-button.opened').css({'top': '0px', 'transition': '.6s'}).removeClass('opened');
                $('.banner.shrink').next().hide()
                $('.banner.shrink').removeClass('shrink');
                $('.nav-item').removeClass('section-in-view');
                $(window).off('scroll', navItemsStyle);
            });
        });
        $('.home-button').off('click', homeButtonSetup);
    }

    function navItemsStyle(navItems, page, banners, landing) {
        // if window scroll position is between a banner, add nav style to corresponding nav item
        if (landing.getBoundingClientRect().bottom < '-24') {
            for (var j = 0, y = banners.length; j < y; j++) {
                if (banners[j].getBoundingClientRect().top <= g.topPadding && (banners[j].nextSibling.nextSibling.getBoundingClientRect().bottom > g.topPadding || banners[j].getBoundingClientRect().bottom > g.topPadding)) {
                    navItems[j].classList.add('section-in-view');
                } else {
                    navItems[j].classList.remove('section-in-view');
                }
            }
        } else {
            $('.nav-item').removeClass('section-in-view');
        }
    }

    function mobileClick() {
        var $menuButton = $('#menu-button span');
        if ($menuButton.html() === 'MENU') {
            $('nav ul').show(500, 'easeOutQuad');
            $menuButton.html('CLOSE');
        } else {
            $('nav ul').hide(500, 'easeOutQuad');
            $menuButton.html('MENU');
        }
    }

    module.exports.navItemsStyle = navItemsStyle;
    module.exports.homeButtonSetup = homeButtonSetup;
    module.exports.mobileClick = mobileClick;
}();
