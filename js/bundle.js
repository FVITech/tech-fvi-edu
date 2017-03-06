(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){"use strict";(function DOMquery(){window.$=function(query){var elements=document.querySelectorAll(query);if(elements.length===1)return elements[0];return elements};Object.prototype.addClass=function(){var _this=this;for(var _len=arguments.length,classNames=Array(_len),_key=0;_key<_len;_key++){classNames[_key]=arguments[_key]}if(!this[0]){classNames.forEach(function(className){_this.classList.add(className)});return this}this.forEach(function(el){classNames.forEach(function(className){el.classList.add(className)})});return this};Object.prototype.removeClass=function(){var _this2=this;for(var _len2=arguments.length,classNames=Array(_len2),_key2=0;_key2<_len2;_key2++){classNames[_key2]=arguments[_key2]}if(!this[0]){classNames.forEach(function(className){_this2.classList.remove(className)});return this}this.forEach(function(el){classNames.forEach(function(className){el.classList.remove(className)})});return this}})()},{}],2:[function(require,module,exports){"use strict";(function mainFunction(){"use strict";require("./dom-query.js");require("dom-slider");var g=require("./partials/_globals");var router=require("./partials/_router");var pb=require("./partials/_plus-buttons");var menu=require("./partials/_menu");var form=require("./partials/_form");var preventPopstateScroll=require("prevent-popstate-scroll");var setup={initAll:function initAll(){setup.urlRouter();setup.clickRouter();window.addEventListener("popstate",setup.urlRouter);preventPopstateScroll.prevent();setup.smoothScroll();g.$applyButtons.forEach(function(btn){btn.addEventListener("click",function(e){e.preventDefault();form.show()})});$("#apply-close").addEventListener("click",form.hide);g.$overlay.addEventListener("click",function(){form.hide();if(window.innerWidth<=g.mobileMenuWidth){if($("#menu-button span").textContent==="CLOSE"){menu.mobileClick()}}});g.$plusButtons.forEach(function(btn){btn.addEventListener("click",function(){this.classList.contains("opened")?pb.close(this):pb.open(this)})});if(window.innerWidth<g.mobileMenuWidth){$("#menu-button").addEventListener("click",menu.mobileClick);$("#menu-items a").forEach(function(item){item.addEventListener("click",menu.mobileClick)})}},urlRouter:function urlRouter(){if(location.hash===""){document.title=router.routes.home.title;router.load(router.routes.home);history.replaceState(router.routes.home,router.routes.home.path,"#/"+router.routes.home.path)}else{for(var route in router.routes){if(location.hash.slice(2)==router.routes[route].path){router.load(router.routes[route]);return false}}}},clickRouter:function clickRouter(){var _loop=function _loop(route){if(route==="home")return"continue";if(router.routes.hasOwnProperty(route)){$(".card."+router.routes[route]["class"]).addEventListener("click",function(e){e.preventDefault();router.loadAndPushState(router.routes[route])})}};for(var route in router.routes){var _ret=_loop(route);if(_ret==="continue")continue}g.$homeButton.addEventListener("click",function(e){e.preventDefault();router.loadAndPushState(router.routes.home)})},smoothScroll:function smoothScroll(){$("a.smoothScroll").forEach(function(anchor){anchor.addEventListener("click",function(e){e.preventDefault();var dest=$(anchor.getAttribute("href"));zenscroll.to(dest,400,function(){var btn=dest.querySelector(".plus-button");if(btn&&!btn.classList.contains("opened")){btn.click()}})})})}};setup.initAll()})()},{"./dom-query.js":1,"./partials/_form":3,"./partials/_globals":4,"./partials/_menu":5,"./partials/_plus-buttons":6,"./partials/_router":7,"dom-slider":8,"prevent-popstate-scroll":12}],3:[function(require,module,exports){"use strict";var _typeof=typeof Symbol==="function"&&typeof Symbol.iterator==="symbol"?function(obj){return typeof obj}:function(obj){return obj&&typeof Symbol==="function"&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj};(function _form(){var g=require("./_globals");var $message=$("#sent-message");function show(){g.$overlay.removeClass("hidden");g.$applyPopUp.removeClass("hidden")}function hide(){g.$overlay.addClass("hidden");g.$applyPopUp.addClass("hidden")}function serializeArray(form){var field,l,s=[];if((typeof form==="undefined"?"undefined":_typeof(form))=="object"&&form.nodeName=="FORM"){var len=form.elements.length;for(i=0;i<len;i++){field=form.elements[i];if(field.name&&!field.disabled&&field.type!="file"&&field.type!="reset"&&field.type!="submit"&&field.type!="button"){if(field.type=="select-multiple"){l=form.elements[i].options.length;for(j=0;j<l;j++){if(field.options[j].selected)s[s.length]={name:field.name,value:field.options[j].value}}}else if(field.type!="checkbox"&&field.type!="radio"||field.checked){s[s.length]={name:field.name,value:field.value}}}}}return s}function sendForm(){return fetch({url:"http://fvi-grad.com:4004/fakeform",type:"post",data:serializeArray(g.$applyForm)})}function send(){sendForm().done(function(){g.$applyForm.removeClass("hidden");setTimeout(function(){$message.addClass("hidden");g.$applyForm.reset()},300)})}module.exports.show=show;module.exports.hide=hide;module.exports.send=send})()},{"./_globals":4}],4:[function(require,module,exports){"use strict";(function _globals(){var $overlay=$("#overlay");var $cards=$("label.card");var $applyPopUp=$("#apply-pop-up");var $applyButtons=$("#nav-apply-btn, #cta-apply-btn, #contact-home, .request-info");var $pagesContainer=$("#pages-container");var $homeButton=$("#home-button");var $menuItems=$("#menu-items");var $navItems=$("a.nav-item");var $sections=$pagesContainer.querySelectorAll("section");var $banners=$(".banner");var $plusButtons=$("span.plus-button");module.exports.mobileMenuWidth="960";module.exports.topPadding=window.innerWidth>="960"?52:0;module.exports.$overlay=$overlay;module.exports.$cards=$cards;module.exports.$applyPopUp=$applyPopUp;module.exports.$applyButtons=$applyButtons;module.exports.$pagesContainer=$pagesContainer;module.exports.$homeButton=$homeButton;module.exports.$menuItems=$menuItems;module.exports.$navItems=$navItems;module.exports.$sections=$sections;module.exports.$banners=$banners;module.exports.$plusButtons=$plusButtons})()},{}],5:[function(require,module,exports){"use strict";(function _menu(){var g=require("./_globals");function navItemsStyle(navItems,banners,landing){if(landing.getBoundingClientRect().bottom<"-24"){for(var j=0,y=banners.length;j<y;j++){if(banners[j].getBoundingClientRect().top<=g.topPadding+1&&(banners[j].nextSibling.nextSibling.getBoundingClientRect().bottom>g.topPadding||banners[j].getBoundingClientRect().bottom>g.topPadding)){navItems[j].classList.add("section-in-view")}else{navItems[j].classList.remove("section-in-view")}}}else{g.$navItems.removeClass("section-in-view")}}function mobileClick(){var $menuButton=$("#menu-button span");if($menuButton.textContent==="MENU"){g.$menuItems.slideDown();$menuButton.textContent="CLOSE"}else{g.$menuItems.slideUp();$menuButton.textContent="MENU"}}module.exports.navItemsStyle=navItemsStyle;module.exports.mobileClick=mobileClick})()},{"./_globals":4}],6:[function(require,module,exports){"use strict";(function _plusButtons(){var g=require("./_globals");function open($button){var $banner=$button.parentNode;$button.addClass("opened");$banner.addClass("shrink");$banner.nextSibling.nextSibling.slideDown(600)}function close($button){var $banner=$button.parentNode;zenscroll.to($banner,300);$button.removeClass("opened");$button.style.top="0px";$button.style.transition="all 0.6s";$banner.removeClass("shrink");$banner.nextSibling.nextSibling.slideUp(600)}function fixed(){var bottomPadding=window.innerWidth>=g.mobileMenuWidth?"96":"45";var $openButtons=document.querySelectorAll(".plus-button.opened");$openButtons.forEach(function(btn){var contentPosition=btn.parentNode.nextSibling.nextSibling.getBoundingClientRect();if(contentPosition.top<=String(g.topPadding)&&contentPosition.bottom>=bottomPadding){btn.style.top=-contentPosition.top+g.topPadding+"px";btn.style.transition="0s"}else{btn.style.top="0px";btn.style.transition="0s"}})}module.exports.open=open;module.exports.close=close;module.exports.fixed=fixed})()},{"./_globals":4}],7:[function(require,module,exports){"use strict";(function _router(){var g=require("./_globals");var pb=require("./_plus-buttons");var menu=require("./_menu");var $downArrows=$("a.arrow-down");var routes={home:{path:"home",title:"Learn to Code at the Florida Vocational Institute - Evening Coding Bootcamp","class":"home"},webdev:{path:"web-developer-program",title:"Web Developer Evening Bootcamp by The Florida Vocational Institute","class":"webdev"},cyber:{path:"network-administrator-program",title:"Network Administrator Evening Bootcamp by The Florida Vocational Institute","class":"cyber"}};function _scrollHandlerDesktop($arrows,items,sectionBanners,landingPage){pb.fixed();if(window.scrollY>"20"){$arrows.forEach(function(a){return a.addClass("hidden")})}else{$arrows.forEach(function(a){return a.slideDown(400)})}menu.navItemsStyle(items,sectionBanners,landingPage)}function _scrollHandlerMobile($arrows){pb.fixed();if(window.scrollY>"20"){$arrows.forEach(function(a){return a.addClass("hidden")})}else{$arrows.forEach(function(a){return a.slideDown(400)})}}function updateContent(pageClass){$("html").style.opacity="0";g.$navItems.removeClass("section-in-view");g.$overlay.addClass("hidden");g.$applyPopUp.addClass("hidden");if(window.innerWidth<=g.mobileMenuWidth){g.$menuItems.slideUp(10)}$(".plus-button.opened").forEach(function(btn){btn.style.top="0px";btn.style.transition=".6s";btn.removeClass("opened")});$(".banner").removeClass("shrink");$(".content-container").forEach(function(c){return c.slideUp(10)});g.$navItems.removeClass("section-in-view");window.removeEventListener("scroll",scrollHandlerBody);window.scrollTo(0,0);$("#radio-"+pageClass).checked=true;if(pageClass==="home"){$("#menu").style.display="none";$("#sections-container").addClass("hidden")}else{$("#menu").style.display="block";$("#sections-container").removeClass("hidden")}var navItems=$("a.nav-item."+pageClass);var banners=$(".banner."+pageClass);var landing=$("#page_"+pageClass);var scrollHandlerBody=window.innerWidth>=g.mobileMenuWidth?_scrollHandlerDesktop:_scrollHandlerMobile;window.addEventListener("scroll",function scrollHandler(){scrollHandlerBody($downArrows,navItems,banners,landing)});$("html").style.opacity="1"}function _createrRouteLoader(pushState){function loader(route){document.title=route.title;updateContent(route.class);if(pushState){history.pushState(route,route.path,"#/"+route.path)}}return loader}var load=_createrRouteLoader(false);var loadAndPushState=_createrRouteLoader(true);module.exports.routes=routes;module.exports.load=load;module.exports.loadAndPushState=loadAndPushState;module.exports.updateContent=updateContent})()},{"./_globals":4,"./_menu":5,"./_plus-buttons":6}],8:[function(require,module,exports){"use strict";function slide(element,_speed,direction,easing){if(direction==="down"&&(element.classList.contains("setHeight")||!element.classList.contains("DOM-slider-hidden")))return false;if(direction==="up"&&(element.classList.contains("DOM-slider-hidden")||element.classList.contains("setHeight")))return false;var s=element.style;var speed=_speed?_speed:_speed===0?0:300;var contentHeight=element.scrollHeight;if(direction==="up"){var style=window.getComputedStyle(element);var paddingTop=+style.getPropertyValue("padding-top").split("px")[0];var paddingBottom=+style.getPropertyValue("padding-bottom").split("px")[0];contentHeight=element.scrollHeight-paddingTop-paddingBottom}var sheet=document.createElement("style");var setHeightId=(Date.now()*Math.random()).toFixed(0);sheet.innerHTML=".setHeight-"+setHeightId+" {height: "+contentHeight+"px;}";document.head.appendChild(sheet);if(direction==="up"){element.classList.add("setHeight-"+setHeightId)}else{element.classList.add("DOM-slider-hidden","setHeight-"+setHeightId)}s.transition="all "+speed+"ms "+(easing||"");s.overflow="hidden";if(direction==="up"){setTimeout(function(){element.classList.add("DOM-slider-hidden")},10)}else{element.classList.remove("DOM-slider-hidden")}var done=new Promise(function(resolve,reject){setTimeout(function(){element.removeAttribute("style");sheet.parentNode.removeChild(sheet);element.classList.remove("setHeight-"+setHeightId);resolve(element)},speed)});return done}(function DOMsliderInit(){var sheet=document.createElement("style");sheet.id="slideCSSClasses";sheet.innerHTML="\n    .DOM-slider-hidden {\n        height: 0 !important;\n        padding-top: 0 !important;\n        padding-bottom: 0 !important;\n        border-top-width: 0 !important;\n        border-bottom-width: 0 !important;\n        margin-top: 0 !important;\n        margin-bottom: 0 !important;\n        overflow: hidden !important;\n    }\n    ";document.head.appendChild(sheet);Object.prototype.slideDown=function(_speed,easing){return slide(this,_speed,"down",easing)};Object.prototype.slideUp=function(_speed,easing){return slide(this,_speed,"up",easing)};Object.prototype.slideToggle=function(_speed,easing){if(this.classList.contains("DOM-slider-hidden")){return slide(this,_speed,"down",easing)}else{return slide(this,_speed,"up",easing)}}})()},{}],9:[function(require,module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:true});function getScrollTop(){return window.pageYOffset||document.body.scrollTop}function getScrollLeft(){return window.pageXOffset||document.body.scrollLeft}exports["default"]=getScrollTop;exports.getScrollLeft=getScrollLeft;exports.getScrollTop=getScrollTop;exports.left=getScrollLeft;exports.top=getScrollTop},{}],10:[function(require,module,exports){module.exports=on;module.exports.on=on;module.exports.off=off;function on(element,type,listener,useCapture){element.addEventListener(type,listener,useCapture);return listener}function off(element,type,listener,useCapture){element.removeEventListener(type,listener,useCapture);return listener}},{}],11:[function(require,module,exports){"use strict";function once(target,type,listener,useCapture){target.addEventListener(type,listener,useCapture);target.addEventListener(type,function selfRemoving(){target.removeEventListener(type,listener,useCapture);target.removeEventListener(type,selfRemoving,useCapture)},useCapture)}once.promise=function(target,type,useCapture){return new Promise(function(resolve){return once(target,type,resolve,useCapture)})};module.exports=once},{}],12:[function(require,module,exports){"use strict";function _interopDefault(ex){return ex&&typeof ex==="object"&&"default"in ex?ex["default"]:ex}var getScroll=require("get-scroll");var onOff=require("on-off");var once=_interopDefault(require("one-event"));exports.isPrevented=false;var lastScrollPosition=void 0;function resetScroll(){window.scrollTo.apply(window,lastScrollPosition)}function waitForScroll(){lastScrollPosition=[getScroll.getScrollLeft(),getScroll.getScrollTop()];once(window,"scroll",resetScroll)}function event(action){if(action===onOff.off===exports.isPrevented){action(window,"popstate",waitForScroll)}}function allow(){event(onOff.off);exports.isPrevented=false}function prevent(){event(onOff.on);exports.isPrevented=true}function preventOnce(){event(once)}var index=function(toggle){(toggle?prevent:allow)()};exports.allow=allow;exports.prevent=prevent;exports.preventOnce=preventOnce;exports["default"]=index},{"get-scroll":9,"on-off":10,"one-event":11}]},{},[2]);