! function() {
    const g = require('./globals');

    function show() {
        g.$overlay.fadeIn();
        g.$applyPopUp.fadeIn();
    }

    function hide() {
        g.$overlay.fadeOut();
        g.$applyPopUp.fadeOut();
    }

    function submit() {
        $.ajax({
            url: '',
            type: 'post',
            data: g.$applyForm.serialize(),
            success: function() {
                g.$applyForm.fadeOut(function() {
                    $('#sent-message').fadeIn();
                });
            }
        });
    }

    module.exports.show = show;
    module.exports.hide = hide;
    module.exports.submit = submit;
}();
