(function _form() {
    const g = require('./_globals')
    let $message = $('#sent-message')

    function show() {
        g.$overlay.removeClass('hidden')
        g.$applyPopUp.removeClass('hidden')
    }

    function hide() {
        g.$overlay.addClass('hidden')
        g.$applyPopUp.addClass('hidden')
    }

    // Not my code. Got it from:
    // https://plainjs.com/javascript/ajax/serialize-form-data-into-an-array-46/
    function serializeArray(form) {
        var field, l, s = [];
        if (typeof form == 'object' && form.nodeName == "FORM") {
            var len = form.elements.length;
            for (i=0; i<len; i++) {
                field = form.elements[i];
                if (field.name && !field.disabled && field.type != 'file' && field.type != 'reset' && field.type != 'submit' && field.type != 'button') {
                    if (field.type == 'select-multiple') {
                        l = form.elements[i].options.length;
                        for (j=0; j<l; j++) {
                            if(field.options[j].selected)
                                s[s.length] = { name: field.name, value: field.options[j].value };
                        }
                    } else if ((field.type != 'checkbox' && field.type != 'radio') || field.checked) {
                        s[s.length] = { name: field.name, value: field.value };
                    }
                }
            }
        }
        return s;
    }

    function sendForm() {
        return fetch({
            url: 'http://fvi-grad.com:4004/fakeform',
            type: 'post',
            data: serializeArray(g.$applyForm)
        })
    }

    function send() {
        sendForm().done(function() {
            g.$applyForm.removeClass('hidden')
            setTimeout(function() {
                $message.addClass('hidden')
                g.$applyForm.reset()
            }, 300)
        })
    }

    module.exports.show = show
    module.exports.hide = hide
    module.exports.send = send
})()
