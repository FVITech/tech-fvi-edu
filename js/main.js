! function() {

    var showContentButtons = document.getElementsByClassName('show-content-button');

    // on button click, change button style and show content
    for (var i = 0, x = showContentButtons.length; i < x; i++) {
        showContentButtons[i].addEventListener('click', function() {
            if (this.classList.contains('clicked-button')) {
                this.classList.remove('clicked-button');
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
        for (var i = 0, x = showContentButtons.length; i < x; i++) {
            if (showContentButtons[i].classList.contains('clicked-button')) {
                var contentPosition = showContentButtons[i].parentNode.nextSibling.nextSibling.getBoundingClientRect();
                if (contentPosition.top <= '0' && contentPosition.bottom >= '50') {
                    showContentButtons[i].classList.add('fixed-button');
                } else {
                    showContentButtons[i].classList.remove('fixed-button');
                }
            }
        }
    });

}();
