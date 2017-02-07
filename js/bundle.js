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
        webdev: {
            path: 'web-developer-program',
            title: 'Web Developer Evening Bootcamp by The Florida Vocational Institute',
            class: 'webdev'
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tYWluLmpzIiwianMvcGFydGlhbHMvX2Zvcm0uanMiLCJqcy9wYXJ0aWFscy9fZ2xvYmFscy5qcyIsImpzL3BhcnRpYWxzL19tZW51LmpzIiwianMvcGFydGlhbHMvX3BsdXMtYnV0dG9ucy5qcyIsImpzL3BhcnRpYWxzL19yb3V0ZXIuanMiLCJqcy9wYXJ0aWFscy9fc21vb3RoU2Nyb2xsLmpzIiwibm9kZV9tb2R1bGVzL2dldC1zY3JvbGwvZGlzdC9nZXQtc2Nyb2xsLm5vZGUuanMiLCJub2RlX21vZHVsZXMvb24tb2ZmL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL29uZS1ldmVudC9kaXN0L29uZS1ldmVudC5jb21tb24tanMuanMiLCJub2RlX21vZHVsZXMvcHJldmVudC1wb3BzdGF0ZS1zY3JvbGwvZGlzdC9wcmV2ZW50LXBvcHN0YXRlLXNjcm9sbC5jb21tb24tanMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FDLFVBQVMsSUFBVCxDQUFjLFlBQWQsRUFBNEI7QUFDekI7O0FBQ0EsaUJBQWEsT0FBTyxNQUFwQixFQUE0QixNQUE1QixFQUFvQyxRQUFwQztBQUVILENBSkEsRUFJQyxTQUFTLFlBQVQsQ0FBc0IsQ0FBdEIsRUFBeUIsTUFBekIsRUFBaUMsUUFBakMsRUFBMkM7QUFDekM7O0FBRUEsUUFBTSxJQUFJLFFBQVEscUJBQVIsQ0FBVjtBQUNBLFFBQU0sU0FBUyxRQUFRLG9CQUFSLENBQWY7QUFDQSxRQUFNLEtBQUssUUFBUSwwQkFBUixDQUFYO0FBQ0EsUUFBTSxPQUFPLFFBQVEsa0JBQVIsQ0FBYjtBQUNBLFFBQU0sT0FBTyxRQUFRLGtCQUFSLENBQWI7QUFDQSxRQUFNLGVBQWUsUUFBUSwwQkFBUixDQUFyQjtBQUNBLFFBQU0sd0JBQXdCLFFBQVEseUJBQVIsQ0FBOUI7O0FBRUEsUUFBSSxRQUFRO0FBQ1IsaUJBQVMsbUJBQVc7QUFDaEI7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dXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIihmdW5jdGlvbiBtYWluKG1haW5GdW5jdGlvbikge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIG1haW5GdW5jdGlvbih3aW5kb3cualF1ZXJ5LCB3aW5kb3csIGRvY3VtZW50KTtcblxufShmdW5jdGlvbiBtYWluRnVuY3Rpb24oJCwgd2luZG93LCBkb2N1bWVudCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgY29uc3QgZyA9IHJlcXVpcmUoJy4vcGFydGlhbHMvX2dsb2JhbHMnKTtcbiAgICBjb25zdCByb3V0ZXIgPSByZXF1aXJlKCcuL3BhcnRpYWxzL19yb3V0ZXInKTtcbiAgICBjb25zdCBwYiA9IHJlcXVpcmUoJy4vcGFydGlhbHMvX3BsdXMtYnV0dG9ucycpO1xuICAgIGNvbnN0IG1lbnUgPSByZXF1aXJlKCcuL3BhcnRpYWxzL19tZW51Jyk7XG4gICAgY29uc3QgZm9ybSA9IHJlcXVpcmUoJy4vcGFydGlhbHMvX2Zvcm0nKTtcbiAgICBjb25zdCBzbW9vdGhTY3JvbGwgPSByZXF1aXJlKCcuL3BhcnRpYWxzL19zbW9vdGhTY3JvbGwnKTtcbiAgICBjb25zdCBwcmV2ZW50UG9wc3RhdGVTY3JvbGwgPSByZXF1aXJlKCdwcmV2ZW50LXBvcHN0YXRlLXNjcm9sbCcpO1xuXG4gICAgdmFyIHNldHVwID0ge1xuICAgICAgICBvblJlYWR5OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vIExvYWQgaW5pdGlhbCBVUkxcbiAgICAgICAgICAgIHNldHVwLnVybFJvdXRlcigpO1xuICAgICAgICAgICAgLy8gSW5pdGlhbGl6ZSBmdW5jdGlvbmFsaXR5IHRvIGNoYW5nZSBwYWdlIGNvbnRlbnQgYW5kIFVSTFxuICAgICAgICAgICAgLy8gd2hlbiB1c2VyIGNsaWNrIG9uIGNlcnRhaW4gZWxlbWVudHNcbiAgICAgICAgICAgIHNldHVwLmNsaWNrUm91dGVyKCk7XG4gICAgICAgICAgICAvLyBJbml0aWFsaXplIGZ1bmN0aW9uYWxpdHkgdG8gc2Nyb2xsIHNtb290aGx5IHRvIGRpZmZlcmVudFxuICAgICAgICAgICAgLy8gbG9jYXRpb24gb24gdGhlIHNhbWUgcGFnZSB3aGVuIGxvY2FsIGxpbmsgaXMgY2xpY2tlZFxuICAgICAgICAgICAgc21vb3RoU2Nyb2xsLmluaXQoKTtcbiAgICAgICAgICAgIC8vIENoYW5nZSBwYWdlIGNvbnRlbnQgYW5kIFVSTCB3aGVuIGNsaWNrIGJyb3dzZXIncyBmb3J3YXJkIG9yIGJhY2sgYnV0dG9uc1xuICAgICAgICAgICAgJCh3aW5kb3cpLm9uKCdwb3BzdGF0ZScsIHNldHVwLnVybFJvdXRlcik7XG4gICAgICAgICAgICAvLyBwcmV2ZW50IGJyb3dzZXIgZnJvbSBzY3JvbGxpbmcgdG8gdG9wIHdoZW4gb25wb3BzdGF0ZSBldmVudCBlbWl0c1xuICAgICAgICAgICAgcHJldmVudFBvcHN0YXRlU2Nyb2xsLnByZXZlbnQoKTtcbiAgICAgICAgICAgIC8vIENvbnRhY3QgZm9ybSBmdW5jdGlvbmFsaXR5XG4gICAgICAgICAgICBnLiRhcHBseUJ1dHRvbnMub24oJ2NsaWNrJywgZSA9PiB7ZS5wcmV2ZW50RGVmYXVsdCgpOyBmb3JtLnNob3coKTsgcmV0dXJuIGZhbHNlO30pO1xuICAgICAgICAgICAgJCgnI2FwcGx5LWNsb3NlLCAjb3ZlcmxheScpLm9uKCdjbGljaycsIGZvcm0uaGlkZSk7XG4gICAgICAgICAgICAkKCcjc3VibWl0LWFwcGx5Jykub24oJ2NsaWNrJywgZSA9PiB7ZS5wcmV2ZW50RGVmYXVsdCgpOyBmb3JtLnNlbmQoKTsgcmV0dXJuIGZhbHNlO30pO1xuICAgICAgICAgICAgLy8gU2V0dXAgcGx1cyBidXR0b25zIGZ1bmN0aW9uYWxpdHlcbiAgICAgICAgICAgIGcuJHBsdXNCdXR0b25zLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICgkKHRoaXMpLmhhc0NsYXNzKCdvcGVuZWQnKSkgPyBwYi5jbG9zZSh0aGlzKTogcGIub3Blbih0aGlzKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vIFNldHVwIG1vYmlsZSBtZW51XG4gICAgICAgICAgICBpZiAod2luZG93LmlubmVyV2lkdGggPCBnLm1vYmlsZU1lbnVXaWR0aCkge1xuICAgICAgICAgICAgICAgICQoJyNtZW51LWJ1dHRvbiwgI21lbnUtaXRlbXMgYScpLmNsaWNrKG1lbnUubW9iaWxlQ2xpY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9LFxuICAgICAgICB1cmxSb3V0ZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKGxvY2F0aW9uLmhhc2ggPT09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC50aXRsZSA9IHJvdXRlci5yb3V0ZXMuaG9tZS50aXRsZTtcbiAgICAgICAgICAgICAgICByb3V0ZXIubG9hZChyb3V0ZXIucm91dGVzLmhvbWUpO1xuICAgICAgICAgICAgICAgIGhpc3RvcnkucmVwbGFjZVN0YXRlKHJvdXRlci5yb3V0ZXMuaG9tZSwgcm91dGVyLnJvdXRlcy5ob21lLnBhdGgsIFwiIy9cIiArIHJvdXRlci5yb3V0ZXMuaG9tZS5wYXRoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGZvcihsZXQgcm91dGUgaW4gcm91dGVyLnJvdXRlcykge1xuICAgICAgICAgICAgICAgICAgICBpZihsb2NhdGlvbi5oYXNoLnNsaWNlKDIpID09IHJvdXRlci5yb3V0ZXNbcm91dGVdLnBhdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvdXRlci5sb2FkKHJvdXRlci5yb3V0ZXNbcm91dGVdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgY2xpY2tSb3V0ZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZm9yKGxldCByb3V0ZSBpbiByb3V0ZXIucm91dGVzKSB7XG4gICAgICAgICAgICAgICAgaWYocm91dGVyLnJvdXRlcy5oYXNPd25Qcm9wZXJ0eShyb3V0ZSkpIHtcbiAgICAgICAgICAgICAgICAgIGcuJGNhcmRzLmZpbHRlcihcIi5cIiArIHJvdXRlci5yb3V0ZXNbcm91dGVdWydjbGFzcyddKS5jbGljayhmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICAgIHJvdXRlci5sb2FkQW5kUHVzaFN0YXRlKHJvdXRlci5yb3V0ZXNbcm91dGVdKTtcbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBnLiRob21lQnV0dG9uLm9uKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHJvdXRlci5sb2FkQW5kUHVzaFN0YXRlKHJvdXRlci5yb3V0ZXMuaG9tZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgJChkb2N1bWVudCkucmVhZHkoc2V0dXAub25SZWFkeSk7XG5cbiAgICByZXR1cm4gZmFsc2U7XG59KSk7XG4iLCIoZnVuY3Rpb24gX2Zvcm0oKSB7XG4gICAgY29uc3QgZyA9IHJlcXVpcmUoJy4vX2dsb2JhbHMnKTtcbiAgICBsZXQgJG1lc3NhZ2UgPSAkKCcjc2VudC1tZXNzYWdlJyk7XG5cbiAgICBmdW5jdGlvbiBzaG93KCkge1xuICAgICAgICBnLiRvdmVybGF5LmZhZGVJbigpO1xuICAgICAgICBnLiRhcHBseVBvcFVwLmZhZGVJbigpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaGlkZSgpIHtcbiAgICAgICAgZy4kb3ZlcmxheS5mYWRlT3V0KCk7XG4gICAgICAgIGcuJGFwcGx5UG9wVXAuZmFkZU91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICBnLiRhcHBseUZvcm0uc2hvdygpO1xuICAgICAgICAgICRtZXNzYWdlLmhpZGUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZW5kKCkge1xuXG4gICAgICAgIGZ1bmN0aW9uIHNlbmRGb3JtKCkge1xuICAgICAgICAgICAgcmV0dXJuICQuYWpheCh7XG4gICAgICAgICAgICAgICAgdXJsOiAnaHR0cDovL2Z2aS1ncmFkLmNvbTo0MDA0L2Zha2Vmb3JtJyxcbiAgICAgICAgICAgICAgICB0eXBlOiAncG9zdCcsXG4gICAgICAgICAgICAgICAgZGF0YTogZy4kYXBwbHlGb3JtLnNlcmlhbGl6ZSgpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNlbmRGb3JtKCkuZG9uZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGcuJGFwcGx5Rm9ybS5mYWRlT3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICRtZXNzYWdlLmZhZGVJbigpO1xuICAgICAgICAgICAgICAgIGcuJGFwcGx5Rm9ybVswXS5yZXNldCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pLmZhaWwoZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgICAgICRtZXNzYWdlLmZhZGVJbigpO1xuICAgICAgICAgICAgJG1lc3NhZ2UuZmluZCgnaDMnKS5odG1sKCdVaCBPaCEnKTtcbiAgICAgICAgICAgICRtZXNzYWdlLmZpbmQoJ3AnKS5odG1sKCdMb29rcyBsaWtlIHRoZXJlIHdhcyBhbiBlcnJvciBzZW5kaW5nIHlvdXIgbWVzc2FnZS5cXG5QbGVhc2UgY2FsbCA3ODYtNTc0LTk1MTEgdG8gc3BlYWsgd2l0aCBhIHJlcHJlc2VudGF0aXZlIGZyb20gRlZJLicpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIG1vZHVsZS5leHBvcnRzLnNob3cgPSBzaG93O1xuICAgIG1vZHVsZS5leHBvcnRzLmhpZGUgPSBoaWRlO1xuICAgIG1vZHVsZS5leHBvcnRzLnNlbmQgPSBzZW5kO1xufSkoKTtcbiIsIihmdW5jdGlvbiBfZ2xvYmFscygpIHtcbiAgICBjb25zdCAkb3ZlcmxheSA9ICQoJyNvdmVybGF5Jyk7XG4gICAgY29uc3QgJGNhcmRzID0gJCgnbGFiZWwuY2FyZCcpO1xuICAgIGNvbnN0ICRhcHBseVBvcFVwID0gJCgnI2FwcGx5LXBvcC11cCcpO1xuICAgIGNvbnN0ICRhcHBseUZvcm0gPSAkYXBwbHlQb3BVcC5maW5kKCdmb3JtJyk7XG4gICAgY29uc3QgJGFwcGx5QnV0dG9ucyA9ICQoJyNuYXYtYXBwbHktYnRuLCAjY3RhLWFwcGx5LWJ0biwgI2NvbnRhY3QtaG9tZSwgLnJlcXVlc3QtaW5mbycpO1xuICAgIGNvbnN0ICRwYWdlc0NvbnRhaW5lciA9ICQoJyNwYWdlcy1jb250YWluZXInKTtcbiAgICBjb25zdCAkaG9tZUJ1dHRvbiA9ICQoJyNob21lLWJ1dHRvbicpO1xuICAgIGNvbnN0ICRtZW51SXRlbXMgPSAkKCcjbWVudS1pdGVtcycpO1xuICAgIGNvbnN0ICRuYXZJdGVtcyA9ICRtZW51SXRlbXMuZmluZCgnYS5uYXYtaXRlbScpO1xuICAgIGNvbnN0ICRzZWN0aW9ucyA9ICRwYWdlc0NvbnRhaW5lci5maW5kKCdzZWN0aW9uJyk7XG4gICAgY29uc3QgJGJhbm5lcnMgPSAkc2VjdGlvbnMuZmluZCgnLmJhbm5lcicpO1xuICAgIGNvbnN0ICRwbHVzQnV0dG9ucyA9ICRiYW5uZXJzLmZpbmQoJ3NwYW4ucGx1cy1idXR0b24nKTtcblxuICAgIG1vZHVsZS5leHBvcnRzLm1vYmlsZU1lbnVXaWR0aCA9ICc5NjAnO1xuICAgIG1vZHVsZS5leHBvcnRzLnRvcFBhZGRpbmcgPSAod2luZG93LmlubmVyV2lkdGggPj0gJzk2MCcpID8gNTIgOiAwO1xuICAgIG1vZHVsZS5leHBvcnRzLiRvdmVybGF5ID0gJG92ZXJsYXk7XG4gICAgbW9kdWxlLmV4cG9ydHMuJGNhcmRzID0gJGNhcmRzO1xuICAgIG1vZHVsZS5leHBvcnRzLiRhcHBseVBvcFVwID0gJGFwcGx5UG9wVXA7XG4gICAgbW9kdWxlLmV4cG9ydHMuJGFwcGx5Rm9ybSA9ICRhcHBseUZvcm07XG4gICAgbW9kdWxlLmV4cG9ydHMuJGFwcGx5QnV0dG9ucyA9ICRhcHBseUJ1dHRvbnM7XG4gICAgbW9kdWxlLmV4cG9ydHMuJHBhZ2VzQ29udGFpbmVyID0gJHBhZ2VzQ29udGFpbmVyO1xuICAgIG1vZHVsZS5leHBvcnRzLiRob21lQnV0dG9uID0gJGhvbWVCdXR0b247XG4gICAgbW9kdWxlLmV4cG9ydHMuJG1lbnVJdGVtcyA9ICRtZW51SXRlbXM7XG4gICAgbW9kdWxlLmV4cG9ydHMuJG5hdkl0ZW1zID0gJG5hdkl0ZW1zO1xuICAgIG1vZHVsZS5leHBvcnRzLiRzZWN0aW9ucyA9ICRzZWN0aW9ucztcbiAgICBtb2R1bGUuZXhwb3J0cy4kYmFubmVycyA9ICRiYW5uZXJzO1xuICAgIG1vZHVsZS5leHBvcnRzLiRwbHVzQnV0dG9ucyA9ICRwbHVzQnV0dG9ucztcbn0pKCk7XG4iLCIoZnVuY3Rpb24gX21lbnUoKSB7XG4gICAgY29uc3QgZyA9IHJlcXVpcmUoJy4vX2dsb2JhbHMnKTtcblxuICAgIGZ1bmN0aW9uIG5hdkl0ZW1zU3R5bGUobmF2SXRlbXMsIGJhbm5lcnMsIGxhbmRpbmcpIHtcbiAgICAgICAgLy8gaWYgd2luZG93IHNjcm9sbCBwb3NpdGlvbiBpcyBiZXR3ZWVuIGEgYmFubmVyLCBhZGQgbmF2IHN0eWxlIHRvIGNvcnJlc3BvbmRpbmcgbmF2IGl0ZW1cbiAgICAgICAgaWYgKGxhbmRpbmcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuYm90dG9tIDwgJy0yNCcpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwLCB5ID0gYmFubmVycy5sZW5ndGg7IGogPCB5OyBqKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoYmFubmVyc1tqXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgPD0gZy50b3BQYWRkaW5nICsgMSAmJiAoYmFubmVyc1tqXS5uZXh0U2libGluZy5uZXh0U2libGluZy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5ib3R0b20gPiBnLnRvcFBhZGRpbmcgfHwgYmFubmVyc1tqXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5ib3R0b20gPiBnLnRvcFBhZGRpbmcpKSB7XG4gICAgICAgICAgICAgICAgICAgIG5hdkl0ZW1zW2pdLmNsYXNzTGlzdC5hZGQoJ3NlY3Rpb24taW4tdmlldycpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG5hdkl0ZW1zW2pdLmNsYXNzTGlzdC5yZW1vdmUoJ3NlY3Rpb24taW4tdmlldycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGcuJG5hdkl0ZW1zLnJlbW92ZUNsYXNzKCdzZWN0aW9uLWluLXZpZXcnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbW9iaWxlQ2xpY2soKSB7XG4gICAgICAgIGNvbnN0ICRtZW51QnV0dG9uID0gJCgnI21lbnUtYnV0dG9uIHNwYW4nKTtcbiAgICAgICAgaWYgKCRtZW51QnV0dG9uLmh0bWwoKSA9PT0gJ01FTlUnKSB7XG4gICAgICAgICAgICBnLiRtZW51SXRlbXMuc2hvdyg1MDAsICdlYXNlT3V0UXVhZCcpO1xuICAgICAgICAgICAgJG1lbnVCdXR0b24uaHRtbCgnQ0xPU0UnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGcuJG1lbnVJdGVtcy5oaWRlKDUwMCwgJ2Vhc2VPdXRRdWFkJyk7XG4gICAgICAgICAgICAkbWVudUJ1dHRvbi5odG1sKCdNRU5VJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIG1vZHVsZS5leHBvcnRzLm5hdkl0ZW1zU3R5bGUgPSBuYXZJdGVtc1N0eWxlO1xuICAgIG1vZHVsZS5leHBvcnRzLm1vYmlsZUNsaWNrID0gbW9iaWxlQ2xpY2s7XG59KSgpO1xuIiwiKGZ1bmN0aW9uIF9wbHVzQnV0dG9ucygpIHtcbiAgICBjb25zdCBnID0gcmVxdWlyZSgnLi9fZ2xvYmFscycpO1xuXG4gICAgZnVuY3Rpb24gb3BlbihidXR0b24pIHtcbiAgICAgICAgdmFyICRiYW5uZXIgPSAkKGJ1dHRvbi5wYXJlbnROb2RlKTtcbiAgICAgICAgJChidXR0b24pLmFkZENsYXNzKCdvcGVuZWQnKTtcbiAgICAgICAgJGJhbm5lci5hZGRDbGFzcygnc2hyaW5rJyk7XG4gICAgICAgICRiYW5uZXIubmV4dCgpLnNsaWRlRG93big2MDAsICdlYXNlT3V0UXVhZCcpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xvc2UoYnV0dG9uKSB7XG4gICAgICAgIHZhciAkYnV0dG9uID0gJChidXR0b24pO1xuICAgICAgICB2YXIgJGJhbm5lciA9ICQoYnV0dG9uLnBhcmVudE5vZGUpO1xuICAgICAgICB2YXIgZGlzdGFuY2UgPSAod2luZG93LmlubmVyV2lkdGggPj0gZy5tb2JpbGVNZW51V2lkdGgpID8gJGJhbm5lci5vZmZzZXQoKS50b3AgLSBnLnRvcFBhZGRpbmcgLSB3aW5kb3cuc2Nyb2xsWSA6ICRiYW5uZXIub2Zmc2V0KCkudG9wIC0gd2luZG93LnNjcm9sbFk7XG4gICAgICAgIHZhciB0aW1pbmcgPSAoZGlzdGFuY2UgPD0gMSAmJiBkaXN0YW5jZSA+PSAwKSA/IDAgOiA3MDA7XG4gICAgICAgICQoJ2h0bWwsIGJvZHknKS5zdG9wKCkuYW5pbWF0ZSh7IC8vIG5lZWQgdG8gc2VsZWN0IGJvdGggaHRtbCBhbmQgYm9keSBmb3IgRmlyZUZveFxuICAgICAgICAgICAgc2Nyb2xsVG9wOiAkYmFubmVyLm9mZnNldCgpLnRvcCAtIGcudG9wUGFkZGluZ1xuICAgICAgICB9LCB0aW1pbmcsICdlYXNlSW5PdXRRdWFkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkYnV0dG9uLnJlbW92ZUNsYXNzKCdvcGVuZWQnKS5jc3Moe1xuICAgICAgICAgICAgICAgICd0b3AnOiAnMHB4JyxcbiAgICAgICAgICAgICAgICAndHJhbnNpdGlvbic6ICdhbGwgLjZzJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkYmFubmVyLnJlbW92ZUNsYXNzKCdzaHJpbmsnKS5uZXh0KCkuc2xpZGVVcCg2MDAsICdlYXNlSW5PdXRDdWJpYycpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZpeGVkKCkge1xuICAgICAgICAvLyBib3R0b21QYWRkaW5nIGlzIHRoZSBib3R0b20gb2YgdGhlIGNvbnRlbnQsIHBsdXMgbmF2IGhlaWdodCBhbmQgYnV0dG9uIHRyYW5zbGF0ZVlcbiAgICAgICAgbGV0IGJvdHRvbVBhZGRpbmcgPSAod2luZG93LmlubmVyV2lkdGggPj0gZy5tb2JpbGVNZW51V2lkdGgpID8gJzk2JyA6ICc0NSc7XG4gICAgICAgIGxldCAkb3BlbkJ1dHRvbnMgPSBnLiRwbHVzQnV0dG9ucy5maWx0ZXIoJy5vcGVuZWQnKTtcbiAgICAgICAgZm9yKGxldCBpID0gMCwgeCA9ICRvcGVuQnV0dG9ucy5sZW5ndGg7IGkgPCB4OyBpKyspIHtcbiAgICAgICAgICAgIGxldCBjb250ZW50UG9zaXRpb24gPSAkb3BlbkJ1dHRvbnNbaV0ucGFyZW50Tm9kZS5uZXh0U2libGluZy5uZXh0U2libGluZy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgIGlmIChjb250ZW50UG9zaXRpb24udG9wIDw9IFN0cmluZyhnLnRvcFBhZGRpbmcpICYmIGNvbnRlbnRQb3NpdGlvbi5ib3R0b20gPj0gYm90dG9tUGFkZGluZykge1xuICAgICAgICAgICAgICAgICQoJG9wZW5CdXR0b25zW2ldKS5jc3Moe1xuICAgICAgICAgICAgICAgICAgICAndG9wJzogKC0oY29udGVudFBvc2l0aW9uLnRvcCkgKyBnLnRvcFBhZGRpbmcpICsgJ3B4JyxcbiAgICAgICAgICAgICAgICAgICAgJ3RyYW5zaXRpb24nOiAnMHMnXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICQoJG9wZW5CdXR0b25zW2ldKS5jc3Moe1xuICAgICAgICAgICAgICAgICAgICAndG9wJzogJzBweCcsXG4gICAgICAgICAgICAgICAgICAgICd0cmFuc2l0aW9uJzogJzBzJ1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBtb2R1bGUuZXhwb3J0cy5vcGVuID0gb3BlbjtcbiAgICBtb2R1bGUuZXhwb3J0cy5jbG9zZSA9IGNsb3NlO1xuICAgIG1vZHVsZS5leHBvcnRzLmZpeGVkID0gZml4ZWQ7XG59KSgpO1xuIiwiKGZ1bmN0aW9uIF9yb3V0ZXIoKSB7XG4gICAgY29uc3QgZyA9IHJlcXVpcmUoJy4vX2dsb2JhbHMnKTtcbiAgICBjb25zdCBwYiA9IHJlcXVpcmUoJy4vX3BsdXMtYnV0dG9ucycpO1xuICAgIGNvbnN0IG1lbnUgPSByZXF1aXJlKCcuL19tZW51Jyk7XG4gICAgbGV0ICRkb3duQXJyb3dzID0gJCgnYS5hcnJvdy1kb3duJyk7XG5cbiAgICBjb25zdCByb3V0ZXMgPSB7XG4gICAgICAgIGhvbWU6IHtcbiAgICAgICAgICAgIHBhdGg6ICdob21lJyxcbiAgICAgICAgICAgIHRpdGxlOiAnTGVhcm4gdG8gQ29kZSBhdCB0aGUgRmxvcmlkYSBWb2NhdGlvbmFsIEluc3RpdHV0ZSAtIEV2ZW5pbmcgQ29kaW5nIEJvb3RjYW1wJyxcbiAgICAgICAgICAgIGNsYXNzOiAnaG9tZSdcbiAgICAgICAgfSxcbiAgICAgICAgd2ViZGV2OiB7XG4gICAgICAgICAgICBwYXRoOiAnd2ViLWRldmVsb3Blci1wcm9ncmFtJyxcbiAgICAgICAgICAgIHRpdGxlOiAnV2ViIERldmVsb3BlciBFdmVuaW5nIEJvb3RjYW1wIGJ5IFRoZSBGbG9yaWRhIFZvY2F0aW9uYWwgSW5zdGl0dXRlJyxcbiAgICAgICAgICAgIGNsYXNzOiAnd2ViZGV2J1xuICAgICAgICB9LFxuICAgICAgICBjeWJlcjoge1xuICAgICAgICAgICAgcGF0aDogJ2N5YmVyLXNlY3VyaXR5LWFuZC1uZXR3b3JrLWFkbWluaXN0cmF0b3ItcHJvZ3JhbScsXG4gICAgICAgICAgICB0aXRsZTogJ05ldHdvcmsgQWRtaW5pc3RyYXRvciBFdmVuaW5nIEJvb3RjYW1wIGJ5IFRoZSBGbG9yaWRhIFZvY2F0aW9uYWwgSW5zdGl0dXRlJyxcbiAgICAgICAgICAgIGNsYXNzOiAnY3liZXInXG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gX2NyZWF0ZXJSb3V0ZUxvYWRlcihwdXNoU3RhdGUpIHtcbiAgICAgICAgZnVuY3Rpb24gbG9hZGVyKHJvdXRlKSB7XG4gICAgICAgICAgICBkb2N1bWVudC50aXRsZSA9IHJvdXRlLnRpdGxlO1xuICAgICAgICAgICAgdXBkYXRlQ29udGVudChyb3V0ZS5jbGFzcyk7XG4gICAgICAgICAgICBpZihwdXNoU3RhdGUpIHtoaXN0b3J5LnB1c2hTdGF0ZShyb3V0ZSwgcm91dGUucGF0aCwgXCIjL1wiICsgcm91dGUucGF0aCl9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGxvYWRlcjtcbiAgICB9XG5cbiAgICBsZXQgbG9hZCA9IF9jcmVhdGVyUm91dGVMb2FkZXIoZmFsc2UpO1xuICAgIGxldCBsb2FkQW5kUHVzaFN0YXRlID0gX2NyZWF0ZXJSb3V0ZUxvYWRlcih0cnVlKTtcblxuICAgIGZ1bmN0aW9uIHVwZGF0ZUNvbnRlbnQocGFnZUNsYXNzKSB7XG4gICAgICAgICQoJ2h0bWwnKS5mYWRlT3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLy8gcmVzZXQgdG8gZGVmYXVsdHNcbiAgICAgICAgICAgIGcuJG5hdkl0ZW1zLnJlbW92ZUNsYXNzKCdzZWN0aW9uLWluLXZpZXcnKTtcbiAgICAgICAgICAgIGcuJG92ZXJsYXkuaGlkZSgpO1xuICAgICAgICAgICAgZy4kYXBwbHlQb3BVcC5oaWRlKCk7XG4gICAgICAgICAgICBnLiRwbHVzQnV0dG9ucy5maWx0ZXIoJy5vcGVuZWQnKVxuICAgICAgICAgICAgICAgIC5jc3Moeyd0b3AnOiAnMHB4JywgJ3RyYW5zaXRpb24nOiAnLjZzJ30pXG4gICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdvcGVuZWQnKTtcbiAgICAgICAgICAgIGcuJGJhbm5lcnMuZmlsdGVyKCcuc2hyaW5rJylcbiAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ3NocmluaycpXG4gICAgICAgICAgICAgICAgLm5leHQoKS5oaWRlKCk7XG4gICAgICAgICAgICBnLiRuYXZJdGVtcy5yZW1vdmVDbGFzcygnc2VjdGlvbi1pbi12aWV3Jyk7XG4gICAgICAgICAgICAkKHdpbmRvdykub2ZmKCdzY3JvbGwnLCBzY3JvbGxIYW5kbGVyQm9keSk7XG4gICAgICAgICAgICB3aW5kb3cuc2Nyb2xsKDAsIDApO1xuXG4gICAgICAgICAgICAkKCcjcmFkaW8tJyArIHBhZ2VDbGFzcylbMF0uY2hlY2tlZCA9IHRydWU7XG4gICAgICAgICAgICBpZihwYWdlQ2xhc3MgPT0gXCJob21lXCIpIHtcbiAgICAgICAgICAgICAgJCgnI21lbnUsICNzZWN0aW9ucy1jb250YWluZXInKS5oaWRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgJCgnI21lbnUsICNzZWN0aW9ucy1jb250YWluZXInKS5zaG93KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBuYXZJdGVtcyA9IGcuJG5hdkl0ZW1zLmZpbHRlcignLicgKyBwYWdlQ2xhc3MpO1xuICAgICAgICAgICAgdmFyIGJhbm5lcnMgPSBnLiRiYW5uZXJzLmZpbHRlcignLicgKyBwYWdlQ2xhc3MpO1xuICAgICAgICAgICAgdmFyIGxhbmRpbmcgPSAkKCcjcGFnZV8nICsgcGFnZUNsYXNzKVswXTtcblxuICAgICAgICAgICAgLy8gb24gc2Nyb2xsLCBmaXggcGx1cy1idXR0b25zIHRvIHNjcmVlbiBhbmQgYWRkIG5hdiBzdHlsZXNcbiAgICAgICAgICAgIHZhciBzY3JvbGxIYW5kbGVyQm9keSA9ICh3aW5kb3cuaW5uZXJXaWR0aCA+PSBnLm1vYmlsZU1lbnVXaWR0aCkgPyBfc2Nyb2xsSGFuZGxlckRlc2t0b3AgOiBfc2Nyb2xsSGFuZGxlck1vYmlsZTtcbiAgICAgICAgICAgICQod2luZG93KS5vbignc2Nyb2xsJywgZnVuY3Rpb24gc2Nyb2xsSGFuZGxlcigpIHtcbiAgICAgICAgICAgICAgICBzY3JvbGxIYW5kbGVyQm9keSgkZG93bkFycm93cywgbmF2SXRlbXMsIGJhbm5lcnMsIGxhbmRpbmcpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICQoJ2h0bWwnKS5mYWRlSW4oKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfc2Nyb2xsSGFuZGxlckRlc2t0b3AoJGFycm93cywgaXRlbXMsIHNlY3Rpb25CYW5uZXJzLCBsYW5kaW5nUGFnZSkge1xuICAgICAgICBwYi5maXhlZCgpO1xuICAgICAgICBpZih3aW5kb3cuc2Nyb2xsWSA+ICcyMCcpIHtcbiAgICAgICAgICAkYXJyb3dzLmZhZGVPdXQoNDAwKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAkYXJyb3dzLnNsaWRlRG93big0MDApO1xuICAgICAgICB9XG4gICAgICAgIG1lbnUubmF2SXRlbXNTdHlsZShpdGVtcywgc2VjdGlvbkJhbm5lcnMsIGxhbmRpbmdQYWdlKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9zY3JvbGxIYW5kbGVyTW9iaWxlKCRhcnJvd3MpIHtcbiAgICAgICAgcGIuZml4ZWQoKTtcbiAgICAgICAgaWYod2luZG93LnNjcm9sbFkgPiAnMjAnKSB7XG4gICAgICAgICAgJGFycm93cy5mYWRlT3V0KDQwMCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgJGFycm93cy5zbGlkZURvd24oNDAwKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgbW9kdWxlLmV4cG9ydHMucm91dGVzID0gcm91dGVzO1xuICAgIG1vZHVsZS5leHBvcnRzLmxvYWQgPSBsb2FkO1xuICAgIG1vZHVsZS5leHBvcnRzLmxvYWRBbmRQdXNoU3RhdGUgPSBsb2FkQW5kUHVzaFN0YXRlO1xuICAgIG1vZHVsZS5leHBvcnRzLnVwZGF0ZUNvbnRlbnQgPSB1cGRhdGVDb250ZW50O1xufSkoKTtcbiIsIihmdW5jdGlvbiBfc21vb3RoU2Nyb2xsKCkge1xuICAgIC8vIFRoaXMgd2lsbCBzZWxlY3QgZXZlcnl0aGluZyB3aXRoIHRoZSBjbGFzcyBzbW9vdGhTY3JvbGxcbiAgICAvLyBUaGlzIHNob3VsZCBwcmV2ZW50IHByb2JsZW1zIHdpdGggY2Fyb3VzZWwsIHNjcm9sbHNweSwgZXRjLi4uXG4gICAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICAgICAgLy8gbWVudSBpdGVtc1xuICAgICAgICAkKCcuc21vb3RoU2Nyb2xsJykuY2xpY2soX3Ntb290aFNjcm9sbEZ1bmMpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX3Ntb290aFNjcm9sbEZ1bmMoKSB7XG4gICAgICAgIGlmIChsb2NhdGlvbi5wYXRobmFtZS5yZXBsYWNlKC9eXFwvLywgJycpID09IHRoaXMucGF0aG5hbWUucmVwbGFjZSgvXlxcLy8sICcnKSAmJiBsb2NhdGlvbi5ob3N0bmFtZSA9PSB0aGlzLmhvc3RuYW1lKSB7XG4gICAgICAgICAgICB2YXIgdGFyZ2V0ID0gJCh0aGlzLmhhc2gpO1xuICAgICAgICAgICAgdGFyZ2V0ID0gdGFyZ2V0Lmxlbmd0aCA/IHRhcmdldCA6ICQoJ1tuYW1lPScgKyB0aGlzLmhhc2guc2xpY2UoMSkgKyAnXScpO1xuICAgICAgICAgICAgaWYgKHRhcmdldC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAvLyB0b3BQYWRkaW5nIGlzIHRoZSBoZWlnaHQgb2YgdGhlIG5hdiwgc28gaXQgc2Nyb2xscyBwYXN0IHRoZSBuYXZcbiAgICAgICAgICAgICAgICB2YXIgdG9wUGFkZGluZyA9ICgkKHRhcmdldFswXSkuaGFzQ2xhc3MoJ2Jhbm5lcicpKSA/ICgod2luZG93LmlubmVyV2lkdGggPj0gJzk2MCcpID8gLTUyIDogMCkgOiAwO1xuICAgICAgICAgICAgICAgIHZhciBkaXN0YW5jZSA9ICQodGFyZ2V0WzBdKS5vZmZzZXQoKS50b3AgKyB0b3BQYWRkaW5nIC0gd2luZG93LnNjcm9sbFk7XG4gICAgICAgICAgICAgICAgdmFyIHRpbWluZyA9IChkaXN0YW5jZSA8IDEgJiYgZGlzdGFuY2UgPj0gMCkgPyAwIDogNzAwO1xuICAgICAgICAgICAgICAgICQoJ2JvZHksIGh0bWwnKS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wOiB0YXJnZXQub2Zmc2V0KCkudG9wICsgdG9wUGFkZGluZ1xuICAgICAgICAgICAgICAgIH0sIHRpbWluZywgJ2Vhc2VJbk91dFF1aW50JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICgkKHRhcmdldFswXSkuaGFzKCdzcGFuLnBsdXMtYnV0dG9uJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBub2RlcyA9IHRhcmdldFswXS5jaGlsZE5vZGVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIHggPSBub2Rlcy5sZW5ndGg7IGkgPCB4OyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobm9kZXNbaV0uY2xhc3NMaXN0ID09ICdwbHVzLWJ1dHRvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJChub2Rlc1tpXSkuY2xpY2soKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBtb2R1bGUuZXhwb3J0cy5pbml0ID0gaW5pdDtcbn0pKCk7XG4iLCIndXNlIHN0cmljdCc7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG5cdHZhbHVlOiB0cnVlXG59KTtcbmZ1bmN0aW9uIGdldFNjcm9sbFRvcCgpIHtcblx0cmV0dXJuIHdpbmRvdy5wYWdlWU9mZnNldCB8fCBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcDtcbn1cblxuZnVuY3Rpb24gZ2V0U2Nyb2xsTGVmdCgpIHtcblx0cmV0dXJuIHdpbmRvdy5wYWdlWE9mZnNldCB8fCBkb2N1bWVudC5ib2R5LnNjcm9sbExlZnQ7XG59XG5leHBvcnRzWydkZWZhdWx0J10gPSBnZXRTY3JvbGxUb3A7XG5leHBvcnRzLmdldFNjcm9sbExlZnQgPSBnZXRTY3JvbGxMZWZ0O1xuZXhwb3J0cy5nZXRTY3JvbGxUb3AgPSBnZXRTY3JvbGxUb3A7XG5leHBvcnRzLmxlZnQgPSBnZXRTY3JvbGxMZWZ0O1xuZXhwb3J0cy50b3AgPSBnZXRTY3JvbGxUb3A7XG5cbiIsIm1vZHVsZS5leHBvcnRzID0gb247XG5tb2R1bGUuZXhwb3J0cy5vbiA9IG9uO1xubW9kdWxlLmV4cG9ydHMub2ZmID0gb2ZmO1xuXG5mdW5jdGlvbiBvbiAoZWxlbWVudCwgdHlwZSwgbGlzdGVuZXIsIHVzZUNhcHR1cmUpIHtcbiAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGxpc3RlbmVyLCB1c2VDYXB0dXJlKTtcbiAgcmV0dXJuIGxpc3RlbmVyO1xufVxuXG5mdW5jdGlvbiBvZmYgKGVsZW1lbnQsIHR5cGUsIGxpc3RlbmVyLCB1c2VDYXB0dXJlKSB7XG4gIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lciwgdXNlQ2FwdHVyZSk7XG4gIHJldHVybiBsaXN0ZW5lcjtcbn1cbiIsIi8qISBucG0uaW0vb25lLWV2ZW50ICovXG4ndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIG9uY2UodGFyZ2V0LCB0eXBlLCBsaXN0ZW5lciwgdXNlQ2FwdHVyZSkge1xuXHR0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lciwgdXNlQ2FwdHVyZSk7XG5cdHRhcmdldC5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGZ1bmN0aW9uIHNlbGZSZW1vdmluZygpIHtcblx0XHR0YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lciwgdXNlQ2FwdHVyZSk7XG5cdFx0dGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZSwgc2VsZlJlbW92aW5nLCB1c2VDYXB0dXJlKTtcblx0fSwgdXNlQ2FwdHVyZSk7XG59XG5cbm9uY2UucHJvbWlzZSA9IGZ1bmN0aW9uICh0YXJnZXQsIHR5cGUsIHVzZUNhcHR1cmUpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJldHVybiBvbmNlKHRhcmdldCwgdHlwZSwgcmVzb2x2ZSwgdXNlQ2FwdHVyZSk7IH0pOyB9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG9uY2U7IiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBfaW50ZXJvcERlZmF1bHQgKGV4KSB7IHJldHVybiAoZXggJiYgKHR5cGVvZiBleCA9PT0gJ29iamVjdCcpICYmICdkZWZhdWx0JyBpbiBleCkgPyBleFsnZGVmYXVsdCddIDogZXg7IH1cblxudmFyIGdldFNjcm9sbCA9IHJlcXVpcmUoJ2dldC1zY3JvbGwnKTtcbnZhciBvbk9mZiA9IHJlcXVpcmUoJ29uLW9mZicpO1xudmFyIG9uY2UgPSBfaW50ZXJvcERlZmF1bHQocmVxdWlyZSgnb25lLWV2ZW50JykpO1xuXG5leHBvcnRzLmlzUHJldmVudGVkID0gZmFsc2U7XG5cbi8qKlxuICogU2Nyb2xsIGZ1bmN0aW9uc1xuICovXG52YXIgbGFzdFNjcm9sbFBvc2l0aW9uID0gdm9pZCAwO1xuZnVuY3Rpb24gcmVzZXRTY3JvbGwoKSB7XG5cdHdpbmRvdy5zY3JvbGxUby5hcHBseSh3aW5kb3csIGxhc3RTY3JvbGxQb3NpdGlvbik7XG59XG5mdW5jdGlvbiB3YWl0Rm9yU2Nyb2xsKCkge1xuXHRsYXN0U2Nyb2xsUG9zaXRpb24gPSBbZ2V0U2Nyb2xsLmdldFNjcm9sbExlZnQoKSwgZ2V0U2Nyb2xsLmdldFNjcm9sbFRvcCgpXTtcblx0b25jZSh3aW5kb3csICdzY3JvbGwnLCByZXNldFNjcm9sbCk7XG59XG5cbi8qKlxuICogVG9nZ2xlIGZ1bmN0aW9uc1xuICovXG5mdW5jdGlvbiBldmVudChhY3Rpb24pIHtcblx0Ly8gcnVuIFwicmVtb3ZlXCIgb25seSBpZiBpdCdzIHByZXZlbnRlZFxuXHQvLyBvdGhlcndpc2UgcnVuIFwiYXR0YWNoXCIgb3IgXCJvbmNlXCIgb25seSBpZiBpdCdzIG5vdCBhbHJlYWR5IHByZXZlbnRlZFxuXHRpZiAoYWN0aW9uID09PSBvbk9mZi5vZmYgPT09IGV4cG9ydHMuaXNQcmV2ZW50ZWQpIHtcblx0XHRhY3Rpb24od2luZG93LCAncG9wc3RhdGUnLCB3YWl0Rm9yU2Nyb2xsKTtcblx0fVxufVxuZnVuY3Rpb24gYWxsb3coKSB7XG5cdGV2ZW50KG9uT2ZmLm9mZik7XG5cdGV4cG9ydHMuaXNQcmV2ZW50ZWQgPSBmYWxzZTtcbn1cbmZ1bmN0aW9uIHByZXZlbnQoKSB7XG5cdGV2ZW50KG9uT2ZmLm9uKTtcblx0ZXhwb3J0cy5pc1ByZXZlbnRlZCA9IHRydWU7XG59XG5mdW5jdGlvbiBwcmV2ZW50T25jZSgpIHtcblx0ZXZlbnQob25jZSk7XG59XG5cbnZhciBpbmRleCA9IChmdW5jdGlvbiAodG9nZ2xlKSB7XG5cdCh0b2dnbGUgPyBwcmV2ZW50IDogYWxsb3cpKCk7XG59KTtcblxuZXhwb3J0cy5hbGxvdyA9IGFsbG93O1xuZXhwb3J0cy5wcmV2ZW50ID0gcHJldmVudDtcbmV4cG9ydHMucHJldmVudE9uY2UgPSBwcmV2ZW50T25jZTtcbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IGluZGV4OyJdfQ==
