(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

;(function DOMquery() {

    window.$ = function (query) {
        var elements = document.querySelectorAll(query);
        if (elements.length === 1) return elements[0];
        return elements;
    };

    // must be used on a node list, i.e. the return value of querySelectorAll
    Object.prototype.addClass = function () {
        var _this = this;

        for (var _len = arguments.length, classNames = Array(_len), _key = 0; _key < _len; _key++) {
            classNames[_key] = arguments[_key];
        }

        if (!this[0]) {
            classNames.forEach(function (className) {
                _this.classList.add(className);
            });
            return this;
        }
        this.forEach(function (el) {
            classNames.forEach(function (className) {
                el.classList.add(className);
            });
        });
        return this;
    };

    // must be used on a node list, i.e. the return value of querySelectorAll
    Object.prototype.removeClass = function () {
        var _this2 = this;

        for (var _len2 = arguments.length, classNames = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            classNames[_key2] = arguments[_key2];
        }

        if (!this[0]) {
            classNames.forEach(function (className) {
                _this2.classList.remove(className);
            });
            return this;
        }
        this.forEach(function (el) {
            classNames.forEach(function (className) {
                el.classList.remove(className);
            });
        });
        return this;
    };
})();

},{}],2:[function(require,module,exports){
'use strict';

(function mainFunction() {
    "use strict";

    require('./dom-query.js');
    require('dom-slider');
    require('dom-fader');
    var g = require('./partials/_globals');
    var router = require('./partials/_router');
    var pb = require('./partials/_plus-buttons');
    var menu = require('./partials/_menu');
    var form = require('./partials/_form');
    var preventPopstateScroll = require('prevent-popstate-scroll');

    var setup = {
        initAll: function initAll() {
            // Load initial URL
            setup.urlRouter();
            // Initialize functionality to change page content and URL
            // when user click on certain elements
            setup.clickRouter();
            // Change page content and URL when click browser's forward or back buttons
            window.addEventListener('popstate', setup.urlRouter);
            // prevent browser from scrolling to top when onpopstate event emits
            preventPopstateScroll.prevent();
            // smoothScroll initialization
            setup.smoothScroll();
            // Click on plus-buttons before user prints, to show content
            setup.printStyles();
            // Contact form functionality
            g.$applyButtons.forEach(function (btn) {
                btn.addEventListener('click', function (e) {
                    e.preventDefault();
                    form.show();
                });
            });
            $('#apply-close').addEventListener('click', form.hide);
            g.$overlay.addEventListener('click', function () {
                form.hide();
                if (window.innerWidth <= g.mobileMenuWidth) {
                    if ($('#menu-button span').textContent === 'CLOSE') {
                        menu.mobileClick();
                    }
                }
            });
            $('#submit-apply').addEventListener('click', form.send);
            // Setup plus buttons functionality
            g.$plusButtons.forEach(function (btn) {
                btn.addEventListener('click', function () {
                    this.classList.contains('opened') ? pb.close(this) : pb.open(this);
                });
            });
            // Setup mobile menu
            if (window.innerWidth < g.mobileMenuWidth) {
                $('#menu-button').addEventListener('click', menu.mobileClick);
                $('#menu-items a').forEach(function (item) {
                    item.addEventListener('click', menu.mobileClick);
                });
            }
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
                        return false;
                    }
                }
            }
        },
        clickRouter: function clickRouter() {
            var _loop = function _loop(route) {
                if (route === 'home') return 'continue';
                if (router.routes.hasOwnProperty(route)) {
                    $(".card." + router.routes[route]['class']).addEventListener('click', function (e) {
                        e.preventDefault();
                        router.loadAndPushState(router.routes[route]);
                    });
                }
            };

            for (var route in router.routes) {
                var _ret = _loop(route);

                if (_ret === 'continue') continue;
            }
            g.$homeButton.addEventListener('click', function (e) {
                e.preventDefault();
                router.loadAndPushState(router.routes.home);
            });
        },
        smoothScroll: function smoothScroll() {
            $('a.smoothScroll').forEach(function (anchor) {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    var dest = $(anchor.getAttribute('href'));
                    zenscroll.to(dest, 400, function () {
                        var btn = dest.querySelector('.plus-button');
                        if (btn && !btn.classList.contains('opened')) {
                            btn.click();
                        }
                    });
                });
            });
        },
        printStyles: function printStyles() {
            function showContent() {
                $('.plus-button:not(.opened)').forEach(function (btn) {
                    btn.click();
                });
            }

            function hideContent() {
                $('.plus-button.opened').forEach(function (btn) {
                    btn.click();
                });
            }

            window.onbeforeprint = showContent;
            window.onafterprint = hideContent;

            var mediaQueryList = window.matchMedia('print');
            mediaQueryList.addListener(function (mql) {
                if (mql.matches) {
                    showContent();
                    setTimeout(hideContent, 500);
                };
            });
        }
    };

    setup.initAll();
})();

},{"./dom-query.js":1,"./partials/_form":3,"./partials/_globals":4,"./partials/_menu":5,"./partials/_plus-buttons":6,"./partials/_router":7,"dom-fader":8,"dom-slider":9,"prevent-popstate-scroll":13}],3:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

require('whatwg-fetch');

(function _form() {
  var g = require('./_globals');

  var $message = $('#sent-message');

  function show() {
    g.$overlay.fadeIn();
    g.$applyPopUp.fadeIn();
  }

  function hide() {
    g.$overlay.fadeOut();
    g.$applyPopUp.fadeOut();
  }

  function buildFormData() {
    return {
      fname: $("#form-full_name").value.split(" ")[0],
      lname: $("#form-full_name").value.split(" ").slice(1).join(" "),
      email: $("#form-email").value,
      phone: $("#form-day_phone").value
    };
  }
  function resetForm() {
    $("#form-full_name").value = "";
    $("#form-email").value = "";
    $("#form-day_phone").value = "";
  }

  function sendForm() {
    var data = buildFormData();
    if (!data || !data.fname || !data.lname) {
      alert("Please input your full name");
      return;
    }
    if (!data.email) {
      alert("Please input your email");
      return;
    }
    if (!data.phone) {
      alert("Please input your phone number");
      return;
    }
    fetch('http://fvi-grad.com:4004/submittechfviform', {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(data)
    }).then(function (res) {
      console.log(res);
      if (res.status != 200) {
        console.log("Caught bad response");
        throw { message: 'Bad response from server: ' + res.status, serverRes: res };
      }
      $(".form").fadeOut();
      $message.fadeIn();
      console.log("made it here");
      setTimeout(function () {
        resetForm();
      }, 300);
    }).catch(function (err) {
      console.log("Entering catch clause");
      if ((typeof err === 'undefined' ? 'undefined' : _typeof(err)) === 'object') alert(JSON.stringify(err));
      console.log(err);
    });
  }

  module.exports.show = show;
  module.exports.hide = hide;
  module.exports.send = sendForm;
})();

},{"./_globals":4,"whatwg-fetch":14}],4:[function(require,module,exports){
'use strict';

(function _globals() {
    var $overlay = $('#overlay');
    var $cards = $('label.card');
    var $applyPopUp = $('#apply-pop-up');
    var $applyForm = $applyPopUp.querySelectorAll('.form');
    var $applyButtons = $('#nav-apply-btn, #cta-apply-btn, #contact-home, .request-info');
    var $pagesContainer = $('#pages-container');
    var $homeButton = $('#home-button');
    var $menuItems = $('#menu-items');
    var $navItems = $('a.nav-item');
    var $sections = $pagesContainer.querySelectorAll('section');
    var $banners = $('.banner');
    var $plusButtons = $('span.plus-button');

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

},{}],5:[function(require,module,exports){
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
    }

    function mobileClick() {
        var $menuButton = $('#menu-button span');
        if ($menuButton.textContent === 'MENU') {
            g.$menuItems.slideDown();
            $menuButton.textContent = 'CLOSE';
        } else {
            g.$menuItems.slideUp();
            $menuButton.textContent = 'MENU';
        }
    }

    module.exports.navItemsStyle = navItemsStyle;
    module.exports.mobileClick = mobileClick;
})();

},{"./_globals":4}],6:[function(require,module,exports){
'use strict';

(function _plusButtons() {
    var g = require('./_globals');

    function open($button) {
        var $banner = $button.parentNode;
        $button.addClass('opened');
        $banner.addClass('shrink');
        $banner.nextSibling.nextSibling.slideDown(600);
    }

    function close($button) {
        var $banner = $button.parentNode;
        zenscroll.to($banner, 300);
        $button.removeClass('opened');
        $button.style.top = '0px';
        $button.style.transition = 'all 0.6s';
        $banner.removeClass('shrink');
        $banner.nextSibling.nextSibling.slideUp(600);
    }

    function fixed() {
        // bottomPadding is the bottom of the content, plus nav height and button translateY
        var bottomPadding = window.innerWidth >= g.mobileMenuWidth ? '96' : '45';
        var $openButtons = document.querySelectorAll('.plus-button.opened');
        $openButtons.forEach(function (btn) {
            var contentPosition = btn.parentNode.nextSibling.nextSibling.getBoundingClientRect();
            if (contentPosition.top <= String(g.topPadding) && contentPosition.bottom >= bottomPadding) {
                btn.style.top = -contentPosition.top + g.topPadding + 'px';
                btn.style.transition = '0s';
            } else {
                btn.style.top = '0px';
                btn.style.transition = '0s';
            }
        });
    }

    module.exports.open = open;
    module.exports.close = close;
    module.exports.fixed = fixed;
})();

},{"./_globals":4}],7:[function(require,module,exports){
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
            path: 'network-administrator-program',
            title: 'Network Administrator Evening Bootcamp by The Florida Vocational Institute',
            class: 'cyber'
        }
    };

    function _scrollHandlerDesktop($arrows, items, sectionBanners, landingPage) {
        pb.fixed();
        if (window.scrollY > '20') {
            $arrows.forEach(function (a) {
                return a.fadeOut(200);
            });
        } else {
            $arrows.forEach(function (a) {
                return a.fadeIn(200);
            });
        }
        menu.navItemsStyle(items, sectionBanners, landingPage);
    }

    function _scrollHandlerMobile($arrows) {
        pb.fixed();
        if (window.scrollY > '20') {
            $arrows.forEach(function (a) {
                return a.fadeOut(200);
            });
        } else {
            $arrows.forEach(function (a) {
                return a.fadeIn(200);
            });
        }
    }

    function updateContent(pageClass) {
        // reset to defaults
        $('html').style.opacity = '0';
        g.$navItems.removeClass('section-in-view');
        g.$overlay.fadeOut();
        g.$applyPopUp.fadeOut();
        if (window.innerWidth <= g.mobileMenuWidth) {
            g.$menuItems.slideUp(10);
        }
        $('.plus-button.opened').forEach(function (btn) {
            btn.style.top = '0px';
            btn.style.transition = '.6s';
            btn.removeClass('opened');
        });
        $('.banner').removeClass('shrink');
        $('.content-container').forEach(function (c) {
            return c.slideUp(10);
        });
        g.$navItems.removeClass('section-in-view');
        window.removeEventListener('scroll', scrollHandlerBody);
        window.scrollTo(0, 0);

        $('#radio-' + pageClass).checked = true;
        if (pageClass === "home") {
            $('#menu').style.display = 'none';
            $('#sections-container').slideUp(10);
        } else {
            $('#menu').style.display = 'block';
            $('#sections-container').slideDown(10);
        }

        var navItems = $('a.nav-item.' + pageClass);
        var banners = $('.banner.' + pageClass);
        var landing = $('#page_' + pageClass);

        // on scroll, fix plus-buttons to screen and add nav styles
        var scrollHandlerBody = window.innerWidth >= g.mobileMenuWidth ? _scrollHandlerDesktop : _scrollHandlerMobile;
        window.addEventListener('scroll', function scrollHandler() {
            scrollHandlerBody($downArrows, navItems, banners, landing);
        });
        $('html').style.opacity = '1';
    }

    function _createrRouteLoader(pushState) {
        function loader(route) {
            document.title = route.title;
            updateContent(route.class);
            if (pushState) {
                history.pushState(route, route.path, "#/" + route.path);
            }
        }
        return loader;
    }

    var load = _createrRouteLoader(false);
    var loadAndPushState = _createrRouteLoader(true);

    module.exports.routes = routes;
    module.exports.load = load;
    module.exports.loadAndPushState = loadAndPushState;
    module.exports.updateContent = updateContent;
})();

},{"./_globals":4,"./_menu":5,"./_plus-buttons":6}],8:[function(require,module,exports){
'use strict';

// Save the display values of new elements before fading out,
// so that fadeIn will go back to the original display value
var CSSvalues = {};

function fade(element, _speed, direction, easing) {
    // abort fading if is already fading in or out
    if (element.dataset.fading) return false;

    element.dataset.fading = true;

    var s = element.style;
    var savedValues = CSSvalues[element.dataset.domFaderId];
    var thisDisplay = window.getComputedStyle(element).getPropertyValue('display');
    var thisOpacity = window.getComputedStyle(element).getPropertyValue('opacity');
    var speed = _speed ? _speed : _speed === 0 ? 0 : 300;

    if (!element.dataset.domFaderId) {
        var id = Math.random();
        element.dataset.domFaderId = id;
        CSSvalues[id] = {
            display: thisDisplay === 'none' ? 'block' : thisDisplay,
            opacity: thisOpacity === '0' ? '1' : thisOpacity
        };
    }

    // add/remove the styles that will animate the element
    if (direction === 'in') {
        s.opacity = '0';
        s.display = savedValues ? savedValues.display : 'block';
        s.transition = 'opacity ' + speed + 'ms ' + (easing || '');
        setTimeout(function () {
            return s.opacity = savedValues ? savedValues.opacity : '1';
        }, 10);
    }
    if (direction === 'out') {
        s.transition = 'opacity ' + speed + 'ms ' + (easing || '');
        s.opacity = '0';
    }

    // remove temp styles, add DOM-fader-hidden class, and return the element
    var done = new Promise(function (resolve, reject) {
        setTimeout(function () {
            element.removeAttribute('style');
            element.removeAttribute('data-fading');
            if (direction === 'in') {
                element.classList.remove('DOM-fader-hidden');
                s.display = savedValues ? savedValues.display : 'block';
            }
            if (direction === 'out') element.classList.add('DOM-fader-hidden');
            resolve(element);
        }, speed);
    });

    return done;
}

(function DOMfaderInit() {
    var sheet = document.createElement('style');
    sheet.id = 'fadeCSSStyles';
    sheet.innerHTML = '\n        .DOM-fader-hidden {\n            display: none;\n        }\n    ';
    document.head.appendChild(sheet);

    Object.prototype.fadeIn = function (_speed, easing) {
        return fade(this, _speed, 'in', easing);
    };

    Object.prototype.fadeOut = function (_speed, easing) {
        return fade(this, _speed, 'out', easing);
    };

    Object.prototype.fadeToggle = function (_speed, easing) {
        if (this.classList.contains('DOM-fader-hidden')) {
            return fade(this, _speed, 'in', easing);
        } else {
            return fade(this, _speed, 'out', easing);
        }
    };
})();

},{}],9:[function(require,module,exports){
'use strict';

function slide(element, _speed, direction, easing) {
    // prevent user from sliding down if already sliding
    if (direction === 'down' && (element.classList.contains('setHeight') || !element.classList.contains('DOM-slider-hidden'))) return false;

    // prevent user from sliding up if already sliding
    if (direction === 'up' && (element.classList.contains('DOM-slider-hidden') || element.classList.contains('setHeight'))) return false;

    var s = element.style;
    var speed = _speed ? _speed : _speed === 0 ? 0 : 300;
    var contentHeight = element.scrollHeight;

    // subtract padding from contentHeight
    if (direction === 'up') {
        var style = window.getComputedStyle(element);
        var paddingTop = +style.getPropertyValue('padding-top').split('px')[0];
        var paddingBottom = +style.getPropertyValue('padding-bottom').split('px')[0];
        contentHeight = element.scrollHeight - paddingTop - paddingBottom;
    }

    // create a setHeight CSS class
    var sheet = document.createElement('style');
    // create an id for each class to allow multiple elements to slide
    // at the same time, such as when activated by a forEach loop
    var setHeightId = (Date.now() * Math.random()).toFixed(0);
    sheet.innerHTML = '.setHeight-' + setHeightId + ' {height: ' + contentHeight + 'px;}';
    document.head.appendChild(sheet);

    // add the CSS classes that will give the computer a fixed starting point
    if (direction === 'up') {
        element.classList.add('setHeight-' + setHeightId);
    } else {
        element.classList.add('DOM-slider-hidden', 'setHeight-' + setHeightId);
    }

    s.transition = 'all ' + speed + 'ms ' + (easing || '');
    s.overflow = 'hidden';

    // add/remove the CSS class(s) that will animate the element
    if (direction === 'up') {
        // Don't know why, but waiting 10 milliseconds before adding
        // the 'hidden' class when sliding up prevents height-jumping
        setTimeout(function () {
            element.classList.add('DOM-slider-hidden');
        }, 10);
    } else {
        element.classList.remove('DOM-slider-hidden');
    }

    var done = new Promise(function (resolve, reject) {
        setTimeout(function () {
            // remove the temporary inline styles and remove the temp stylesheet
            element.removeAttribute('style');
            sheet.parentNode.removeChild(sheet);
            element.classList.remove('setHeight-' + setHeightId);
            resolve(element);
        }, speed);
    });

    return done;
}

(function DOMsliderInit() {
    var sheet = document.createElement('style');
    sheet.id = 'slideCSSClasses';
    sheet.innerHTML = '\n    .DOM-slider-hidden {\n        height: 0 !important;\n        padding-top: 0 !important;\n        padding-bottom: 0 !important;\n        border-top-width: 0 !important;\n        border-bottom-width: 0 !important;\n        margin-top: 0 !important;\n        margin-bottom: 0 !important;\n        overflow: hidden !important;\n    }\n    ';
    document.head.appendChild(sheet);

    Object.prototype.slideDown = function (_speed, easing) {
        return slide(this, _speed, 'down', easing);
    };

    Object.prototype.slideUp = function (_speed, easing) {
        return slide(this, _speed, 'up', easing);
    };

    Object.prototype.slideToggle = function (_speed, easing) {
        if (this.classList.contains('DOM-slider-hidden')) {
            return slide(this, _speed, 'down', easing);
        } else {
            return slide(this, _speed, 'up', easing);
        }
    };
})();

},{}],10:[function(require,module,exports){
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


},{}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
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
},{}],13:[function(require,module,exports){
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
},{"get-scroll":10,"on-off":11,"one-event":12}],14:[function(require,module,exports){
(function(self) {
  'use strict';

  if (self.fetch) {
    return
  }

  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob: 'FileReader' in self && 'Blob' in self && (function() {
      try {
        new Blob()
        return true
      } catch(e) {
        return false
      }
    })(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  }

  if (support.arrayBuffer) {
    var viewClasses = [
      '[object Int8Array]',
      '[object Uint8Array]',
      '[object Uint8ClampedArray]',
      '[object Int16Array]',
      '[object Uint16Array]',
      '[object Int32Array]',
      '[object Uint32Array]',
      '[object Float32Array]',
      '[object Float64Array]'
    ]

    var isDataView = function(obj) {
      return obj && DataView.prototype.isPrototypeOf(obj)
    }

    var isArrayBufferView = ArrayBuffer.isView || function(obj) {
      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
    }
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name)
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value)
    }
    return value
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function() {
        var value = items.shift()
        return {done: value === undefined, value: value}
      }
    }

    if (support.iterable) {
      iterator[Symbol.iterator] = function() {
        return iterator
      }
    }

    return iterator
  }

  function Headers(headers) {
    this.map = {}

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value)
      }, this)
    } else if (Array.isArray(headers)) {
      headers.forEach(function(header) {
        this.append(header[0], header[1])
      }, this)
    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name])
      }, this)
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name)
    value = normalizeValue(value)
    var oldValue = this.map[name]
    this.map[name] = oldValue ? oldValue+','+value : value
  }

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)]
  }

  Headers.prototype.get = function(name) {
    name = normalizeName(name)
    return this.has(name) ? this.map[name] : null
  }

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  }

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = normalizeValue(value)
  }

  Headers.prototype.forEach = function(callback, thisArg) {
    for (var name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        callback.call(thisArg, this.map[name], name, this)
      }
    }
  }

  Headers.prototype.keys = function() {
    var items = []
    this.forEach(function(value, name) { items.push(name) })
    return iteratorFor(items)
  }

  Headers.prototype.values = function() {
    var items = []
    this.forEach(function(value) { items.push(value) })
    return iteratorFor(items)
  }

  Headers.prototype.entries = function() {
    var items = []
    this.forEach(function(value, name) { items.push([name, value]) })
    return iteratorFor(items)
  }

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result)
      }
      reader.onerror = function() {
        reject(reader.error)
      }
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsArrayBuffer(blob)
    return promise
  }

  function readBlobAsText(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsText(blob)
    return promise
  }

  function readArrayBufferAsText(buf) {
    var view = new Uint8Array(buf)
    var chars = new Array(view.length)

    for (var i = 0; i < view.length; i++) {
      chars[i] = String.fromCharCode(view[i])
    }
    return chars.join('')
  }

  function bufferClone(buf) {
    if (buf.slice) {
      return buf.slice(0)
    } else {
      var view = new Uint8Array(buf.byteLength)
      view.set(new Uint8Array(buf))
      return view.buffer
    }
  }

  function Body() {
    this.bodyUsed = false

    this._initBody = function(body) {
      this._bodyInit = body
      if (!body) {
        this._bodyText = ''
      } else if (typeof body === 'string') {
        this._bodyText = body
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString()
      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
        this._bodyArrayBuffer = bufferClone(body.buffer)
        // IE 10-11 can't handle a DataView body.
        this._bodyInit = new Blob([this._bodyArrayBuffer])
      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
        this._bodyArrayBuffer = bufferClone(body)
      } else {
        throw new Error('unsupported BodyInit type')
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8')
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type)
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
        }
      }
    }

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this)
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(new Blob([this._bodyArrayBuffer]))
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      }

      this.arrayBuffer = function() {
        if (this._bodyArrayBuffer) {
          return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
        } else {
          return this.blob().then(readBlobAsArrayBuffer)
        }
      }
    }

    this.text = function() {
      var rejected = consumed(this)
      if (rejected) {
        return rejected
      }

      if (this._bodyBlob) {
        return readBlobAsText(this._bodyBlob)
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as text')
      } else {
        return Promise.resolve(this._bodyText)
      }
    }

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      }
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    }

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

  function normalizeMethod(method) {
    var upcased = method.toUpperCase()
    return (methods.indexOf(upcased) > -1) ? upcased : method
  }

  function Request(input, options) {
    options = options || {}
    var body = options.body

    if (input instanceof Request) {
      if (input.bodyUsed) {
        throw new TypeError('Already read')
      }
      this.url = input.url
      this.credentials = input.credentials
      if (!options.headers) {
        this.headers = new Headers(input.headers)
      }
      this.method = input.method
      this.mode = input.mode
      if (!body && input._bodyInit != null) {
        body = input._bodyInit
        input.bodyUsed = true
      }
    } else {
      this.url = String(input)
    }

    this.credentials = options.credentials || this.credentials || 'omit'
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers)
    }
    this.method = normalizeMethod(options.method || this.method || 'GET')
    this.mode = options.mode || this.mode || null
    this.referrer = null

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body)
  }

  Request.prototype.clone = function() {
    return new Request(this, { body: this._bodyInit })
  }

  function decode(body) {
    var form = new FormData()
    body.trim().split('&').forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=')
        var name = split.shift().replace(/\+/g, ' ')
        var value = split.join('=').replace(/\+/g, ' ')
        form.append(decodeURIComponent(name), decodeURIComponent(value))
      }
    })
    return form
  }

  function parseHeaders(rawHeaders) {
    var headers = new Headers()
    rawHeaders.split(/\r?\n/).forEach(function(line) {
      var parts = line.split(':')
      var key = parts.shift().trim()
      if (key) {
        var value = parts.join(':').trim()
        headers.append(key, value)
      }
    })
    return headers
  }

  Body.call(Request.prototype)

  function Response(bodyInit, options) {
    if (!options) {
      options = {}
    }

    this.type = 'default'
    this.status = 'status' in options ? options.status : 200
    this.ok = this.status >= 200 && this.status < 300
    this.statusText = 'statusText' in options ? options.statusText : 'OK'
    this.headers = new Headers(options.headers)
    this.url = options.url || ''
    this._initBody(bodyInit)
  }

  Body.call(Response.prototype)

  Response.prototype.clone = function() {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    })
  }

  Response.error = function() {
    var response = new Response(null, {status: 0, statusText: ''})
    response.type = 'error'
    return response
  }

  var redirectStatuses = [301, 302, 303, 307, 308]

  Response.redirect = function(url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code')
    }

    return new Response(null, {status: status, headers: {location: url}})
  }

  self.Headers = Headers
  self.Request = Request
  self.Response = Response

  self.fetch = function(input, init) {
    return new Promise(function(resolve, reject) {
      var request = new Request(input, init)
      var xhr = new XMLHttpRequest()

      xhr.onload = function() {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
        }
        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL')
        var body = 'response' in xhr ? xhr.response : xhr.responseText
        resolve(new Response(body, options))
      }

      xhr.onerror = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.ontimeout = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.open(request.method, request.url, true)

      if (request.credentials === 'include') {
        xhr.withCredentials = true
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob'
      }

      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value)
      })

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
    })
  }
  self.fetch.polyfill = true
})(typeof self !== 'undefined' ? self : this);

},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqc1xcZG9tLXF1ZXJ5LmpzIiwianNcXG1haW4uanMiLCJqc1xccGFydGlhbHNcXF9mb3JtLmpzIiwianNcXHBhcnRpYWxzXFxfZ2xvYmFscy5qcyIsImpzXFxwYXJ0aWFsc1xcX21lbnUuanMiLCJqc1xccGFydGlhbHNcXF9wbHVzLWJ1dHRvbnMuanMiLCJqc1xccGFydGlhbHNcXF9yb3V0ZXIuanMiLCJub2RlX21vZHVsZXMvZG9tLWZhZGVyL2Rpc3QvZG9tLWZhZGVyLmpzIiwibm9kZV9tb2R1bGVzL2RvbS1zbGlkZXIvZGlzdC9kb20tc2xpZGVyLmpzIiwibm9kZV9tb2R1bGVzL2dldC1zY3JvbGwvZGlzdC9nZXQtc2Nyb2xsLm5vZGUuanMiLCJub2RlX21vZHVsZXMvb24tb2ZmL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL29uZS1ldmVudC9kaXN0L29uZS1ldmVudC5jb21tb24tanMuanMiLCJub2RlX21vZHVsZXMvcHJldmVudC1wb3BzdGF0ZS1zY3JvbGwvZGlzdC9wcmV2ZW50LXBvcHN0YXRlLXNjcm9sbC5jb21tb24tanMuanMiLCJub2RlX21vZHVsZXMvd2hhdHdnLWZldGNoL2ZldGNoLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxDQUFDLENBQUMsU0FBUyxRQUFULEdBQW9COztBQUV0QixXQUFPLENBQVAsR0FBVyxVQUFTLEtBQVQsRUFBZ0I7QUFDdkIsWUFBSSxXQUFXLFNBQVMsZ0JBQVQsQ0FBMEIsS0FBMUIsQ0FBZjtBQUNBLFlBQUcsU0FBUyxNQUFULEtBQW9CLENBQXZCLEVBQTBCLE9BQU8sU0FBUyxDQUFULENBQVA7QUFDMUIsZUFBTyxRQUFQO0FBQ0gsS0FKRDs7QUFNQTtBQUNBLFdBQU8sU0FBUCxDQUFpQixRQUFqQixHQUE0QixZQUF3QjtBQUFBOztBQUFBLDBDQUFaLFVBQVk7QUFBWixzQkFBWTtBQUFBOztBQUNoRCxZQUFHLENB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiOyhmdW5jdGlvbiBET01xdWVyeSgpIHtcclxuXHJcbndpbmRvdy4kID0gZnVuY3Rpb24ocXVlcnkpIHtcclxuICAgIGxldCBlbGVtZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwocXVlcnkpXHJcbiAgICBpZihlbGVtZW50cy5sZW5ndGggPT09IDEpIHJldHVybiBlbGVtZW50c1swXVxyXG4gICAgcmV0dXJuIGVsZW1lbnRzXHJcbn1cclxuXHJcbi8vIG11c3QgYmUgdXNlZCBvbiBhIG5vZGUgbGlzdCwgaS5lLiB0aGUgcmV0dXJuIHZhbHVlIG9mIHF1ZXJ5U2VsZWN0b3JBbGxcclxuT2JqZWN0LnByb3RvdHlwZS5hZGRDbGFzcyA9IGZ1bmN0aW9uKC4uLmNsYXNzTmFtZXMpIHtcclxuICAgIGlmKCF0aGlzWzBdKSB7XHJcbiAgICAgICAgY2xhc3NOYW1lcy5mb3JFYWNoKGNsYXNzTmFtZSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpXHJcbiAgICAgICAgfSlcclxuICAgICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG4gICAgdGhpcy5mb3JFYWNoKGVsID0+IHtcclxuICAgICAgICBjbGFzc05hbWVzLmZvckVhY2goY2xhc3NOYW1lID0+IHtcclxuICAgICAgICAgICAgZWwuY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpXHJcbiAgICAgICAgfSlcclxuICAgIH0pXHJcbiAgICByZXR1cm4gdGhpc1xyXG59XHJcblxyXG4vLyBtdXN0IGJlIHVzZWQgb24gYSBub2RlIGxpc3QsIGkuZS4gdGhlIHJldHVybiB2YWx1ZSBvZiBxdWVyeVNlbGVjdG9yQWxsXHJcbk9iamVjdC5wcm90b3R5cGUucmVtb3ZlQ2xhc3MgPSBmdW5jdGlvbiguLi5jbGFzc05hbWVzKSB7XHJcbiAgICBpZighdGhpc1swXSkge1xyXG4gICAgICAgIGNsYXNzTmFtZXMuZm9yRWFjaChjbGFzc05hbWUgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuICAgIHRoaXMuZm9yRWFjaChlbCA9PiB7XHJcbiAgICAgICAgY2xhc3NOYW1lcy5mb3JFYWNoKGNsYXNzTmFtZSA9PiB7XHJcbiAgICAgICAgICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKVxyXG4gICAgICAgIH0pXHJcbiAgICB9KVxyXG4gICAgcmV0dXJuIHRoaXNcclxufVxyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uIG1haW5GdW5jdGlvbigpIHtcclxuICAgIFwidXNlIHN0cmljdFwiXHJcblxyXG4gICAgcmVxdWlyZSgnLi9kb20tcXVlcnkuanMnKVxyXG4gICAgcmVxdWlyZSgnZG9tLXNsaWRlcicpXHJcbiAgICByZXF1aXJlKCdkb20tZmFkZXInKVxyXG4gICAgY29uc3QgZyA9IHJlcXVpcmUoJy4vcGFydGlhbHMvX2dsb2JhbHMnKVxyXG4gICAgY29uc3Qgcm91dGVyID0gcmVxdWlyZSgnLi9wYXJ0aWFscy9fcm91dGVyJylcclxuICAgIGNvbnN0IHBiID0gcmVxdWlyZSgnLi9wYXJ0aWFscy9fcGx1cy1idXR0b25zJylcclxuICAgIGNvbnN0IG1lbnUgPSByZXF1aXJlKCcuL3BhcnRpYWxzL19tZW51JylcclxuICAgIGNvbnN0IGZvcm0gPSByZXF1aXJlKCcuL3BhcnRpYWxzL19mb3JtJylcclxuICAgIGNvbnN0IHByZXZlbnRQb3BzdGF0ZVNjcm9sbCA9IHJlcXVpcmUoJ3ByZXZlbnQtcG9wc3RhdGUtc2Nyb2xsJylcclxuXHJcbiAgICB2YXIgc2V0dXAgPSB7XHJcbiAgICAgICAgaW5pdEFsbDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIC8vIExvYWQgaW5pdGlhbCBVUkxcclxuICAgICAgICAgICAgc2V0dXAudXJsUm91dGVyKClcclxuICAgICAgICAgICAgLy8gSW5pdGlhbGl6ZSBmdW5jdGlvbmFsaXR5IHRvIGNoYW5nZSBwYWdlIGNvbnRlbnQgYW5kIFVSTFxyXG4gICAgICAgICAgICAvLyB3aGVuIHVzZXIgY2xpY2sgb24gY2VydGFpbiBlbGVtZW50c1xyXG4gICAgICAgICAgICBzZXR1cC5jbGlja1JvdXRlcigpXHJcbiAgICAgICAgICAgIC8vIENoYW5nZSBwYWdlIGNvbnRlbnQgYW5kIFVSTCB3aGVuIGNsaWNrIGJyb3dzZXIncyBmb3J3YXJkIG9yIGJhY2sgYnV0dG9uc1xyXG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCBzZXR1cC51cmxSb3V0ZXIpXHJcbiAgICAgICAgICAgIC8vIHByZXZlbnQgYnJvd3NlciBmcm9tIHNjcm9sbGluZyB0byB0b3Agd2hlbiBvbnBvcHN0YXRlIGV2ZW50IGVtaXRzXHJcbiAgICAgICAgICAgIHByZXZlbnRQb3BzdGF0ZVNjcm9sbC5wcmV2ZW50KClcclxuICAgICAgICAgICAgLy8gc21vb3RoU2Nyb2xsIGluaXRpYWxpemF0aW9uXHJcbiAgICAgICAgICAgIHNldHVwLnNtb290aFNjcm9sbCgpXHJcbiAgICAgICAgICAgIC8vIENsaWNrIG9uIHBsdXMtYnV0dG9ucyBiZWZvcmUgdXNlciBwcmludHMsIHRvIHNob3cgY29udGVudFxyXG4gICAgICAgICAgICBzZXR1cC5wcmludFN0eWxlcygpXHJcbiAgICAgICAgICAgIC8vIENvbnRhY3QgZm9ybSBmdW5jdGlvbmFsaXR5XHJcbiAgICAgICAgICAgIGcuJGFwcGx5QnV0dG9ucy5mb3JFYWNoKGJ0biA9PiB7XHJcbiAgICAgICAgICAgICAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgICAgICAgICAgICAgICAgICBmb3JtLnNob3coKVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgJCgnI2FwcGx5LWNsb3NlJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmb3JtLmhpZGUpXHJcbiAgICAgICAgICAgIGcuJG92ZXJsYXkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGZvcm0uaGlkZSgpXHJcbiAgICAgICAgICAgICAgICBpZih3aW5kb3cuaW5uZXJXaWR0aCA8PSBnLm1vYmlsZU1lbnVXaWR0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKCQoJyNtZW51LWJ1dHRvbiBzcGFuJykudGV4dENvbnRlbnQgPT09ICdDTE9TRScpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWVudS5tb2JpbGVDbGljaygpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAkKCcjc3VibWl0LWFwcGx5JykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmb3JtLnNlbmQpO1xyXG4gICAgICAgICAgICAvLyBTZXR1cCBwbHVzIGJ1dHRvbnMgZnVuY3Rpb25hbGl0eVxyXG4gICAgICAgICAgICBnLiRwbHVzQnV0dG9ucy5mb3JFYWNoKGJ0biA9PiB7XHJcbiAgICAgICAgICAgICAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAodGhpcy5jbGFzc0xpc3QuY29udGFpbnMoJ29wZW5lZCcpKSA/IHBiLmNsb3NlKHRoaXMpOiBwYi5vcGVuKHRoaXMpXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAvLyBTZXR1cCBtb2JpbGUgbWVudVxyXG4gICAgICAgICAgICBpZiAod2luZG93LmlubmVyV2lkdGggPCBnLm1vYmlsZU1lbnVXaWR0aCkge1xyXG4gICAgICAgICAgICAgICAgJCgnI21lbnUtYnV0dG9uJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBtZW51Lm1vYmlsZUNsaWNrKVxyXG4gICAgICAgICAgICAgICAgJCgnI21lbnUtaXRlbXMgYScpLmZvckVhY2goaXRlbSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG1lbnUubW9iaWxlQ2xpY2spXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICB1cmxSb3V0ZXI6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpZiAobG9jYXRpb24uaGFzaCA9PT0gXCJcIikge1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQudGl0bGUgPSByb3V0ZXIucm91dGVzLmhvbWUudGl0bGVcclxuICAgICAgICAgICAgICAgIHJvdXRlci5sb2FkKHJvdXRlci5yb3V0ZXMuaG9tZSlcclxuICAgICAgICAgICAgICAgIGhpc3RvcnkucmVwbGFjZVN0YXRlKFxyXG4gICAgICAgICAgICAgICAgICAgIHJvdXRlci5yb3V0ZXMuaG9tZSxcclxuICAgICAgICAgICAgICAgICAgICByb3V0ZXIucm91dGVzLmhvbWUucGF0aCxcclxuICAgICAgICAgICAgICAgICAgICBcIiMvXCIgKyByb3V0ZXIucm91dGVzLmhvbWUucGF0aFxyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZm9yKGxldCByb3V0ZSBpbiByb3V0ZXIucm91dGVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYobG9jYXRpb24uaGFzaC5zbGljZSgyKSA9PSByb3V0ZXIucm91dGVzW3JvdXRlXS5wYXRoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvdXRlci5sb2FkKHJvdXRlci5yb3V0ZXNbcm91dGVdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGNsaWNrUm91dGVyOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgZm9yKGxldCByb3V0ZSBpbiByb3V0ZXIucm91dGVzKSB7XHJcbiAgICAgICAgICAgICAgICBpZihyb3V0ZSA9PT0gJ2hvbWUnKSBjb250aW51ZVxyXG4gICAgICAgICAgICAgICAgaWYocm91dGVyLnJvdXRlcy5oYXNPd25Qcm9wZXJ0eShyb3V0ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKFwiLmNhcmQuXCIgKyByb3V0ZXIucm91dGVzW3JvdXRlXVsnY2xhc3MnXSkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByb3V0ZXIubG9hZEFuZFB1c2hTdGF0ZShyb3V0ZXIucm91dGVzW3JvdXRlXSlcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGcuJGhvbWVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgICAgICAgICByb3V0ZXIubG9hZEFuZFB1c2hTdGF0ZShyb3V0ZXIucm91dGVzLmhvbWUpXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSxcclxuICAgICAgICBzbW9vdGhTY3JvbGw6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAkKCdhLnNtb290aFNjcm9sbCcpLmZvckVhY2goYW5jaG9yID0+IHtcclxuICAgICAgICAgICAgICAgIGFuY2hvci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRlc3QgPSAkKCBhbmNob3IuZ2V0QXR0cmlidXRlKCdocmVmJykgKVxyXG4gICAgICAgICAgICAgICAgICAgIHplbnNjcm9sbC50byhkZXN0LCA0MDAsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBidG4gPSBkZXN0LnF1ZXJ5U2VsZWN0b3IoJy5wbHVzLWJ1dHRvbicpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGJ0biAmJiAhYnRuLmNsYXNzTGlzdC5jb250YWlucygnb3BlbmVkJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ0bi5jbGljaygpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9LFxyXG4gICAgICAgIHByaW50U3R5bGVzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgZnVuY3Rpb24gc2hvd0NvbnRlbnQoKSB7XHJcbiAgICAgICAgICAgICAgICAkKCcucGx1cy1idXR0b246bm90KC5vcGVuZWQpJykuZm9yRWFjaChidG4gPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGJ0bi5jbGljaygpXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBoaWRlQ29udGVudCgpIHtcclxuICAgICAgICAgICAgICAgICQoJy5wbHVzLWJ1dHRvbi5vcGVuZWQnKS5mb3JFYWNoKGJ0biA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnRuLmNsaWNrKClcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHdpbmRvdy5vbmJlZm9yZXByaW50ID0gc2hvd0NvbnRlbnRcclxuICAgICAgICAgICAgd2luZG93Lm9uYWZ0ZXJwcmludCA9IGhpZGVDb250ZW50XHJcblxyXG4gICAgICAgICAgICB2YXIgbWVkaWFRdWVyeUxpc3QgPSB3aW5kb3cubWF0Y2hNZWRpYSgncHJpbnQnKTtcclxuICAgICAgICAgICAgbWVkaWFRdWVyeUxpc3QuYWRkTGlzdGVuZXIoZnVuY3Rpb24obXFsKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobXFsLm1hdGNoZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBzaG93Q29udGVudCgpXHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChoaWRlQ29udGVudCwgNTAwKVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNldHVwLmluaXRBbGwoKVxyXG59KSgpXHJcbiIsImltcG9ydCAnd2hhdHdnLWZldGNoJztcclxuKGZ1bmN0aW9uIF9mb3JtKCkge1xyXG4gICAgY29uc3QgZyA9IHJlcXVpcmUoJy4vX2dsb2JhbHMnKTtcclxuXHJcbiAgICBsZXQgJG1lc3NhZ2UgPSAkKCcjc2VudC1tZXNzYWdlJylcclxuXHJcbiAgICBmdW5jdGlvbiBzaG93KCkge1xyXG4gICAgICAgIGcuJG92ZXJsYXkuZmFkZUluKClcclxuICAgICAgICBnLiRhcHBseVBvcFVwLmZhZGVJbigpXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gaGlkZSgpIHtcclxuICAgICAgICBnLiRvdmVybGF5LmZhZGVPdXQoKVxyXG4gICAgICAgIGcuJGFwcGx5UG9wVXAuZmFkZU91dCgpXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gYnVpbGRGb3JtRGF0YSgpe1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGZuYW1lOiAkKFwiI2Zvcm0tZnVsbF9uYW1lXCIpLnZhbHVlLnNwbGl0KFwiIFwiKVswXSxcclxuICAgICAgICBsbmFtZTogJChcIiNmb3JtLWZ1bGxfbmFtZVwiKS52YWx1ZS5zcGxpdChcIiBcIikuc2xpY2UoMSkuam9pbihcIiBcIiksXHJcbiAgICAgICAgZW1haWw6ICQoXCIjZm9ybS1lbWFpbFwiKS52YWx1ZSxcclxuICAgICAgICBwaG9uZTogJChcIiNmb3JtLWRheV9waG9uZVwiKS52YWx1ZVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiByZXNldEZvcm0oKXtcclxuICAgICAgJChcIiNmb3JtLWZ1bGxfbmFtZVwiKS52YWx1ZT1cIlwiO1xyXG4gICAgICAkKFwiI2Zvcm0tZW1haWxcIikudmFsdWU9XCJcIjtcclxuICAgICAgJChcIiNmb3JtLWRheV9waG9uZVwiKS52YWx1ZT1cIlwiXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gc2VuZEZvcm0oKSB7XHJcbiAgICAgIHZhciBkYXRhID0gYnVpbGRGb3JtRGF0YSgpO1xyXG4gICAgICBpZiAoIWRhdGEgfHwgIWRhdGEuZm5hbWUgfHwgIWRhdGEubG5hbWUpIHtcclxuICAgICAgICBhbGVydCAoXCJQbGVhc2UgaW5wdXQgeW91ciBmdWxsIG5hbWVcIik7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICghIGRhdGEuZW1haWwpe1xyXG4gICAgICAgIGFsZXJ0IChcIlBsZWFzZSBpbnB1dCB5b3VyIGVtYWlsXCIpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICBpZiAoISBkYXRhLnBob25lKXtcclxuICAgICAgICBhbGVydCAoXCJQbGVhc2UgaW5wdXQgeW91ciBwaG9uZSBudW1iZXJcIik7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIGZldGNoKCdodHRwOi8vZnZpLWdyYWQuY29tOjQwMDQvc3VibWl0dGVjaGZ2aWZvcm0nLCB7XHJcbiAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZGF0YSksXHJcbiAgICAgIH0pXHJcbiAgICAgIC50aGVuKHJlcz0+e1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XHJcbiAgICAgICAgaWYgKHJlcy5zdGF0dXMgIT0gMjAwKXtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ2F1Z2h0IGJhZCByZXNwb25zZVwiKTtcclxuICAgICAgICAgIHRocm93IHttZXNzYWdlOiAnQmFkIHJlc3BvbnNlIGZyb20gc2VydmVyOiAnK3Jlcy5zdGF0dXMsIHNlcnZlclJlczogcmVzfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgJChcIi5mb3JtXCIpLmZhZGVPdXQoKTtcclxuICAgICAgICAkbWVzc2FnZS5mYWRlSW4oKVxyXG4gICAgICAgIGNvbnNvbGUubG9nKFwibWFkZSBpdCBoZXJlXCIpO1xyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJlc2V0Rm9ybSgpXHJcbiAgICAgICAgfSwgMzAwKTtcclxuICAgICAgfSlcclxuICAgICAgLmNhdGNoKGVycj0+e1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiRW50ZXJpbmcgY2F0Y2ggY2xhdXNlXCIpO1xyXG4gICAgICAgIGlmICh0eXBlb2YgZXJyID09PSAnb2JqZWN0JylcclxuICAgICAgICAgIGFsZXJ0KEpTT04uc3RyaW5naWZ5KGVycikpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGVycik7XHJcbiAgICAgIH0pXHJcblxyXG4gICAgfVxyXG5cclxuICAgIG1vZHVsZS5leHBvcnRzLnNob3cgPSBzaG93O1xyXG4gICAgbW9kdWxlLmV4cG9ydHMuaGlkZSA9IGhpZGU7XHJcbiAgICBtb2R1bGUuZXhwb3J0cy5zZW5kID0gc2VuZEZvcm07XHJcbn0pKClcclxuIiwiKGZ1bmN0aW9uIF9nbG9iYWxzKCkge1xyXG4gICAgY29uc3QgJG92ZXJsYXkgPSAkKCcjb3ZlcmxheScpXHJcbiAgICBjb25zdCAkY2FyZHMgPSAkKCdsYWJlbC5jYXJkJylcclxuICAgIGNvbnN0ICRhcHBseVBvcFVwID0gJCgnI2FwcGx5LXBvcC11cCcpXHJcbiAgICBjb25zdCAkYXBwbHlGb3JtID0gJGFwcGx5UG9wVXAucXVlcnlTZWxlY3RvckFsbCgnLmZvcm0nKVxyXG4gICAgY29uc3QgJGFwcGx5QnV0dG9ucyA9ICQoJyNuYXYtYXBwbHktYnRuLCAjY3RhLWFwcGx5LWJ0biwgI2NvbnRhY3QtaG9tZSwgLnJlcXVlc3QtaW5mbycpXHJcbiAgICBjb25zdCAkcGFnZXNDb250YWluZXIgPSAkKCcjcGFnZXMtY29udGFpbmVyJylcclxuICAgIGNvbnN0ICRob21lQnV0dG9uID0gJCgnI2hvbWUtYnV0dG9uJylcclxuICAgIGNvbnN0ICRtZW51SXRlbXMgPSAkKCcjbWVudS1pdGVtcycpXHJcbiAgICBjb25zdCAkbmF2SXRlbXMgPSAkKCdhLm5hdi1pdGVtJylcclxuICAgIGNvbnN0ICRzZWN0aW9ucyA9ICRwYWdlc0NvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCdzZWN0aW9uJylcclxuICAgIGNvbnN0ICRiYW5uZXJzID0gJCgnLmJhbm5lcicpXHJcbiAgICBjb25zdCAkcGx1c0J1dHRvbnMgPSAkKCdzcGFuLnBsdXMtYnV0dG9uJylcclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cy5tb2JpbGVNZW51V2lkdGggPSAnOTYwJ1xyXG4gICAgbW9kdWxlLmV4cG9ydHMudG9wUGFkZGluZyA9ICh3aW5kb3cuaW5uZXJXaWR0aCA+PSAnOTYwJykgPyA1MiA6IDBcclxuICAgIG1vZHVsZS5leHBvcnRzLiRvdmVybGF5ID0gJG92ZXJsYXlcclxuICAgIG1vZHVsZS5leHBvcnRzLiRjYXJkcyA9ICRjYXJkc1xyXG4gICAgbW9kdWxlLmV4cG9ydHMuJGFwcGx5UG9wVXAgPSAkYXBwbHlQb3BVcFxyXG4gICAgbW9kdWxlLmV4cG9ydHMuJGFwcGx5Rm9ybSA9ICRhcHBseUZvcm1cclxuICAgIG1vZHVsZS5leHBvcnRzLiRhcHBseUJ1dHRvbnMgPSAkYXBwbHlCdXR0b25zXHJcbiAgICBtb2R1bGUuZXhwb3J0cy4kcGFnZXNDb250YWluZXIgPSAkcGFnZXNDb250YWluZXJcclxuICAgIG1vZHVsZS5leHBvcnRzLiRob21lQnV0dG9uID0gJGhvbWVCdXR0b25cclxuICAgIG1vZHVsZS5leHBvcnRzLiRtZW51SXRlbXMgPSAkbWVudUl0ZW1zXHJcbiAgICBtb2R1bGUuZXhwb3J0cy4kbmF2SXRlbXMgPSAkbmF2SXRlbXNcclxuICAgIG1vZHVsZS5leHBvcnRzLiRzZWN0aW9ucyA9ICRzZWN0aW9uc1xyXG4gICAgbW9kdWxlLmV4cG9ydHMuJGJhbm5lcnMgPSAkYmFubmVyc1xyXG4gICAgbW9kdWxlLmV4cG9ydHMuJHBsdXNCdXR0b25zID0gJHBsdXNCdXR0b25zXHJcbn0pKClcclxuIiwiKGZ1bmN0aW9uIF9tZW51KCkge1xyXG4gICAgY29uc3QgZyA9IHJlcXVpcmUoJy4vX2dsb2JhbHMnKVxyXG5cclxuICAgIGZ1bmN0aW9uIG5hdkl0ZW1zU3R5bGUobmF2SXRlbXMsIGJhbm5lcnMsIGxhbmRpbmcpIHtcclxuICAgICAgICAvLyBpZiB3aW5kb3cgc2Nyb2xsIHBvc2l0aW9uIGlzIGJldHdlZW4gYSBiYW5uZXIsIGFkZCBuYXYgc3R5bGUgdG8gY29ycmVzcG9uZGluZyBuYXYgaXRlbVxyXG4gICAgICAgIGlmIChsYW5kaW5nLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmJvdHRvbSA8ICctMjQnKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwLCB5ID0gYmFubmVycy5sZW5ndGg7IGogPCB5OyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChiYW5uZXJzW2pdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCA8PSBnLnRvcFBhZGRpbmcgKyAxICYmIChiYW5uZXJzW2pdLm5leHRTaWJsaW5nLm5leHRTaWJsaW5nLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmJvdHRvbSA+IGcudG9wUGFkZGluZyB8fCBiYW5uZXJzW2pdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmJvdHRvbSA+IGcudG9wUGFkZGluZykpIHtcclxuICAgICAgICAgICAgICAgICAgICBuYXZJdGVtc1tqXS5jbGFzc0xpc3QuYWRkKCdzZWN0aW9uLWluLXZpZXcnKVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBuYXZJdGVtc1tqXS5jbGFzc0xpc3QucmVtb3ZlKCdzZWN0aW9uLWluLXZpZXcnKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZy4kbmF2SXRlbXMucmVtb3ZlQ2xhc3MoJ3NlY3Rpb24taW4tdmlldycpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIG1vYmlsZUNsaWNrKCkge1xyXG4gICAgICAgIGNvbnN0ICRtZW51QnV0dG9uID0gJCgnI21lbnUtYnV0dG9uIHNwYW4nKVxyXG4gICAgICAgIGlmICgkbWVudUJ1dHRvbi50ZXh0Q29udGVudCA9PT0gJ01FTlUnKSB7XHJcbiAgICAgICAgICAgIGcuJG1lbnVJdGVtcy5zbGlkZURvd24oKVxyXG4gICAgICAgICAgICAkbWVudUJ1dHRvbi50ZXh0Q29udGVudCA9ICdDTE9TRSdcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBnLiRtZW51SXRlbXMuc2xpZGVVcCgpXHJcbiAgICAgICAgICAgICRtZW51QnV0dG9uLnRleHRDb250ZW50ID0gJ01FTlUnXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG1vZHVsZS5leHBvcnRzLm5hdkl0ZW1zU3R5bGUgPSBuYXZJdGVtc1N0eWxlXHJcbiAgICBtb2R1bGUuZXhwb3J0cy5tb2JpbGVDbGljayA9IG1vYmlsZUNsaWNrXHJcbn0pKClcclxuIiwiKGZ1bmN0aW9uIF9wbHVzQnV0dG9ucygpIHtcclxuICAgIGNvbnN0IGcgPSByZXF1aXJlKCcuL19nbG9iYWxzJylcclxuXHJcbiAgICBmdW5jdGlvbiBvcGVuKCRidXR0b24pIHtcclxuICAgICAgICBjb25zdCAkYmFubmVyID0gJGJ1dHRvbi5wYXJlbnROb2RlXHJcbiAgICAgICAgJGJ1dHRvbi5hZGRDbGFzcygnb3BlbmVkJylcclxuICAgICAgICAkYmFubmVyLmFkZENsYXNzKCdzaHJpbmsnKVxyXG4gICAgICAgICRiYW5uZXIubmV4dFNpYmxpbmcubmV4dFNpYmxpbmcuc2xpZGVEb3duKDYwMClcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjbG9zZSgkYnV0dG9uKSB7XHJcbiAgICAgICAgY29uc3QgJGJhbm5lciA9ICRidXR0b24ucGFyZW50Tm9kZVxyXG4gICAgICAgIHplbnNjcm9sbC50bygkYmFubmVyLCAzMDApXHJcbiAgICAgICAgJGJ1dHRvbi5yZW1vdmVDbGFzcygnb3BlbmVkJylcclxuICAgICAgICAkYnV0dG9uLnN0eWxlLnRvcCA9ICcwcHgnXHJcbiAgICAgICAgJGJ1dHRvbi5zdHlsZS50cmFuc2l0aW9uID0gJ2FsbCAwLjZzJ1xyXG4gICAgICAgICRiYW5uZXIucmVtb3ZlQ2xhc3MoJ3NocmluaycpXHJcbiAgICAgICAgJGJhbm5lci5uZXh0U2libGluZy5uZXh0U2libGluZy5zbGlkZVVwKDYwMClcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBmaXhlZCgpIHtcclxuICAgICAgICAvLyBib3R0b21QYWRkaW5nIGlzIHRoZSBib3R0b20gb2YgdGhlIGNvbnRlbnQsIHBsdXMgbmF2IGhlaWdodCBhbmQgYnV0dG9uIHRyYW5zbGF0ZVlcclxuICAgICAgICBsZXQgYm90dG9tUGFkZGluZyA9ICh3aW5kb3cuaW5uZXJXaWR0aCA+PSBnLm1vYmlsZU1lbnVXaWR0aCkgPyAnOTYnIDogJzQ1J1xyXG4gICAgICAgIGxldCAkb3BlbkJ1dHRvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucGx1cy1idXR0b24ub3BlbmVkJylcclxuICAgICAgICAkb3BlbkJ1dHRvbnMuZm9yRWFjaChidG4gPT4ge1xyXG4gICAgICAgICAgICBsZXQgY29udGVudFBvc2l0aW9uID0gYnRuLnBhcmVudE5vZGUubmV4dFNpYmxpbmcubmV4dFNpYmxpbmcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcclxuICAgICAgICAgICAgaWYgKGNvbnRlbnRQb3NpdGlvbi50b3AgPD0gU3RyaW5nKGcudG9wUGFkZGluZykgJiYgY29udGVudFBvc2l0aW9uLmJvdHRvbSA+PSBib3R0b21QYWRkaW5nKSB7XHJcbiAgICAgICAgICAgICAgICBidG4uc3R5bGUudG9wID0gKC0oY29udGVudFBvc2l0aW9uLnRvcCkgKyBnLnRvcFBhZGRpbmcpICsgJ3B4J1xyXG4gICAgICAgICAgICAgICAgYnRuLnN0eWxlLnRyYW5zaXRpb24gPSAnMHMnXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBidG4uc3R5bGUudG9wID0gJzBweCdcclxuICAgICAgICAgICAgICAgIGJ0bi5zdHlsZS50cmFuc2l0aW9uID0gJzBzJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cy5vcGVuID0gb3BlblxyXG4gICAgbW9kdWxlLmV4cG9ydHMuY2xvc2UgPSBjbG9zZVxyXG4gICAgbW9kdWxlLmV4cG9ydHMuZml4ZWQgPSBmaXhlZFxyXG59KSgpXHJcbiIsIihmdW5jdGlvbiBfcm91dGVyKCkge1xyXG4gICAgY29uc3QgZyA9IHJlcXVpcmUoJy4vX2dsb2JhbHMnKVxyXG4gICAgY29uc3QgcGIgPSByZXF1aXJlKCcuL19wbHVzLWJ1dHRvbnMnKVxyXG4gICAgY29uc3QgbWVudSA9IHJlcXVpcmUoJy4vX21lbnUnKVxyXG4gICAgbGV0ICRkb3duQXJyb3dzID0gJCgnYS5hcnJvdy1kb3duJylcclxuXHJcbiAgICBjb25zdCByb3V0ZXMgPSB7XHJcbiAgICAgICAgaG9tZToge1xyXG4gICAgICAgICAgICBwYXRoOiAnaG9tZScsXHJcbiAgICAgICAgICAgIHRpdGxlOiAnTGVhcm4gdG8gQ29kZSBhdCB0aGUgRmxvcmlkYSBWb2NhdGlvbmFsIEluc3RpdHV0ZSAtIEV2ZW5pbmcgQ29kaW5nIEJvb3RjYW1wJyxcclxuICAgICAgICAgICAgY2xhc3M6ICdob21lJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgd2ViZGV2OiB7XHJcbiAgICAgICAgICAgIHBhdGg6ICd3ZWItZGV2ZWxvcGVyLXByb2dyYW0nLFxyXG4gICAgICAgICAgICB0aXRsZTogJ1dlYiBEZXZlbG9wZXIgRXZlbmluZyBCb290Y2FtcCBieSBUaGUgRmxvcmlkYSBWb2NhdGlvbmFsIEluc3RpdHV0ZScsXHJcbiAgICAgICAgICAgIGNsYXNzOiAnd2ViZGV2J1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY3liZXI6IHtcclxuICAgICAgICAgICAgcGF0aDogJ25ldHdvcmstYWRtaW5pc3RyYXRvci1wcm9ncmFtJyxcclxuICAgICAgICAgICAgdGl0bGU6ICdOZXR3b3JrIEFkbWluaXN0cmF0b3IgRXZlbmluZyBCb290Y2FtcCBieSBUaGUgRmxvcmlkYSBWb2NhdGlvbmFsIEluc3RpdHV0ZScsXHJcbiAgICAgICAgICAgIGNsYXNzOiAnY3liZXInXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIF9zY3JvbGxIYW5kbGVyRGVza3RvcCgkYXJyb3dzLCBpdGVtcywgc2VjdGlvbkJhbm5lcnMsIGxhbmRpbmdQYWdlKSB7XHJcbiAgICAgICAgcGIuZml4ZWQoKVxyXG4gICAgICAgIGlmKHdpbmRvdy5zY3JvbGxZID4gJzIwJykge1xyXG4gICAgICAgICAgJGFycm93cy5mb3JFYWNoKGEgPT4gYS5mYWRlT3V0KDIwMCkpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgJGFycm93cy5mb3JFYWNoKGEgPT4gYS5mYWRlSW4oMjAwKSlcclxuICAgICAgICB9XHJcbiAgICAgICAgbWVudS5uYXZJdGVtc1N0eWxlKGl0ZW1zLCBzZWN0aW9uQmFubmVycywgbGFuZGluZ1BhZ2UpXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gX3Njcm9sbEhhbmRsZXJNb2JpbGUoJGFycm93cykge1xyXG4gICAgICAgIHBiLmZpeGVkKClcclxuICAgICAgICBpZih3aW5kb3cuc2Nyb2xsWSA+ICcyMCcpIHtcclxuICAgICAgICAgICRhcnJvd3MuZm9yRWFjaChhID0+IGEuZmFkZU91dCgyMDApKVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICRhcnJvd3MuZm9yRWFjaChhID0+IGEuZmFkZUluKDIwMCkpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHVwZGF0ZUNvbnRlbnQocGFnZUNsYXNzKSB7XHJcbiAgICAgICAgLy8gcmVzZXQgdG8gZGVmYXVsdHNcclxuICAgICAgICAkKCdodG1sJykuc3R5bGUub3BhY2l0eSA9ICcwJ1xyXG4gICAgICAgIGcuJG5hdkl0ZW1zLnJlbW92ZUNsYXNzKCdzZWN0aW9uLWluLXZpZXcnKVxyXG4gICAgICAgIGcuJG92ZXJsYXkuZmFkZU91dCgpXHJcbiAgICAgICAgZy4kYXBwbHlQb3BVcC5mYWRlT3V0KClcclxuICAgICAgICBpZih3aW5kb3cuaW5uZXJXaWR0aCA8PSBnLm1vYmlsZU1lbnVXaWR0aCkge1xyXG4gICAgICAgICAgICBnLiRtZW51SXRlbXMuc2xpZGVVcCgxMClcclxuICAgICAgICB9XHJcbiAgICAgICAgJCgnLnBsdXMtYnV0dG9uLm9wZW5lZCcpLmZvckVhY2goYnRuID0+IHtcclxuICAgICAgICAgICAgYnRuLnN0eWxlLnRvcCA9ICcwcHgnXHJcbiAgICAgICAgICAgIGJ0bi5zdHlsZS50cmFuc2l0aW9uID0gJy42cydcclxuICAgICAgICAgICAgYnRuLnJlbW92ZUNsYXNzKCdvcGVuZWQnKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgJCgnLmJhbm5lcicpLnJlbW92ZUNsYXNzKCdzaHJpbmsnKVxyXG4gICAgICAgICQoJy5jb250ZW50LWNvbnRhaW5lcicpLmZvckVhY2goYyA9PiBjLnNsaWRlVXAoMTApKVxyXG4gICAgICAgIGcuJG5hdkl0ZW1zLnJlbW92ZUNsYXNzKCdzZWN0aW9uLWluLXZpZXcnKVxyXG4gICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBzY3JvbGxIYW5kbGVyQm9keSlcclxuICAgICAgICB3aW5kb3cuc2Nyb2xsVG8oMCwgMClcclxuXHJcbiAgICAgICAgJCgnI3JhZGlvLScgKyBwYWdlQ2xhc3MpLmNoZWNrZWQgPSB0cnVlXHJcbiAgICAgICAgaWYocGFnZUNsYXNzID09PSBcImhvbWVcIikge1xyXG4gICAgICAgICAgJCgnI21lbnUnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXHJcbiAgICAgICAgICAkKCcjc2VjdGlvbnMtY29udGFpbmVyJykuc2xpZGVVcCgxMClcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICQoJyNtZW51Jykuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcclxuICAgICAgICAgICAgJCgnI3NlY3Rpb25zLWNvbnRhaW5lcicpLnNsaWRlRG93bigxMClcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBuYXZJdGVtcyA9ICQoJ2EubmF2LWl0ZW0uJyArIHBhZ2VDbGFzcylcclxuICAgICAgICB2YXIgYmFubmVycyA9ICQoJy5iYW5uZXIuJyArIHBhZ2VDbGFzcylcclxuICAgICAgICB2YXIgbGFuZGluZyA9ICQoJyNwYWdlXycgKyBwYWdlQ2xhc3MpXHJcblxyXG4gICAgICAgIC8vIG9uIHNjcm9sbCwgZml4IHBsdXMtYnV0dG9ucyB0byBzY3JlZW4gYW5kIGFkZCBuYXYgc3R5bGVzXHJcbiAgICAgICAgdmFyIHNjcm9sbEhhbmRsZXJCb2R5ID0gKHdpbmRvdy5pbm5lcldpZHRoID49IGcubW9iaWxlTWVudVdpZHRoKSA/IF9zY3JvbGxIYW5kbGVyRGVza3RvcCA6IF9zY3JvbGxIYW5kbGVyTW9iaWxlXHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIGZ1bmN0aW9uIHNjcm9sbEhhbmRsZXIoKSB7XHJcbiAgICAgICAgICAgIHNjcm9sbEhhbmRsZXJCb2R5KCRkb3duQXJyb3dzLCBuYXZJdGVtcywgYmFubmVycywgbGFuZGluZylcclxuICAgICAgICB9KVxyXG4gICAgICAgICQoJ2h0bWwnKS5zdHlsZS5vcGFjaXR5ID0gJzEnXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gX2NyZWF0ZXJSb3V0ZUxvYWRlcihwdXNoU3RhdGUpIHtcclxuICAgICAgICBmdW5jdGlvbiBsb2FkZXIocm91dGUpIHtcclxuICAgICAgICAgICAgZG9jdW1lbnQudGl0bGUgPSByb3V0ZS50aXRsZVxyXG4gICAgICAgICAgICB1cGRhdGVDb250ZW50KHJvdXRlLmNsYXNzKVxyXG4gICAgICAgICAgICBpZihwdXNoU3RhdGUpIHtoaXN0b3J5LnB1c2hTdGF0ZShyb3V0ZSwgcm91dGUucGF0aCwgXCIjL1wiICsgcm91dGUucGF0aCl9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBsb2FkZXJcclxuICAgIH1cclxuXHJcbiAgICBsZXQgbG9hZCA9IF9jcmVhdGVyUm91dGVMb2FkZXIoZmFsc2UpXHJcbiAgICBsZXQgbG9hZEFuZFB1c2hTdGF0ZSA9IF9jcmVhdGVyUm91dGVMb2FkZXIodHJ1ZSlcclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cy5yb3V0ZXMgPSByb3V0ZXNcclxuICAgIG1vZHVsZS5leHBvcnRzLmxvYWQgPSBsb2FkXHJcbiAgICBtb2R1bGUuZXhwb3J0cy5sb2FkQW5kUHVzaFN0YXRlID0gbG9hZEFuZFB1c2hTdGF0ZVxyXG4gICAgbW9kdWxlLmV4cG9ydHMudXBkYXRlQ29udGVudCA9IHVwZGF0ZUNvbnRlbnRcclxufSkoKVxyXG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIFNhdmUgdGhlIGRpc3BsYXkgdmFsdWVzIG9mIG5ldyBlbGVtZW50cyBiZWZvcmUgZmFkaW5nIG91dCxcbi8vIHNvIHRoYXQgZmFkZUluIHdpbGwgZ28gYmFjayB0byB0aGUgb3JpZ2luYWwgZGlzcGxheSB2YWx1ZVxudmFyIENTU3ZhbHVlcyA9IHt9O1xuXG5mdW5jdGlvbiBmYWRlKGVsZW1lbnQsIF9zcGVlZCwgZGlyZWN0aW9uLCBlYXNpbmcpIHtcbiAgICAvLyBhYm9ydCBmYWRpbmcgaWYgaXMgYWxyZWFkeSBmYWRpbmcgaW4gb3Igb3V0XG4gICAgaWYgKGVsZW1lbnQuZGF0YXNldC5mYWRpbmcpIHJldHVybiBmYWxzZTtcblxuICAgIGVsZW1lbnQuZGF0YXNldC5mYWRpbmcgPSB0cnVlO1xuXG4gICAgdmFyIHMgPSBlbGVtZW50LnN0eWxlO1xuICAgIHZhciBzYXZlZFZhbHVlcyA9IENTU3ZhbHVlc1tlbGVtZW50LmRhdGFzZXQuZG9tRmFkZXJJZF07XG4gICAgdmFyIHRoaXNEaXNwbGF5ID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCkuZ2V0UHJvcGVydHlWYWx1ZSgnZGlzcGxheScpO1xuICAgIHZhciB0aGlzT3BhY2l0eSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpLmdldFByb3BlcnR5VmFsdWUoJ29wYWNpdHknKTtcbiAgICB2YXIgc3BlZWQgPSBfc3BlZWQgPyBfc3BlZWQgOiBfc3BlZWQgPT09IDAgPyAwIDogMzAwO1xuXG4gICAgaWYgKCFlbGVtZW50LmRhdGFzZXQuZG9tRmFkZXJJZCkge1xuICAgICAgICB2YXIgaWQgPSBNYXRoLnJhbmRvbSgpO1xuICAgICAgICBlbGVtZW50LmRhdGFzZXQuZG9tRmFkZXJJZCA9IGlkO1xuICAgICAgICBDU1N2YWx1ZXNbaWRdID0ge1xuICAgICAgICAgICAgZGlzcGxheTogdGhpc0Rpc3BsYXkgPT09ICdub25lJyA/ICdibG9jaycgOiB0aGlzRGlzcGxheSxcbiAgICAgICAgICAgIG9wYWNpdHk6IHRoaXNPcGFjaXR5ID09PSAnMCcgPyAnMScgOiB0aGlzT3BhY2l0eVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8vIGFkZC9yZW1vdmUgdGhlIHN0eWxlcyB0aGF0IHdpbGwgYW5pbWF0ZSB0aGUgZWxlbWVudFxuICAgIGlmIChkaXJlY3Rpb24gPT09ICdpbicpIHtcbiAgICAgICAgcy5vcGFjaXR5ID0gJzAnO1xuICAgICAgICBzLmRpc3BsYXkgPSBzYXZlZFZhbHVlcyA/IHNhdmVkVmFsdWVzLmRpc3BsYXkgOiAnYmxvY2snO1xuICAgICAgICBzLnRyYW5zaXRpb24gPSAnb3BhY2l0eSAnICsgc3BlZWQgKyAnbXMgJyArIChlYXNpbmcgfHwgJycpO1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBzLm9wYWNpdHkgPSBzYXZlZFZhbHVlcyA/IHNhdmVkVmFsdWVzLm9wYWNpdHkgOiAnMSc7XG4gICAgICAgIH0sIDEwKTtcbiAgICB9XG4gICAgaWYgKGRpcmVjdGlvbiA9PT0gJ291dCcpIHtcbiAgICAgICAgcy50cmFuc2l0aW9uID0gJ29wYWNpdHkgJyArIHNwZWVkICsgJ21zICcgKyAoZWFzaW5nIHx8ICcnKTtcbiAgICAgICAgcy5vcGFjaXR5ID0gJzAnO1xuICAgIH1cblxuICAgIC8vIHJlbW92ZSB0ZW1wIHN0eWxlcywgYWRkIERPTS1mYWRlci1oaWRkZW4gY2xhc3MsIGFuZCByZXR1cm4gdGhlIGVsZW1lbnRcbiAgICB2YXIgZG9uZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgnc3R5bGUnKTtcbiAgICAgICAgICAgIGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCdkYXRhLWZhZGluZycpO1xuICAgICAgICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gJ2luJykge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnRE9NLWZhZGVyLWhpZGRlbicpO1xuICAgICAgICAgICAgICAgIHMuZGlzcGxheSA9IHNhdmVkVmFsdWVzID8gc2F2ZWRWYWx1ZXMuZGlzcGxheSA6ICdibG9jayc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZGlyZWN0aW9uID09PSAnb3V0JykgZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdET00tZmFkZXItaGlkZGVuJyk7XG4gICAgICAgICAgICByZXNvbHZlKGVsZW1lbnQpO1xuICAgICAgICB9LCBzcGVlZCk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZG9uZTtcbn1cblxuKGZ1bmN0aW9uIERPTWZhZGVySW5pdCgpIHtcbiAgICB2YXIgc2hlZXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgIHNoZWV0LmlkID0gJ2ZhZGVDU1NTdHlsZXMnO1xuICAgIHNoZWV0LmlubmVySFRNTCA9ICdcXG4gICAgICAgIC5ET00tZmFkZXItaGlkZGVuIHtcXG4gICAgICAgICAgICBkaXNwbGF5OiBub25lO1xcbiAgICAgICAgfVxcbiAgICAnO1xuICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc2hlZXQpO1xuXG4gICAgT2JqZWN0LnByb3RvdHlwZS5mYWRlSW4gPSBmdW5jdGlvbiAoX3NwZWVkLCBlYXNpbmcpIHtcbiAgICAgICAgcmV0dXJuIGZhZGUodGhpcywgX3NwZWVkLCAnaW4nLCBlYXNpbmcpO1xuICAgIH07XG5cbiAgICBPYmplY3QucHJvdG90eXBlLmZhZGVPdXQgPSBmdW5jdGlvbiAoX3NwZWVkLCBlYXNpbmcpIHtcbiAgICAgICAgcmV0dXJuIGZhZGUodGhpcywgX3NwZWVkLCAnb3V0JywgZWFzaW5nKTtcbiAgICB9O1xuXG4gICAgT2JqZWN0LnByb3RvdHlwZS5mYWRlVG9nZ2xlID0gZnVuY3Rpb24gKF9zcGVlZCwgZWFzaW5nKSB7XG4gICAgICAgIGlmICh0aGlzLmNsYXNzTGlzdC5jb250YWlucygnRE9NLWZhZGVyLWhpZGRlbicpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFkZSh0aGlzLCBfc3BlZWQsICdpbicsIGVhc2luZyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFkZSh0aGlzLCBfc3BlZWQsICdvdXQnLCBlYXNpbmcpO1xuICAgICAgICB9XG4gICAgfTtcbn0pKCk7XG4iLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIHNsaWRlKGVsZW1lbnQsIF9zcGVlZCwgZGlyZWN0aW9uLCBlYXNpbmcpIHtcbiAgICAvLyBwcmV2ZW50IHVzZXIgZnJvbSBzbGlkaW5nIGRvd24gaWYgYWxyZWFkeSBzbGlkaW5nXG4gICAgaWYgKGRpcmVjdGlvbiA9PT0gJ2Rvd24nICYmIChlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnc2V0SGVpZ2h0JykgfHwgIWVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdET00tc2xpZGVyLWhpZGRlbicpKSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgLy8gcHJldmVudCB1c2VyIGZyb20gc2xpZGluZyB1cCBpZiBhbHJlYWR5IHNsaWRpbmdcbiAgICBpZiAoZGlyZWN0aW9uID09PSAndXAnICYmIChlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnRE9NLXNsaWRlci1oaWRkZW4nKSB8fCBlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnc2V0SGVpZ2h0JykpKSByZXR1cm4gZmFsc2U7XG5cbiAgICB2YXIgcyA9IGVsZW1lbnQuc3R5bGU7XG4gICAgdmFyIHNwZWVkID0gX3NwZWVkID8gX3NwZWVkIDogX3NwZWVkID09PSAwID8gMCA6IDMwMDtcbiAgICB2YXIgY29udGVudEhlaWdodCA9IGVsZW1lbnQuc2Nyb2xsSGVpZ2h0O1xuXG4gICAgLy8gc3VidHJhY3QgcGFkZGluZyBmcm9tIGNvbnRlbnRIZWlnaHRcbiAgICBpZiAoZGlyZWN0aW9uID09PSAndXAnKSB7XG4gICAgICAgIHZhciBzdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpO1xuICAgICAgICB2YXIgcGFkZGluZ1RvcCA9ICtzdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKCdwYWRkaW5nLXRvcCcpLnNwbGl0KCdweCcpWzBdO1xuICAgICAgICB2YXIgcGFkZGluZ0JvdHRvbSA9ICtzdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKCdwYWRkaW5nLWJvdHRvbScpLnNwbGl0KCdweCcpWzBdO1xuICAgICAgICBjb250ZW50SGVpZ2h0ID0gZWxlbWVudC5zY3JvbGxIZWlnaHQgLSBwYWRkaW5nVG9wIC0gcGFkZGluZ0JvdHRvbTtcbiAgICB9XG5cbiAgICAvLyBjcmVhdGUgYSBzZXRIZWlnaHQgQ1NTIGNsYXNzXG4gICAgdmFyIHNoZWV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICAvLyBjcmVhdGUgYW4gaWQgZm9yIGVhY2ggY2xhc3MgdG8gYWxsb3cgbXVsdGlwbGUgZWxlbWVudHMgdG8gc2xpZGVcbiAgICAvLyBhdCB0aGUgc2FtZSB0aW1lLCBzdWNoIGFzIHdoZW4gYWN0aXZhdGVkIGJ5IGEgZm9yRWFjaCBsb29wXG4gICAgdmFyIHNldEhlaWdodElkID0gKERhdGUubm93KCkgKiBNYXRoLnJhbmRvbSgpKS50b0ZpeGVkKDApO1xuICAgIHNoZWV0LmlubmVySFRNTCA9ICcuc2V0SGVpZ2h0LScgKyBzZXRIZWlnaHRJZCArICcge2hlaWdodDogJyArIGNvbnRlbnRIZWlnaHQgKyAncHg7fSc7XG4gICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzaGVldCk7XG5cbiAgICAvLyBhZGQgdGhlIENTUyBjbGFzc2VzIHRoYXQgd2lsbCBnaXZlIHRoZSBjb21wdXRlciBhIGZpeGVkIHN0YXJ0aW5nIHBvaW50XG4gICAgaWYgKGRpcmVjdGlvbiA9PT0gJ3VwJykge1xuICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3NldEhlaWdodC0nICsgc2V0SGVpZ2h0SWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnRE9NLXNsaWRlci1oaWRkZW4nLCAnc2V0SGVpZ2h0LScgKyBzZXRIZWlnaHRJZCk7XG4gICAgfVxuXG4gICAgcy50cmFuc2l0aW9uID0gJ2FsbCAnICsgc3BlZWQgKyAnbXMgJyArIChlYXNpbmcgfHwgJycpO1xuICAgIHMub3ZlcmZsb3cgPSAnaGlkZGVuJztcblxuICAgIC8vIGFkZC9yZW1vdmUgdGhlIENTUyBjbGFzcyhzKSB0aGF0IHdpbGwgYW5pbWF0ZSB0aGUgZWxlbWVudFxuICAgIGlmIChkaXJlY3Rpb24gPT09ICd1cCcpIHtcbiAgICAgICAgLy8gRG9uJ3Qga25vdyB3aHksIGJ1dCB3YWl0aW5nIDEwIG1pbGxpc2Vjb25kcyBiZWZvcmUgYWRkaW5nXG4gICAgICAgIC8vIHRoZSAnaGlkZGVuJyBjbGFzcyB3aGVuIHNsaWRpbmcgdXAgcHJldmVudHMgaGVpZ2h0LWp1bXBpbmdcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ0RPTS1zbGlkZXItaGlkZGVuJyk7XG4gICAgICAgIH0sIDEwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ0RPTS1zbGlkZXItaGlkZGVuJyk7XG4gICAgfVxuXG4gICAgdmFyIGRvbmUgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLy8gcmVtb3ZlIHRoZSB0ZW1wb3JhcnkgaW5saW5lIHN0eWxlcyBhbmQgcmVtb3ZlIHRoZSB0ZW1wIHN0eWxlc2hlZXRcbiAgICAgICAgICAgIGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCdzdHlsZScpO1xuICAgICAgICAgICAgc2hlZXQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzaGVldCk7XG4gICAgICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ3NldEhlaWdodC0nICsgc2V0SGVpZ2h0SWQpO1xuICAgICAgICAgICAgcmVzb2x2ZShlbGVtZW50KTtcbiAgICAgICAgfSwgc3BlZWQpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGRvbmU7XG59XG5cbihmdW5jdGlvbiBET01zbGlkZXJJbml0KCkge1xuICAgIHZhciBzaGVldCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgc2hlZXQuaWQgPSAnc2xpZGVDU1NDbGFzc2VzJztcbiAgICBzaGVldC5pbm5lckhUTUwgPSAnXFxuICAgIC5ET00tc2xpZGVyLWhpZGRlbiB7XFxuICAgICAgICBoZWlnaHQ6IDAgIWltcG9ydGFudDtcXG4gICAgICAgIHBhZGRpbmctdG9wOiAwICFpbXBvcnRhbnQ7XFxuICAgICAgICBwYWRkaW5nLWJvdHRvbTogMCAhaW1wb3J0YW50O1xcbiAgICAgICAgYm9yZGVyLXRvcC13aWR0aDogMCAhaW1wb3J0YW50O1xcbiAgICAgICAgYm9yZGVyLWJvdHRvbS13aWR0aDogMCAhaW1wb3J0YW50O1xcbiAgICAgICAgbWFyZ2luLXRvcDogMCAhaW1wb3J0YW50O1xcbiAgICAgICAgbWFyZ2luLWJvdHRvbTogMCAhaW1wb3J0YW50O1xcbiAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbiAhaW1wb3J0YW50O1xcbiAgICB9XFxuICAgICc7XG4gICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzaGVldCk7XG5cbiAgICBPYmplY3QucHJvdG90eXBlLnNsaWRlRG93biA9IGZ1bmN0aW9uIChfc3BlZWQsIGVhc2luZykge1xuICAgICAgICByZXR1cm4gc2xpZGUodGhpcywgX3NwZWVkLCAnZG93bicsIGVhc2luZyk7XG4gICAgfTtcblxuICAgIE9iamVjdC5wcm90b3R5cGUuc2xpZGVVcCA9IGZ1bmN0aW9uIChfc3BlZWQsIGVhc2luZykge1xuICAgICAgICByZXR1cm4gc2xpZGUodGhpcywgX3NwZWVkLCAndXAnLCBlYXNpbmcpO1xuICAgIH07XG5cbiAgICBPYmplY3QucHJvdG90eXBlLnNsaWRlVG9nZ2xlID0gZnVuY3Rpb24gKF9zcGVlZCwgZWFzaW5nKSB7XG4gICAgICAgIGlmICh0aGlzLmNsYXNzTGlzdC5jb250YWlucygnRE9NLXNsaWRlci1oaWRkZW4nKSkge1xuICAgICAgICAgICAgcmV0dXJuIHNsaWRlKHRoaXMsIF9zcGVlZCwgJ2Rvd24nLCBlYXNpbmcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHNsaWRlKHRoaXMsIF9zcGVlZCwgJ3VwJywgZWFzaW5nKTtcbiAgICAgICAgfVxuICAgIH07XG59KSgpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuXHR2YWx1ZTogdHJ1ZVxufSk7XG5mdW5jdGlvbiBnZXRTY3JvbGxUb3AoKSB7XG5cdHJldHVybiB3aW5kb3cucGFnZVlPZmZzZXQgfHwgZG9jdW1lbnQuYm9keS5zY3JvbGxUb3A7XG59XG5cbmZ1bmN0aW9uIGdldFNjcm9sbExlZnQoKSB7XG5cdHJldHVybiB3aW5kb3cucGFnZVhPZmZzZXQgfHwgZG9jdW1lbnQuYm9keS5zY3JvbGxMZWZ0O1xufVxuZXhwb3J0c1snZGVmYXVsdCddID0gZ2V0U2Nyb2xsVG9wO1xuZXhwb3J0cy5nZXRTY3JvbGxMZWZ0ID0gZ2V0U2Nyb2xsTGVmdDtcbmV4cG9ydHMuZ2V0U2Nyb2xsVG9wID0gZ2V0U2Nyb2xsVG9wO1xuZXhwb3J0cy5sZWZ0ID0gZ2V0U2Nyb2xsTGVmdDtcbmV4cG9ydHMudG9wID0gZ2V0U2Nyb2xsVG9wO1xuXG4iLCJtb2R1bGUuZXhwb3J0cyA9IG9uO1xubW9kdWxlLmV4cG9ydHMub24gPSBvbjtcbm1vZHVsZS5leHBvcnRzLm9mZiA9IG9mZjtcblxuZnVuY3Rpb24gb24gKGVsZW1lbnQsIHR5cGUsIGxpc3RlbmVyLCB1c2VDYXB0dXJlKSB7XG4gIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lciwgdXNlQ2FwdHVyZSk7XG4gIHJldHVybiBsaXN0ZW5lcjtcbn1cblxuZnVuY3Rpb24gb2ZmIChlbGVtZW50LCB0eXBlLCBsaXN0ZW5lciwgdXNlQ2FwdHVyZSkge1xuICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZSwgbGlzdGVuZXIsIHVzZUNhcHR1cmUpO1xuICByZXR1cm4gbGlzdGVuZXI7XG59XG4iLCIvKiEgbnBtLmltL29uZS1ldmVudCAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBvbmNlKHRhcmdldCwgdHlwZSwgbGlzdGVuZXIsIHVzZUNhcHR1cmUpIHtcblx0dGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgbGlzdGVuZXIsIHVzZUNhcHR1cmUpO1xuXHR0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBmdW5jdGlvbiBzZWxmUmVtb3ZpbmcoKSB7XG5cdFx0dGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZSwgbGlzdGVuZXIsIHVzZUNhcHR1cmUpO1xuXHRcdHRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKHR5cGUsIHNlbGZSZW1vdmluZywgdXNlQ2FwdHVyZSk7XG5cdH0sIHVzZUNhcHR1cmUpO1xufVxuXG5vbmNlLnByb21pc2UgPSBmdW5jdGlvbiAodGFyZ2V0LCB0eXBlLCB1c2VDYXB0dXJlKSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXR1cm4gb25jZSh0YXJnZXQsIHR5cGUsIHJlc29sdmUsIHVzZUNhcHR1cmUpOyB9KTsgfTtcblxubW9kdWxlLmV4cG9ydHMgPSBvbmNlOyIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gX2ludGVyb3BEZWZhdWx0IChleCkgeyByZXR1cm4gKGV4ICYmICh0eXBlb2YgZXggPT09ICdvYmplY3QnKSAmJiAnZGVmYXVsdCcgaW4gZXgpID8gZXhbJ2RlZmF1bHQnXSA6IGV4OyB9XG5cbnZhciBnZXRTY3JvbGwgPSByZXF1aXJlKCdnZXQtc2Nyb2xsJyk7XG52YXIgb25PZmYgPSByZXF1aXJlKCdvbi1vZmYnKTtcbnZhciBvbmNlID0gX2ludGVyb3BEZWZhdWx0KHJlcXVpcmUoJ29uZS1ldmVudCcpKTtcblxuZXhwb3J0cy5pc1ByZXZlbnRlZCA9IGZhbHNlO1xuXG4vKipcbiAqIFNjcm9sbCBmdW5jdGlvbnNcbiAqL1xudmFyIGxhc3RTY3JvbGxQb3NpdGlvbiA9IHZvaWQgMDtcbmZ1bmN0aW9uIHJlc2V0U2Nyb2xsKCkge1xuXHR3aW5kb3cuc2Nyb2xsVG8uYXBwbHkod2luZG93LCBsYXN0U2Nyb2xsUG9zaXRpb24pO1xufVxuZnVuY3Rpb24gd2FpdEZvclNjcm9sbCgpIHtcblx0bGFzdFNjcm9sbFBvc2l0aW9uID0gW2dldFNjcm9sbC5nZXRTY3JvbGxMZWZ0KCksIGdldFNjcm9sbC5nZXRTY3JvbGxUb3AoKV07XG5cdG9uY2Uod2luZG93LCAnc2Nyb2xsJywgcmVzZXRTY3JvbGwpO1xufVxuXG4vKipcbiAqIFRvZ2dsZSBmdW5jdGlvbnNcbiAqL1xuZnVuY3Rpb24gZXZlbnQoYWN0aW9uKSB7XG5cdC8vIHJ1biBcInJlbW92ZVwiIG9ubHkgaWYgaXQncyBwcmV2ZW50ZWRcblx0Ly8gb3RoZXJ3aXNlIHJ1biBcImF0dGFjaFwiIG9yIFwib25jZVwiIG9ubHkgaWYgaXQncyBub3QgYWxyZWFkeSBwcmV2ZW50ZWRcblx0aWYgKGFjdGlvbiA9PT0gb25PZmYub2ZmID09PSBleHBvcnRzLmlzUHJldmVudGVkKSB7XG5cdFx0YWN0aW9uKHdpbmRvdywgJ3BvcHN0YXRlJywgd2FpdEZvclNjcm9sbCk7XG5cdH1cbn1cbmZ1bmN0aW9uIGFsbG93KCkge1xuXHRldmVudChvbk9mZi5vZmYpO1xuXHRleHBvcnRzLmlzUHJldmVudGVkID0gZmFsc2U7XG59XG5mdW5jdGlvbiBwcmV2ZW50KCkge1xuXHRldmVudChvbk9mZi5vbik7XG5cdGV4cG9ydHMuaXNQcmV2ZW50ZWQgPSB0cnVlO1xufVxuZnVuY3Rpb24gcHJldmVudE9uY2UoKSB7XG5cdGV2ZW50KG9uY2UpO1xufVxuXG52YXIgaW5kZXggPSAoZnVuY3Rpb24gKHRvZ2dsZSkge1xuXHQodG9nZ2xlID8gcHJldmVudCA6IGFsbG93KSgpO1xufSk7XG5cbmV4cG9ydHMuYWxsb3cgPSBhbGxvdztcbmV4cG9ydHMucHJldmVudCA9IHByZXZlbnQ7XG5leHBvcnRzLnByZXZlbnRPbmNlID0gcHJldmVudE9uY2U7XG5leHBvcnRzWydkZWZhdWx0J10gPSBpbmRleDsiLCIoZnVuY3Rpb24oc2VsZikge1xuICAndXNlIHN0cmljdCc7XG5cbiAgaWYgKHNlbGYuZmV0Y2gpIHtcbiAgICByZXR1cm5cbiAgfVxuXG4gIHZhciBzdXBwb3J0ID0ge1xuICAgIHNlYXJjaFBhcmFtczogJ1VSTFNlYXJjaFBhcmFtcycgaW4gc2VsZixcbiAgICBpdGVyYWJsZTogJ1N5bWJvbCcgaW4gc2VsZiAmJiAnaXRlcmF0b3InIGluIFN5bWJvbCxcbiAgICBibG9iOiAnRmlsZVJlYWRlcicgaW4gc2VsZiAmJiAnQmxvYicgaW4gc2VsZiAmJiAoZnVuY3Rpb24oKSB7XG4gICAgICB0cnkge1xuICAgICAgICBuZXcgQmxvYigpXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgfSkoKSxcbiAgICBmb3JtRGF0YTogJ0Zvcm1EYXRhJyBpbiBzZWxmLFxuICAgIGFycmF5QnVmZmVyOiAnQXJyYXlCdWZmZXInIGluIHNlbGZcbiAgfVxuXG4gIGlmIChzdXBwb3J0LmFycmF5QnVmZmVyKSB7XG4gICAgdmFyIHZpZXdDbGFzc2VzID0gW1xuICAgICAgJ1tvYmplY3QgSW50OEFycmF5XScsXG4gICAgICAnW29iamVjdCBVaW50OEFycmF5XScsXG4gICAgICAnW29iamVjdCBVaW50OENsYW1wZWRBcnJheV0nLFxuICAgICAgJ1tvYmplY3QgSW50MTZBcnJheV0nLFxuICAgICAgJ1tvYmplY3QgVWludDE2QXJyYXldJyxcbiAgICAgICdbb2JqZWN0IEludDMyQXJyYXldJyxcbiAgICAgICdbb2JqZWN0IFVpbnQzMkFycmF5XScsXG4gICAgICAnW29iamVjdCBGbG9hdDMyQXJyYXldJyxcbiAgICAgICdbb2JqZWN0IEZsb2F0NjRBcnJheV0nXG4gICAgXVxuXG4gICAgdmFyIGlzRGF0YVZpZXcgPSBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBvYmogJiYgRGF0YVZpZXcucHJvdG90eXBlLmlzUHJvdG90eXBlT2Yob2JqKVxuICAgIH1cblxuICAgIHZhciBpc0FycmF5QnVmZmVyVmlldyA9IEFycmF5QnVmZmVyLmlzVmlldyB8fCBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBvYmogJiYgdmlld0NsYXNzZXMuaW5kZXhPZihPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSkgPiAtMVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG5vcm1hbGl6ZU5hbWUobmFtZSkge1xuICAgIGlmICh0eXBlb2YgbmFtZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgIG5hbWUgPSBTdHJpbmcobmFtZSlcbiAgICB9XG4gICAgaWYgKC9bXmEtejAtOVxcLSMkJSYnKisuXFxeX2B8fl0vaS50ZXN0KG5hbWUpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIGNoYXJhY3RlciBpbiBoZWFkZXIgZmllbGQgbmFtZScpXG4gICAgfVxuICAgIHJldHVybiBuYW1lLnRvTG93ZXJDYXNlKClcbiAgfVxuXG4gIGZ1bmN0aW9uIG5vcm1hbGl6ZVZhbHVlKHZhbHVlKSB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHZhbHVlID0gU3RyaW5nKHZhbHVlKVxuICAgIH1cbiAgICByZXR1cm4gdmFsdWVcbiAgfVxuXG4gIC8vIEJ1aWxkIGEgZGVzdHJ1Y3RpdmUgaXRlcmF0b3IgZm9yIHRoZSB2YWx1ZSBsaXN0XG4gIGZ1bmN0aW9uIGl0ZXJhdG9yRm9yKGl0ZW1zKSB7XG4gICAgdmFyIGl0ZXJhdG9yID0ge1xuICAgICAgbmV4dDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IGl0ZW1zLnNoaWZ0KClcbiAgICAgICAgcmV0dXJuIHtkb25lOiB2YWx1ZSA9PT0gdW5kZWZpbmVkLCB2YWx1ZTogdmFsdWV9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHN1cHBvcnQuaXRlcmFibGUpIHtcbiAgICAgIGl0ZXJhdG9yW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhdG9yXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGl0ZXJhdG9yXG4gIH1cblxuICBmdW5jdGlvbiBIZWFkZXJzKGhlYWRlcnMpIHtcbiAgICB0aGlzLm1hcCA9IHt9XG5cbiAgICBpZiAoaGVhZGVycyBpbnN0YW5jZW9mIEhlYWRlcnMpIHtcbiAgICAgIGhlYWRlcnMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgbmFtZSkge1xuICAgICAgICB0aGlzLmFwcGVuZChuYW1lLCB2YWx1ZSlcbiAgICAgIH0sIHRoaXMpXG4gICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGhlYWRlcnMpKSB7XG4gICAgICBoZWFkZXJzLmZvckVhY2goZnVuY3Rpb24oaGVhZGVyKSB7XG4gICAgICAgIHRoaXMuYXBwZW5kKGhlYWRlclswXSwgaGVhZGVyWzFdKVxuICAgICAgfSwgdGhpcylcbiAgICB9IGVsc2UgaWYgKGhlYWRlcnMpIHtcbiAgICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGhlYWRlcnMpLmZvckVhY2goZnVuY3Rpb24obmFtZSkge1xuICAgICAgICB0aGlzLmFwcGVuZChuYW1lLCBoZWFkZXJzW25hbWVdKVxuICAgICAgfSwgdGhpcylcbiAgICB9XG4gIH1cblxuICBIZWFkZXJzLnByb3RvdHlwZS5hcHBlbmQgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICAgIG5hbWUgPSBub3JtYWxpemVOYW1lKG5hbWUpXG4gICAgdmFsdWUgPSBub3JtYWxpemVWYWx1ZSh2YWx1ZSlcbiAgICB2YXIgb2xkVmFsdWUgPSB0aGlzLm1hcFtuYW1lXVxuICAgIHRoaXMubWFwW25hbWVdID0gb2xkVmFsdWUgPyBvbGRWYWx1ZSsnLCcrdmFsdWUgOiB2YWx1ZVxuICB9XG5cbiAgSGVhZGVycy5wcm90b3R5cGVbJ2RlbGV0ZSddID0gZnVuY3Rpb24obmFtZSkge1xuICAgIGRlbGV0ZSB0aGlzLm1hcFtub3JtYWxpemVOYW1lKG5hbWUpXVxuICB9XG5cbiAgSGVhZGVycy5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24obmFtZSkge1xuICAgIG5hbWUgPSBub3JtYWxpemVOYW1lKG5hbWUpXG4gICAgcmV0dXJuIHRoaXMuaGFzKG5hbWUpID8gdGhpcy5tYXBbbmFtZV0gOiBudWxsXG4gIH1cblxuICBIZWFkZXJzLnByb3RvdHlwZS5oYXMgPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMubWFwLmhhc093blByb3BlcnR5KG5vcm1hbGl6ZU5hbWUobmFtZSkpXG4gIH1cblxuICBIZWFkZXJzLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICAgIHRoaXMubWFwW25vcm1hbGl6ZU5hbWUobmFtZSldID0gbm9ybWFsaXplVmFsdWUodmFsdWUpXG4gIH1cblxuICBIZWFkZXJzLnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24oY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICBmb3IgKHZhciBuYW1lIGluIHRoaXMubWFwKSB7XG4gICAgICBpZiAodGhpcy5tYXAuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICAgICAgY2FsbGJhY2suY2FsbCh0aGlzQXJnLCB0aGlzLm1hcFtuYW1lXSwgbmFtZSwgdGhpcylcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBIZWFkZXJzLnByb3RvdHlwZS5rZXlzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGl0ZW1zID0gW11cbiAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIG5hbWUpIHsgaXRlbXMucHVzaChuYW1lKSB9KVxuICAgIHJldHVybiBpdGVyYXRvckZvcihpdGVtcylcbiAgfVxuXG4gIEhlYWRlcnMucHJvdG90eXBlLnZhbHVlcyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpdGVtcyA9IFtdXG4gICAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlKSB7IGl0ZW1zLnB1c2godmFsdWUpIH0pXG4gICAgcmV0dXJuIGl0ZXJhdG9yRm9yKGl0ZW1zKVxuICB9XG5cbiAgSGVhZGVycy5wcm90b3R5cGUuZW50cmllcyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpdGVtcyA9IFtdXG4gICAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBuYW1lKSB7IGl0ZW1zLnB1c2goW25hbWUsIHZhbHVlXSkgfSlcbiAgICByZXR1cm4gaXRlcmF0b3JGb3IoaXRlbXMpXG4gIH1cblxuICBpZiAoc3VwcG9ydC5pdGVyYWJsZSkge1xuICAgIEhlYWRlcnMucHJvdG90eXBlW1N5bWJvbC5pdGVyYXRvcl0gPSBIZWFkZXJzLnByb3RvdHlwZS5lbnRyaWVzXG4gIH1cblxuICBmdW5jdGlvbiBjb25zdW1lZChib2R5KSB7XG4gICAgaWYgKGJvZHkuYm9keVVzZWQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgVHlwZUVycm9yKCdBbHJlYWR5IHJlYWQnKSlcbiAgICB9XG4gICAgYm9keS5ib2R5VXNlZCA9IHRydWVcbiAgfVxuXG4gIGZ1bmN0aW9uIGZpbGVSZWFkZXJSZWFkeShyZWFkZXIpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJlc29sdmUocmVhZGVyLnJlc3VsdClcbiAgICAgIH1cbiAgICAgIHJlYWRlci5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJlamVjdChyZWFkZXIuZXJyb3IpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlYWRCbG9iQXNBcnJheUJ1ZmZlcihibG9iKSB7XG4gICAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKClcbiAgICB2YXIgcHJvbWlzZSA9IGZpbGVSZWFkZXJSZWFkeShyZWFkZXIpXG4gICAgcmVhZGVyLnJlYWRBc0FycmF5QnVmZmVyKGJsb2IpXG4gICAgcmV0dXJuIHByb21pc2VcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlYWRCbG9iQXNUZXh0KGJsb2IpIHtcbiAgICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKVxuICAgIHZhciBwcm9taXNlID0gZmlsZVJlYWRlclJlYWR5KHJlYWRlcilcbiAgICByZWFkZXIucmVhZEFzVGV4dChibG9iKVxuICAgIHJldHVybiBwcm9taXNlXG4gIH1cblxuICBmdW5jdGlvbiByZWFkQXJyYXlCdWZmZXJBc1RleHQoYnVmKSB7XG4gICAgdmFyIHZpZXcgPSBuZXcgVWludDhBcnJheShidWYpXG4gICAgdmFyIGNoYXJzID0gbmV3IEFycmF5KHZpZXcubGVuZ3RoKVxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2aWV3Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBjaGFyc1tpXSA9IFN0cmluZy5mcm9tQ2hhckNvZGUodmlld1tpXSlcbiAgICB9XG4gICAgcmV0dXJuIGNoYXJzLmpvaW4oJycpXG4gIH1cblxuICBmdW5jdGlvbiBidWZmZXJDbG9uZShidWYpIHtcbiAgICBpZiAoYnVmLnNsaWNlKSB7XG4gICAgICByZXR1cm4gYnVmLnNsaWNlKDApXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB2aWV3ID0gbmV3IFVpbnQ4QXJyYXkoYnVmLmJ5dGVMZW5ndGgpXG4gICAgICB2aWV3LnNldChuZXcgVWludDhBcnJheShidWYpKVxuICAgICAgcmV0dXJuIHZpZXcuYnVmZmVyXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gQm9keSgpIHtcbiAgICB0aGlzLmJvZHlVc2VkID0gZmFsc2VcblxuICAgIHRoaXMuX2luaXRCb2R5ID0gZnVuY3Rpb24oYm9keSkge1xuICAgICAgdGhpcy5fYm9keUluaXQgPSBib2R5XG4gICAgICBpZiAoIWJvZHkpIHtcbiAgICAgICAgdGhpcy5fYm9keVRleHQgPSAnJ1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYm9keSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgdGhpcy5fYm9keVRleHQgPSBib2R5XG4gICAgICB9IGVsc2UgaWYgKHN1cHBvcnQuYmxvYiAmJiBCbG9iLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpKSB7XG4gICAgICAgIHRoaXMuX2JvZHlCbG9iID0gYm9keVxuICAgICAgfSBlbHNlIGlmIChzdXBwb3J0LmZvcm1EYXRhICYmIEZvcm1EYXRhLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpKSB7XG4gICAgICAgIHRoaXMuX2JvZHlGb3JtRGF0YSA9IGJvZHlcbiAgICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5zZWFyY2hQYXJhbXMgJiYgVVJMU2VhcmNoUGFyYW1zLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpKSB7XG4gICAgICAgIHRoaXMuX2JvZHlUZXh0ID0gYm9keS50b1N0cmluZygpXG4gICAgICB9IGVsc2UgaWYgKHN1cHBvcnQuYXJyYXlCdWZmZXIgJiYgc3VwcG9ydC5ibG9iICYmIGlzRGF0YVZpZXcoYm9keSkpIHtcbiAgICAgICAgdGhpcy5fYm9keUFycmF5QnVmZmVyID0gYnVmZmVyQ2xvbmUoYm9keS5idWZmZXIpXG4gICAgICAgIC8vIElFIDEwLTExIGNhbid0IGhhbmRsZSBhIERhdGFWaWV3IGJvZHkuXG4gICAgICAgIHRoaXMuX2JvZHlJbml0ID0gbmV3IEJsb2IoW3RoaXMuX2JvZHlBcnJheUJ1ZmZlcl0pXG4gICAgICB9IGVsc2UgaWYgKHN1cHBvcnQuYXJyYXlCdWZmZXIgJiYgKEFycmF5QnVmZmVyLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpIHx8IGlzQXJyYXlCdWZmZXJWaWV3KGJvZHkpKSkge1xuICAgICAgICB0aGlzLl9ib2R5QXJyYXlCdWZmZXIgPSBidWZmZXJDbG9uZShib2R5KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCd1bnN1cHBvcnRlZCBCb2R5SW5pdCB0eXBlJylcbiAgICAgIH1cblxuICAgICAgaWYgKCF0aGlzLmhlYWRlcnMuZ2V0KCdjb250ZW50LXR5cGUnKSkge1xuICAgICAgICBpZiAodHlwZW9mIGJvZHkgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgdGhpcy5oZWFkZXJzLnNldCgnY29udGVudC10eXBlJywgJ3RleHQvcGxhaW47Y2hhcnNldD1VVEYtOCcpXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUJsb2IgJiYgdGhpcy5fYm9keUJsb2IudHlwZSkge1xuICAgICAgICAgIHRoaXMuaGVhZGVycy5zZXQoJ2NvbnRlbnQtdHlwZScsIHRoaXMuX2JvZHlCbG9iLnR5cGUpXG4gICAgICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5zZWFyY2hQYXJhbXMgJiYgVVJMU2VhcmNoUGFyYW1zLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpKSB7XG4gICAgICAgICAgdGhpcy5oZWFkZXJzLnNldCgnY29udGVudC10eXBlJywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDtjaGFyc2V0PVVURi04JylcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzdXBwb3J0LmJsb2IpIHtcbiAgICAgIHRoaXMuYmxvYiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgcmVqZWN0ZWQgPSBjb25zdW1lZCh0aGlzKVxuICAgICAgICBpZiAocmVqZWN0ZWQpIHtcbiAgICAgICAgICByZXR1cm4gcmVqZWN0ZWRcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9ib2R5QmxvYikge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5fYm9keUJsb2IpXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUFycmF5QnVmZmVyKSB7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShuZXcgQmxvYihbdGhpcy5fYm9keUFycmF5QnVmZmVyXSkpXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUZvcm1EYXRhKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdjb3VsZCBub3QgcmVhZCBGb3JtRGF0YSBib2R5IGFzIGJsb2InKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobmV3IEJsb2IoW3RoaXMuX2JvZHlUZXh0XSkpXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5hcnJheUJ1ZmZlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5fYm9keUFycmF5QnVmZmVyKSB7XG4gICAgICAgICAgcmV0dXJuIGNvbnN1bWVkKHRoaXMpIHx8IFByb21pc2UucmVzb2x2ZSh0aGlzLl9ib2R5QXJyYXlCdWZmZXIpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuYmxvYigpLnRoZW4ocmVhZEJsb2JBc0FycmF5QnVmZmVyKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy50ZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcmVqZWN0ZWQgPSBjb25zdW1lZCh0aGlzKVxuICAgICAgaWYgKHJlamVjdGVkKSB7XG4gICAgICAgIHJldHVybiByZWplY3RlZFxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5fYm9keUJsb2IpIHtcbiAgICAgICAgcmV0dXJuIHJlYWRCbG9iQXNUZXh0KHRoaXMuX2JvZHlCbG9iKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5QXJyYXlCdWZmZXIpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShyZWFkQXJyYXlCdWZmZXJBc1RleHQodGhpcy5fYm9keUFycmF5QnVmZmVyKSlcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUZvcm1EYXRhKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignY291bGQgbm90IHJlYWQgRm9ybURhdGEgYm9keSBhcyB0ZXh0JylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5fYm9keVRleHQpXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHN1cHBvcnQuZm9ybURhdGEpIHtcbiAgICAgIHRoaXMuZm9ybURhdGEgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGV4dCgpLnRoZW4oZGVjb2RlKVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuanNvbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMudGV4dCgpLnRoZW4oSlNPTi5wYXJzZSlcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgLy8gSFRUUCBtZXRob2RzIHdob3NlIGNhcGl0YWxpemF0aW9uIHNob3VsZCBiZSBub3JtYWxpemVkXG4gIHZhciBtZXRob2RzID0gWydERUxFVEUnLCAnR0VUJywgJ0hFQUQnLCAnT1BUSU9OUycsICdQT1NUJywgJ1BVVCddXG5cbiAgZnVuY3Rpb24gbm9ybWFsaXplTWV0aG9kKG1ldGhvZCkge1xuICAgIHZhciB1cGNhc2VkID0gbWV0aG9kLnRvVXBwZXJDYXNlKClcbiAgICByZXR1cm4gKG1ldGhvZHMuaW5kZXhPZih1cGNhc2VkKSA+IC0xKSA/IHVwY2FzZWQgOiBtZXRob2RcbiAgfVxuXG4gIGZ1bmN0aW9uIFJlcXVlc3QoaW5wdXQsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fVxuICAgIHZhciBib2R5ID0gb3B0aW9ucy5ib2R5XG5cbiAgICBpZiAoaW5wdXQgaW5zdGFuY2VvZiBSZXF1ZXN0KSB7XG4gICAgICBpZiAoaW5wdXQuYm9keVVzZWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQWxyZWFkeSByZWFkJylcbiAgICAgIH1cbiAgICAgIHRoaXMudXJsID0gaW5wdXQudXJsXG4gICAgICB0aGlzLmNyZWRlbnRpYWxzID0gaW5wdXQuY3JlZGVudGlhbHNcbiAgICAgIGlmICghb3B0aW9ucy5oZWFkZXJzKSB7XG4gICAgICAgIHRoaXMuaGVhZGVycyA9IG5ldyBIZWFkZXJzKGlucHV0LmhlYWRlcnMpXG4gICAgICB9XG4gICAgICB0aGlzLm1ldGhvZCA9IGlucHV0Lm1ldGhvZFxuICAgICAgdGhpcy5tb2RlID0gaW5wdXQubW9kZVxuICAgICAgaWYgKCFib2R5ICYmIGlucHV0Ll9ib2R5SW5pdCAhPSBudWxsKSB7XG4gICAgICAgIGJvZHkgPSBpbnB1dC5fYm9keUluaXRcbiAgICAgICAgaW5wdXQuYm9keVVzZWQgPSB0cnVlXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudXJsID0gU3RyaW5nKGlucHV0KVxuICAgIH1cblxuICAgIHRoaXMuY3JlZGVudGlhbHMgPSBvcHRpb25zLmNyZWRlbnRpYWxzIHx8IHRoaXMuY3JlZGVudGlhbHMgfHwgJ29taXQnXG4gICAgaWYgKG9wdGlvbnMuaGVhZGVycyB8fCAhdGhpcy5oZWFkZXJzKSB7XG4gICAgICB0aGlzLmhlYWRlcnMgPSBuZXcgSGVhZGVycyhvcHRpb25zLmhlYWRlcnMpXG4gICAgfVxuICAgIHRoaXMubWV0aG9kID0gbm9ybWFsaXplTWV0aG9kKG9wdGlvbnMubWV0aG9kIHx8IHRoaXMubWV0aG9kIHx8ICdHRVQnKVxuICAgIHRoaXMubW9kZSA9IG9wdGlvbnMubW9kZSB8fCB0aGlzLm1vZGUgfHwgbnVsbFxuICAgIHRoaXMucmVmZXJyZXIgPSBudWxsXG5cbiAgICBpZiAoKHRoaXMubWV0aG9kID09PSAnR0VUJyB8fCB0aGlzLm1ldGhvZCA9PT0gJ0hFQUQnKSAmJiBib2R5KSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdCb2R5IG5vdCBhbGxvd2VkIGZvciBHRVQgb3IgSEVBRCByZXF1ZXN0cycpXG4gICAgfVxuICAgIHRoaXMuX2luaXRCb2R5KGJvZHkpXG4gIH1cblxuICBSZXF1ZXN0LnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBuZXcgUmVxdWVzdCh0aGlzLCB7IGJvZHk6IHRoaXMuX2JvZHlJbml0IH0pXG4gIH1cblxuICBmdW5jdGlvbiBkZWNvZGUoYm9keSkge1xuICAgIHZhciBmb3JtID0gbmV3IEZvcm1EYXRhKClcbiAgICBib2R5LnRyaW0oKS5zcGxpdCgnJicpLmZvckVhY2goZnVuY3Rpb24oYnl0ZXMpIHtcbiAgICAgIGlmIChieXRlcykge1xuICAgICAgICB2YXIgc3BsaXQgPSBieXRlcy5zcGxpdCgnPScpXG4gICAgICAgIHZhciBuYW1lID0gc3BsaXQuc2hpZnQoKS5yZXBsYWNlKC9cXCsvZywgJyAnKVxuICAgICAgICB2YXIgdmFsdWUgPSBzcGxpdC5qb2luKCc9JykucmVwbGFjZSgvXFwrL2csICcgJylcbiAgICAgICAgZm9ybS5hcHBlbmQoZGVjb2RlVVJJQ29tcG9uZW50KG5hbWUpLCBkZWNvZGVVUklDb21wb25lbnQodmFsdWUpKVxuICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIGZvcm1cbiAgfVxuXG4gIGZ1bmN0aW9uIHBhcnNlSGVhZGVycyhyYXdIZWFkZXJzKSB7XG4gICAgdmFyIGhlYWRlcnMgPSBuZXcgSGVhZGVycygpXG4gICAgcmF3SGVhZGVycy5zcGxpdCgvXFxyP1xcbi8pLmZvckVhY2goZnVuY3Rpb24obGluZSkge1xuICAgICAgdmFyIHBhcnRzID0gbGluZS5zcGxpdCgnOicpXG4gICAgICB2YXIga2V5ID0gcGFydHMuc2hpZnQoKS50cmltKClcbiAgICAgIGlmIChrZXkpIHtcbiAgICAgICAgdmFyIHZhbHVlID0gcGFydHMuam9pbignOicpLnRyaW0oKVxuICAgICAgICBoZWFkZXJzLmFwcGVuZChrZXksIHZhbHVlKVxuICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIGhlYWRlcnNcbiAgfVxuXG4gIEJvZHkuY2FsbChSZXF1ZXN0LnByb3RvdHlwZSlcblxuICBmdW5jdGlvbiBSZXNwb25zZShib2R5SW5pdCwgb3B0aW9ucykge1xuICAgIGlmICghb3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IHt9XG4gICAgfVxuXG4gICAgdGhpcy50eXBlID0gJ2RlZmF1bHQnXG4gICAgdGhpcy5zdGF0dXMgPSAnc3RhdHVzJyBpbiBvcHRpb25zID8gb3B0aW9ucy5zdGF0dXMgOiAyMDBcbiAgICB0aGlzLm9rID0gdGhpcy5zdGF0dXMgPj0gMjAwICYmIHRoaXMuc3RhdHVzIDwgMzAwXG4gICAgdGhpcy5zdGF0dXNUZXh0ID0gJ3N0YXR1c1RleHQnIGluIG9wdGlvbnMgPyBvcHRpb25zLnN0YXR1c1RleHQgOiAnT0snXG4gICAgdGhpcy5oZWFkZXJzID0gbmV3IEhlYWRlcnMob3B0aW9ucy5oZWFkZXJzKVxuICAgIHRoaXMudXJsID0gb3B0aW9ucy51cmwgfHwgJydcbiAgICB0aGlzLl9pbml0Qm9keShib2R5SW5pdClcbiAgfVxuXG4gIEJvZHkuY2FsbChSZXNwb25zZS5wcm90b3R5cGUpXG5cbiAgUmVzcG9uc2UucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG5ldyBSZXNwb25zZSh0aGlzLl9ib2R5SW5pdCwge1xuICAgICAgc3RhdHVzOiB0aGlzLnN0YXR1cyxcbiAgICAgIHN0YXR1c1RleHQ6IHRoaXMuc3RhdHVzVGV4dCxcbiAgICAgIGhlYWRlcnM6IG5ldyBIZWFkZXJzKHRoaXMuaGVhZGVycyksXG4gICAgICB1cmw6IHRoaXMudXJsXG4gICAgfSlcbiAgfVxuXG4gIFJlc3BvbnNlLmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHJlc3BvbnNlID0gbmV3IFJlc3BvbnNlKG51bGwsIHtzdGF0dXM6IDAsIHN0YXR1c1RleHQ6ICcnfSlcbiAgICByZXNwb25zZS50eXBlID0gJ2Vycm9yJ1xuICAgIHJldHVybiByZXNwb25zZVxuICB9XG5cbiAgdmFyIHJlZGlyZWN0U3RhdHVzZXMgPSBbMzAxLCAzMDIsIDMwMywgMzA3LCAzMDhdXG5cbiAgUmVzcG9uc2UucmVkaXJlY3QgPSBmdW5jdGlvbih1cmwsIHN0YXR1cykge1xuICAgIGlmIChyZWRpcmVjdFN0YXR1c2VzLmluZGV4T2Yoc3RhdHVzKSA9PT0gLTEpIHtcbiAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbnZhbGlkIHN0YXR1cyBjb2RlJylcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFJlc3BvbnNlKG51bGwsIHtzdGF0dXM6IHN0YXR1cywgaGVhZGVyczoge2xvY2F0aW9uOiB1cmx9fSlcbiAgfVxuXG4gIHNlbGYuSGVhZGVycyA9IEhlYWRlcnNcbiAgc2VsZi5SZXF1ZXN0ID0gUmVxdWVzdFxuICBzZWxmLlJlc3BvbnNlID0gUmVzcG9uc2VcblxuICBzZWxmLmZldGNoID0gZnVuY3Rpb24oaW5wdXQsIGluaXQpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICB2YXIgcmVxdWVzdCA9IG5ldyBSZXF1ZXN0KGlucHV0LCBpbml0KVxuICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXG5cbiAgICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICAgICAgc3RhdHVzOiB4aHIuc3RhdHVzLFxuICAgICAgICAgIHN0YXR1c1RleHQ6IHhoci5zdGF0dXNUZXh0LFxuICAgICAgICAgIGhlYWRlcnM6IHBhcnNlSGVhZGVycyh4aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkgfHwgJycpXG4gICAgICAgIH1cbiAgICAgICAgb3B0aW9ucy51cmwgPSAncmVzcG9uc2VVUkwnIGluIHhociA/IHhoci5yZXNwb25zZVVSTCA6IG9wdGlvbnMuaGVhZGVycy5nZXQoJ1gtUmVxdWVzdC1VUkwnKVxuICAgICAgICB2YXIgYm9keSA9ICdyZXNwb25zZScgaW4geGhyID8geGhyLnJlc3BvbnNlIDogeGhyLnJlc3BvbnNlVGV4dFxuICAgICAgICByZXNvbHZlKG5ldyBSZXNwb25zZShib2R5LCBvcHRpb25zKSlcbiAgICAgIH1cblxuICAgICAgeGhyLm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmVqZWN0KG5ldyBUeXBlRXJyb3IoJ05ldHdvcmsgcmVxdWVzdCBmYWlsZWQnKSlcbiAgICAgIH1cblxuICAgICAgeGhyLm9udGltZW91dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZWplY3QobmV3IFR5cGVFcnJvcignTmV0d29yayByZXF1ZXN0IGZhaWxlZCcpKVxuICAgICAgfVxuXG4gICAgICB4aHIub3BlbihyZXF1ZXN0Lm1ldGhvZCwgcmVxdWVzdC51cmwsIHRydWUpXG5cbiAgICAgIGlmIChyZXF1ZXN0LmNyZWRlbnRpYWxzID09PSAnaW5jbHVkZScpIHtcbiAgICAgICAgeGhyLndpdGhDcmVkZW50aWFscyA9IHRydWVcbiAgICAgIH1cblxuICAgICAgaWYgKCdyZXNwb25zZVR5cGUnIGluIHhociAmJiBzdXBwb3J0LmJsb2IpIHtcbiAgICAgICAgeGhyLnJlc3BvbnNlVHlwZSA9ICdibG9iJ1xuICAgICAgfVxuXG4gICAgICByZXF1ZXN0LmhlYWRlcnMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgbmFtZSkge1xuICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihuYW1lLCB2YWx1ZSlcbiAgICAgIH0pXG5cbiAgICAgIHhoci5zZW5kKHR5cGVvZiByZXF1ZXN0Ll9ib2R5SW5pdCA9PT0gJ3VuZGVmaW5lZCcgPyBudWxsIDogcmVxdWVzdC5fYm9keUluaXQpXG4gICAgfSlcbiAgfVxuICBzZWxmLmZldGNoLnBvbHlmaWxsID0gdHJ1ZVxufSkodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnID8gc2VsZiA6IHRoaXMpO1xuIl19
