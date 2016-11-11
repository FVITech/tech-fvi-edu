(function() {
    const g = require('./globals');

    function homeButtonSetup(navItems, page) {
        // switch to home page
        g.$programsContainer.fadeOut(function() {
            window.scrollTo(0, 0);
            g.$pageLandingHome.fadeIn(function() {
                // reset things to default
                g.$overlay.hide();
                g.$applyPopUp.hide();
                g.$plusButtons.filter('.opened')
                    .css({'top': '0px', 'transition': '.6s'})
                    .removeClass('opened');
                g.$banners.filter('.shrink')
                    .removeClass('shrink')
                    .next().hide();
                g.$navItems.removeClass('section-in-view');
                $(window).off('scroll', navItemsStyle);
                return false;
            });
            return false;
        });
        g.$homeButton.off('click', homeButtonSetup);
        return false;
    }

    function navItemsStyle(navItems, banners, landing) {
        // if window scroll position is between a banner, add nav style to corresponding nav item
        if (landing.getBoundingClientRect().bottom < '-24') {
            for (let j = 0, y = banners.length; j < y; j++) {
                if (banners[j].getBoundingClientRect().top <= g.topPadding && (banners[j].nextSibling.nextSibling.getBoundingClientRect().bottom > g.topPadding || banners[j].getBoundingClientRect().bottom > g.topPadding)) {
                    navItems[j].classList.add('section-in-view');
                } else {
                    navItems[j].classList.remove('section-in-view');
                }
            }
        } else {
            g.$navItems.removeClass('section-in-view');
        }
        return false;
    }

    function mobileClick() {
        const $menuButton = $('#menu-button span');
        if ($menuButton.html() === 'MENU') {
            g.$menuItems.show(500, 'easeOutQuad');
            $menuButton.html('CLOSE');
        } else {
            g.$menuItems.hide(500, 'easeOutQuad');
            $menuButton.html('MENU');
        }
        return false;
    }

    module.exports.navItemsStyle = navItemsStyle;
    module.exports.homeButtonSetup = homeButtonSetup;
    module.exports.mobileClick = mobileClick;
})();
