!function() {
    const g = require('./globals');

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

    function homeButtonSetup(navItems, page) {
        $('#overlay, .apply-pop-up').fadeOut();
        $('.plus-button.clicked-button').click();
        $('.programs-container').fadeOut(function() {
            window.scrollTo(0, 0);
            $('.page-landing.home').fadeIn(function() {
                $('.nav-item').removeClass('section-in-view');
                $('.content.' + page).hide();
                $('section.' + page).hide();
                $('.page-landing.' + page).hide();
                $('.nav-item.' + page).parent().hide();
                $(window).off('scroll', navItemsStyle);
            });
        });
        $('.home-button').off('click', homeButtonSetup);
    }

    function mobileClick() {
        var $menuButton = $('#menu-button');
        if ($menuButton.html() === '<i class="fa fa-bars" aria-hidden="true"></i> MENU') {
            $('nav ul').show(500, 'easeOutQuad');
            $menuButton.html('<i class="fa fa-bars" aria-hidden="true"></i> CLOSE');
        } else {
            $('nav ul').hide(500, 'easeOutQuad');
            $menuButton.html('<i class="fa fa-bars" aria-hidden="true"></i> MENU');
        }
    }

    module.exports.navItemsStyle = navItemsStyle;
    module.exports.homeButtonSetup = homeButtonSetup;
    module.exports.mobileClick = mobileClick;
}();
