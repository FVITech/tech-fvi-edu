!function() {
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
                var topPadding = ($(target[0]).hasClass('banner')) ? ((window.innerWidth >= '960') ? -52 : 0) : 0;
                var distance = $(target[0]).offset().top + topPadding - window.scrollY;
                var timing = (distance < 1 && distance >= 0) ? 0 : 700;
                $('body, html').animate({
                    scrollTop: target.offset().top + topPadding
                }, timing, 'easeInOutQuint', function() {
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
