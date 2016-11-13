(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

(function form() {
    var g = require('./globals');
    var $message = $('#sent-message');

    function show() {
        g.$overlay.fadeIn();
        g.$applyPopUp.fadeIn();
        return false;
    }

    function hide() {
        g.$overlay.fadeOut();
        g.$applyPopUp.fadeOut(function () {
            g.$applyForm.show();
            $message.hide();
        });
        return false;
    }

    function send() {

        function sendForm() {
            return $.ajax({
                url: 'http://fvi-grad.com:4004/fakeform',
                type: 'post',
                data: g.$applyForm.serialize()
            });
        }

        sendForm().done(function () {
            g.$applyForm.fadeOut(function () {
                $message.fadeIn();
                g.$applyForm[0].reset();
            });
        }).fail(function (error) {
            console.log(error);
            $message.fadeIn();
            $message.find('h3').html('Uh Oh!');
            $message.find('p').html('Looks like there was an error sending your message.\nPlease call 786-574-9511 to speak with a representative from FVI.');
        });
        return false;
    }

    module.exports.show = show;
    module.exports.hide = hide;
    module.exports.send = send;
})();

},{"./globals":2}],2:[function(require,module,exports){
'use strict';

(function globals() {
    var $overlay = $('#overlay');
    var $cards = $('label.card');
    var $applyPopUp = $('#apply-pop-up');
    var $applyForm = $applyPopUp.find('form');
    var $applyButtons = $('#nav-apply-btn, #cta-apply-btn, #contact-home, .request-info');
    var $pagesContainer = $('#pages-container');
    var $homeButton = $('#home-button');
    var $menuItems = $('#menu-items');
    var $navItems = $menuItems.find('a.nav-item');
    var $sections = $pagesContainer.find('section');
    var $banners = $sections.find('.banner');
    var $plusButtons = $banners.find('span.plus-button');

    module.exports.mobileMenuWidth = '960';
    module.exports.topPadding = window.innerWidth >= '960' ? 52 : 0;
    module.exports.$overlay = $overlay;
    module.exports.$cards = $cards;
    module.exports.$applyPopUp = $applyPopUp;
    module.exports.$applyForm = $applyForm;
    module.exports.$applyButtons = $applyButtons;
    module.exports.$pagesContainer = $pagesContainer;
    module.exports.$homeButton = $homeButton;
    module.exports.$menuItems = $menuItems;
    module.exports.$navItems = $navItems;
    module.exports.$sections = $sections;
    module.exports.$banners = $banners;
    module.exports.$plusButtons = $plusButtons;
})();

},{}],3:[function(require,module,exports){
"use strict";

(function main(mainFunction) {
    "use strict";

    mainFunction(window.jQuery, window, document);
})(function mainFunction($, window, document) {
    "use strict";

    var g = require('./globals');
    var router = require('./router');
    var pb = require('./plus-buttons');
    var menu = require('./menu');
    var form = require('./form');
    var smoothScroll = require('./smoothScroll');
    var preventPopstateScroll = require('prevent-popstate-scroll');

    var setup = {
        onReady: function onReady() {
            // Load initial URL
            setup.urlRouter();
            // Initialize functionality to change page content and URL
            // when user click on certain elements
            setup.clickRouter();
            // Initialize functionality to scroll smoothly to different
            // location on the same page when local link is clicked
            smoothScroll.init();
            // Change page content and URL when click browser's forward or back buttons
            $(window).on('popstate', setup.urlRouter);
            // prevent browser from scrolling to top when onpopstate event emits
            preventPopstateScroll.prevent();
            // Contact form functionality
            g.$applyButtons.on('click', function (e) {
                e.preventDefault();form.show();return false;
            });
            $('#apply-close, #overlay').on('click', form.hide);
            $('#submit-apply').on('click', function (e) {
                e.preventDefault();form.send();return false;
            });
            // Setup plus buttons functionality
            g.$plusButtons.on('click', function () {
                $(this).hasClass('opened') ? pb.close(this) : pb.open(this);
                return false;
            });
            // Setup mobile menu
            if (window.innerWidth < g.mobileMenuWidth) {
                $('#menu-button, #menu-items a').click(menu.mobileClick);
            }
            return false;
        },
        urlRouter: function urlRouter() {
            if (location.hash == "") {
                document.title = router.routes.home.title;
                router.load(router.routes.home);
                history.replaceState(router.routes.home, router.routes.home.path, "#/" + router.routes.home.path);
            } else {
                for (var route in router.routes) {
                    if (location.hash.slice(2) == router.routes[route]['path']) {
                        router.load(router.routes[route]);
                        return;
                    }
                }
            }
        },
        clickRouter: function clickRouter() {
            var _loop = function _loop(route) {
                g.$cards.filter("." + router.routes[route]['class']).click(function (e) {
                    e.preventDefault();
                    router.loadAndPushState(router.routes[route]);
                    return false;
                });
            };

            for (var route in router.routes) {
                _loop(route);
            }
            g.$homeButton.on('click', function (e) {
                e.preventDefault();
                router.loadAndPushState(router.routes.home);
                return false;
            });
        }
    };

    $(document).ready(setup.onReady);

    return false;
});

},{"./form":1,"./globals":2,"./menu":4,"./plus-buttons":5,"./router":6,"./smoothScroll":7,"prevent-popstate-scroll":11}],4:[function(require,module,exports){
'use strict';

(function menu() {
    var g = require('./globals');

    function navItemsStyle(navItems, banners, landing) {
        // if window scroll position is between a banner, add nav style to corresponding nav item
        if (landing.getBoundingClientRect().bottom < '-24') {
            for (var j = 0, y = banners.length; j < y; j++) {
                if (banners[j].getBoundingClientRect().top <= g.topPadding + 1 && (banners[j].nextSibling.nextSibling.getBoundingClientRect().bottom > g.topPadding || banners[j].getBoundingClientRect().bottom > g.topPadding)) {
                    navItems[j].classList.add('section-in-view');
                } else {
                    navItems[j].classList.remove('section-in-view');
                }
            }
        } else {
            g.$navItems.removeClass('section-in-view');
        }
        return false;
    }

    function mobileClick() {
        var $menuButton = $('#menu-button span');
        if ($menuButton.html() === 'MENU') {
            g.$menuItems.show(500, 'easeOutQuad');
            $menuButton.html('CLOSE');
        } else {
            g.$menuItems.hide(500, 'easeOutQuad');
            $menuButton.html('MENU');
        }
        return false;
    }

    module.exports.navItemsStyle = navItemsStyle;
    module.exports.mobileClick = mobileClick;
})();

},{"./globals":2}],5:[function(require,module,exports){
'use strict';

(function plusButtons() {
    var g = require('./globals');

    function open(button) {
        var $banner = $(button.parentNode);
        $(button).addClass('opened');
        $banner.addClass('shrink');
        $banner.next().slideDown(600, 'easeOutQuad');
        return false;
    }

    function close(button) {
        var $button = $(button);
        var $banner = $(button.parentNode);
        var distance = window.innerWidth >= g.mobileMenuWidth ? $banner.offset().top - g.topPadding - window.scrollY : $banner.offset().top - window.scrollY;
        var timing = distance <= 1 && distance >= 0 ? 0 : 700;
        $('html, body').stop().animate({ // need to select both html and body for FireFox
            scrollTop: $banner.offset().top - g.topPadding
        }, timing, 'easeInOutQuad', function () {
            $button.removeClass('opened').css({
                'top': '0px',
                'transition': 'all .6s'
            });
            $banner.removeClass('shrink').next().slideUp(600, 'easeInOutCubic');
            return false;
        });
        return false;
    }

    function fixed() {
        // bottomPadding is the bottom of the content, plus nav height and button translateY
        var bottomPadding = window.innerWidth >= g.mobileMenuWidth ? '96' : '45';
        var $openButtons = g.$plusButtons.filter('.opened');
        for (var i = 0, x = $openButtons.length; i < x; i++) {
            var contentPosition = $openButtons[i].parentNode.nextSibling.nextSibling.getBoundingClientRect();
            if (contentPosition.top <= String(g.topPadding) && contentPosition.bottom >= bottomPadding) {
                $($openButtons[i]).css({
                    'top': -contentPosition.top + g.topPadding + 'px',
                    'transition': '0s'
                });
            } else {
                $($openButtons[i]).css({
                    'top': '0px',
                    'transition': '0s'
                });
            }
        }
        return false;
    }

    module.exports.open = open;
    module.exports.close = close;
    module.exports.fixed = fixed;
})();

},{"./globals":2}],6:[function(require,module,exports){
'use strict';

(function router() {
    var g = require('./globals');
    var pb = require('./plus-buttons');
    var menu = require('./menu');
    var $downArrows = $('a.arrow-down');

    var routes = {
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
            if (pushState) {
                history.pushState(route, route.path, "#/" + route.path);
            }
            return false;
        }
        return loader;
    }

    var load = createrRouteLoader(false);
    var loadAndPushState = createrRouteLoader(true);

    function updateContent(pageClass) {
        $('html').fadeOut(function () {
            // reset to defaults
            g.$navItems.removeClass('section-in-view');
            g.$overlay.hide();
            g.$applyPopUp.hide();
            g.$plusButtons.filter('.opened').css({ 'top': '0px', 'transition': '.6s' }).removeClass('opened');
            g.$banners.filter('.shrink').removeClass('shrink').next().hide();
            g.$navItems.removeClass('section-in-view');
            $(window).off('scroll', scrollHandlerBody);
            window.scroll(0, 0);

            $('#radio-' + pageClass)[0].checked = true;
            pageClass == "home" ? $('#menu, #sections-container').hide() : $('#menu, #sections-container').show();

            var navItems = g.$navItems.filter('.' + pageClass);
            var banners = g.$banners.filter('.' + pageClass);
            var landing = $('#page_' + pageClass)[0];

            // on scroll, fix plus-buttons to screen and add nav styles
            var scrollHandlerBody = window.innerWidth >= g.mobileMenuWidth ? scrollHandlerDesktop : scrollHandlerMobile;
            $(window).on('scroll', function scrollHandler() {
                scrollHandlerBody($downArrows, navItems, banners, landing);
            });

            $('html').fadeIn();
        });
        return false;
    }

    function scrollHandlerDesktop($arrows, items, sectionBanners, landingPage) {
        pb.fixed();
        window.scrollY > '20' ? $arrows.fadeOut(400) : $arrows.slideDown(400);
        menu.navItemsStyle(items, sectionBanners, landingPage);
        return false;
    }

    function scrollHandlerMobile($arrows, items, sectionBanners, landingPage) {
        pb.fixed();
        window.scrollY > '20' ? $arrows.fadeOut(400) : $arrows.slideDown(400);
        return false;
    }

    module.exports.routes = routes;
    module.exports.load = load;
    module.exports.loadAndPushState = loadAndPushState;
    module.exports.updateContent = updateContent;
})();

},{"./globals":2,"./menu":4,"./plus-buttons":5}],7:[function(require,module,exports){
'use strict';

(function smoothScroll() {
    // This will select everything with the class smoothScroll
    // This should prevent problems with carousel, scrollspy, etc...
    function init() {
        // menu items
        $('.smoothScroll').click(smoothScrollFunc);
        return false;
    }

    function smoothScrollFunc() {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                // topPadding is the height of the nav, so it scrolls past the nav
                var topPadding = $(target[0]).hasClass('banner') ? window.innerWidth >= '960' ? -52 : 0 : 0;
                var distance = $(target[0]).offset().top + topPadding - window.scrollY;
                var timing = distance < 1 && distance >= 0 ? 0 : 700;
                $('body, html').animate({
                    scrollTop: target.offset().top + topPadding
                }, timing, 'easeInOutQuint', function () {
                    if ($(target[0]).has('span.plus-button')) {
                        var nodes = target[0].childNodes;
                        for (var i = 0, x = nodes.length; i < x; i++) {
                            if (nodes[i].classList == 'plus-button') {
                                $(nodes[i]).click();
                            }
                        }
                    }
                    return false;
                });
            }
        }
        return false;
    }

    module.exports.init = init;
})();

},{}],8:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, '__esModule', {
	value: true
});
function getScrollTop() {
	return window.pageYOffset || document.body.scrollTop;
}

function getScrollLeft() {
	return window.pageXOffset || document.body.scrollLeft;
}
exports['default'] = getScrollTop;
exports.getScrollLeft = getScrollLeft;
exports.getScrollTop = getScrollTop;
exports.left = getScrollLeft;
exports.top = getScrollTop;


},{}],9:[function(require,module,exports){
module.exports = on;
module.exports.on = on;
module.exports.off = off;

function on (element, type, listener, useCapture) {
  element.addEventListener(type, listener, useCapture);
  return listener;
}

function off (element, type, listener, useCapture) {
  element.removeEventListener(type, listener, useCapture);
  return listener;
}

},{}],10:[function(require,module,exports){
/*! npm.im/one-event */
'use strict';

function once(target, type, listener, useCapture) {
	target.addEventListener(type, listener, useCapture);
	target.addEventListener(type, function selfRemoving() {
		target.removeEventListener(type, listener, useCapture);
		target.removeEventListener(type, selfRemoving, useCapture);
	}, useCapture);
}

once.promise = function (target, type, useCapture) { return new Promise(function (resolve) { return once(target, type, resolve, useCapture); }); };

module.exports = once;
},{}],11:[function(require,module,exports){
'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var getScroll = require('get-scroll');
var onOff = require('on-off');
var once = _interopDefault(require('one-event'));

exports.isPrevented = false;

/**
 * Scroll functions
 */
var lastScrollPosition = void 0;
function resetScroll() {
	window.scrollTo.apply(window, lastScrollPosition);
}
function waitForScroll() {
	lastScrollPosition = [getScroll.getScrollLeft(), getScroll.getScrollTop()];
	once(window, 'scroll', resetScroll);
}

/**
 * Toggle functions
 */
function event(action) {
	// run "remove" only if it's prevented
	// otherwise run "attach" or "once" only if it's not already prevented
	if (action === onOff.off === exports.isPrevented) {
		action(window, 'popstate', waitForScroll);
	}
}
function allow() {
	event(onOff.off);
	exports.isPrevented = false;
}
function prevent() {
	event(onOff.on);
	exports.isPrevented = true;
}
function preventOnce() {
	event(once);
}

var index = (function (toggle) {
	(toggle ? prevent : allow)();
});

exports.allow = allow;
exports.prevent = prevent;
exports.preventOnce = preventOnce;
exports['default'] = index;
},{"get-scroll":8,"on-off":9,"one-event":10}]},{},[3]);
