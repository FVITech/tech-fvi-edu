(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

!function () {
    var mobileMenuWidth = '920';

    module.exports.plusButtons = document.getElementsByClassName('plus-button');
    module.exports.mobileMenuWidth = mobileMenuWidth;
    module.exports.topPadding = window.innerWidth >= mobileMenuWidth ? 52 : 0;
}();

},{}],2:[function(require,module,exports){
'use strict';

$(document).ready(function () {
    "use strict";

    var smoothScroll = require('./smoothScroll');
    var g = require('./globals');
    var plusButtonFunctions = require('./plus-buttons');
    var menu = require('./menu');

    // on button click, change button style and show content
    $('body').on('click', '.plus-button', plusButtonFunctions.setup);
    // on window scroll, fixed clicked button to screen
    $(window).on('scroll', plusButtonFunctions.fixed);
    // hide all nav items until page is chosen
    $('.nav-item').parent().hide();

    // Code for home page
    $('.card.web').click(function () {
        switchPage('web');
    });
    $('.card.cyber').click(function () {
        switchPage('cyber');
    });

    function switchPage(page) {
        $('.page-landing.home').fadeOut(function () {
            window.scrollTo(0, 0);
            // var displayType = (window.innerWidth >= g.mobileMenuWidth) ? 'inline-block' : 'block';
            $('.nav-item.' + page).parent().show();
            $('.page-landing.' + page).show();
            $('section.' + page).show();
            $('.content.' + page).show();
            setupPage(page);
            $('.programs-container').fadeIn();
        });
    }

    function setupPage(page) {
        var navItems = document.getElementsByClassName('nav-item ' + page);
        var banners = document.getElementsByClassName('banner ' + page);
        var landing = document.getElementsByClassName('page-landing ' + page)[0];
        // Switch to home page annd reset everything to default
        $('.home-button').on('click', function (e) {
            e.preventDefault();
            menu.homeButtonSetup(navItems, page);
        });

        // on window scroll, add style to nav item if section is in view
        if (window.innerWidth >= g.mobileMenuWidth) {
            $(window).on('scroll', function () {
                menu.navItemsStyle(navItems, page, banners, landing);
            });
        }
    }; // end setupPage function

    // mobile-menu show/hide
    if (window.innerWidth < g.mobileMenuWidth) {
        $('#menu-button, #overlay, #menu-items li a').click(menu.mobileClick);
    }

    // fade-out down-arrow in landing page when scroll
    window.addEventListener('scroll', function () {
        if (window.scrollY > '20') {
            $('.arrow-down').fadeOut(400);
        } else {
            $('.arrow-down').slideDown(400);
        }
    });
});

},{"./globals":1,"./menu":3,"./plus-buttons":4,"./smoothScroll":5}],3:[function(require,module,exports){
'use strict';

!function () {
    var g = require('./globals');

    function navItemsStyle(navItems, page, banners, landing) {
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
            $('.nav-item').removeClass('section-in-view');
        }
    }

    function homeButtonSetup(navItems, page) {
        $('.plus-button.clicked-button').click();
        $('.programs-container').fadeOut(function () {
            window.scrollTo(0, 0);
            $('.page-landing.home').fadeIn(function () {
                $('.nav-item').removeClass('section-in-view');
                $('.content.' + page).hide();
                $('section.' + page).hide();
                $('.page-landing.' + page).hide();
                $('.nav-item.' + page).parent().hide();
                $(window).off('scroll', navItemsStyle);
            });
        });
        $('.home-button').off('click', homeButtonSetup);
    }

    function mobileClick() {
        var $menuButton = $('#menu-button');
        if ($menuButton.html() === '<i class="fa fa-bars" aria-hidden="true"></i> MENU') {
            $menuButton.html('<i class="fa fa-bars" aria-hidden="true"></i> CLOSE');
        } else {
            $menuButton.html('<i class="fa fa-bars" aria-hidden="true"></i> MENU');
        }
        $('#overlay').fadeToggle();
        $('nav ul').toggle(500, 'easeOutQuad');
    }

    module.exports.navItemsStyle = navItemsStyle;
    module.exports.homeButtonSetup = homeButtonSetup;
    module.exports.mobileClick = mobileClick;
}();

},{"./globals":1}],4:[function(require,module,exports){
'use strict';

!function () {
    var g = require('./globals');

    function setup() {
        var $button = $(this);
        var $banner = $(this.parentNode);
        // if button is clicked and content is displayed
        if ($button.hasClass('clicked-button')) {
            var timing = window.scrollY == $banner.offset().top - g.topPadding ? 0 : 700;
            // first, scroll to top of banner, then change buton style and slideUp the content
            $('html, body').stop().animate({ // need to select both html and body for FireFox
                scrollTop: $banner.offset().top - g.topPadding
            }, timing, 'easeInOutQuad', function () {
                $button.removeClass('clicked-button');
                $button.css({
                    'top': '0px',
                    'transition': 'all .6s'
                });
                $banner.removeClass('shrink');
                $banner.children().first().css('padding-bottom', '20px');
                $banner.next().slideUp(600, 'easeInOutCubic');
            });
        }
        // else content must be hidden, so slideDown the content
        else {
                $button.addClass('clicked-button');
                $banner.addClass('shrink');
                $banner.children().first().css('padding-bottom', '0');
                $banner.next().slideDown(600, 'easeOutQuad');
            }
    } // end setupButtons function

    function fixed() {
        $('.plus-button').each(function (i, button) {
            if (button.classList.contains('clicked-button')) {
                var contentPosition = button.parentNode.nextSibling.nextSibling.getBoundingClientRect();
                // bottomPadding is the bottom of the content, plus nav height and button translateY
                var bottomPadding = window.innerWidth >= g.mobileMenuWidth ? '96' : '45';
                if (contentPosition.top <= String(g.topPadding) && contentPosition.bottom >= bottomPadding) {
                    $(button).css({
                        'top': -contentPosition.top + g.topPadding + 'px',
                        'transition': '0s'
                    });
                } else {
                    $(button).css({
                        'top': '0px',
                        'transition': '0s'
                    });
                }
            }
        });
    }

    module.exports.setup = setup;
    module.exports.fixed = fixed;
}();

},{"./globals":1}],5:[function(require,module,exports){
'use strict';

$(document).ready(function () {
    "use strict";

    $(function () {
        // This will select everything with the class smoothScroll
        // This should prevent problems with carousel, scrollspy, etc...
        $('.smoothScroll').click(function () {
            if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                if (target.length) {
                    // topPadding is the height of the nav, so it scrolls past the nav
                    var topPadding = $(target[0]).hasClass('banner') ? window.innerWidth >= '920' ? -51 : 0 : 0;
                    var timing = window.scrollY == $(target[0]).offset().top + topPadding ? 0 : 700;
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
                    });
                    return false;
                }
            }
        });
    });

    //Check to see if the window is top; if not then display back-to-top button
    // $(window).scroll(function() {
    //     if ($(this).scrollTop() > 100) {
    //         $('.back-to-top a').fadeIn();
    //     } else {
    //         $('.back-to-top a').fadeOut();
    //     }
    // });

    //Click event to scroll to top
    // $('.back-to-top').click(function() {
    //     $('html, body').animate({
    //         scrollTop: 0
    //     }, 400, 'ease-in-out');
    //     return false;
    // });
});

},{}]},{},[2]);
