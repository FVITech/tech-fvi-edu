! function() {
    // on button click, change button style and show content
    var showContentButtons = document.getElementsByClassName('show-content-button');
    for (var i = 0, x = showContentButtons.length; i < x; i++) {
        showContentButtons[i].addEventListener('click', function() {
            if (this.classList.contains('clicked-button')) {
                this.classList.remove('clicked-button');
                $(this.parentNode.childNodes[7]).slideUp(300);
            } else {
                this.classList.add('clicked-button');
                $(this.parentNode.childNodes[7]).slideDown(300);
            }
        });
    }


}();
