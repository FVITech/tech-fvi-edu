$(document).ready(function() {

    $(function() {
        // This will select everything with the class smoothScroll
        // This should prevent problems with carousel, scrollspy, etc...
        $('.smoothScroll').click(function() {
            if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                if (target.length) {
                    var topPadding = ($(target[0]).hasClass('banner')) ? -50 : 0;
                    $('body').animate({
                        scrollTop: target.offset().top + topPadding
                    }, 900, 'easeInOutQuart', function() {
                        if($(target[0]).has('span.plus-button')) {
                            var nodes = target[0].childNodes;
                            for(var i = 0, x = nodes.length; i < x; i++) {
                                if(nodes[i].classList == 'plus-button') {
                                    $(nodes[i]).click();
                                }
                            }
                        }
                    }); // The number here represents the speed of the scroll in milliseconds
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
