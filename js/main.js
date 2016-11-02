$(document).ready(function() {
    "use strict";

    const smoothScroll = require('./smoothScroll');
    const g = require('./globals');
    const plusButtonFunctions = require('./plus-buttons');
    const menu = require('./menu');

    // on button click, change button style and show content
    $('body').on('click', '.plus-button', plusButtonFunctions.setup);
    // on window scroll, fixed clicked button to screen
    $(window).on('scroll', plusButtonFunctions.fixed);
    // hide all nav items until page is chosen
    $('.nav-item').parent().hide();

    // Code for home page
    $('.card.web').click(function() {
        switchPage('web')
    });
    $('.card.cyber').click(function() {
        switchPage('cyber')
    });

    function switchPage(page) {
        $('.page-landing.home').fadeOut(function() {
            window.scrollTo(0, 0);
            // var displayType = (window.innerWidth >= g.mobileMenuWidth) ? 'inline-block' : 'block';
            $('.nav-item.' + page).parent().show();
            $('.page-landing.' + page).show();
            $('section.' + page).show();
            $('.content.' + page).show();
            setupPage(page);
            $('.programs-container').fadeIn();
        });
    }

    function setupPage(page) {
        var navItems = document.getElementsByClassName('nav-item ' + page);
        var banners = document.getElementsByClassName('banner ' + page);
        var landing = document.getElementsByClassName('page-landing ' + page)[0];
        // Switch to home page annd reset everything to default
        $('.home-button').on('click', function(e) {
            e.preventDefault();
            menu.homeButtonSetup(navItems, page);
        });

        // on window scroll, add style to nav item if section is in view
        if (window.innerWidth >= g.mobileMenuWidth) {
            $(window).on('scroll', function() {
                menu.navItemsStyle(navItems, page, banners, landing)
            });
        }
    }; // end setupPage function

    // mobile-menu show/hide
    if (window.innerWidth < g.mobileMenuWidth) {
        $('#menu-button, #overlay, #menu-items li a').click(menu.mobileClick);
    }

    // fade-out down-arrow in landing page when scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > '20') {
            $('.arrow-down').fadeOut(400);
        } else {
            $('.arrow-down').slideDown(400);
        }
    });

});
