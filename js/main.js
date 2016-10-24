$(document).ready(function() {

    var fadeSpeed = 700;
    var slideSpeed = 400;

    $('.card').click(function() {
        if( $(this).next().css('display') == "none" ) {
            var position = window.scrollY;
            $(this).next().css('top', position + 'px').fadeIn(fadeSpeed);
            $('#overlay').fadeIn(fadeSpeed);
        }
    });

    $('#overlay').click(function() {
        if( $(this).css('display') == 'block' ) {
            $('.content-container').fadeOut(fadeSpeed);
            $(this).fadeOut(fadeSpeed);
        }
    });

    $('.content-close').click(function() {
        $('.content-container').fadeOut(fadeSpeed);
        $('#overlay').fadeOut(fadeSpeed);
    });

    $('.content h4').click(function() {
        if( $(this).next().css('display') == "none" ) {
            $(this).next().slideDown(slideSpeed);
        }
        else {
            $(this).next().slideUp(slideSpeed);
        }
    });

});
