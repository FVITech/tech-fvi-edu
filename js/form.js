! function() {
    const g = require('./globals');

    function show() {
        g.$overlay.fadeIn();
        g.$applyPopUp.fadeIn();
        return false;
    }

    function hide() {
        g.$overlay.fadeOut();
        g.$applyPopUp.fadeOut();
        return false;
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
        return false;
    }

    module.exports.show = show;
    module.exports.hide = hide;
    module.exports.submit = submit;
}();
