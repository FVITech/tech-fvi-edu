$(document).ready(function() {
    "use strict";

    $('.page-landing.home').fadeIn(300);

    const smoothScroll = require('./smoothScroll');
    const g = require('./globals');
    const plusButtonFunctions = require('./plus-buttons');
    const menu = require('./menu');
    const form = require('./form');
    var $home = $('.page-landing.home');

    // on button click, change button style and show content
    $('.plus-button').click(function() {
        if($(this).hasClass('opened')) {
            plusButtonFunctions.close(this);
        }
        else {
            plusButtonFunctions.open(this);
        }
    });

    // on window scroll, fixed clicked button to screen
    $(window).on('scroll', plusButtonFunctions.fixed);

    // hide all nav items until page is chosen
    $('.nav-item').parent().hide();

    // At home page, switch pages when click on program card
    $('.card.web').click(function() {
        switchPage('web')
    });
    $('.card.cyber').click(function() {
        switchPage('cyber')
    });

    function switchPage(page) {
        // display page-specific content
        $('.nav-item.' + page).parent().show();
        $('.page-landing.' + page).show();
        $('section.' + page).show();
        $('.content.' + page).show();
        setupPage(page);
        // switch pages
        $home.fadeOut(function() {
            window.scrollTo(0, 0);
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
                menu.navItemsStyle(navItems, page, banners, landing);
            });
        }

        // Set form program id
        var id = (page == "web") ? 'WD' : 'IT';
        $("input[name='program_id']").attr('value', id);
    };



    // fade-out down-arrow in landing page when scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > '20') {
            $('.arrow-down').fadeOut(400);
        } else {
            $('.arrow-down').slideDown(400);
        }
    });

    // apply-button and form
    $('.apply-btn, .nav-item.apply').click(function(e) {
        e.preventDefault();
        form.show();
    });
    $('.apply-pop-up .close, #overlay').click(form.hide);
    $('.apply-pop-up form').submit(function(e) {
        e.preventDefault();
        form.submit();
    });

    // mobile-menu show/hide
    if (window.innerWidth < g.mobileMenuWidth) {
        $('#menu-button, #menu-items li a').click(menu.mobileClick);
    }

});
