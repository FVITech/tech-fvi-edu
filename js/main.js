$(document).ready(function() {
    "use strict";
    var plusButtons = document.getElementsByClassName('plus-button');
    var webBanners = document.getElementsByClassName('web-banner');
    var cyberBanners = document.getElementsByClassName('cyber-banner');
    var webNavItems = document.getElementsByClassName('web-nav-item');
    var cyberNavItems = document.getElementsByClassName('cyber-nav-item');
    var webLanding = document.getElementsByClassName('web-landing')[0];
    var cyberLanding = document.getElementsByClassName('cyber-landing')[0];
    var mobileMenuWidth = '920';
    var topPadding = (window.innerWidth >= mobileMenuWidth) ? 51 : 0;

    // Code for home page
    $('.web-dev').click(function() {
        $('.home-main').fadeOut(function() {
            window.scrollTo(0, 0);
            $('.web-main').fadeIn(function() {
                setupPage('web');
            });
        });
    });

    $('.network-admin').click(function() {
        $('.home-main').fadeOut(function() {
            window.scrollTo(0, 0);
            $('.cyber-main').fadeIn(function() {
                setupPage('cyber');
            });
        });
    });

    function setupPage(page) {
        var banners = (page == 'web') ? webBanners : cyberBanners;
        var navItems = (page == 'web') ? webNavItems : cyberNavItems;
        var landing = (page == 'web') ? webLanding : cyberLanding;

        // When click on HOME button
        $('.' + page + '-home-button').click(function() {
            // Reset everything to default and remove event listeners
            window.removeEventListener('scroll', fixedButton);
            window.removeEventListener('scroll', navItemsStyle);
            for (var i = 0, x = plusButtons.length; i < x; i++) {
                if(plusButtons[i].classList.contains('clicked-button')) {
                    $(plusButtons[i]).click();
                }
                $(plusButtons[i]).off('click', buttonStyle);
            }
            for(var f = 0, g = navItems.length; f < g; f++) {
                navItems[f].classList.remove('section-in-view');
            }
            $('.' + page + '-main').fadeOut(function() {
                $('.home-main').fadeIn();
            });
        });

        // on button click, change button style and show content
        for (var i = 0, x = plusButtons.length; i < x; i++) {
            $(plusButtons[i]).on('click', buttonStyle);
        }

        function buttonStyle() {
            var button = this;
            var $banner = (this.parentNode.classList.contains(page + '-banner')) ? $(this.parentNode) : undefined;
            // if button is clicked and content is displayed
            if (button.classList.contains('clicked-button')) {
                var timing = (window.scrollY == $banner.offset().top - topPadding) ? 0 : 700;
                // first, scroll to top of banner, then change buton style and slideUp the content
                $('body, html').stop().animate({
                    scrollTop: $banner.offset().top - topPadding
                }, timing, 'easeInOutQuad', function() {
                    button.classList.remove('clicked-button');
                    $(button).css({
                        'top': '0px',
                        'transition': '.6s'
                    });
                    $banner.css('padding', '100px 0 140px');
                    $banner.css('box-shadow', '0 0 4px 1px #111');
                    $banner.children().first().css('padding-bottom', '20px');
                    $banner.next().slideUp(600, 'easeInOutCubic');
                });
            }
            // else content must be hidden, so slideDown the content
            else {
                button.classList.add('clicked-button');
                $banner.css('padding', '20px 0');
                $banner.css('box-shadow', '0 -2px 4px 0px #111');
                $banner.children().first().css('padding-bottom', '0');
                $banner.next().slideDown(600, 'easeOutQuad');
            }
        } // end buttonStyle function

        // on window scroll, fixed clicked button to screen
        window.addEventListener('scroll', fixedButton);

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

        // on window scroll, add style to nav item if section is in view
        if (window.innerWidth >= mobileMenuWidth) {
            window.addEventListener('scroll', navItemsStyle);
        }

        function navItemsStyle() {
            // if window scroll position is between a banner, add nav style to corresponding nav item
            for (var j = 0, y = banners.length; j < y; j++) {
                if (landing.getBoundingClientRect().bottom < '86') {
                    if (banners[j].getBoundingClientRect().top <= topPadding && (banners[j].nextSibling.nextSibling.getBoundingClientRect().bottom > topPadding || banners[j].getBoundingClientRect().bottom > topPadding)) {
                        navItems[j].classList.add('section-in-view');
                    } else {
                        navItems[j].classList.remove('section-in-view');
                    }
                } else {
                    navItems[j].classList.remove('section-in-view');
                }
            }
        } // end navItemsStyle function

    }; // end setupPage function

    // mobile-menu show/hide
    if (window.innerWidth < mobileMenuWidth) {
        $('#web-menu-button, #web-overlay, #web-menu-items li a, #web-menu-items li span, #cyber-menu-button, #cyber-overlay, #cyber-menu-items li a, #cyber-menu-items li span').click(function() {
            var $menuButton = $('#web-menu-button, #cyber-menu-button');
            if ($menuButton.html() === '<i class="fa fa-bars" aria-hidden="true"></i> MENU') {
                $menuButton.html('<i class="fa fa-bars" aria-hidden="true"></i> CLOSE');
            } else {
                $menuButton.html('<i class="fa fa-bars" aria-hidden="true"></i> MENU');
            }
            $('#web-overlay, #cyber-overlay').fadeToggle();
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

});
