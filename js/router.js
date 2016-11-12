(function() {
    const g = require('./globals');
    const pb = require('./plus-buttons');
    const menu = require('./menu');
    let $downArrows = $('a.arrow-down');

    const routes = {
        home: {
            path: 'home',
            title: 'Learn to Code at the Florida Vocational Institute - Evening Coding Bootcamp',
            class: 'home'
        },
        web: {
            path: 'web-developer-program',
            title: 'Web Developer Evening Bootcamp by The Florida Vocational Institute',
            class: 'web'
        },
        cyber: {
            path: 'network-administrator-program',
            title: 'Network Administrator Evening Bootcamp by The Florida Vocational Institute',
            class: 'cyber'
        }
    };

    function createrRouteLoader(pushState) {
        function loader(route) {
            document.title = route.title;
            updateContent(route.class);
            if(pushState) {history.pushState(route, route.path, "#/" + route.path)}
            return false;
        }
        return loader;
    }

    let load = createrRouteLoader(false);
    let loadAndPushState = createrRouteLoader(true);

    function updateContent(pageClass) {
        $('html').fadeOut(function() {
            // reset to defaults
            g.$navItems.removeClass('section-in-view');
            g.$overlay.hide();
            g.$applyPopUp.hide();
            g.$plusButtons.filter('.opened')
                .css({'top': '0px', 'transition': '.6s'})
                .removeClass('opened');
            g.$banners.filter('.shrink')
                .removeClass('shrink')
                .next().hide();
            g.$navItems.removeClass('section-in-view');
            $(window).off('scroll', scrollHandlerBody);
            window.scroll(0, 0);

            $('#radio-' + pageClass)[0].checked = true;
            (pageClass == "home") ? $('#menu, #sections-container').hide() : $('#menu, #sections-container').show();

            var navItems = g.$navItems.filter('.' + pageClass);
            var banners = g.$banners.filter('.' + pageClass);
            var landing = $('#page_' + pageClass)[0];

            // on scroll, fix plus-buttons to screen and add nav styles
            let scrollHandlerBody = (window.innerWidth >= g.mobileMenuWidth) ? scrollHandlerDesktop : scrollHandlerMobile;
            $(window).on('scroll', function scrollHandler() {
                scrollHandlerBody($downArrows, navItems, banners, landing);
            });

            $('html').fadeIn();
        });
        return false;
    }

    function scrollHandlerDesktop($arrows, items, sectionBanners, landingPage) {
        pb.fixed();
        (window.scrollY > '20') ? $arrows.fadeOut(400): $arrows.slideDown(400);
        menu.navItemsStyle(items, sectionBanners, landingPage);
        return false;
    }

    function scrollHandlerMobile($arrows, items, sectionBanners, landingPage) {
        pb.fixed();
        (window.scrollY > '20') ? $arrows.fadeOut(400): $arrows.slideDown(400);
        return false
    }

    module.exports.routes = routes;
    module.exports.load = load;
    module.exports.loadAndPushState = loadAndPushState;
    module.exports.updateContent = updateContent;
})();
