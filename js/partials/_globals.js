(function _globals() {
    const $overlay = $('#overlay')
    const $cards = $('label.card')
    const $applyPopUp = $('#apply-pop-up')
    const $applyForm = $applyPopUp.querySelectorAll('.form')
    const $applyButtons = $('#nav-apply-btn, #cta-apply-btn, #contact-home, .request-info')
    const $pagesContainer = $('#pages-container')
    const $homeButton = $('#home-button')
    const $menuItems = $('#menu-items')
    const $navItems = $('a.nav-item')
    const $sections = $pagesContainer.querySelectorAll('section')
    const $banners = $('.banner')
    const $plusButtons = $('span.plus-button')

    module.exports.mobileMenuWidth = '960'
    module.exports.topPadding = (window.innerWidth >= '960') ? 52 : 0
    module.exports.$overlay = $overlay
    module.exports.$cards = $cards
    module.exports.$applyPopUp = $applyPopUp
    module.exports.$applyForm = $applyForm
    module.exports.$applyButtons = $applyButtons
    module.exports.$pagesContainer = $pagesContainer
    module.exports.$homeButton = $homeButton
    module.exports.$menuItems = $menuItems
    module.exports.$navItems = $navItems
    module.exports.$sections = $sections
    module.exports.$banners = $banners
    module.exports.$plusButtons = $plusButtons
})()
