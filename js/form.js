(function() {
    const g = require('./globals');
    let $message = $('#sent-message');

    function show() {
        g.$overlay.fadeIn();
        g.$applyPopUp.fadeIn();
        return false;
    }

    function hide() {
        g.$overlay.fadeOut();
        g.$applyPopUp.fadeOut(function() {
          g.$applyForm.show();
          $message.hide();
        });
        return false;
    }

    function submit() {

        function sendForm() {
            return $.ajax({
                url: 'http://fvi-grad.com:4004/fakeform',
                type: 'post',
                data: g.$applyForm.serialize()
            });
        }

        sendForm().done(function() {
            g.$applyForm.fadeOut(function() {
                $message.fadeIn();
                g.$applyForm[0].reset();
            });
        }).fail(function(error) {
            console.log(error);
            $message.fadeIn();
            $message.find('h3').html('Uh Oh!');
            $message.find('p').html('Looks like there was an error sending your message.\nPlease call 786-574-9511 to speak with a representative from FVI.');
        });
        return false;
    }

    module.exports.show = show;
    module.exports.hide = hide;
    module.exports.submit = submit;
})();
