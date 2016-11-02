!function() {
    const g = require('./globals');

    function setup() {
        var $button = $(this);
        var $banner = $(this.parentNode);
        // if button is clicked and content is displayed
        if ($button.hasClass('clicked-button')) {
            var timing = (window.scrollY == $banner.offset().top - g.topPadding) ? 0 : 700;
            // first, scroll to top of banner, then change buton style and slideUp the content
            $('html, body').stop().animate({ // need to select both html and body for FireFox
                scrollTop: $banner.offset().top - g.topPadding
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

    function fixed() {
        $('.plus-button').each(function(i, button) {
            if (button.classList.contains('clicked-button')) {
                var contentPosition = button.parentNode.nextSibling.nextSibling.getBoundingClientRect();
                // bottomPadding is the bottom of the content, plus nav height and button translateY
                var bottomPadding = (window.innerWidth >= g.mobileMenuWidth) ? '96' : '45';
                if (contentPosition.top <= String(g.topPadding) && contentPosition.bottom >= bottomPadding) {
                    $(button).css({
                        'top': (-(contentPosition.top) + g.topPadding) + 'px',
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
