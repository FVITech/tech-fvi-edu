!function() {
    "use strict";

    $('body').fadeIn(300);

    const g = require('./globals');
    const pb = require('./plus-buttons');
    const menu = require('./menu');
    const form = require('./form');

    // on button click, change button style and show content-container
    g.$plusButtons.click(function() {
        if($(this).hasClass('opened')) {
            pb.close(this);
        }
        else {
            pb.open(this);
        }
    });

    // on window scroll, fixed clicked button to screen
    $(window).on('scroll', pb.fixed);

    // At home page, switch pages when click on program card
    const $cards = $('#cards-container label.card');
    $cards.filter('.web').click(function() {
        switchPage('web')
    });
    $cards.filter('.cyber').click(function() {
        switchPage('cyber')
    });

    function switchPage(page) {
        // display page-specific content
        // $('.nav-item.' + page).parent().show();
        // $('.page-landing.' + page).show();
        // $('section.' + page).show();
        // $('.content.' + page).show();
        setupPage(page);
        // switch pages
        g.$pageLandingHome.fadeOut(function() {
            window.scrollTo(0, 0);
            g.$programsContainer.fadeIn();
        });
    }

    function setupPage(page) {
        var navItems = g.$navItems.filter('.' + page);
        var banners = g.$banners.filter('.' + page);
        var landing = $('#page-landing_' + page)[0];
        // Switch to home page annd reset everything to default
        g.$homeButton.on('click', function(e) {
            e.preventDefault();
            menu.homeButtonSetup();
        });

        // on window scroll, add style to nav item if section is in view
        if (window.innerWidth >= g.mobileMenuWidth) {
            $(window).on('scroll', function() {
                menu.navItemsStyle(navItems, banners, landing);
            });
        }

        // Set form program id
        let id = (page == "web") ? 'WD' : 'IT';
        g.$applyPopUp.find("input[name='program_id']").attr('value', id);
    };

    // fade-out down-arrow in landing page when scroll
    const $arrowDown = g.$programsContainer.find('div.page-landing a.arrow-down');
    window.addEventListener('scroll', function() {
        if (window.scrollY > '20') {
            $arrowDown.fadeOut(400);
        } else {
            $arrowDown.slideDown(400);
        }
    });

    // mobile-menu show/hide
    if (window.innerWidth < g.mobileMenuWidth) {
        $('#menu-button, #menu-items li a').click(menu.mobileClick);
    }

    // apply-button and form
    g.$applyButtons.click(function(e) {
        e.preventDefault();
        form.show();
    });
    $('#apply-close, #overlay').click(form.hide);
    g.$applyForm.submit(function(e) {
        e.preventDefault();
        form.submit();
    });

}();
