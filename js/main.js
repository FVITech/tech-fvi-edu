! function() {

    var plusButtons = document.getElementsByClassName('plus-button');
    var banners = document.getElementsByClassName('banner');

    // on button click, change button style and show content
    for (var i = 0, x = plusButtons.length; i < x; i++) {
        $(plusButtons[i]).on('click', function() {
            var button = this;
            var banner = (this.parentNode.classList.contains('banner')) ? this.parentNode : (function() {alert("expected button's parentNode to be a banner, but it was not.")})();
            // if button is clicked and content is displayed
            if (button.classList.contains('clicked-button')) {
                // topPadding is the nav height, so it scrolls past the nav
                // var topPadding = (window.innerWidth >= '980') ? -51 : 0;
                var $banner = $(banner);
                var timing = (window.scrollY == $banner.offset().top /* + topPadding */) ? 0 : 700;
                // first, scroll to top of banner, then change buton style and slideUp the content
                $('body, html').animate({
                    scrollTop: $banner.offset().top // + topPadding
                }, timing, 'easeInOutQuad', function() {
                    button.classList.remove('clicked-button');
                    $(button).css({
                        'top': '0px',
                        'transition': '.6s'
                    });
                    banner.style.padding = '100px 0 140px';
                    banner.style.boxShadow = '0 0 4px 1px #111';
                    banner.childNodes[1].style.paddingBottom = '20px';
                    $(banner.nextSibling.nextSibling).slideUp(600, 'easeInOutCubic');
                });
            }
            // else content must be hidden, so slideDown the content
            else {
                button.classList.add('clicked-button');
                banner.style.padding = '20px 0';
                banner.style.boxShadow = '0 -2px 4px 0px #111';
                banner.childNodes[1].style.paddingBottom = '0';
                $(banner.nextSibling.nextSibling).slideDown(600, 'easeOutQuad');
            }
        });
    }

    window.addEventListener('scroll', function() {

        // on window scroll, fixed clicked button to screen
        for (var i = 0, x = plusButtons.length; i < x; i++) {
            if (plusButtons[i].classList.contains('clicked-button')) {
                var contentPosition = plusButtons[i].parentNode.nextSibling.nextSibling.getBoundingClientRect();
                // bottomPadding is the bottom of the content, plus nav height and button translateY
                var bottomPadding = (window.innerWidth >= '980') ? '96' : '45';
                // topPadding accounts for nav height
                var topPadding = (window.innerWidth >= '980') ? 51 : 0;
                if (contentPosition.top <= String(topPadding) && contentPosition.bottom >= bottomPadding) {
                    $(plusButtons[i]).css({
                        'top': (-(contentPosition.top) + topPadding) + 'px',
                        'transition': '0s'
                    });
                } else {
                    $(plusButtons[i]).css({
                        'top': '0px',
                        'transition': '0s'
                    });
                }
            }
        }

    });

}();
