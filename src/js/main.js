(function(code) {
    "use strict";
    code(window.jQuery, window, document);

}(function($, window, document) {
    "use strict";

    const g = require('./globals');
    const pb = require('./plus-buttons');
    const menu = require('./menu');
    const form = require('./form');
    const ss = require('./smoothScroll');

    $(document).ready(function() {
        $('body').fadeIn(300);
        ss.init();

        // on button click, change button style and show content-container
        g.$plusButtons.click(function() {
            if ($(this).hasClass('opened')) {
                pb.close(this);
            } else {
                pb.open(this);
            }
            return false;
        });

        g.$programsContainer.on('click', 'section div.banner span.plus-button', function() {
            if ($(this).hasClass('opened')) {
                pb.close(this);
            } else {
                pb.open(this);
            }
            return false;
        });

        // At home page, switch pages when click on program card
        const $cards = $('#cards-container label.card');
        $cards.filter('.web').click(function() {
            switchPage('web');
        });
        $cards.filter('.cyber').click(function() {
            switchPage('cyber');
        });

        function switchPage(page) {
            setupPage(page);
            g.$pageLandingHome.fadeOut(function() {
                window.scrollTo(0, 0);
                g.$programsContainer.fadeIn();
                return false;
            });
            return false;
        }

        function setupPage(page) {
            var navItems = g.$navItems.filter('.' + page);
            var banners = g.$banners.filter('.' + page);
            var landing = $('#page-landing_' + page)[0];
            const $arrowDown = g.$programsContainer.find('div.page-landing a.arrow-down');

            // Switch to home page annd reset everything to default
            g.$homeButton.on('click', function(e) {
                e.preventDefault();
                menu.homeButtonSetup();
                return false;
            });

            // on scroll, fix plus-buttons to screen and add nav styles
            if(window.innerWidth >= g.mobileMenuWidth) {
                $(window).on('scroll', function() {
                    buttonsAndArrowScroll();
                    menu.navItemsStyle(navItems, banners, landing);
                    return false;
                });
            }
            else {
                $(window).on('scroll', buttonsAndArrowScroll);
            }

            function buttonsAndArrowScroll() {
                // fix plus-buttons to screen
                pb.fixed();
                // fade out down arrow
                if (window.scrollY > '20') {
                    $arrowDown.fadeOut(400);
                } else {
                    $arrowDown.slideDown(400);
                }
                return false;
            }

            // Set form program id
            let id = (page == "web") ? 'WD' : 'IT';
            g.$applyPopUp.find("input[name='program_id']").attr('value', id);
            return false;
        };

        // mobile-menu show/hide
        if (window.innerWidth < g.mobileMenuWidth) {
            $('#menu-button, #menu-items li a').click(menu.mobileClick);
        }

        // apply-button and form
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
        return false;
    });
    return false;

}));
