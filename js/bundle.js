(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

(function () {
    var g = require('./globals');

    function show() {
        g.$overlay.fadeIn();
        g.$applyPopUp.fadeIn();
        return false;
    }

    function hide() {
        g.$overlay.fadeOut();
        g.$applyPopUp.fadeOut();
        return false;
    }

    function submit() {

        function sendForm() {
            return $.ajax({
                url: '',
                type: 'post',
                data: g.$applyForm.serialize()
            });
        }

        sendForm().done(function () {
            g.$applyForm.fadeOut(function () {
                $('#sent-message').fadeIn();
            });
        });
        return false;
    }

    module.exports.show = show;
    module.exports.hide = hide;
    module.exports.submit = submit;
})();

},{"./globals":2}],2:[function(require,module,exports){
'use strict';

(function () {
    var $overlay = $('#overlay');
    var $pageLandingHome = $('#page-landing_home');
    var $cards = $('label.card');
    var $pageLandingWeb = $('#page-landing_web');
    var $pageLandingCyber = $('#page-landing_cyber');
    var $applyPopUp = $('#apply-pop-up');
    var $applyForm = $applyPopUp.find('form');
    var $applyButtons = $('#nav-apply-btn, #cta-apply-btn, #contact-home, .request-info');
    var $programsContainer = $('#programs-container');
    var $homeButton = $('#home-button');
    var $menuItems = $('#menu-items');
    var $navItems = $menuItems.find('a.nav-item');
    var $sections = $programsContainer.find('section');
    var $banners = $sections.find('.banner');
    var $plusButtons = $banners.find('span.plus-button');

    module.exports.mobileMenuWidth = '920';
    module.exports.topPadding = window.innerWidth >= '920' ? 52 : 0;
    module.exports.$overlay = $overlay;
    module.exports.$pageLandingHome = $pageLandingHome;
    module.exports.$cards = $cards;
    module.exports.$pageLandingWeb = $pageLandingWeb;
    module.exports.$pageLandingCyber = $pageLandingCyber;
    module.exports.$applyPopUp = $applyPopUp;
    module.exports.$applyForm = $applyForm;
    module.exports.$applyButtons = $applyButtons;
    module.exports.$programsContainer = $programsContainer;
    module.exports.$homeButton = $homeButton;
    module.exports.$menuItems = $menuItems;
    module.exports.$navItems = $navItems;
    module.exports.$sections = $sections;
    module.exports.$banners = $banners;
    module.exports.$plusButtons = $plusButtons;
})();

},{}],3:[function(require,module,exports){
"use strict";

(function (code) {
    "use strict";

    code(window.jQuery, window, document);
})(function ($, window, document) {
    "use strict";

    $('body').fadeIn(300);

    var g = require('./globals');
    var pb = require('./plus-buttons');
    var menu = require('./menu');
    var form = require('./form');
    var smoothScroll = require('./smoothScroll');

    var pageSetup = {
        onReady: function onReady() {
            smoothScroll.init();
            g.$cards.filter('.web').on('click', function () {
                pageSetup.switchPage('web');
            });
            g.$cards.filter('.cyber').on('click', function () {
                pageSetup.switchPage('cyber');
            });
            g.$applyButtons.on('click', pageSetup.applyButtonsFunctionality);
            $('#apply-close, #overlay').on('click', form.hide);
            g.$applyForm.on('click', pageSetup.formSubmit);
            g.$plusButtons.on('click', pageSetup.plusButtonsFunctionality);
            if (window.innerWidth < g.mobileMenuWidth) {
                $('#menu-button, #menu-items a').click(menu.mobileClick);
            }
            return false;
        },
        switchPage: function switchPage(page) {
            var navItems = g.$navItems.filter('.' + page);
            var banners = g.$banners.filter('.' + page);
            var landing = $('#page-landing_' + page)[0];

            // Switch to home page annd reset everything to default
            g.$homeButton.on('click', function (e) {
                e.preventDefault();
                menu.homeButtonSetup();
                return false;
            });

            // on scroll, fix plus-buttons to screen and add nav styles
            var $downArrows = $('a.arrow-down');
            if (window.innerWidth >= g.mobileMenuWidth) {
                $(window).on('scroll', function () {
                    pb.fixed();
                    window.scrollY > '20' ? $downArrows.fadeOut(400) : $downArrows.slideDown(400);
                    menu.navItemsStyle(navItems, banners, landing);
                    return false;
                });
            } else {
                $(window).on('scroll', function () {
                    pb.fixed();
                    window.scrollY > '20' ? $downArrows.fadeOut(400) : $downArrows.slideDown(400);
                });
            }

            // Set form program id
            var id = page == "web" ? 'WD' : 'IT';
            g.$applyPopUp.find("input[name='program_id']").attr('value', id);

            // animate switching pages
            g.$pageLandingHome.fadeOut(function () {
                window.scrollTo(0, 0);
                g.$programsContainer.fadeIn();
                return false;
            });
            return false;
        },
        applyButtonsFunctionality: function applyButtonsFunctionality(e) {
            e.preventDefault();
            form.show();
            return false;
        },
        formSubmit: function formSubmit(e) {
            e.preventDefault();
            form.submit();
            return false;
        },
        plusButtonsFunctionality: function plusButtonsFunctionality() {
            $(this).hasClass('opened') ? pb.close(this) : pb.open(this);
            return false;
        }
    };

    $(document).ready(pageSetup.onReady);

    return false;
});

},{"./form":1,"./globals":2,"./menu":4,"./plus-buttons":5,"./smoothScroll":6}],4:[function(require,module,exports){
'use strict';

(function () {
    var g = require('./globals');

    function homeButtonSetup(navItems, page) {
        // switch to home page
        g.$programsContainer.fadeOut(function () {
            window.scrollTo(0, 0);
            g.$pageLandingHome.fadeIn(function () {
                // reset things to default
                g.$overlay.hide();
                g.$applyPopUp.hide();
                g.$plusButtons.filter('.opened').css({ 'top': '0px', 'transition': '.6s' }).removeClass('opened');
                g.$banners.filter('.shrink').removeClass('shrink').next().hide();
                g.$navItems.removeClass('section-in-view');
                $(window).off('scroll', navItemsStyle);
                return false;
            });
            return false;
        });
        g.$homeButton.off('click', homeButtonSetup);
        return false;
    }

    function navItemsStyle(navItems, banners, landing) {
        // if window scroll position is between a banner, add nav style to corresponding nav item
        if (landing.getBoundingClientRect().bottom < '-24') {
            for (var j = 0, y = banners.length; j < y; j++) {
                if (banners[j].getBoundingClientRect().top <= g.topPadding && (banners[j].nextSibling.nextSibling.getBoundingClientRect().bottom > g.topPadding || banners[j].getBoundingClientRect().bottom > g.topPadding)) {
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
    module.exports.homeButtonSetup = homeButtonSetup;
    module.exports.mobileClick = mobileClick;
})();

},{"./globals":2}],5:[function(require,module,exports){
'use strict';

(function () {
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

!function () {
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
                var topPadding = $(target[0]).hasClass('banner') ? window.innerWidth >= '920' ? -52 : 0 : 0;
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
}();

},{}]},{},[3]);
