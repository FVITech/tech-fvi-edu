(function(code) {
    "use strict";
    code(window.jQuery, window, document);

}(function($, window, document) {
    "use strict";

    const g = require('./globals');
    const pb = require('./plus-buttons');
    const menu = require('./menu');
    const form = require('./form');
    const smoothScroll = require('./smoothScroll');
    let initialUrlHasPath;
    const homeData = {
        path: 'home',
        title: 'Learn to Code at the Florida Vocational Institute - Evening Coding Bootcamp'
    };
    const webData = {
        path: 'web-developer-program',
        title: 'FVI Will Turn You Into A Web Developer'
    };
    const cyberData = {
        path: 'network-administrator-program',
        title: 'FVI Will Turn You Into A Network Administrator'
    };
    if(window.location.href.indexOf('web-developer-program') !== -1 ||
       window.location.href.indexOf('network-administrator-program') !== -1) {
         initialUrlHasPath = true;
    } else {
        initialUrlHasPath = false;
        history.replaceState(homeData, homeData.path, "#/" + homeData.path);
    }
    var state;

    var pageSetup = {
        onReady: function() {
            pageSetup.checkUrl();
            smoothScroll.init();
            g.$cards.filter('.web').on('click', () => {
                pageSetup.switchPage('web')
            });
            g.$cards.filter('.cyber').on('click', () => {
                pageSetup.switchPage('cyber')
            });
            g.$homeButton.on('click', function(e) {
                e.preventDefault();
                history.pushState(homeData, homeData.path, '#/' + homeData.path);
                menu.homeButton();
                return false;
            });
            $(window).on('popstate', (e) => {
                pageSetup.checkUrl();
                state = window.history.state.path;
            });
            g.$applyButtons.on('click', pageSetup.applyButtonsFunctionality);
            $('#apply-close, #overlay').on('click', form.hide);
            g.$applyForm.on('click', form.show);
            $('#submit-apply').on('click', pageSetup.formSubmit);
            g.$plusButtons.on('click', pageSetup.plusButtonsFunctionality);
            if (window.innerWidth < g.mobileMenuWidth) {
                $('#menu-button, #menu-items a').click(menu.mobileClick);
            }
            return false;
        },
        checkUrl: function() {
            if(window.history.state.path === state || window.location.href.indexOf('home') !== -1) {
                document.title = homeData.title;
                history.pushState(homeData, homeData.path, "#/" + homeData.path);
                menu.homeButton();
                $('html').fadeIn(900);
            } else if (window.location.href.indexOf('web-developer-program') !== -1) {
                $('#radio-web')[0].checked = true;
                pageSetup.switchPage('web');
            } else if (window.location.href.indexOf('network-administrator-program') !== -1) {
                $('#radio-cyber')[0].checked = true;
                pageSetup.switchPage('cyber');
            }
        },
        switchPage: function(page) {
            var stateData = (page === 'web') ? webData : cyberData;
            history.pushState(stateData, stateData.path, "#/" + stateData.path);
            document.title = stateData.title;
            window.history.forward();

            var navItems = g.$navItems.filter('.' + page);
            var banners = g.$banners.filter('.' + page);
            var landing = $('#page-landing_' + page)[0];

            // on scroll, fix plus-buttons to screen and add nav styles
            let $downArrows = $('a.arrow-down');
            if (window.innerWidth >= g.mobileMenuWidth) {
                $(window).on('scroll', function() {
                    pb.fixed();
                    (window.scrollY > '20') ? $downArrows.fadeOut(400): $downArrows.slideDown(400);
                    menu.navItemsStyle(navItems, banners, landing);
                    return false;
                });
            } else {
                $(window).on('scroll', function() {
                    pb.fixed();
                    (window.scrollY > '20') ? $downArrows.fadeOut(400): $downArrows.slideDown(400);
                });
            }

            // Set form program id
            let id = (page == "web") ? 'WD' : 'IT';
            g.$applyPopUp.find("input[name='program_id']").attr('value', id);

            // animate switching pages
            if(initialUrlHasPath) {
                g.$pageLandingHome.hide();
                g.$programsContainer.show();
                $('html').fadeIn();
            }
            else {
              g.$pageLandingHome.fadeOut(function() {
                  window.scrollTo(0, 0);
                  g.$programsContainer.fadeIn();
                  return false;
              });
            }

            return false;
        },
        applyButtonsFunctionality: function(e) {
            e.preventDefault();
            form.show();
            return false;
        },
        formSubmit: function(e) {
            e.preventDefault();
            form.submit();
            return false;
        },
        plusButtonsFunctionality: function() {
            ($(this).hasClass('opened')) ? pb.close(this): pb.open(this);
            return false;
        }
    };

    $(document).ready(pageSetup.onReady);

    return false;
}));
