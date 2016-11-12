(function(code) {
    "use strict";
    code(window.jQuery, window, document);

}(function($, window, document) {
    "use strict";

    const g = require('./globals');
    const router = require('./router');
    const pb = require('./plus-buttons');
    const menu = require('./menu');
    const form = require('./form');
    const smoothScroll = require('./smoothScroll');
    const preventPopstateScroll = require('prevent-popstate-scroll');

    var main = {
        onReady: function() {
            // Load initial URL
            main.urlRouter();
            // Initialize functionality to change page content and URL
            // when user click on certain elements
            main.clickRouter();
            // Initialize functionality to scroll smoothly to different
            // location on the same page when local link is clicked
            smoothScroll.init();
            // Change page content and URL when click browser's forward or back buttons
            $(window).on('popstate', main.urlRouter);
            // prevent browser from scrolling to top when onpopstate event emits
            preventPopstateScroll.prevent();
            // Contact form functionality
            g.$applyButtons.on('click', e => {e.preventDefault(); form.show(); return false;});
            $('#apply-close, #overlay').on('click', form.hide);
            $('#submit-apply').on('click', e => {e.preventDefault(); form.send(); return false;});
            // Setup plus buttons functionality
            g.$plusButtons.on('click', function() {
                ($(this).hasClass('opened')) ? pb.close(this): pb.open(this);
                return false;
            });
            // Setup mobile menu
            if (window.innerWidth < g.mobileMenuWidth) {
                $('#menu-button, #menu-items a').click(menu.mobileClick);
            }
            return false;
        },
        urlRouter: function() {
            if (location.hash == "") {
                document.title = router.routes.home.title;
                router.load(router.routes.home);
                history.replaceState(router.routes.home, router.routes.home.path, "#/" + router.routes.home.path);
            }
            else {
                for(let route in router.routes) {
                    if(location.hash.slice(2) == router.routes[route]['path']) {
                        router.load(router.routes[route]);
                        return;
                    }
                }
            }
        },
        clickRouter: function() {
            for(let route in router.routes) {
                g.$cards.filter("." + router.routes[route]['class']).click(function(e) {
                    e.preventDefault();
                    router.loadAndPushState(router.routes[route]);
                    return false;
                });
            }
            g.$homeButton.on('click', (e) => {
                e.preventDefault();
                router.loadAndPushState(router.routes.home);
                return false;
            });
        }
    };

    $(document).ready(main.onReady);

    return false;
}));
