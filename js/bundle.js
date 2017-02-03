(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

(function main(mainFunction) {
    "use strict";

    mainFunction(window.jQuery, window, document);
})(function mainFunction($, window, document) {
    "use strict";

    var g = require('./partials/_globals');
    var router = require('./partials/_router');
    var pb = require('./partials/_plus-buttons');
    var menu = require('./partials/_menu');
    var form = require('./partials/_form');
    var smoothScroll = require('./partials/_smoothScroll');
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
            if (location.hash === "") {
                document.title = router.routes.home.title;
                router.load(router.routes.home);
                history.replaceState(router.routes.home, router.routes.home.path, "#/" + router.routes.home.path);
            } else {
                for (var route in router.routes) {
                    if (location.hash.slice(2) == router.routes[route].path) {
                        router.load(router.routes[route]);
                        return;
                    }
                }
            }
        },
        clickRouter: function clickRouter() {
            var _loop = function _loop(route) {
                if (router.routes.hasOwnProperty(route)) {
                    g.$cards.filter("." + router.routes[route]['class']).click(function (e) {
                        e.preventDefault();
                        router.loadAndPushState(router.routes[route]);
                        return false;
                    });
                }
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

},{"./partials/_form":2,"./partials/_globals":3,"./partials/_menu":4,"./partials/_plus-buttons":5,"./partials/_router":6,"./partials/_smoothScroll":7,"prevent-popstate-scroll":11}],2:[function(require,module,exports){
'use strict';

(function _form() {
    var g = require('./_globals');
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

},{"./_globals":3}],3:[function(require,module,exports){
'use strict';

(function _globals() {
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

},{}],4:[function(require,module,exports){
'use strict';

(function _menu() {
    var g = require('./_globals');

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

},{"./_globals":3}],5:[function(require,module,exports){
'use strict';

(function _plusButtons() {
    var g = require('./_globals');

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

},{"./_globals":3}],6:[function(require,module,exports){
'use strict';

(function _router() {
    var g = require('./_globals');
    var pb = require('./_plus-buttons');
    var menu = require('./_menu');
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
            path: 'cyber-security-and-network-administrator-program',
            title: 'Network Administrator Evening Bootcamp by The Florida Vocational Institute',
            class: 'cyber'
        }
    };

    function _createrRouteLoader(pushState) {
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

    var load = _createrRouteLoader(false);
    var loadAndPushState = _createrRouteLoader(true);

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
            if (pageClass == "home") {
                $('#menu, #sections-container').hide();
            } else {
                $('#menu, #sections-container').show();
            }

            var navItems = g.$navItems.filter('.' + pageClass);
            var banners = g.$banners.filter('.' + pageClass);
            var landing = $('#page_' + pageClass)[0];

            // on scroll, fix plus-buttons to screen and add nav styles
            var scrollHandlerBody = window.innerWidth >= g.mobileMenuWidth ? _scrollHandlerDesktop : _scrollHandlerMobile;
            $(window).on('scroll', function scrollHandler() {
                scrollHandlerBody($downArrows, navItems, banners, landing);
            });

            $('html').fadeIn();
        });
        return false;
    }

    function _scrollHandlerDesktop($arrows, items, sectionBanners, landingPage) {
        pb.fixed();
        if (window.scrollY > '20') {
            $arrows.fadeOut(400);
        } else {
            $arrows.slideDown(400);
        }
        menu.navItemsStyle(items, sectionBanners, landingPage);
        return false;
    }

    function _scrollHandlerMobile($arrows) {
        pb.fixed();
        if (window.scrollY > '20') {
            $arrows.fadeOut(400);
        } else {
            $arrows.slideDown(400);
        }
        return false;
    }

    module.exports.routes = routes;
    module.exports.load = load;
    module.exports.loadAndPushState = loadAndPushState;
    module.exports.updateContent = updateContent;
})();

},{"./_globals":3,"./_menu":4,"./_plus-buttons":5}],7:[function(require,module,exports){
'use strict';

(function _smoothScroll() {
    // This will select everything with the class smoothScroll
    // This should prevent problems with carousel, scrollspy, etc...
    function init() {
        // menu items
        $('.smoothScroll').click(_smoothScrollFunc);
        return false;
    }

    function _smoothScrollFunc() {
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
},{"get-scroll":8,"on-off":9,"one-event":10}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqc1xcbWFpbi5qcyIsImpzXFxwYXJ0aWFsc1xcX2Zvcm0uanMiLCJqc1xccGFydGlhbHNcXF9nbG9iYWxzLmpzIiwianNcXHBhcnRpYWxzXFxfbWVudS5qcyIsImpzXFxwYXJ0aWFsc1xcX3BsdXMtYnV0dG9ucy5qcyIsImpzXFxwYXJ0aWFsc1xcX3JvdXRlci5qcyIsImpzXFxwYXJ0aWFsc1xcX3Ntb290aFNjcm9sbC5qcyIsIm5vZGVfbW9kdWxlcy9nZXQtc2Nyb2xsL2Rpc3QvZ2V0LXNjcm9sbC5ub2RlLmpzIiwibm9kZV9tb2R1bGVzL29uLW9mZi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9vbmUtZXZlbnQvZGlzdC9vbmUtZXZlbnQuY29tbW9uLWpzLmpzIiwibm9kZV9tb2R1bGVzL3ByZXZlbnQtcG9wc3RhdGUtc2Nyb2xsL2Rpc3QvcHJldmVudC1wb3BzdGF0ZS1zY3JvbGwuY29tbW9uLWpzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQyxVQUFTLElBQVQsQ0FBYyxZQUFkLEVBQTRCO0FBQ3pCOztBQUNBLGlCQUFhLE9BQU8sTUFBcEIsRUFBNEIsTUFBNUIsRUFBb0MsUUFBcEM7QUFFSCxDQUpBLEVBSUMsU0FBUyxZQUFULENBQXNCLENBQXRCLEVBQXlCLE1BQXpCLEVBQWlDLFFBQWpDLEVBQTJDO0FBQ3pDOztBQUVBLFFBQU0sSUFBSSxRQUFRLHFCQUFSLENBQVY7QUFDQSxRQUFNLFNBQVMsUUFBUSxvQkFBUixDQUFmO0FBQ0EsUUFBTSxLQUFLLFFBQVEsMEJBQVIsQ0FBWDtBQUNBLFFBQU0sT0FBTyxRQUFRLGtCQUFSLENBQWI7QUFDQSxRQUFNLE9BQU8sUUFBUSxrQkFBUixDQUFiO0FBQ0EsUUFBTSxlQUFlLFFBQVEsMEJBQVIsQ0FBckI7QUFDQSxRQUFNLHdCQUF3QixRQUFRLHlCQUFSLENBQTlCOztBQUVBLFFBQUksUUFBUTtBQUNSLGlCQUFT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YXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIihmdW5jdGlvbiBtYWluKG1haW5GdW5jdGlvbikge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBtYWluRnVuY3Rpb24od2luZG93LmpRdWVyeSwgd2luZG93LCBkb2N1bWVudCk7XHJcblxyXG59KGZ1bmN0aW9uIG1haW5GdW5jdGlvbigkLCB3aW5kb3csIGRvY3VtZW50KSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBjb25zdCBnID0gcmVxdWlyZSgnLi9wYXJ0aWFscy9fZ2xvYmFscycpO1xyXG4gICAgY29uc3Qgcm91dGVyID0gcmVxdWlyZSgnLi9wYXJ0aWFscy9fcm91dGVyJyk7XHJcbiAgICBjb25zdCBwYiA9IHJlcXVpcmUoJy4vcGFydGlhbHMvX3BsdXMtYnV0dG9ucycpO1xyXG4gICAgY29uc3QgbWVudSA9IHJlcXVpcmUoJy4vcGFydGlhbHMvX21lbnUnKTtcclxuICAgIGNvbnN0IGZvcm0gPSByZXF1aXJlKCcuL3BhcnRpYWxzL19mb3JtJyk7XHJcbiAgICBjb25zdCBzbW9vdGhTY3JvbGwgPSByZXF1aXJlKCcuL3BhcnRpYWxzL19zbW9vdGhTY3JvbGwnKTtcclxuICAgIGNvbnN0IHByZXZlbnRQb3BzdGF0ZVNjcm9sbCA9IHJlcXVpcmUoJ3ByZXZlbnQtcG9wc3RhdGUtc2Nyb2xsJyk7XHJcblxyXG4gICAgdmFyIHNldHVwID0ge1xyXG4gICAgICAgIG9uUmVhZHk6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAvLyBMb2FkIGluaXRpYWwgVVJMXHJcbiAgICAgICAgICAgIHNldHVwLnVybFJvdXRlcigpO1xyXG4gICAgICAgICAgICAvLyBJbml0aWFsaXplIGZ1bmN0aW9uYWxpdHkgdG8gY2hhbmdlIHBhZ2UgY29udGVudCBhbmQgVVJMXHJcbiAgICAgICAgICAgIC8vIHdoZW4gdXNlciBjbGljayBvbiBjZXJ0YWluIGVsZW1lbnRzXHJcbiAgICAgICAgICAgIHNldHVwLmNsaWNrUm91dGVyKCk7XHJcbiAgICAgICAgICAgIC8vIEluaXRpYWxpemUgZnVuY3Rpb25hbGl0eSB0byBzY3JvbGwgc21vb3RobHkgdG8gZGlmZmVyZW50XHJcbiAgICAgICAgICAgIC8vIGxvY2F0aW9uIG9uIHRoZSBzYW1lIHBhZ2Ugd2hlbiBsb2NhbCBsaW5rIGlzIGNsaWNrZWRcclxuICAgICAgICAgICAgc21vb3RoU2Nyb2xsLmluaXQoKTtcclxuICAgICAgICAgICAgLy8gQ2hhbmdlIHBhZ2UgY29udGVudCBhbmQgVVJMIHdoZW4gY2xpY2sgYnJvd3NlcidzIGZvcndhcmQgb3IgYmFjayBidXR0b25zXHJcbiAgICAgICAgICAgICQod2luZG93KS5vbigncG9wc3RhdGUnLCBzZXR1cC51cmxSb3V0ZXIpO1xyXG4gICAgICAgICAgICAvLyBwcmV2ZW50IGJyb3dzZXIgZnJvbSBzY3JvbGxpbmcgdG8gdG9wIHdoZW4gb25wb3BzdGF0ZSBldmVudCBlbWl0c1xyXG4gICAgICAgICAgICBwcmV2ZW50UG9wc3RhdGVTY3JvbGwucHJldmVudCgpO1xyXG4gICAgICAgICAgICAvLyBDb250YWN0IGZvcm0gZnVuY3Rpb25hbGl0eVxyXG4gICAgICAgICAgICBnLiRhcHBseUJ1dHRvbnMub24oJ2NsaWNrJywgZSA9PiB7ZS5wcmV2ZW50RGVmYXVsdCgpOyBmb3JtLnNob3coKTsgcmV0dXJuIGZhbHNlO30pO1xyXG4gICAgICAgICAgICAkKCcjYXBwbHktY2xvc2UsICNvdmVybGF5Jykub24oJ2NsaWNrJywgZm9ybS5oaWRlKTtcclxuICAgICAgICAgICAgJCgnI3N1Ym1pdC1hcHBseScpLm9uKCdjbGljaycsIGUgPT4ge2UucHJldmVudERlZmF1bHQoKTsgZm9ybS5zZW5kKCk7IHJldHVybiBmYWxzZTt9KTtcclxuICAgICAgICAgICAgLy8gU2V0dXAgcGx1cyBidXR0b25zIGZ1bmN0aW9uYWxpdHlcclxuICAgICAgICAgICAgZy4kcGx1c0J1dHRvbnMub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAoJCh0aGlzKS5oYXNDbGFzcygnb3BlbmVkJykpID8gcGIuY2xvc2UodGhpcyk6IHBiLm9wZW4odGhpcyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAvLyBTZXR1cCBtb2JpbGUgbWVudVxyXG4gICAgICAgICAgICBpZiAod2luZG93LmlubmVyV2lkdGggPCBnLm1vYmlsZU1lbnVXaWR0aCkge1xyXG4gICAgICAgICAgICAgICAgJCgnI21lbnUtYnV0dG9uLCAjbWVudS1pdGVtcyBhJykuY2xpY2sobWVudS5tb2JpbGVDbGljayk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdXJsUm91dGVyOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaWYgKGxvY2F0aW9uLmhhc2ggPT09IFwiXCIpIHtcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LnRpdGxlID0gcm91dGVyLnJvdXRlcy5ob21lLnRpdGxlO1xyXG4gICAgICAgICAgICAgICAgcm91dGVyLmxvYWQocm91dGVyLnJvdXRlcy5ob21lKTtcclxuICAgICAgICAgICAgICAgIGhpc3RvcnkucmVwbGFjZVN0YXRlKHJvdXRlci5yb3V0ZXMuaG9tZSwgcm91dGVyLnJvdXRlcy5ob21lLnBhdGgsIFwiIy9cIiArIHJvdXRlci5yb3V0ZXMuaG9tZS5wYXRoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGZvcihsZXQgcm91dGUgaW4gcm91dGVyLnJvdXRlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGxvY2F0aW9uLmhhc2guc2xpY2UoMikgPT0gcm91dGVyLnJvdXRlc1tyb3V0ZV0ucGF0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByb3V0ZXIubG9hZChyb3V0ZXIucm91dGVzW3JvdXRlXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGNsaWNrUm91dGVyOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgZm9yKGxldCByb3V0ZSBpbiByb3V0ZXIucm91dGVzKSB7XHJcbiAgICAgICAgICAgICAgICBpZihyb3V0ZXIucm91dGVzLmhhc093blByb3BlcnR5KHJvdXRlKSkge1xyXG4gICAgICAgICAgICAgICAgICBnLiRjYXJkcy5maWx0ZXIoXCIuXCIgKyByb3V0ZXIucm91dGVzW3JvdXRlXVsnY2xhc3MnXSkuY2xpY2soZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgcm91dGVyLmxvYWRBbmRQdXNoU3RhdGUocm91dGVyLnJvdXRlc1tyb3V0ZV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBnLiRob21lQnV0dG9uLm9uKCdjbGljaycsIChlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICByb3V0ZXIubG9hZEFuZFB1c2hTdGF0ZShyb3V0ZXIucm91dGVzLmhvbWUpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgICQoZG9jdW1lbnQpLnJlYWR5KHNldHVwLm9uUmVhZHkpO1xyXG5cclxuICAgIHJldHVybiBmYWxzZTtcclxufSkpO1xyXG4iLCIoZnVuY3Rpb24gX2Zvcm0oKSB7XHJcbiAgICBjb25zdCBnID0gcmVxdWlyZSgnLi9fZ2xvYmFscycpO1xyXG4gICAgbGV0ICRtZXNzYWdlID0gJCgnI3NlbnQtbWVzc2FnZScpO1xyXG5cclxuICAgIGZ1bmN0aW9uIHNob3coKSB7XHJcbiAgICAgICAgZy4kb3ZlcmxheS5mYWRlSW4oKTtcclxuICAgICAgICBnLiRhcHBseVBvcFVwLmZhZGVJbigpO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBoaWRlKCkge1xyXG4gICAgICAgIGcuJG92ZXJsYXkuZmFkZU91dCgpO1xyXG4gICAgICAgIGcuJGFwcGx5UG9wVXAuZmFkZU91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgIGcuJGFwcGx5Rm9ybS5zaG93KCk7XHJcbiAgICAgICAgICAkbWVzc2FnZS5oaWRlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHNlbmQoKSB7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHNlbmRGb3JtKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgIHVybDogJ2h0dHA6Ly9mdmktZ3JhZC5jb206NDAwNC9mYWtlZm9ybScsXHJcbiAgICAgICAgICAgICAgICB0eXBlOiAncG9zdCcsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBnLiRhcHBseUZvcm0uc2VyaWFsaXplKClcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZW5kRm9ybSgpLmRvbmUoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGcuJGFwcGx5Rm9ybS5mYWRlT3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgJG1lc3NhZ2UuZmFkZUluKCk7XHJcbiAgICAgICAgICAgICAgICBnLiRhcHBseUZvcm1bMF0ucmVzZXQoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSkuZmFpbChmdW5jdGlvbihlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICAgICAgICAgICRtZXNzYWdlLmZhZGVJbigpO1xyXG4gICAgICAgICAgICAkbWVzc2FnZS5maW5kKCdoMycpLmh0bWwoJ1VoIE9oIScpO1xyXG4gICAgICAgICAgICAkbWVzc2FnZS5maW5kKCdwJykuaHRtbCgnTG9va3MgbGlrZSB0aGVyZSB3YXMgYW4gZXJyb3Igc2VuZGluZyB5b3VyIG1lc3NhZ2UuXFxuUGxlYXNlIGNhbGwgNzg2LTU3NC05NTExIHRvIHNwZWFrIHdpdGggYSByZXByZXNlbnRhdGl2ZSBmcm9tIEZWSS4nKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgbW9kdWxlLmV4cG9ydHMuc2hvdyA9IHNob3c7XHJcbiAgICBtb2R1bGUuZXhwb3J0cy5oaWRlID0gaGlkZTtcclxuICAgIG1vZHVsZS5leHBvcnRzLnNlbmQgPSBzZW5kO1xyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24gX2dsb2JhbHMoKSB7XHJcbiAgICBjb25zdCAkb3ZlcmxheSA9ICQoJyNvdmVybGF5Jyk7XHJcbiAgICBjb25zdCAkY2FyZHMgPSAkKCdsYWJlbC5jYXJkJyk7XHJcbiAgICBjb25zdCAkYXBwbHlQb3BVcCA9ICQoJyNhcHBseS1wb3AtdXAnKTtcclxuICAgIGNvbnN0ICRhcHBseUZvcm0gPSAkYXBwbHlQb3BVcC5maW5kKCdmb3JtJyk7XHJcbiAgICBjb25zdCAkYXBwbHlCdXR0b25zID0gJCgnI25hdi1hcHBseS1idG4sICNjdGEtYXBwbHktYnRuLCAjY29udGFjdC1ob21lLCAucmVxdWVzdC1pbmZvJyk7XHJcbiAgICBjb25zdCAkcGFnZXNDb250YWluZXIgPSAkKCcjcGFnZXMtY29udGFpbmVyJyk7XHJcbiAgICBjb25zdCAkaG9tZUJ1dHRvbiA9ICQoJyNob21lLWJ1dHRvbicpO1xyXG4gICAgY29uc3QgJG1lbnVJdGVtcyA9ICQoJyNtZW51LWl0ZW1zJyk7XHJcbiAgICBjb25zdCAkbmF2SXRlbXMgPSAkbWVudUl0ZW1zLmZpbmQoJ2EubmF2LWl0ZW0nKTtcclxuICAgIGNvbnN0ICRzZWN0aW9ucyA9ICRwYWdlc0NvbnRhaW5lci5maW5kKCdzZWN0aW9uJyk7XHJcbiAgICBjb25zdCAkYmFubmVycyA9ICRzZWN0aW9ucy5maW5kKCcuYmFubmVyJyk7XHJcbiAgICBjb25zdCAkcGx1c0J1dHRvbnMgPSAkYmFubmVycy5maW5kKCdzcGFuLnBsdXMtYnV0dG9uJyk7XHJcblxyXG4gICAgbW9kdWxlLmV4cG9ydHMubW9iaWxlTWVudVdpZHRoID0gJzk2MCc7XHJcbiAgICBtb2R1bGUuZXhwb3J0cy50b3BQYWRkaW5nID0gKHdpbmRvdy5pbm5lcldpZHRoID49ICc5NjAnKSA/IDUyIDogMDtcclxuICAgIG1vZHVsZS5leHBvcnRzLiRvdmVybGF5ID0gJG92ZXJsYXk7XHJcbiAgICBtb2R1bGUuZXhwb3J0cy4kY2FyZHMgPSAkY2FyZHM7XHJcbiAgICBtb2R1bGUuZXhwb3J0cy4kYXBwbHlQb3BVcCA9ICRhcHBseVBvcFVwO1xyXG4gICAgbW9kdWxlLmV4cG9ydHMuJGFwcGx5Rm9ybSA9ICRhcHBseUZvcm07XHJcbiAgICBtb2R1bGUuZXhwb3J0cy4kYXBwbHlCdXR0b25zID0gJGFwcGx5QnV0dG9ucztcclxuICAgIG1vZHVsZS5leHBvcnRzLiRwYWdlc0NvbnRhaW5lciA9ICRwYWdlc0NvbnRhaW5lcjtcclxuICAgIG1vZHVsZS5leHBvcnRzLiRob21lQnV0dG9uID0gJGhvbWVCdXR0b247XHJcbiAgICBtb2R1bGUuZXhwb3J0cy4kbWVudUl0ZW1zID0gJG1lbnVJdGVtcztcclxuICAgIG1vZHVsZS5leHBvcnRzLiRuYXZJdGVtcyA9ICRuYXZJdGVtcztcclxuICAgIG1vZHVsZS5leHBvcnRzLiRzZWN0aW9ucyA9ICRzZWN0aW9ucztcclxuICAgIG1vZHVsZS5leHBvcnRzLiRiYW5uZXJzID0gJGJhbm5lcnM7XHJcbiAgICBtb2R1bGUuZXhwb3J0cy4kcGx1c0J1dHRvbnMgPSAkcGx1c0J1dHRvbnM7XHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbiBfbWVudSgpIHtcclxuICAgIGNvbnN0IGcgPSByZXF1aXJlKCcuL19nbG9iYWxzJyk7XHJcblxyXG4gICAgZnVuY3Rpb24gbmF2SXRlbXNTdHlsZShuYXZJdGVtcywgYmFubmVycywgbGFuZGluZykge1xyXG4gICAgICAgIC8vIGlmIHdpbmRvdyBzY3JvbGwgcG9zaXRpb24gaXMgYmV0d2VlbiBhIGJhbm5lciwgYWRkIG5hdiBzdHlsZSB0byBjb3JyZXNwb25kaW5nIG5hdiBpdGVtXHJcbiAgICAgICAgaWYgKGxhbmRpbmcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuYm90dG9tIDwgJy0yNCcpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDAsIHkgPSBiYW5uZXJzLmxlbmd0aDsgaiA8IHk7IGorKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGJhbm5lcnNbal0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wIDw9IGcudG9wUGFkZGluZyArIDEgJiYgKGJhbm5lcnNbal0ubmV4dFNpYmxpbmcubmV4dFNpYmxpbmcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuYm90dG9tID4gZy50b3BQYWRkaW5nIHx8IGJhbm5lcnNbal0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuYm90dG9tID4gZy50b3BQYWRkaW5nKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hdkl0ZW1zW2pdLmNsYXNzTGlzdC5hZGQoJ3NlY3Rpb24taW4tdmlldycpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBuYXZJdGVtc1tqXS5jbGFzc0xpc3QucmVtb3ZlKCdzZWN0aW9uLWluLXZpZXcnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGcuJG5hdkl0ZW1zLnJlbW92ZUNsYXNzKCdzZWN0aW9uLWluLXZpZXcnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIG1vYmlsZUNsaWNrKCkge1xyXG4gICAgICAgIGNvbnN0ICRtZW51QnV0dG9uID0gJCgnI21lbnUtYnV0dG9uIHNwYW4nKTtcclxuICAgICAgICBpZiAoJG1lbnVCdXR0b24uaHRtbCgpID09PSAnTUVOVScpIHtcclxuICAgICAgICAgICAgZy4kbWVudUl0ZW1zLnNob3coNTAwLCAnZWFzZU91dFF1YWQnKTtcclxuICAgICAgICAgICAgJG1lbnVCdXR0b24uaHRtbCgnQ0xPU0UnKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBnLiRtZW51SXRlbXMuaGlkZSg1MDAsICdlYXNlT3V0UXVhZCcpO1xyXG4gICAgICAgICAgICAkbWVudUJ1dHRvbi5odG1sKCdNRU5VJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cy5uYXZJdGVtc1N0eWxlID0gbmF2SXRlbXNTdHlsZTtcclxuICAgIG1vZHVsZS5leHBvcnRzLm1vYmlsZUNsaWNrID0gbW9iaWxlQ2xpY2s7XHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbiBfcGx1c0J1dHRvbnMoKSB7XHJcbiAgICBjb25zdCBnID0gcmVxdWlyZSgnLi9fZ2xvYmFscycpO1xyXG5cclxuICAgIGZ1bmN0aW9uIG9wZW4oYnV0dG9uKSB7XHJcbiAgICAgICAgdmFyICRiYW5uZXIgPSAkKGJ1dHRvbi5wYXJlbnROb2RlKTtcclxuICAgICAgICAkKGJ1dHRvbikuYWRkQ2xhc3MoJ29wZW5lZCcpO1xyXG4gICAgICAgICRiYW5uZXIuYWRkQ2xhc3MoJ3NocmluaycpO1xyXG4gICAgICAgICRiYW5uZXIubmV4dCgpLnNsaWRlRG93big2MDAsICdlYXNlT3V0UXVhZCcpO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjbG9zZShidXR0b24pIHtcclxuICAgICAgICB2YXIgJGJ1dHRvbiA9ICQoYnV0dG9uKTtcclxuICAgICAgICB2YXIgJGJhbm5lciA9ICQoYnV0dG9uLnBhcmVudE5vZGUpO1xyXG4gICAgICAgIHZhciBkaXN0YW5jZSA9ICh3aW5kb3cuaW5uZXJXaWR0aCA+PSBnLm1vYmlsZU1lbnVXaWR0aCkgPyAkYmFubmVyLm9mZnNldCgpLnRvcCAtIGcudG9wUGFkZGluZyAtIHdpbmRvdy5zY3JvbGxZIDogJGJhbm5lci5vZmZzZXQoKS50b3AgLSB3aW5kb3cuc2Nyb2xsWTtcclxuICAgICAgICB2YXIgdGltaW5nID0gKGRpc3RhbmNlIDw9IDEgJiYgZGlzdGFuY2UgPj0gMCkgPyAwIDogNzAwO1xyXG4gICAgICAgICQoJ2h0bWwsIGJvZHknKS5zdG9wKCkuYW5pbWF0ZSh7IC8vIG5lZWQgdG8gc2VsZWN0IGJvdGggaHRtbCBhbmQgYm9keSBmb3IgRmlyZUZveFxyXG4gICAgICAgICAgICBzY3JvbGxUb3A6ICRiYW5uZXIub2Zmc2V0KCkudG9wIC0gZy50b3BQYWRkaW5nXHJcbiAgICAgICAgfSwgdGltaW5nLCAnZWFzZUluT3V0UXVhZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAkYnV0dG9uLnJlbW92ZUNsYXNzKCdvcGVuZWQnKS5jc3Moe1xyXG4gICAgICAgICAgICAgICAgJ3RvcCc6ICcwcHgnLFxyXG4gICAgICAgICAgICAgICAgJ3RyYW5zaXRpb24nOiAnYWxsIC42cydcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICRiYW5uZXIucmVtb3ZlQ2xhc3MoJ3NocmluaycpLm5leHQoKS5zbGlkZVVwKDYwMCwgJ2Vhc2VJbk91dEN1YmljJyk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZml4ZWQoKSB7XHJcbiAgICAgICAgLy8gYm90dG9tUGFkZGluZyBpcyB0aGUgYm90dG9tIG9mIHRoZSBjb250ZW50LCBwbHVzIG5hdiBoZWlnaHQgYW5kIGJ1dHRvbiB0cmFuc2xhdGVZXHJcbiAgICAgICAgbGV0IGJvdHRvbVBhZGRpbmcgPSAod2luZG93LmlubmVyV2lkdGggPj0gZy5tb2JpbGVNZW51V2lkdGgpID8gJzk2JyA6ICc0NSc7XHJcbiAgICAgICAgbGV0ICRvcGVuQnV0dG9ucyA9IGcuJHBsdXNCdXR0b25zLmZpbHRlcignLm9wZW5lZCcpO1xyXG4gICAgICAgIGZvcihsZXQgaSA9IDAsIHggPSAkb3BlbkJ1dHRvbnMubGVuZ3RoOyBpIDwgeDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBjb250ZW50UG9zaXRpb24gPSAkb3BlbkJ1dHRvbnNbaV0ucGFyZW50Tm9kZS5uZXh0U2libGluZy5uZXh0U2libGluZy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICAgICAgaWYgKGNvbnRlbnRQb3NpdGlvbi50b3AgPD0gU3RyaW5nKGcudG9wUGFkZGluZykgJiYgY29udGVudFBvc2l0aW9uLmJvdHRvbSA+PSBib3R0b21QYWRkaW5nKSB7XHJcbiAgICAgICAgICAgICAgICAkKCRvcGVuQnV0dG9uc1tpXSkuY3NzKHtcclxuICAgICAgICAgICAgICAgICAgICAndG9wJzogKC0oY29udGVudFBvc2l0aW9uLnRvcCkgKyBnLnRvcFBhZGRpbmcpICsgJ3B4JyxcclxuICAgICAgICAgICAgICAgICAgICAndHJhbnNpdGlvbic6ICcwcydcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJCgkb3BlbkJ1dHRvbnNbaV0pLmNzcyh7XHJcbiAgICAgICAgICAgICAgICAgICAgJ3RvcCc6ICcwcHgnLFxyXG4gICAgICAgICAgICAgICAgICAgICd0cmFuc2l0aW9uJzogJzBzJ1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIG1vZHVsZS5leHBvcnRzLm9wZW4gPSBvcGVuO1xyXG4gICAgbW9kdWxlLmV4cG9ydHMuY2xvc2UgPSBjbG9zZTtcclxuICAgIG1vZHVsZS5leHBvcnRzLmZpeGVkID0gZml4ZWQ7XHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbiBfcm91dGVyKCkge1xyXG4gICAgY29uc3QgZyA9IHJlcXVpcmUoJy4vX2dsb2JhbHMnKTtcclxuICAgIGNvbnN0IHBiID0gcmVxdWlyZSgnLi9fcGx1cy1idXR0b25zJyk7XHJcbiAgICBjb25zdCBtZW51ID0gcmVxdWlyZSgnLi9fbWVudScpO1xyXG4gICAgbGV0ICRkb3duQXJyb3dzID0gJCgnYS5hcnJvdy1kb3duJyk7XHJcblxyXG4gICAgY29uc3Qgcm91dGVzID0ge1xyXG4gICAgICAgIGhvbWU6IHtcclxuICAgICAgICAgICAgcGF0aDogJ2hvbWUnLFxyXG4gICAgICAgICAgICB0aXRsZTogJ0xlYXJuIHRvIENvZGUgYXQgdGhlIEZsb3JpZGEgVm9jYXRpb25hbCBJbnN0aXR1dGUgLSBFdmVuaW5nIENvZGluZyBCb290Y2FtcCcsXHJcbiAgICAgICAgICAgIGNsYXNzOiAnaG9tZSdcclxuICAgICAgICB9LFxyXG4gICAgICAgIHdlYjoge1xyXG4gICAgICAgICAgICBwYXRoOiAnd2ViLWRldmVsb3Blci1wcm9ncmFtJyxcclxuICAgICAgICAgICAgdGl0bGU6ICdXZWIgRGV2ZWxvcGVyIEV2ZW5pbmcgQm9vdGNhbXAgYnkgVGhlIEZsb3JpZGEgVm9jYXRpb25hbCBJbnN0aXR1dGUnLFxyXG4gICAgICAgICAgICBjbGFzczogJ3dlYidcclxuICAgICAgICB9LFxyXG4gICAgICAgIGN5YmVyOiB7XHJcbiAgICAgICAgICAgIHBhdGg6ICdjeWJlci1zZWN1cml0eS1hbmQtbmV0d29yay1hZG1pbmlzdHJhdG9yLXByb2dyYW0nLFxyXG4gICAgICAgICAgICB0aXRsZTogJ05ldHdvcmsgQWRtaW5pc3RyYXRvciBFdmVuaW5nIEJvb3RjYW1wIGJ5IFRoZSBGbG9yaWRhIFZvY2F0aW9uYWwgSW5zdGl0dXRlJyxcclxuICAgICAgICAgICAgY2xhc3M6ICdjeWJlcidcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGZ1bmN0aW9uIF9jcmVhdGVyUm91dGVMb2FkZXIocHVzaFN0YXRlKSB7XHJcbiAgICAgICAgZnVuY3Rpb24gbG9hZGVyKHJvdXRlKSB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LnRpdGxlID0gcm91dGUudGl0bGU7XHJcbiAgICAgICAgICAgIHVwZGF0ZUNvbnRlbnQocm91dGUuY2xhc3MpO1xyXG4gICAgICAgICAgICBpZihwdXNoU3RhdGUpIHtoaXN0b3J5LnB1c2hTdGF0ZShyb3V0ZSwgcm91dGUucGF0aCwgXCIjL1wiICsgcm91dGUucGF0aCl9XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGxvYWRlcjtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgbG9hZCA9IF9jcmVhdGVyUm91dGVMb2FkZXIoZmFsc2UpO1xyXG4gICAgbGV0IGxvYWRBbmRQdXNoU3RhdGUgPSBfY3JlYXRlclJvdXRlTG9hZGVyKHRydWUpO1xyXG5cclxuICAgIGZ1bmN0aW9uIHVwZGF0ZUNvbnRlbnQocGFnZUNsYXNzKSB7XHJcbiAgICAgICAgJCgnaHRtbCcpLmZhZGVPdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIC8vIHJlc2V0IHRvIGRlZmF1bHRzXHJcbiAgICAgICAgICAgIGcuJG5hdkl0ZW1zLnJlbW92ZUNsYXNzKCdzZWN0aW9uLWluLXZpZXcnKTtcclxuICAgICAgICAgICAgZy4kb3ZlcmxheS5oaWRlKCk7XHJcbiAgICAgICAgICAgIGcuJGFwcGx5UG9wVXAuaGlkZSgpO1xyXG4gICAgICAgICAgICBnLiRwbHVzQnV0dG9ucy5maWx0ZXIoJy5vcGVuZWQnKVxyXG4gICAgICAgICAgICAgICAgLmNzcyh7J3RvcCc6ICcwcHgnLCAndHJhbnNpdGlvbic6ICcuNnMnfSlcclxuICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnb3BlbmVkJyk7XHJcbiAgICAgICAgICAgIGcuJGJhbm5lcnMuZmlsdGVyKCcuc2hyaW5rJylcclxuICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnc2hyaW5rJylcclxuICAgICAgICAgICAgICAgIC5uZXh0KCkuaGlkZSgpO1xyXG4gICAgICAgICAgICBnLiRuYXZJdGVtcy5yZW1vdmVDbGFzcygnc2VjdGlvbi1pbi12aWV3Jyk7XHJcbiAgICAgICAgICAgICQod2luZG93KS5vZmYoJ3Njcm9sbCcsIHNjcm9sbEhhbmRsZXJCb2R5KTtcclxuICAgICAgICAgICAgd2luZG93LnNjcm9sbCgwLCAwKTtcclxuXHJcbiAgICAgICAgICAgICQoJyNyYWRpby0nICsgcGFnZUNsYXNzKVswXS5jaGVja2VkID0gdHJ1ZTtcclxuICAgICAgICAgICAgaWYocGFnZUNsYXNzID09IFwiaG9tZVwiKSB7XHJcbiAgICAgICAgICAgICAgJCgnI21lbnUsICNzZWN0aW9ucy1jb250YWluZXInKS5oaWRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgJCgnI21lbnUsICNzZWN0aW9ucy1jb250YWluZXInKS5zaG93KCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBuYXZJdGVtcyA9IGcuJG5hdkl0ZW1zLmZpbHRlcignLicgKyBwYWdlQ2xhc3MpO1xyXG4gICAgICAgICAgICB2YXIgYmFubmVycyA9IGcuJGJhbm5lcnMuZmlsdGVyKCcuJyArIHBhZ2VDbGFzcyk7XHJcbiAgICAgICAgICAgIHZhciBsYW5kaW5nID0gJCgnI3BhZ2VfJyArIHBhZ2VDbGFzcylbMF07XHJcblxyXG4gICAgICAgICAgICAvLyBvbiBzY3JvbGwsIGZpeCBwbHVzLWJ1dHRvbnMgdG8gc2NyZWVuIGFuZCBhZGQgbmF2IHN0eWxlc1xyXG4gICAgICAgICAgICB2YXIgc2Nyb2xsSGFuZGxlckJvZHkgPSAod2luZG93LmlubmVyV2lkdGggPj0gZy5tb2JpbGVNZW51V2lkdGgpID8gX3Njcm9sbEhhbmRsZXJEZXNrdG9wIDogX3Njcm9sbEhhbmRsZXJNb2JpbGU7XHJcbiAgICAgICAgICAgICQod2luZG93KS5vbignc2Nyb2xsJywgZnVuY3Rpb24gc2Nyb2xsSGFuZGxlcigpIHtcclxuICAgICAgICAgICAgICAgIHNjcm9sbEhhbmRsZXJCb2R5KCRkb3duQXJyb3dzLCBuYXZJdGVtcywgYmFubmVycywgbGFuZGluZyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgJCgnaHRtbCcpLmZhZGVJbigpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBfc2Nyb2xsSGFuZGxlckRlc2t0b3AoJGFycm93cywgaXRlbXMsIHNlY3Rpb25CYW5uZXJzLCBsYW5kaW5nUGFnZSkge1xyXG4gICAgICAgIHBiLmZpeGVkKCk7XHJcbiAgICAgICAgaWYod2luZG93LnNjcm9sbFkgPiAnMjAnKSB7XHJcbiAgICAgICAgICAkYXJyb3dzLmZhZGVPdXQoNDAwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAkYXJyb3dzLnNsaWRlRG93big0MDApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBtZW51Lm5hdkl0ZW1zU3R5bGUoaXRlbXMsIHNlY3Rpb25CYW5uZXJzLCBsYW5kaW5nUGFnZSk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIF9zY3JvbGxIYW5kbGVyTW9iaWxlKCRhcnJvd3MpIHtcclxuICAgICAgICBwYi5maXhlZCgpO1xyXG4gICAgICAgIGlmKHdpbmRvdy5zY3JvbGxZID4gJzIwJykge1xyXG4gICAgICAgICAgJGFycm93cy5mYWRlT3V0KDQwMCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgJGFycm93cy5zbGlkZURvd24oNDAwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIG1vZHVsZS5leHBvcnRzLnJvdXRlcyA9IHJvdXRlcztcclxuICAgIG1vZHVsZS5leHBvcnRzLmxvYWQgPSBsb2FkO1xyXG4gICAgbW9kdWxlLmV4cG9ydHMubG9hZEFuZFB1c2hTdGF0ZSA9IGxvYWRBbmRQdXNoU3RhdGU7XHJcbiAgICBtb2R1bGUuZXhwb3J0cy51cGRhdGVDb250ZW50ID0gdXBkYXRlQ29udGVudDtcclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uIF9zbW9vdGhTY3JvbGwoKSB7XHJcbiAgICAvLyBUaGlzIHdpbGwgc2VsZWN0IGV2ZXJ5dGhpbmcgd2l0aCB0aGUgY2xhc3Mgc21vb3RoU2Nyb2xsXHJcbiAgICAvLyBUaGlzIHNob3VsZCBwcmV2ZW50IHByb2JsZW1zIHdpdGggY2Fyb3VzZWwsIHNjcm9sbHNweSwgZXRjLi4uXHJcbiAgICBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgICAgIC8vIG1lbnUgaXRlbXNcclxuICAgICAgICAkKCcuc21vb3RoU2Nyb2xsJykuY2xpY2soX3Ntb290aFNjcm9sbEZ1bmMpO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBfc21vb3RoU2Nyb2xsRnVuYygpIHtcclxuICAgICAgICBpZiAobG9jYXRpb24ucGF0aG5hbWUucmVwbGFjZSgvXlxcLy8sICcnKSA9PSB0aGlzLnBhdGhuYW1lLnJlcGxhY2UoL15cXC8vLCAnJykgJiYgbG9jYXRpb24uaG9zdG5hbWUgPT0gdGhpcy5ob3N0bmFtZSkge1xyXG4gICAgICAgICAgICB2YXIgdGFyZ2V0ID0gJCh0aGlzLmhhc2gpO1xyXG4gICAgICAgICAgICB0YXJnZXQgPSB0YXJnZXQubGVuZ3RoID8gdGFyZ2V0IDogJCgnW25hbWU9JyArIHRoaXMuaGFzaC5zbGljZSgxKSArICddJyk7XHJcbiAgICAgICAgICAgIGlmICh0YXJnZXQubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAvLyB0b3BQYWRkaW5nIGlzIHRoZSBoZWlnaHQgb2YgdGhlIG5hdiwgc28gaXQgc2Nyb2xscyBwYXN0IHRoZSBuYXZcclxuICAgICAgICAgICAgICAgIHZhciB0b3BQYWRkaW5nID0gKCQodGFyZ2V0WzBdKS5oYXNDbGFzcygnYmFubmVyJykpID8gKCh3aW5kb3cuaW5uZXJXaWR0aCA+PSAnOTYwJykgPyAtNTIgOiAwKSA6IDA7XHJcbiAgICAgICAgICAgICAgICB2YXIgZGlzdGFuY2UgPSAkKHRhcmdldFswXSkub2Zmc2V0KCkudG9wICsgdG9wUGFkZGluZyAtIHdpbmRvdy5zY3JvbGxZO1xyXG4gICAgICAgICAgICAgICAgdmFyIHRpbWluZyA9IChkaXN0YW5jZSA8IDEgJiYgZGlzdGFuY2UgPj0gMCkgPyAwIDogNzAwO1xyXG4gICAgICAgICAgICAgICAgJCgnYm9keSwgaHRtbCcpLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogdGFyZ2V0Lm9mZnNldCgpLnRvcCArIHRvcFBhZGRpbmdcclxuICAgICAgICAgICAgICAgIH0sIHRpbWluZywgJ2Vhc2VJbk91dFF1aW50JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCQodGFyZ2V0WzBdKS5oYXMoJ3NwYW4ucGx1cy1idXR0b24nKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbm9kZXMgPSB0YXJnZXRbMF0uY2hpbGROb2RlcztcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIHggPSBub2Rlcy5sZW5ndGg7IGkgPCB4OyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChub2Rlc1tpXS5jbGFzc0xpc3QgPT0gJ3BsdXMtYnV0dG9uJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQobm9kZXNbaV0pLmNsaWNrKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIG1vZHVsZS5leHBvcnRzLmluaXQgPSBpbml0O1xyXG59KSgpO1xyXG4iLCIndXNlIHN0cmljdCc7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG5cdHZhbHVlOiB0cnVlXG59KTtcbmZ1bmN0aW9uIGdldFNjcm9sbFRvcCgpIHtcblx0cmV0dXJuIHdpbmRvdy5wYWdlWU9mZnNldCB8fCBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcDtcbn1cblxuZnVuY3Rpb24gZ2V0U2Nyb2xsTGVmdCgpIHtcblx0cmV0dXJuIHdpbmRvdy5wYWdlWE9mZnNldCB8fCBkb2N1bWVudC5ib2R5LnNjcm9sbExlZnQ7XG59XG5leHBvcnRzWydkZWZhdWx0J10gPSBnZXRTY3JvbGxUb3A7XG5leHBvcnRzLmdldFNjcm9sbExlZnQgPSBnZXRTY3JvbGxMZWZ0O1xuZXhwb3J0cy5nZXRTY3JvbGxUb3AgPSBnZXRTY3JvbGxUb3A7XG5leHBvcnRzLmxlZnQgPSBnZXRTY3JvbGxMZWZ0O1xuZXhwb3J0cy50b3AgPSBnZXRTY3JvbGxUb3A7XG5cbiIsIm1vZHVsZS5leHBvcnRzID0gb247XG5tb2R1bGUuZXhwb3J0cy5vbiA9IG9uO1xubW9kdWxlLmV4cG9ydHMub2ZmID0gb2ZmO1xuXG5mdW5jdGlvbiBvbiAoZWxlbWVudCwgdHlwZSwgbGlzdGVuZXIsIHVzZUNhcHR1cmUpIHtcbiAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGxpc3RlbmVyLCB1c2VDYXB0dXJlKTtcbiAgcmV0dXJuIGxpc3RlbmVyO1xufVxuXG5mdW5jdGlvbiBvZmYgKGVsZW1lbnQsIHR5cGUsIGxpc3RlbmVyLCB1c2VDYXB0dXJlKSB7XG4gIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lciwgdXNlQ2FwdHVyZSk7XG4gIHJldHVybiBsaXN0ZW5lcjtcbn1cbiIsIi8qISBucG0uaW0vb25lLWV2ZW50ICovXG4ndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIG9uY2UodGFyZ2V0LCB0eXBlLCBsaXN0ZW5lciwgdXNlQ2FwdHVyZSkge1xuXHR0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lciwgdXNlQ2FwdHVyZSk7XG5cdHRhcmdldC5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGZ1bmN0aW9uIHNlbGZSZW1vdmluZygpIHtcblx0XHR0YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lciwgdXNlQ2FwdHVyZSk7XG5cdFx0dGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZSwgc2VsZlJlbW92aW5nLCB1c2VDYXB0dXJlKTtcblx0fSwgdXNlQ2FwdHVyZSk7XG59XG5cbm9uY2UucHJvbWlzZSA9IGZ1bmN0aW9uICh0YXJnZXQsIHR5cGUsIHVzZUNhcHR1cmUpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJldHVybiBvbmNlKHRhcmdldCwgdHlwZSwgcmVzb2x2ZSwgdXNlQ2FwdHVyZSk7IH0pOyB9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG9uY2U7IiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBfaW50ZXJvcERlZmF1bHQgKGV4KSB7IHJldHVybiAoZXggJiYgKHR5cGVvZiBleCA9PT0gJ29iamVjdCcpICYmICdkZWZhdWx0JyBpbiBleCkgPyBleFsnZGVmYXVsdCddIDogZXg7IH1cblxudmFyIGdldFNjcm9sbCA9IHJlcXVpcmUoJ2dldC1zY3JvbGwnKTtcbnZhciBvbk9mZiA9IHJlcXVpcmUoJ29uLW9mZicpO1xudmFyIG9uY2UgPSBfaW50ZXJvcERlZmF1bHQocmVxdWlyZSgnb25lLWV2ZW50JykpO1xuXG5leHBvcnRzLmlzUHJldmVudGVkID0gZmFsc2U7XG5cbi8qKlxuICogU2Nyb2xsIGZ1bmN0aW9uc1xuICovXG52YXIgbGFzdFNjcm9sbFBvc2l0aW9uID0gdm9pZCAwO1xuZnVuY3Rpb24gcmVzZXRTY3JvbGwoKSB7XG5cdHdpbmRvdy5zY3JvbGxUby5hcHBseSh3aW5kb3csIGxhc3RTY3JvbGxQb3NpdGlvbik7XG59XG5mdW5jdGlvbiB3YWl0Rm9yU2Nyb2xsKCkge1xuXHRsYXN0U2Nyb2xsUG9zaXRpb24gPSBbZ2V0U2Nyb2xsLmdldFNjcm9sbExlZnQoKSwgZ2V0U2Nyb2xsLmdldFNjcm9sbFRvcCgpXTtcblx0b25jZSh3aW5kb3csICdzY3JvbGwnLCByZXNldFNjcm9sbCk7XG59XG5cbi8qKlxuICogVG9nZ2xlIGZ1bmN0aW9uc1xuICovXG5mdW5jdGlvbiBldmVudChhY3Rpb24pIHtcblx0Ly8gcnVuIFwicmVtb3ZlXCIgb25seSBpZiBpdCdzIHByZXZlbnRlZFxuXHQvLyBvdGhlcndpc2UgcnVuIFwiYXR0YWNoXCIgb3IgXCJvbmNlXCIgb25seSBpZiBpdCdzIG5vdCBhbHJlYWR5IHByZXZlbnRlZFxuXHRpZiAoYWN0aW9uID09PSBvbk9mZi5vZmYgPT09IGV4cG9ydHMuaXNQcmV2ZW50ZWQpIHtcblx0XHRhY3Rpb24od2luZG93LCAncG9wc3RhdGUnLCB3YWl0Rm9yU2Nyb2xsKTtcblx0fVxufVxuZnVuY3Rpb24gYWxsb3coKSB7XG5cdGV2ZW50KG9uT2ZmLm9mZik7XG5cdGV4cG9ydHMuaXNQcmV2ZW50ZWQgPSBmYWxzZTtcbn1cbmZ1bmN0aW9uIHByZXZlbnQoKSB7XG5cdGV2ZW50KG9uT2ZmLm9uKTtcblx0ZXhwb3J0cy5pc1ByZXZlbnRlZCA9IHRydWU7XG59XG5mdW5jdGlvbiBwcmV2ZW50T25jZSgpIHtcblx0ZXZlbnQob25jZSk7XG59XG5cbnZhciBpbmRleCA9IChmdW5jdGlvbiAodG9nZ2xlKSB7XG5cdCh0b2dnbGUgPyBwcmV2ZW50IDogYWxsb3cpKCk7XG59KTtcblxuZXhwb3J0cy5hbGxvdyA9IGFsbG93O1xuZXhwb3J0cy5wcmV2ZW50ID0gcHJldmVudDtcbmV4cG9ydHMucHJldmVudE9uY2UgPSBwcmV2ZW50T25jZTtcbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IGluZGV4OyJdfQ==
