(function mainFunction() {
    "use strict"

    require('./dom-query.js')
    require('dom-slider')
    require('dom-fader')
    const g = require('./partials/_globals')
    const router = require('./partials/_router')
    const pb = require('./partials/_plus-buttons')
    const menu = require('./partials/_menu')
    const form = require('./partials/_form')
    const preventPopstateScroll = require('prevent-popstate-scroll')

    var setup = {
        initAll: function() {
            // Load initial URL
            setup.urlRouter()
            // Initialize functionality to change page content and URL
            // when user click on certain elements
            setup.clickRouter()
            // Change page content and URL when click browser's forward or back buttons
            window.addEventListener('popstate', setup.urlRouter)
            // prevent browser from scrolling to top when onpopstate event emits
            preventPopstateScroll.prevent()
            // smoothScroll initialization
            setup.smoothScroll()
            // Click on plus-buttons before user prints, to show content
            setup.printStyles()
            // Contact form functionality
            g.$applyButtons.forEach(btn => {
                btn.addEventListener('click', e => {
                    e.preventDefault()
                    form.show()
                })
            })
            $('#apply-close').addEventListener('click', form.hide)
            g.$overlay.addEventListener('click', function() {
                form.hide()
                if(window.innerWidth <= g.mobileMenuWidth) {
                    if($('#menu-button span').textContent === 'CLOSE') {
                        menu.mobileClick()
                    }
                }
            })
            $('#submit-apply').addEventListener('click', form.send);
            // Setup plus buttons functionality
            g.$plusButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    (this.classList.contains('opened')) ? pb.close(this): pb.open(this)
                })
            })
            // Setup mobile menu
            if (window.innerWidth < g.mobileMenuWidth) {
                $('#menu-button').addEventListener('click', menu.mobileClick)
                $('#menu-items a').forEach(item => {
                    item.addEventListener('click', menu.mobileClick)
                })
            }
        },
        urlRouter: function() {
            if (location.hash === "") {
                document.title = router.routes.home.title
                router.load(router.routes.home)
                history.replaceState(
                    router.routes.home,
                    router.routes.home.path,
                    "#/" + router.routes.home.path
                )
            }
            else {
                for(let route in router.routes) {
                    if(location.hash.slice(2) == router.routes[route].path) {
                        router.load(router.routes[route])
                        return false
                    }
                }
            }
        },
        clickRouter: function() {
            for(let route in router.routes) {
                if(route === 'home') continue
                if(router.routes.hasOwnProperty(route)) {
                    $(".card." + router.routes[route]['class']).addEventListener('click', function(e) {
                        e.preventDefault()
                        router.loadAndPushState(router.routes[route])
                    })
                }
            }
            g.$homeButton.addEventListener('click', (e) => {
                e.preventDefault()
                router.loadAndPushState(router.routes.home)
            })
        },
        smoothScroll: function() {
            $('a.smoothScroll').forEach(anchor => {
                anchor.addEventListener('click', e => {
                    e.preventDefault()
                    const dest = $( anchor.getAttribute('href') )
                    zenscroll.to(dest, 400, function() {
                        const btn = dest.querySelector('.plus-button')
                        if(btn && !btn.classList.contains('opened')) {
                            btn.click()
                        }
                    })
                })
            })
        },
        printStyles: function() {
            function showContent() {
                $('.plus-button:not(.opened)').forEach(btn => {
                    btn.click()
                })
            }

            function hideContent() {
                $('.plus-button.opened').forEach(btn => {
                    btn.click()
                })
            }

            window.onbeforeprint = showContent
            window.onafterprint = hideContent

            var mediaQueryList = window.matchMedia('print');
            mediaQueryList.addListener(function(mql) {
                if (mql.matches) {
                    showContent()
                    setTimeout(hideContent, 500)
                };
            });
        }
    }

    setup.initAll()
})()
