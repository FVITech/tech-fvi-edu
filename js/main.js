(function(code) {
    "use strict";
    code(window.jQuery, window, document);

}(function($, window, document) {
    "use strict";

    const g = require('./globals');
    const pb = require('./plus-buttons');
    const menu = require('./menu');
    const form = require('./form');
    const smoothScroll = require('./smoothScroll');
    const viewsData = {
        home: {
            path: 'home',
            title: 'Learn to Code at the Florida Vocational Institute - Evening Coding Bootcamp'
        },
        web: {
            path: 'web-developer-program',
            title: 'Web Developer Evening Bootcamp by The Florida Vocational Institute'
        },
        cyber: {
            path: 'network-administrator-program',
            title: 'Network Administrator Evening Bootcamp by The Florida Vocational Institute'
        }
    };
    let initialUrlHasPath;
    (location.href.includes('?') && !location.href.includes('?home')) ? initialUrlHasPath = true: initialUrlHasPath = false;

    var pageSetup = {
        onReady: function() {
            pageSetup.loadPage();
            smoothScroll.init();
            g.$cards.filter('.web').on('click', () => {
                pageSetup.switchPage('web');
                history.pushState(viewsData.web, viewsData.web.path, "?" + viewsData.web.path);
            });
            g.$cards.filter('.cyber').on('click', () => {
                pageSetup.switchPage('cyber');
                history.pushState(viewsData.cyber, viewsData.cyber.path, "?" + viewsData.cyber.path);
            });
            g.$homeButton.on('click', (e) => {
                e.preventDefault();
                history.pushState(viewsData.home, viewsData.home.path, "?" + viewsData.home.path);
                menu.loadHome();
                return false;
            });
            $(window).on('popstate', () => {
                pageSetup.loadPage(false);
            });
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
        loadPage: function(pageInit) {
            if (location.href.includes('web-developer-program')) {
                $('#radio-web')[0].checked = true;
                document.title = viewsData.web.title;
                pageSetup.switchPage('web');
            } else if (location.href.includes('network-administrator-program')) {
                $('#radio-cyber')[0].checked = true;
                document.title = viewsData.cyber.title;
                pageSetup.switchPage('cyber');
            } else {
                menu.loadHome();
                document.title = viewsData.home.title;
                $('html').fadeIn(900);
                history.replaceState(viewsData.home, viewsData.home.path, "?" + viewsData.home.path);
            }
        },
        switchPage: function(page) {
            var navItems = g.$navItems.filter('.' + page);
            var banners = g.$banners.filter('.' + page);
            var landing = $('#page-landing_' + page)[0];

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
            if (initialUrlHasPath) {
                g.$pageLandingHome.hide();
                g.$programsContainer.show();
                $('html').fadeIn();
                initialUrlHasPath = false;
            } else {
                g.$pageLandingHome.fadeOut(function() {
                    window.scrollTo(0, 0);
                    g.$programsContainer.fadeIn();
                    return false;
                });
            }

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
