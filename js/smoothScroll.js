$(document).ready(function() {

    $(function() {
        // This will select everything with the class smoothScroll
        // This should prevent problems with carousel, scrollspy, etc...
        $('.smoothScroll').click(function() {
            if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                if (target.length) {
                    $('html,body').animate({
                        scrollTop: target.offset().top
                    }, 900, 'easeInOutQuart'); // The number here represents the speed of the scroll in milliseconds
                    return false;
                }
            }
        });
    });

    //Check to see if the window is top; if not then display button
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
