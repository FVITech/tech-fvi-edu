!function() {
    const $overlay = $('#overlay');
    const $pageLandingHome = $('#page-landing_home');
    const $pageLandingWeb = $('#page-landing_web');
    const $pageLandingCyber = $('#page-landing_cyber');
    const $applyPopUp = $('#apply-pop-up');
    const $applyForm = $applyPopUp.find('form');
    const $applyButtons = $('#nav-apply-btn, #cta-apply-btn');
    const $programsContainer = $('#programs-container');
    const $homeButton = $('#home-button');
    const $menu = $('#menu-items');
    const $navItems = $menu.find('a.nav-item');
    const $sections = $programsContainer.find('section');
    const $banners = $sections.find('div.banner');
    const $plusButtons = $banners.find('span.plus-button');

    module.exports.mobileMenuWidth = '920';
    module.exports.topPadding = (window.innerWidth >= '920') ? 52 : 0;
    module.exports.$overlay = $overlay;
    module.exports.$pageLandingHome = $pageLandingHome;
    module.exports.$pageLandingWeb = $pageLandingWeb;
    module.exports.$pageLandingCyber = $pageLandingCyber;
    module.exports.$applyPopUp = $applyPopUp;
    module.exports.$applyForm = $applyForm;
    module.exports.$applyButtons = $applyButtons;
    module.exports.$programsContainer = $programsContainer;
    module.exports.$homeButton = $homeButton;
    module.exports.$menu = $menu;
    module.exports.$navItems = $navItems;
    module.exports.$sections = $sections;
    module.exports.$banners = $banners;
    module.exports.$plusButtons = $plusButtons;
}();
