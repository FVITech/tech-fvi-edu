(function(code) {
    "use strict";
    code(window.jQuery, window, document);

}(function($, window, document) {
    "use strict";

    $('body').fadeIn(300);

    const g = require('./globals');
    const pb = require('./plus-buttons');
    const menu = require('./menu');
    const form = require('./form');
    const smoothScroll = require('./smoothScroll');

    var pageSetup = {
        onReady: function() {
            smoothScroll.init();
            g.$cards.filter('.web').on('click', () => {pageSetup.switchPage('web')});
            g.$cards.filter('.cyber').on('click', () => {pageSetup.switchPage('cyber')});
            $(window).on('popstate', () => {g.$homeButton.click()});
            g.$applyButtons.on('click', pageSetup.applyButtonsFunctionality);
            $('#apply-close, #overlay').on('click', form.hide);
            g.$applyForm.on('click', form.show);
            $('#submit-apply').on('click', pageSetup.formSubmit);
            g.$plusButtons.on('click', pageSetup.plusButtonsFunctionality);
            if (window.innerWidth < g.mobileMenuWidth) {
                $('#menu-button, #menu-items a').click(menu.mobileClick);
            }
            return false;
        },
        switchPage: function(page) {
            var address = (page === 'web') ? 'web-developer-program' : 'network-administrator-program';
            var state = { page: address};
            history.pushState(state, "", "");

            var navItems = g.$navItems.filter('.' + page);
            var banners = g.$banners.filter('.' + page);
            var landing = $('#page-landing_' + page)[0];

            // Switch to home page annd reset everything to default
            g.$homeButton.on('click', function(e) {
                e.preventDefault();
                menu.homeButtonSetup();
                return false;
            });

            // on scroll, fix plus-buttons to screen and add nav styles
            let $downArrows = $('a.arrow-down');
            if (window.innerWidth >= g.mobileMenuWidth) {
                $(window).on('scroll', function() {
                    pb.fixed();
                    (window.scrollY > '20') ? $downArrows.fadeOut(400): $downArrows.slideDown(400);
                    menu.navItemsStyle(navItems, banners, landing);
                    return false;
                });
            } else {
                $(window).on('scroll', function() {
                    pb.fixed();
                    (window.scrollY > '20') ? $downArrows.fadeOut(400): $downArrows.slideDown(400);
                });
            }

            // Set form program id
            let id = (page == "web") ? 'WD' : 'IT';
            g.$applyPopUp.find("input[name='program_id']").attr('value', id);

            // animate switching pages
            g.$pageLandingHome.fadeOut(function() {
                window.scrollTo(0, 0);
                g.$programsContainer.fadeIn();
                return false;
            });
            return false;
        },
        applyButtonsFunctionality: function(e) {
            e.preventDefault();
            form.show();
            return false;
        },
        formSubmit: function(e) {
            e.preventDefault();
            form.submit();
            return false;
        },
        plusButtonsFunctionality: function() {
            ($(this).hasClass('opened')) ? pb.close(this): pb.open(this);
            return false;
        }
    };

    $(document).ready(pageSetup.onReady);

    return false;
}));
