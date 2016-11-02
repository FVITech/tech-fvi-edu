!function() {
    const mobileMenuWidth = '920';

    module.exports.plusButtons = document.getElementsByClassName('plus-button');
    module.exports.mobileMenuWidth = mobileMenuWidth;
    module.exports.topPadding = (window.innerWidth >= mobileMenuWidth) ? 52 : 0;
}();
