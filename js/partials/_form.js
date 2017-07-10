import 'whatwg-fetch';
(function _form() {
    const g = require('./_globals');

    let $message = $('#sent-message')

    function show() {
        g.$overlay.fadeIn()
        g.$applyPopUp.fadeIn()
    }

    function hide() {
        g.$overlay.fadeOut()
        g.$applyPopUp.fadeOut()
    }

    function buildFormData(){
      return {
        fname: $("#form-full_name").value.split(" ")[0],
        lname: $("#form-full_name").value.split(" ").slice(1).join(" "),
        email: $("#form-email").value,
        phone: $("#form-day_phone").value
      }
    }
    function resetForm(){
      $("#form-full_name").value="";
      $("#form-email").value="";
      $("#form-day_phone").value=""
    }

    function sendForm() {
      var data = buildFormData();
      if (!data || !data.fname || !data.lname) {
        alert ("Please input your full name");
        return;
      }
      if (! data.email){
        alert ("Please input your email");
        return;
      }
      if (! data.phone){
        alert ("Please input your phone number");
        return;
      }
      fetch('http://fvi-grad.com:4004/submittechfviform', {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(data),
      })
      .then(res=>{
        console.log(res);
        if (res.status != 200){
          console.log("Caught bad response");
          throw {message: 'Bad response from server: '+res.status, serverRes: res};
        }
        $(".form").fadeOut();
        $message.fadeIn()
        console.log("made it here");
        setTimeout(function() {
            resetForm()
        }, 300);
      })
      .catch(err=>{
        console.log("Entering catch clause");
        if (typeof err === 'object')
          alert(JSON.stringify(err));
        console.log(err);
      })

    }

    module.exports.show = show;
    module.exports.hide = hide;
    module.exports.send = sendForm;
})()
