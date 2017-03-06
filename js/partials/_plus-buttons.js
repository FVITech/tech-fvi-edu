(function _plusButtons() {
    const g = require('./_globals')

    function open($button) {
        const $banner = $button.parentNode
        $button.addClass('opened')
        $banner.addClass('shrink')
        $banner.nextSibling.nextSibling.slideDown(600)
    }

    function close($button) {
        const $banner = $button.parentNode
        zenscroll.to($banner, 300)
        $button.removeClass('opened')
        $button.style.top = '0px'
        $button.style.transition = 'all 0.6s'
        $banner.removeClass('shrink')
        $banner.nextSibling.nextSibling.slideUp(600)
    }

    function fixed() {
        // bottomPadding is the bottom of the content, plus nav height and button translateY
        let bottomPadding = (window.innerWidth >= g.mobileMenuWidth) ? '96' : '45'
        let $openButtons = document.querySelectorAll('.plus-button.opened')
        $openButtons.forEach(btn => {
            let contentPosition = btn.parentNode.nextSibling.nextSibling.getBoundingClientRect()
            if (contentPosition.top <= String(g.topPadding) && contentPosition.bottom >= bottomPadding) {
                btn.style.top = (-(contentPosition.top) + g.topPadding) + 'px'
                btn.style.transition = '0s'
            } else {
                btn.style.top = '0px'
                btn.style.transition = '0s'
            }
        })
    }

    module.exports.open = open
    module.exports.close = close
    module.exports.fixed = fixed
})()
