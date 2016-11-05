! function() {
    const g = require('./globals');

    function open(button) {
        var $banner = $(button.parentNode);
        $(button).addClass('opened');
        $banner.addClass('shrink');
        $banner.next().slideDown(600, 'easeOutQuad');
    }

    function close(button) {
        var $button = $(button);
        var $banner = $(button.parentNode);
        var distance = (window.innerWidth >= g.mobileMenuWidth) ? $banner.offset().top - g.topPadding - window.scrollY : $banner.offset().top - window.scrollY;
        var timing = (distance <= 1 && distance >= 0) ? 0 : 700;
        $('html, body').stop().animate({ // need to select both html and body for FireFox
            scrollTop: $banner.offset().top - g.topPadding
        }, timing, 'easeInOutQuad', function() {
            $button.removeClass('opened').css({
                'top': '0px',
                'transition': 'all .6s'
            });
            $banner.removeClass('shrink').next().slideUp(600, 'easeInOutCubic');
        });
    }

    function fixed() {
        g.$plusButtons.filter('.opened').each(function(i, button) {
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
        });
    }

    module.exports.open = open;
    module.exports.close = close;
    module.exports.fixed = fixed;
}();
