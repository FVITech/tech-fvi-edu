(function _menu() {
    const g = require('./_globals')

    function navItemsStyle(navItems, banners, landing) {
        // if window scroll position is between a banner, add nav style to corresponding nav item
        if (landing.getBoundingClientRect().bottom < '-24') {
            for (let j = 0, y = banners.length; j < y; j++) {
                if (banners[j].getBoundingClientRect().top <= g.topPadding + 1 && (banners[j].nextSibling.nextSibling.getBoundingClientRect().bottom > g.topPadding || banners[j].getBoundingClientRect().bottom > g.topPadding)) {
                    navItems[j].classList.add('section-in-view')
                } else {
                    navItems[j].classList.remove('section-in-view')
                }
            }
        } else {
            g.$navItems.removeClass('section-in-view')
        }
    }

    function mobileClick() {
        const $menuButton = $('#menu-button span')
        if ($menuButton.textContent === 'MENU') {
            g.$menuItems.slideDown()
            $menuButton.textContent = 'CLOSE'
        } else {
            g.$menuItems.slideUp()
            $menuButton.textContent = 'MENU'
        }
    }

    module.exports.navItemsStyle = navItemsStyle
    module.exports.mobileClick = mobileClick
})()
