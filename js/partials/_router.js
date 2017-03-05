(function _router() {
    const g = require('./_globals')
    const pb = require('./_plus-buttons')
    const menu = require('./_menu')
    let $downArrows = $('a.arrow-down')

    const routes = {
        home: {
            path: 'home',
            title: 'Learn to Code at the Florida Vocational Institute - Evening Coding Bootcamp',
            class: 'home'
        },
        webdev: {
            path: 'web-developer-program',
            title: 'Web Developer Evening Bootcamp by The Florida Vocational Institute',
            class: 'webdev'
        },
        cyber: {
            path: 'network-administrator-program',
            title: 'Network Administrator Evening Bootcamp by The Florida Vocational Institute',
            class: 'cyber'
        }
    }

    function _scrollHandlerDesktop($arrows, items, sectionBanners, landingPage) {
        pb.fixed()
        if(window.scrollY > '20') {
          $arrows.forEach(a => a.addClass('hidden'))
        }
        else {
          $arrows.forEach(a => a.slideDown(400))
        }
        menu.navItemsStyle(items, sectionBanners, landingPage)
    }

    function _scrollHandlerMobile($arrows) {
        pb.fixed()
        if(window.scrollY > '20') {
          $arrows.forEach(a => a.addClass('hidden'))
        }
        else {
          $arrows.forEach(a => a.slideDown(400))
        }
    }

    function updateContent(pageClass) {
        // reset to defaults
        $('html').style.opacity = '0'
        g.$navItems.removeClass('section-in-view')
        g.$overlay.addClass('hidden')
        g.$applyPopUp.addClass('hidden')
        if(window.innerWidth <= g.mobileMenuWidth) {
            g.$menuItems.slideUp(10)
        }
        $('.plus-button.opened').forEach(btn => {
            btn.style.top = '0px'
            btn.style.transition = '.6s'
            btn.removeClass('opened')
        })
        $('.banner').removeClass('shrink')
        $('.content-container').forEach(c => c.slideUp(10))
        g.$navItems.removeClass('section-in-view')
        window.removeEventListener('scroll', scrollHandlerBody)
        window.scrollTo(0, 0)

        $('#radio-' + pageClass).checked = true
        if(pageClass === "home") {
          $('#menu').style.display = 'none'
          $('#sections-container').addClass('hidden')
        }
        else {
            $('#menu').style.display = 'block'
            $('#sections-container').removeClass('hidden')
        }

        var navItems = $('a.nav-item.' + pageClass)
        var banners = $('.banner.' + pageClass)
        var landing = $('#page_' + pageClass)

        // on scroll, fix plus-buttons to screen and add nav styles
        var scrollHandlerBody = (window.innerWidth >= g.mobileMenuWidth) ? _scrollHandlerDesktop : _scrollHandlerMobile
        window.addEventListener('scroll', function scrollHandler() {
            scrollHandlerBody($downArrows, navItems, banners, landing)
        })
        $('html').style.opacity = '1'
    }

    function _createrRouteLoader(pushState) {
        function loader(route) {
            document.title = route.title
            updateContent(route.class)
            if(pushState) {history.pushState(route, route.path, "#/" + route.path)}
        }
        return loader
    }

    let load = _createrRouteLoader(false)
    let loadAndPushState = _createrRouteLoader(true)

    module.exports.routes = routes
    module.exports.load = load
    module.exports.loadAndPushState = loadAndPushState
    module.exports.updateContent = updateContent
})()
