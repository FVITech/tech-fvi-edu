! function() {

    var plusButtons = document.getElementsByClassName('show-content-button');

    // on button click, change button style and show content
    for (var i = 0, x = plusButtons.length; i < x; i++) {
        plusButtons[i].addEventListener('click', function() {
            if (this.classList.contains('clicked-button')) {
                this.classList.remove('clicked-button');
                this.classList.remove('fixed-button');
                this.parentNode.style.padding = '100px 0 140px';
                $(this.parentNode.nextSibling.nextSibling).slideUp(600);
            } else {
                this.classList.add('clicked-button');
                this.parentNode.style.padding = '20px 0';
                $(this.parentNode.nextSibling.nextSibling).slideDown(600);
            }
        });
    }

    // on window scroll, fixed clicked button to screen
    window.addEventListener('scroll', function() {
        for (var i = 0, x = plusButtons.length; i < x; i++) {
            if (plusButtons[i].classList.contains('clicked-button')) {
                var contentPosition = plusButtons[i].parentNode.nextSibling.nextSibling.getBoundingClientRect();
                if (contentPosition.top <= '40' && contentPosition.bottom >= '90') {
                    plusButtons[i].classList.add('fixed-button');
                } else {
                    plusButtons[i].classList.remove('fixed-button');
                }
            }
        }
    });

    // mobile-menu show/hide
    if (window.innerWidth < '830') {
        $('#menu-button, #overlay, #menu-items li a').click(function() {
            $('#overlay').fadeToggle();
            $('#menu-items').slideToggle(300);
        });
    }

}();
