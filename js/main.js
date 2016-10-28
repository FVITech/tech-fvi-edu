$(document).ready(function() {

    // Code for home page
    $('.web-dev').click(function() {
        $('.home-main').fadeOut(function() {
            $('.web-main').fadeIn(function() {
                setupPage();
            });
        });
    });

    $('.network-admin').click(function() {
        $('.home-main').fadeOut(function() {
            $('.cyber-main').fadeIn(function() {
                setupPage();
            });
        });
    });

    function setupPage() {
        // Code for web-dev and network-admin pages below
        var plusButtons = document.getElementsByClassName('plus-button');
        var webBanners = document.getElementsByClassName('web-banner');
        var cyberBanners = document.getElementsByClassName('cyber-banner');
        var banners = ($('.web-main').css('display') == "block") ? webBanners : ($('.cyber-main').css('display') == "block") ? cyberBanners : undefined;
        var webNavItems = document.getElementsByClassName('web-nav-item');
        var cyberNavItems = document.getElementsByClassName('cyber-nav-item');
        var navItems = ($('.web-main').css('display') == "block") ? webNavItems : ($('.cyber-main').css('display') == "block") ? cyberNavItems : undefined;
        var webLanding = document.getElementsByClassName('web-landing');
        var cyberLanding = document.getElementsByClassName('cyber-landing');
        var landing = ($('.web-main').css('display') == "block") ? webLanding : ($('.cyber-main').css('display') == "block") ? cyberLanding : undefined;

        // When click on HOME button
        $('.web-home-button').click(function() {
            $('.web-main').fadeOut(function() {
                $('.home-main').fadeIn();
            });
        });
        $('.cyber-home-button').click(function() {
            $('.cyber-main').fadeOut(function() {
                $('.home-main').fadeIn();
            });
        });

        // on button click, change button style and show content
        for (var i = 0, x = plusButtons.length; i < x; i++) {
            $(plusButtons[i]).on('click', function() {
                var button = this;
                var webBanner = (this.parentNode.classList.contains('web-banner')) ? this.parentNode : undefined;
                var cyberBanner = (this.parentNode.classList.contains('cyber-banner')) ? this.parentNode : undefined;
                var $banner = (webBanner) ? $(webBanner) : $(cyberBanner);
                // if button is clicked and content is displayed
                if (button.classList.contains('clicked-button')) {
                    // topPadding is the nav height, so it scrolls past the nav
                    var topPadding = (window.innerWidth >= '980') ? -51 : 0;
                    var timing = (window.scrollY == $banner.offset().top + topPadding) ? 0 : 700;
                    // first, scroll to top of banner, then change buton style and slideUp the content
                    $('body, html').animate({
                        scrollTop: $banner.offset().top + topPadding
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
            });
        }

        window.addEventListener('scroll', function() {

            // on window scroll, fixed clicked button to screen
            for (var i = 0, x = plusButtons.length; i < x; i++) {
                if (plusButtons[i].classList.contains('clicked-button')) {
                    var contentPosition = plusButtons[i].parentNode.nextSibling.nextSibling.getBoundingClientRect();
                    // bottomPadding is the bottom of the content, plus nav height and button translateY
                    var bottomPadding = (window.innerWidth >= '980') ? '96' : '45';
                    // topPadding accounts for nav height
                    var topPadding = (window.innerWidth >= '980') ? 51 : 0;
                    if (contentPosition.top <= String(topPadding) && contentPosition.bottom >= bottomPadding) {
                        $(plusButtons[i]).css({
                            'top': (-(contentPosition.top) + topPadding) + 'px',
                            'transition': '0s'
                        });
                    } else {
                        $(plusButtons[i]).css({
                            'top': '0px',
                            'transition': '0s'
                        });
                    }
                }
            }

            // on window scroll, add style to nav item if section is in view
            if (window.innerWidth >= '920') {
                var topPadding = (window.innerWidth >= '920') ? '51' : '0';
                for (var j = 0, y = banners.length; j < y; j++) {
                    if (landing[0].getBoundingClientRect().bottom < '86') {
                        navItems[0].classList.remove('section-in-view');
                        if (banners[j].getBoundingClientRect().top <= topPadding && (banners[j].nextSibling.nextSibling.getBoundingClientRect().bottom > topPadding || banners[j].getBoundingClientRect().bottom > topPadding)) {
                            navItems[j].classList.add('section-in-view');
                            navItems[0].classList.remove('section-in-view');
                        } else {
                            navItems[j].classList.remove('section-in-view');
                        }
                    } else {
                        navItems[0].classList.add('section-in-view');
                        navItems[j + 1].classList.remove('section-in-view');
                    }
                }
            } else {
                navItems[0].classList.remove('section-in-view');
            }

            // fade-out down-arrow in landing page when scroll
            if (window.scrollY > '20') {
                $('.arrow-down').fadeOut(400);
            } else {
                $('.arrow-down').slideDown(400);
            }

        });

        $('.arrow-down').click(function() {
            if ($(this).hasClass('clicked-button')) {
                $(plusButtons[0]).click();
            }
        });

        // Small screens adjustments below
        if (window.innerWidth < '920') {
            navItems[0].classList.remove('section-in-view');
        }

        // mobile-menu show/hide
        if (window.innerWidth < '920') {
            $('#web-menu-button, #web-overlay, #web-menu-items li a, #cyber-menu-button, #cyber-overlay, #cyber-menu-items li a').click(function() {
                if ($('#web-menu-button, #cyber-menu-button').html() == '<i class="fa fa-bars" aria-hidden="true"></i> MENU') {
                    $('#web-menu-button, #cyber-menu-button').html('<i class="fa fa-bars" aria-hidden="true"></i> CLOSE');
                } else {
                    $('#web-menu-button, #cyber-menu-button').html('<i class="fa fa-bars" aria-hidden="true"></i> MENU');
                }
                $('#web-overlay, #cyber-overlay').fadeToggle();
                $('nav ul').toggle(500, 'easeOutQuad');
            });
        }
    };



});
