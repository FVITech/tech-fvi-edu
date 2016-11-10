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

    smoothScroll.init();

    // At home page, switch pages when click on program card
    const $cards = $('label.card');
    $cards.filter('.web').click(function() {
        switchPage('web');
    });
    $cards.filter('.cyber').click(function() {
        switchPage('cyber');
    });

    // init functionality of contact-us/apply/request-info buttons and form
    g.$applyButtons.click(function(e) {
        e.preventDefault();
        form.show();
        return false;
    });
    $('#apply-close, #overlay').click(form.hide);
    g.$applyForm.submit(function(e) {
        e.preventDefault();
        form.submit();
        return false;
    });

    // on button click, change button style and show content-container
    g.$plusButtons.click(function() {
        ($(this).hasClass('opened')) ? pb.close(this): pb.open(this);
        return false;
    });

    // mobile-menu show/hide
    if (window.innerWidth < g.mobileMenuWidth) {
        $('#menu-button, #menu-items a').click(menu.mobileClick);
    }

    function switchPage(page) {
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
    }

    return false;
}));
