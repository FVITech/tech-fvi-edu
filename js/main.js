const smoothScroll = require('./smoothScroll');

$(document).ready(function() {
    "use strict";
    var plusButtons = document.getElementsByClassName('plus-button');
    var webLanding = document.getElementsByClassName('page-landing web')[0];
    var cyberLanding = document.getElementsByClassName('page-landing cyber')[0];
    var mobileMenuWidth = '920';
    var topPadding = (window.innerWidth >= mobileMenuWidth) ? 51 : 0;

    // Code for home page
    $('.card.web').click(function() {
        switchPage('web')
    });
    $('.card.cyber').click(function() {
        switchPage('cyber')
    });

    function switchPage(page) {
        $('.page-landing.home').fadeOut(function() {
            window.scrollTo(0, 0);
            var displayType = (window.innerWidth >= mobileMenuWidth) ? 'inline-block' : 'block';
            $('.nav-item.' + page).parent().css('display', displayType);
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
        $('.home-button').on('click', function(e) {
            e.preventDefault();
            setupHomeButton(navItems, page);
        });

        // on window scroll, add style to nav item if section is in view
        if (window.innerWidth >= mobileMenuWidth) {
            $(window).on('scroll', function() {
                navItemsStyle(navItems, page, banners, landing)
            });
        }


    }; // end setupPage function

    function setupHomeButton(navItems, page) {
        $('.programs-container').fadeOut(function() {
            for (var i = 0, x = plusButtons.length; i < x; i++) {
                if ($(plusButtons[i]).hasClass('clicked-button')) {
                    $(plusButtons[i]).trigger('click');
                }
            }
            $('.page-landing.home').fadeIn(function() {
                for (var f = 0, g = navItems.length; f < g; f++) {
                    navItems[f].classList.remove('section-in-view');
                }
                $('.content.' + page).hide();
                $('section.' + page).hide();
                $('.page-landing.' + page).hide();
                $('.nav-item.' + page).parent().hide();
                $(window).off('scroll', navItemsStyle);
            });
        });
        $('.home-button').off('click', setupHomeButton);
    }

    function navItemsStyle(navItems, page, banners, landing) {
        // if window scroll position is between a banner, add nav style to corresponding nav item
        if (landing.getBoundingClientRect().bottom < '-24') {
            for (var j = 0, y = banners.length; j < y; j++) {
                if (banners[j].getBoundingClientRect().top <= topPadding && (banners[j].nextSibling.nextSibling.getBoundingClientRect().bottom > topPadding || banners[j].getBoundingClientRect().bottom > topPadding)) {
                    navItems[j].classList.add('section-in-view');
                } else {
                    navItems[j].classList.remove('section-in-view');
                }
            }
        } else {
            $('navItems').removeClass('section-in-view');
        }
    }

    // mobile-menu show/hide
    if (window.innerWidth < mobileMenuWidth) {
        $('#menu-button, #overlay, #menu-items li a').click(function() {
            var $menuButton = $('#menu-button');
            if ($menuButton.html() === '<i class="fa fa-bars" aria-hidden="true"></i> MENU') {
                $menuButton.html('<i class="fa fa-bars" aria-hidden="true"></i> CLOSE');
            } else {
                $menuButton.html('<i class="fa fa-bars" aria-hidden="true"></i> MENU');
            }
            $('#overlay').fadeToggle();
            $('nav ul').toggle(500, 'easeOutQuad');
        });
    }


    // fade-out down-arrow in landing page when scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > '20') {
            $('.arrow-down').fadeOut(400);
        } else {
            $('.arrow-down').slideDown(400);
        }
    });


    // on button click, change button style and show content
    $('body').on('click', '.plus-button', setupButtons);

    function setupButtons() {
        var $button = $(this);
        var $banner = $(this.parentNode);
        // if button is clicked and content is displayed
        if ($button.hasClass('clicked-button')) {
            var timing = (window.scrollY == $banner.offset().top - topPadding) ? 0 : 700;
            // first, scroll to top of banner, then change buton style and slideUp the content
            $('html, body').stop().animate({ // need to select both html and body for FireFox
                scrollTop: $banner.offset().top - topPadding
            }, timing, 'easeInOutQuad', function() {
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
            $banner.addClass('shrink')
            $banner.children().first().css('padding-bottom', '0');
            $banner.next().slideDown(600, 'easeOutQuad');
        }
    } // end setupButtons function

    // on window scroll, fixed clicked button to screen
    $(window).on('scroll', fixedButton);

    function fixedButton() {
        $('.plus-button').each(function(i, button) {
            if (button.classList.contains('clicked-button')) {
                var contentPosition = button.parentNode.nextSibling.nextSibling.getBoundingClientRect();
                // bottomPadding is the bottom of the content, plus nav height and button translateY
                var bottomPadding = (window.innerWidth >= mobileMenuWidth) ? '96' : '45';
                if (contentPosition.top <= String(topPadding) && contentPosition.bottom >= bottomPadding) {
                    $(button).css({
                        'top': (-(contentPosition.top) + topPadding) + 'px',
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
    } // end fixedButton function

});
