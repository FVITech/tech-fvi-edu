$(document).ready(function() {

    var fadeSpeed = 300;
    var easing = 'easeOutBack';
    var slideSpeed = 400;

    $('.card').click(function() {
        if( $(this).next().css('display') == "none" ) {
            var position = window.scrollY;
            $(this).next().css('top', position + 'px').fadeIn(fadeSpeed);
            $('#overlay').fadeIn(fadeSpeed);
        }
        $('.tooltip').hide();
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
            $(this).next().slideDown(slideSpeed, easing);
        }
        else {
            $(this).next().slideUp(slideSpeed, 'easeOutCubic');
        }
    });

});
