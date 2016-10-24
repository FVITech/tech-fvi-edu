$(document).ready(function() {

    $(function() {
        $('.smoothScroll').click(function() {
            if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                if (target.length) {
                    // topPadding is the height of the nav, so it scrolls past the nav
                    // var topPadding = ($(target[0]).hasClass('banner')) ? ((window.innerWidth >= '980') ? -51 : 0) : 0;
                    var timing = (window.scrollY == $(target[0]).offset().top /* + topPadding */) ? 0 : 700;
                    $('body, html').animate({
                        scrollTop: target.offset().top // + topPadding
                    }, timing, 'easeInOutQuad');
                    return false;
                }
            }
        });
    });

});
