(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

!function () {
    function show() {
        $('#overlay').fadeIn();
        $('.apply-pop-up').fadeIn();
    }

    function hide() {
        $('#overlay').fadeOut();
        $('.apply-pop-up').fadeOut();
    }

    function submit() {
        $.ajax({
            url: '',
            type: 'post',
            data: $('.apply-pop-up form').serialize(),
            success: function success() {
                $(this).closest('form').fadeOut(function () {
                    $(this).closest('.sent-message').fadeIn();
                });
            }
        });
    }

    module.exports.show = show;
    module.exports.hide = hide;
    module.exports.submit = submit;
}();

},{}],2:[function(require,module,exports){
'use strict';

!function () {
    var mobileMenuWidth = '920';

    module.exports.plusButtons = document.getElementsByClassName('plus-button');
    module.exports.mobileMenuWidth = mobileMenuWidth;
    module.exports.topPadding = window.innerWidth >= mobileMenuWidth ? 52 : 0;
}();

},{}],3:[function(require,module,exports){
'use strict';

$(document).ready(function () {
    "use strict";

    $('.page-landing.home').fadeIn(300);

    var smoothScroll = require('./smoothScroll');
    var g = require('./globals');
    var plusButtonFunctions = require('./plus-buttons');
    var menu = require('./menu');
    var form = require('./form');
    var $home = $('.page-landing.home');

    // on button click, change button style and show content-container
    $('.plus-button').click(function () {
        if ($(this).hasClass('opened')) {
            plusButtonFunctions.close(this);
        } else {
            plusButtonFunctions.open(this);
        }
    });

    // on window scroll, fixed clicked button to screen
    $(window).on('scroll', plusButtonFunctions.fixed);

    // At home page, switch pages when click on program card
    $('.card.web').click(function () {
        switchPage('web');
    });
    $('.card.cyber').click(function () {
        switchPage('cyber');
    });

    function switchPage(page) {
        // display page-specific content
        // $('.nav-item.' + page).parent().show();
        // $('.page-landing.' + page).show();
        // $('section.' + page).show();
        // $('.content.' + page).show();
        setupPage(page);
        // switch pages
        $home.fadeOut(function () {
            window.scrollTo(0, 0);
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

        // Set form program id
        var id = page == "web" ? 'WD' : 'IT';
        $("input[name='program_id']").attr('value', id);
    };

    // fade-out down-arrow in landing page when scroll
    window.addEventListener('scroll', function () {
        if (window.scrollY > '20') {
            $('.arrow-down').fadeOut(400);
        } else {
            $('.arrow-down').slideDown(400);
        }
    });

    // apply-button and form
    $('.apply-btn, .nav-item.apply').click(function (e) {
        e.preventDefault();
        form.show();
    });
    $('.apply-pop-up .close, #overlay').click(form.hide);
    $('.apply-pop-up form').submit(function (e) {
        e.preventDefault();
        form.submit();
    });

    // mobile-menu show/hide
    if (window.innerWidth < g.mobileMenuWidth) {
        $('#menu-button, #menu-items li a').click(menu.mobileClick);
    }
});

},{"./form":1,"./globals":2,"./menu":4,"./plus-buttons":5,"./smoothScroll":6}],4:[function(require,module,exports){
'use strict';

!function () {
    var g = require('./globals');

    function homeButtonSetup(navItems, page) {
        // switch to home page
        $('.programs-container').fadeOut(function () {
            window.scrollTo(0, 0);
            $('.page-landing.home').fadeIn(function () {
                // reset things to default
                $('#overlay, .apply-pop-up').hide();
                $('.plus-button.opened').css({ 'top': '0px', 'transition': '.6s' }).removeClass('opened');
                $('.banner.shrink').next().hide();
                $('.banner.shrink').removeClass('shrink');
                $('.nav-item').removeClass('section-in-view');
                $(window).off('scroll', navItemsStyle);
            });
        });
        $('.home-button').off('click', homeButtonSetup);
    }

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

    function mobileClick() {
        var $menuButton = $('#menu-button span');
        if ($menuButton.html() === 'MENU') {
            $('nav ul').show(500, 'easeOutQuad');
            $menuButton.html('CLOSE');
        } else {
            $('nav ul').hide(500, 'easeOutQuad');
            $menuButton.html('MENU');
        }
    }

    module.exports.navItemsStyle = navItemsStyle;
    module.exports.homeButtonSetup = homeButtonSetup;
    module.exports.mobileClick = mobileClick;
}();

},{"./globals":2}],5:[function(require,module,exports){
'use strict';

!function () {
    var g = require('./globals');

    function open(button) {
        var $button = $(button);
        var $banner = $(button.parentNode);
        $button.addClass('opened');
        $banner.addClass('shrink');
        $banner.next().slideDown(600, 'easeOutQuad');
    }

    function close(button) {
        var $button = $(button);
        var $banner = $(button.parentNode);
        var timing = window.scrollY == $banner.offset().top - g.topPadding ? 0 : 700;
        // first, scroll to top of banner, then change buton style and slideUp the content
        $('html, body').stop().animate({ // need to select both html and body for FireFox
            scrollTop: $banner.offset().top - g.topPadding
        }, timing, 'easeInOutQuad', function () {
            $button.removeClass('opened');
            $button.css({
                'top': '0px',
                'transition': 'all .6s'
            });
            $banner.removeClass('shrink');
            $banner.next().slideUp(600, 'easeInOutCubic');
        });
    }

    function fixed() {
        $('.plus-button.opened').each(function (i, button) {
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
        });
    }

    module.exports.open = open;
    module.exports.close = close;
    module.exports.fixed = fixed;
}();

},{"./globals":2}],6:[function(require,module,exports){
'use strict';

$(document).ready(function () {
    "use strict";

    function smoothScroll() {
        $(function () {
            // This will select everything with the class smoothScroll
            // This should prevent problems with carousel, scrollspy, etc...
            $('.smoothScroll').click(function (e) {
                e.preventDefault();
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
    }

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

    module.exports.smoothScroll = smoothScroll;
});

},{}]},{},[3]);
