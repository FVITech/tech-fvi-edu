! function() {
    function show() {
        $('#overlay').fadeIn();
        $('.apply-pop-up').fadeIn();
    }

    function hide() {
        $('#overlay').fadeOut();
        $('.apply-pop-up').fadeOut();
    }

    function submit() {
        $.ajax({
            url: '',
            type: 'post',
            data: $('.apply-pop-up form').serialize(),
            success: function() {
                $(this).closest('form').fadeOut(function() {
                    $(this).closest('.sent-message').fadeIn();
                });
            }
        });
    }

    module.exports.show = show;
    module.exports.hide = hide;
    module.exports.submit = submit;
}();
