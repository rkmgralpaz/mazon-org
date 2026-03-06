//--------------//
//--- SYSTEM ---//
//--------------//
const system = {
    touchDevice: navigator.userAgent.match(/(iPhone|iPod|iPad|Android)/) && 'ontouchstart' in window,
    ios: (function () {
        let version = -1;
        if (/(iPhone|iPod|iPad)/i.test(navigator.userAgent)) {
            version = Number(String(navigator.userAgent.split("OS ")[1]).split("_")[0]);
        }
        return version;
    })(),
    iphone: navigator.userAgent.match(/(iPhone|iPod)/),
    ipad: navigator.userAgent.match(/(iPad)/),
    isOpera: navigator.userAgent.indexOf("Opera"),
    ieOld: navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0,
    isIE: navigator.userAgent.indexOf('MSIE') !== -1,
    webkit: navigator.userAgent.toLocaleLowerCase().indexOf('webkit') !== -1,
    firefox: window.navigator.userAgent.match(/Firefox\/([0-9]+)\./),
    safari: navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0,
    isPhone: (Math.min(screen.width, screen.height) < 768 || navigator.userAgent.match(/(iPhone|iPod)/)) && ('ontouchstart' in window || window.ontouchstart),
    android: navigator.userAgent.toLocaleLowerCase().indexOf('android') !== -1,
    tmp: ""
}
const support = {
    svg: document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1") && (system.ios < 0 || system.ios > 4),
    svgImg: document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1") && (system.ios < 0 || system.ios > 3),
    transform: false,
    tmp: ""
}

let activeEl = document.activeElement;
var $video_button = '';

//------------//
//--- SITE ---//
//------------//

let BASE_URL, PATH, PATH_NAMES, TEMPLATE_DIR, $animateScrollTarget, $html, $body, $doc, $win;
const page = {
    init: function () {
        PATH_NAMES = String(PATH).split('/').filter(function (value) {
            return value != '';
        });
        safeURL.init();
        support.transform = tools.getSupportedTransform();
        if (String(window.location).indexOf('#wpcf7-') == -1) {
            history.scrollRestoration = "manual";
        }
        $animateScrollTarget = $("html, body");
        $html = $("html");
        $body = $("body");
        $doc = $(document);
        $win = $(window);
        $body.addClass('content-loaded');
        helper.init();
        mainMenu.init();
        menuAccessibility.init();
        home.init();
        modules.init();
        embedded.init();
        donateButtonGlobal.init();
        forms.init();
        skipToMain();
        accordion();
        hideDonateButton();
        if (system.touchDevice) {
            $body.addClass("touch-device");
            if (system.isPhone) {
                $body.addClass("phone-device");
            }
        } else {
            $body.addClass("standard-device");
        }
        if (system.safari) {
            $body.addClass('safari');
        }
        if (system.isIE) {
            $body.addClass('ie');
        }
    }



}


const skipToMain = function () {
    document.querySelector('#skip-btn').addEventListener('click', (e) => {
        location.href = "#main-content";
    })
}


const accordion = function () {
    const $accordions = document.querySelectorAll('.accordion-btn');
    $accordions.forEach((item, i) => {
        const $accordionContent = item.nextElementSibling;
        if (i === 0) {
            $accordionContent.classList.add('show')
        }
        item.addEventListener('click', function (e) {
            if ($accordionContent.classList.contains('show')) {
                $accordionContent.classList.remove('show')
            } else {
                $accordionContent.classList.add('show')
            }
        })
    });
}

let buttonDonate;

let buttonSuscribe;

document.addEventListener("DOMContentLoaded", function (event) {
    // document.querySelectorAll('.donate-btn-pop-up').forEach((el)=>{
    // 	el.addEventListener('click', function(e) {

    // 		donateFormPopUp();




    // 		buttonDonate = e.target;
    // 	})
    // });

    document.querySelectorAll('.suscribe-btn-pop-up').forEach((el) => {
        el.addEventListener('click', function (e) {
            suscribeFormPopUp();
            buttonSuscribe = e.target;
        })
    });
})

const hideDonateButton = function () {
    const $heroDonate = document.querySelector('.module-hero-buttons .donate-btn-pop-up');
    const $donateButtonGlobal = document.getElementById('donate-button-global');

    if (!!$heroDonate) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    $donateButtonGlobal.classList.add('hide-on-duplicated');
                } else {
                    $donateButtonGlobal.classList.remove('hide-on-duplicated');
                }
            })
        }, { rootMargin: '0px 0px 0px 0px' });
        document.querySelectorAll('.module-hero-buttons .donate-btn-pop-up').forEach((el) => {
            observer.observe(el);
        });

    }

}

function suscribeFormPopUp() {
    const $popup = document.querySelector('#suscribe-popup');
    if ($popup) {
        const removePopup = () => {
            $popup.classList.add('fade-out');
            setTimeout(() => {
                $popup.classList.remove('visible', 'fade-out');
                recurringTabKey.removeGroup('suscrPopup');
                document.body.classList.remove('remove-scroll');
                buttonSuscribe.focus();
            }, 200);

        }

        const $close = $popup.querySelector('.close-button');

        $popup.addEventListener('click', (e) => {

            if (e.target.matches('#suscribe-popup')) {

                removePopup();
            }
        }, true);

        $close.addEventListener('click', (e) => {
            removePopup();
        });
        $popup.addEventListener('keyup', (e) => {
            if (e.key == 'Escape') {
                removePopup();
            }
        });
    }

    $popup.classList.add('visible');

    document.body.classList.add('remove-scroll');
    setTimeout(() => {
        document.querySelector('#suscribe-popup .close-button').focus();
        recurringTabKey.addGroup('suscrPopup', $popup);

        // $popup.querySelector('iframe').addEventListener('blur',(e)=>{
        // 		$popup.querySelector('.close-button').focus();
        // 		e.target.classList.remove('focus');
        // });
        // $popup.querySelector('iframe').addEventListener('focus',(e)=>{
        // 		e.target.classList.add('focus');
        // });

    }, 100)

}


// function donateFormPopUp() {
//   			const $popup = document.querySelector('#donate-popup');
//         if($popup){
//             const removePopup = ()=>{
//                 $popup.classList.add('fade-out');
//                 setTimeout(()=>{
//                     $popup.classList.remove('visible','fade-out');
//                     recurringTabKey.removeGroup('donatePopup');
//                     document.body.classList.remove('remove-scroll');
// 										buttonDonate.focus();
//                 },200);

//             }

//             $popup.addEventListener('click', (e)=>{
//                 if(e.target.matches('.popup-inner')){
//                     e.stopImmediatePropagation();
//                 }else{
//                     removePopup();
//                 }
//             });
//             $popup.addEventListener('keyup', (e)=>{
//                 if(e.key == 'Escape'){
//                     removePopup();
//                 }
//             });
//         }
//         $popup.classList.add('visible');

// 				const a = document.getElementById('donate-popup').querySelector('iframe').getAttribute('data-src')

// 				document.getElementById('donate-popup').querySelector('iframe').setAttribute('src', a)

//         document.body.classList.add('remove-scroll');
//         setTimeout(()=>{
//             document.querySelector('#donate-popup .close-button').focus();
// 						recurringTabKey.addGroup('donatePopup',$popup);

// 						$popup.querySelector('iframe').addEventListener('blur',(e)=>{
// 								$popup.querySelector('.close-button').focus();
// 								e.target.classList.remove('focus');
// 						});
// 						$popup.querySelector('iframe').addEventListener('focus',(e)=>{
// 								e.target.classList.add('focus');
// 						});

//         },100)

// }



const recurringTabKey = {
    obj: [],
    initialized: false,
    docKeyDown: null,
    docKeyUp: null,
    addGroup: function (name, $_firstSelector, $_lastSelector) {
        let exist = -1;
        let $firstSelector, $lastSelector, $tmpSelector, list;
        if ($_firstSelector instanceof Array) {
            list = $_firstSelector;
        } else {
            $firstSelector = typeof $_firstSelector === "string" ? document.querySelector($_firstSelector) : $_firstSelector;
            $lastSelector = typeof $_lastSelector === "string" ? document.querySelector($_lastSelector) : $_lastSelector;
        }
        if (!name || (!$firstSelector && !list)) {
            return false;
        }
        if (!$lastSelector && !list) {
            $tmpSelector = $firstSelector.querySelectorAll('a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])');
            $firstSelector = $tmpSelector[0];
            $lastSelector = $tmpSelector[$tmpSelector.length - 1];
        }
        if (!recurringTabKey.initialized) {
            recurringTabKey.init();
        }
        for (let i = 0; i < recurringTabKey.obj.length; i++) {
            if (name == recurringTabKey.obj[i]['name']) {
                exist = i;
                break;
            }
        }
        if (exist > -1 && list) {
            recurringTabKey.obj[exist].list = list;
        } else if (exist > -1) {
            recurringTabKey.obj[exist].firstSelector = $firstSelector;
            recurringTabKey.obj[exist].lastSelector = $lastSelector;
            recurringTabKey.obj[exist].list = null;
        } else if (list) {
            recurringTabKey.obj.push({ name: name, list: list });
        } else {
            recurringTabKey.obj.push({ name: name, firstSelector: $firstSelector, lastSelector: $lastSelector, list: null });
        }
    },
    removeGroup: function (name) {
        for (let i = 0; i < recurringTabKey.obj.length; i++) {
            if (name == recurringTabKey.obj[i]['name']) {
                recurringTabKey.obj.splice(i, 1);
                i--;
            }
        }
        if (recurringTabKey.obj.length == 0 && recurringTabKey.docKeyDown) {
            recurringTabKey.clearEvents();
        }
    },
    removeAllGroups: function (name) {
        recurringTabKey.obj = new Array();
    },
    clearEvents: function () {
        if (recurringTabKey.obj.length) {
            document.addEventListener('keydown', recurringTabKey.docKeyDown, true);
            document.addEventListener('keyup', recurringTabKey.docKeyUp, true);
            recurringTabKey.initialized = false;
            recurringTabKey.docKeyDown = null;
            recurringTabKey.docKeyUp = null;
        }
    },
    init: function () {
        recurringTabKey.keyPressed = {};
        recurringTabKey.initialized = true;
        document.addEventListener('keydown', recurringTabKey.docKeyDown = (e) => {
            recurringTabKey.keyPressed[e.key.toLowerCase()] = true;
            let focused = document.activeElement;
            for (let i = 0; i < recurringTabKey.obj.length; i++) {
                let list = recurringTabKey.obj[i].list;
                if (list) {
                    for (let j = 0; j < list.length; j++) {
                        if (recurringTabKey.keyPressed.tab && !recurringTabKey.keyPressed.shift && list[j] === focused) {
                            e.preventDefault();
                            let n = j + 1;
                            if (n >= list.length) {
                                n = 0;
                            }
                            list[n].focus();
                            break;
                        } else if (recurringTabKey.keyPressed.tab && recurringTabKey.keyPressed.shift && list[j] === focused) {
                            e.preventDefault();
                            let n = j - 1;
                            if (n < 0) {
                                n = list.length - 1;
                            }
                            list[n].focus();
                            break;
                        }
                    }
                } else if (recurringTabKey.keyPressed.tab && !recurringTabKey.keyPressed.shift && recurringTabKey.obj[i].lastSelector === document.activeElement) {
                    recurringTabKey.obj[i].firstSelector.focus();
                    e.preventDefault();

                } else if (recurringTabKey.keyPressed.tab && recurringTabKey.keyPressed.shift && recurringTabKey.obj[i].firstSelector === document.activeElement) {
                    recurringTabKey.obj[i].lastSelector.focus();
                    e.preventDefault();
                }
            }
        }, true);
        document.addEventListener('keyup', recurringTabKey.docKeyUp = (e) => {
            recurringTabKey.keyPressed[e.key.toLowerCase()] = false;
        }, true);
    }
}

const mapTabindex = (collection, tabindex) => {
    Array.prototype.map.call(collection, (currentValue, index, array) => {
        currentValue.setAttribute('tabindex', tabindex)
        return
    })
}

const menuAccessibility = {
    init: function () {

        //menu desktop
        const $submenuLinks = document.querySelectorAll('#header-main-nav .sub-menu a');
        mapTabindex($submenuLinks, "-1")

        //--- new 2023-05-19 ---//
        setTimeout(function () {

            $('#menu-nav-main > li.menu-item-has-children > a').focus(function (e) {
                var $this = $(this);
                var $parent = $this.parent();
                var $ul = $parent.children('ul');

                if (!$ul.hasClass('visible')) {
                    $this.click();
                    mapTabindex($ul.find('a'), 0);
                }
            });

            $('#header-secondary-nav-button').focus(function (e) {
                $('#menu-nav-main ul.sub-menu.level-2').removeClass('visible');
                $('#header-submenu-bg').stop(true).css({ height: 0 });
            });

            $('#menu-nav-main > li.menu-item-has-children a').addClass('ignore-focused-nav-item');

            $('a, button, select, input[type=button], input[type=submit], input[type=radio], input[type=checkbox], .focusable').focus(function (e) {
                if (!$(this).hasClass('ignore-focused-nav-item') && !$(this) === $('#header-secondary-nav-button')) {
                    $('#menu-nav-main ul.sub-menu.level-2.visible').removeClass('visible');
                    $('#header-submenu-bg').stop(true).css({ height: 0 });
                    $body.removeClass('nav-open');
                    $('#secondary-nav-wrapper').removeClass('visible');
                }
            });
        }, 100);

        //menu mobile
        const $mobileLinks = document.querySelectorAll('#menu-mobile-ul a');
        mapTabindex($mobileLinks, "-1")

        const mediaQuery = window.matchMedia('(min-width: 1200px)')

        function mediaQueryChange(e) {
            if (e.matches) {
                mapTabindex($mobileLinks, "-1")
            } else {
                mapTabindex($submenuLinks, "-1")
            }
        }

        mediaQuery.addListener(mediaQueryChange)
        mediaQueryChange(mediaQuery)

    }
}

const mainMenu = {
    init: function () {
        //--- SET SELECTION: exceptions ---//
        $('#menu-nav-main li.ignore-selection').removeClass('current_page_item');

        if ($('#menu-nav-main li.current_page_item').length == 0) {
            $('#menu-nav-main li a, #menu-secondary-nav li a').each(function () {
                var $this = $(this);
                var url = String($this.attr('href'));
                var hit = false;
                for (var i = 0; i < PATH_NAMES.length; i++) {
                    if (url.indexOf(('/' + PATH_NAMES[i])) !== -1 && PATH_NAMES[i] != 'news' && !$this.parent().hasClass('ignore-selection')) {
                        hit = true;
                        $this.parent().addClass('current_page_item');
                        break;
                    }
                }
                if (hit) {
                    return false;
                }
            });
        }

        //--- MOBILE NAV ---//
        const $menuNavMain = $('#menu-nav-main');
        const $navMobile = $('#nav-mobile');
        const $menuSecondaryNav = $('#menu-secondary-nav');

        $navMobile.html('<ul id="menu-mobile-ul">' + $menuNavMain.html() + $menuSecondaryNav.html() + '</div>');

        $('#menu-mobile-ul .menu-item-has-children').children('a').click(function (e) {
            const $this = $(this);
            const $submenu = $this.parent().children('ul');
            const $submenuA = $submenu.children('li').children('a');
            let height = 0;
            e.preventDefault();
            if ($submenu.hasClass('expanded')) {
                $submenu.removeClass('expanded');
                $this.removeClass('expanded');
                $submenu.css({ height: 0 });
                mapTabindex($submenuA, '-1')

            } else {
                $('#menu-mobile-ul .menu-item-has-children a.expanded').removeClass('expanded');
                $('#menu-mobile-ul .menu-item-has-children ul.expanded').removeClass('expanded').css({ height: 0 });
                $submenu.addClass('expanded');
                $this.addClass('expanded');
                $submenu.children('li').each(function () {
                    height += $(this).outerHeight();
                });
                $submenu.css({ height: height });

                mapTabindex($submenuA, 0)
            }
        });



        //--- fix tab keydown nav mobile ---//
        const keyPressed = {};
        const headerLogo = document.querySelector('#header-logo');
        const navBtn = document.querySelector('#header-secondary-nav-button');
        let keyPressedTimeout;
        document.addEventListener('keydown', (e) => {
            keyPressed[e.key.toLowerCase()] = true;
            if (e.key == 'Tab' && keyPressed['shift'] && e.target == headerLogo && document.body.classList.contains('nav-open')) {
                e.preventDefault();
                document.querySelector('#menu-mobile-ul > li:last-child a').focus();
            }
            if (e.key == 'Tab' && !keyPressed['shift'] && e.target == document.querySelector('#menu-mobile-ul > li:last-child a') && document.body.classList.contains('nav-open')) {
                keyPressedTimeout = setTimeout(() => {
                    headerLogo.focus();
                }, 50);
            }
            if (e.key == 'Escape' && document.body.classList.contains('nav-open')) {
                navBtn.click();
                navBtn.focus();
            }
        });
        document.addEventListener('keyup', (e) => {
            clearTimeout(keyPressedTimeout);
            keyPressed[e.key.toLowerCase()] = false;
        });
        //--- fix tab keydown nav mobile ---//



        //--- DESKTOP NAV ---//
        let mobileNavTimeout;
        const $headerSecondaryNavBtn = $('#header-secondary-nav-button');

        const $menuSecondaryLinks = document.querySelectorAll('#menu-secondary-nav li a');
        mapTabindex($menuSecondaryLinks, "-1")


        $headerSecondaryNavBtn.click(function () {
            clearTimeout(mobileNavTimeout);
            this.setAttribute('aria-expanded', "true")

            var height = 0;

            const $mobileLinks = document.querySelectorAll('#menu-mobile-ul > li > a');

            $body.toggleClass('nav-open');
            $('#menu-nav-main ul.sub-menu.level-2').removeClass('visible');

            if ($body.hasClass('nav-open')) {
                $('#nav-mobile').scrollTop(0);
                $('#secondary-nav-wrapper').addClass('visible');
                height = $('#menu-secondary-nav').outerHeight();
                $win.bind('resize.nav', function () {
                    if ($body.hasClass('nav-open')) {
                        $headerSecondaryNavBtn.click();
                    }
                });
                // abre el current item active 👇🏻
                mobileNavTimeout = setTimeout(function () {
                    $('#menu-mobile-ul > li.menu-item-has-children a.selected').click();

                }, 400);

                if (window.matchMedia("(min-width: 1200px)").matches) {
                    mapTabindex($menuSecondaryLinks, 0)
                } else {
                    mapTabindex($mobileLinks, 0)
                }


            } else {
                $win.unbind('resize.nav');
                $('#secondary-nav-wrapper').removeClass('visible');
                $('#menu-mobile-ul .menu-item-has-children a.expanded').removeClass('expanded');
                $('#menu-mobile-ul .menu-item-has-children ul.expanded').removeClass('expanded').css({ height: 0 });

                if (window.matchMedia("(min-width: 1200px)").matches) {
                    mapTabindex($menuSecondaryLinks, -1)
                } else {
                    mapTabindex($mobileLinks, -1)
                }
                recurringTabKey.removeGroup('navMobile')
            }
            $('#header-submenu-bg').stop(true).css({ height: height });

        });


        // ACCESIBILITY
        const fs = document.getElementById('menu-secondary-nav');
        fs.addEventListener("focusout", function (event) {
            const $nodeList = fs.querySelectorAll('ul li');
            if (event.target === $nodeList[$nodeList.length - 1].querySelector('a')) {
                document.getElementById('secondary-nav-wrapper').classList.remove('visible');
                document.getElementById('header-submenu-bg').style.height = 0;
                mapTabindex(fs.querySelectorAll('a'), -1)
                document.body.classList.remove('nav-open');
            }
        });
        // END ACCESIBILITY

        $('#menu-nav-main > li.menu-item-has-children > a').click(function (e) {
            e.preventDefault();
            var $this = $(this);
            var $parent = $this.parent();
            var $ul = $parent.children('ul');
            var height;
            if ($ul.hasClass('visible')) {
                $('#menu-nav-main ul.sub-menu.level-2').removeClass('visible');
                height = 0;
            } else {

                $('#menu-nav-main ul.sub-menu.level-2').removeClass('visible');
                $ul.addClass('visible');
                height = $ul.outerHeight();
            }
            $('#header-submenu-bg').stop(true).css({ height: height });
            $body.removeClass('nav-open');
            $('#secondary-nav-wrapper').removeClass('visible');
        });
        $('#header').mouseleave(function () {
            $('#menu-nav-main ul.sub-menu.level-2').removeClass('visible');
            $('#header-submenu-bg').stop(true).css({ height: 0 });
            $('#secondary-nav-wrapper').removeClass('visible');
            $body.removeClass('nav-open');
            $('#menu-mobile-ul .menu-item-has-children a.expanded').removeClass('expanded');
            $('#menu-mobile-ul .menu-item-has-children ul.expanded').removeClass('expanded').css({ height: 0 });
        });

        //--- SET SELECTION: first level and mobile nav ---//
        $('ul li.ignore-selection').removeClass('current_page_item');
        $('ul li.ignore-selection a').removeClass('selected');
        $('ul li.current_page_item > a').addClass('selected');
        $('#menu-nav-main > li.menu-item-has-children').each(function () {
            var $this = $(this);
            if ($this.find('a.selected').length) {
                $this.children('a').addClass('selected');
            }
        });
        $('#menu-mobile-ul > li.menu-item-has-children').each(function () {
            var $this = $(this);
            if ($this.find('a.selected').length) {
                $this.children('a').addClass('selected');
            }
        });
        //--- SEARCH ---//
        $('#s').focus(function () {
            var $this = $(this);
            $this.removeAttr('placeholder').data('focus', true);
        }).blur(function () {
            var $this = $(this);
            $this.attr('placeholder', $this.data('placeholder'));
            setTimeout(function () {
                $this.data('focus', false);
            }, 150);
        }).data('placeholder', $('#s').attr('placeholder'));
        $('#search-lightbox form').submit(function (e) {
            if ($('#s').val() == '') {
                e.preventDefault();
            } else {
                $('#search-lightbox .close-button').click();
            }
        });
        $('#search-lightbox .close-button').click(function (e) {
            e.stopPropagation();
            $(this).parent().removeClass('visible');
            $body.removeClass('remove-scroll');
            modules.playAllSliders();
            $('#header-search-button').focus();
            recurringTabKey.removeGroup('search_lightbox_elements');
        });

        $('#header-search-button').click(function () {


            if ($body.hasClass('nav-open')) {
                $headerSecondaryNavBtn.click();
            }
            $('#s').val('');
            $('#search-lightbox').addClass('visible');
            $body.addClass('remove-scroll');
            modules.pauseAllSliders();
            //			
            // ACCESIBILITY
            const $input = document.querySelector('#searchform input');
            const $submit = document.getElementById('searchsubmit');
            const $close = document.querySelector('#search-lightbox .close-button');
            recurringTabKey.addGroup('search_lightbox_elements', [$input, $submit, $close]);
            $input.focus()
            // END ACCESIBILITY
            //
        });
        $('#search-lightbox').click(function () {
            if (!$('#s').data("focus")) {
                $('#search-lightbox .close-button').click();
            }
        });
        $('.search-again-btn').click(function () {
            $('#header-search-button').click();
        });
    }
}

let EscapeSearch = (e) => {
    if (e.key == 'Escape') {
        if ($('#search-lightbox').hasClass('visible')) {
            $('#search-lightbox .close-button').click();
            recurringTabKey.removeGroup('search_lightbox_elements');
            $('#header-search-button').focus();
        }
        if ($('#video-lightbox').hasClass('visible')) {
            $('#video-lightbox .close-button').click();
        }
    }
}
document.addEventListener('keyup', EscapeSearch, true);

const forms = {
    init: function () {
        var $ajaxForm = $('.ajax-form');
        var ajaxLoading = false;
        var $select = $('.form select');
        if ($select.length) {
            $select.each(function () {
                var $this = $(this);
                if ($this.find('option').eq(0).attr('disabled')) {
                    $this.change(function () {
                        var $this = $(this);
                        if ($this.find('option:selected').index() == 0) {
                            $this.removeClass('selected');
                        } else {
                            $this.addClass('selected');
                        }
                    });
                    $this.removeClass('selected');
                } else {
                    $this.addClass('selected');
                }
            });
        }
        if ($ajaxForm.length) {
            $ajaxForm.submit(function (e) {
                e.preventDefault();
                var value;
                var tmp;
                var paramsStr = '?';
                var $recipient = $('#' + $ajaxForm.data('recipient'));
                var url;
                var action = String($ajaxForm.attr('action'));
                if (action.indexOf('http') === -1 && action.indexOf('partials/') !== -1 && action.indexOf('.php') !== -1) {
                    url = TEMPLATE_DIR + String($ajaxForm.attr('action')).split('/partials/').join('partials/');
                } else {
                    url = String($ajaxForm.attr('action'));
                }
                value = '';
                $ajaxForm.find('*[name]').each(function () {
                    var $this = $(this);
                    if ($this.filter(':checked').length) {
                        tmp = new Array();
                        $this.filter(':checked').each(function () {
                            tmp.push($(this).val());
                        });
                        value = tmp.join(',');
                    } else if ($this.children('option:selected').length) {
                        tmp = new Array();
                        $this.children('option:selected').each(function () {
                            tmp.push($(this).val());
                        });
                        value = tmp.join(',');
                    } else {
                        value = $this.val();
                    }
                    paramsStr += $this.attr('name') + '=' + value + '&';
                });
                if (paramsStr.substr(paramsStr.length - 1, paramsStr.length) == '&') {
                    paramsStr = paramsStr.substr(0, paramsStr.length - 1);
                }
                if (!ajaxLoading && $ajaxForm.data('recipient')) {
                    $recipient.html('Loading...');
                    jqxhr = $.ajax(url + paramsStr).done(function (result) {
                        $recipient.html(result);
                    }).fail(function () {
                        $recipient.html('Form error. Please try again.');
                    }).always(function () {
                        ajaxLoading = false;
                    });
                }

            });
        }
    }
}

const donateButtonGlobal = {
    init: function () {
        var $donateButton = $('.module-hero-slider').eq(0).find('.cta');
        var $donateButtonCopy;
        var newTop;
        if ($donateButton.length && $('.module').eq(0).hasClass('module-hero-slider') && $('.page-header').length == 0) {
            $donateButton.addClass('scrollable');
            $donateButton.clone().appendTo($donateButton.parent());
            $donateButtonCopy = $('.module-hero-slider').eq(0).find('.cta').eq(1);
            $donateButtonCopy.addClass('scrollable');
            $donateButtonCopy.css({ top: $donateButton.position().top });
            $donateButton.addClass('hide');
            $win.bind('scroll.donateglobal', function () {
                newTop = $win.height() - $donateButtonCopy.outerHeight() - 50;
                if ($win.scrollTop() > 0) {
                    //$donateButton.addClass('scrolled');
                    $donateButtonCopy.css({ top: newTop });
                } else {
                    //$donateButton.removeClass('scrolled');
                    $donateButtonCopy.css({ top: $donateButton.position().top });
                }
            });
            $win.bind('resize.donateglobal', function () {
                $win.trigger('scroll.donateglobal');
            });
        }
    }
}

const home = {
    init: function () {
        announcement.init();
    }
}
const embedded = {
    init: function () {
        var videosNum = 0;
        $('iframe').each(function (i) {
            var $this = $(this);
            var src = String($this.attr('src'));
            var data = String($this.data('src'));
            var destinationID, sourceID, html, id;
            if (src.indexOf('youtu') !== -1 || src.indexOf('vimeo') !== -1 || data.indexOf('youtu') !== -1 || data.indexOf('vimeo') !== -1) {
                /*
                destinationID = 'iframe-video-'+i;
                sourceID = 'iframe-source-'+i;
                html = '<div id="'+destinationID+'" class="iframe-video"></div>';
                $this.attr('id',sourceID).before(html);
                $this.appendTo("#"+destinationID);
                */
                $this.addClass('video');
                videosNum++;
            } else if (data.indexOf('soundcloud') !== -1) {
                destinationID = 'iframe-sound-' + i;
                sourceID = 'iframe-sound-' + i;
                id = data.split('tracks%2F');
                id = id[1].split('&');
                id = id[0];
                html = '<div id="' + destinationID + '" class="iframe-sound"><iframe width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/' + id + '&color=ff5500"></iframe></div>';
                $this.attr('id', sourceID).before(html);
                $this.addClass('remove-sound');
            }
        });
        $('.remove-sound').remove();
        if (videosNum > 0) {
            $win.bind('resize.iframevideos', function () {
                $('iframe.video').each(function () {
                    var $this = $(this);
                    var height = $this.width() / 16 * 9;
                    $this.css({ height: height });
                })
            });
            $win.trigger('resize.iframevideos');
            setTimeout(function () {
                $win.trigger('resize.iframevideos');
            }, 100);
        }
    }
}

const fromIframe = {
    myFunction: function () {
        // do something
        $(document).scrollTop(0);
        window.scrollTo(0, 0);
    }
};

const newFromIframe = Object.create(fromIframe);

const announcement = {
    init: function () {
        var $announcement = $('.announcement');
        if ($announcement.length) {
            $announcement.addClass('loaded');
            $announcement.find('.a-close-button').click(function () {
                $announcement.addClass('no-transitions');
                $announcement.animate({ opacity: 0 }, 150, function () {
                    $body.removeClass('has-announcement');
                    $announcement.remove();
                });
            });
            $announcement.click(function () {
                $(this).find('.a-close-button').click();
            });
            $announcement.find('.a-box').click(function (e) {
                e.stopPropagation();
            });
        }
    }
}

const modules = {
    init: function () {
        $('.module-boxes .box.one-link').each(function (i) {
            var $this = $(this);
            var $a = $this.find('a');
            var href = $a.attr('href');
            var target = $a.attr('target');
            if ($a.parent().find('svg').length) {
                $a.parent().append('<span class="link-color">' + $a.parent().find('svg')[0].outerHTML + ' ' + $a.text() + '</span>');
            } else {
                $a.parent().append('<span class="link-color">' + $a.text() + '</span>');
            }
            var html;
            if (!target) {
                target = '';
            }
            $a.remove();
            html = '<a href="' + href + '" target="' + target + '">' + $this.html() + '</a>';
            $this.html(html);
        });

        //--- VIDEO LIGHTBOX ---//
        var videoLightboxTimeout;
        $('#video-lightbox .close-button').click(function (e) {
            e.stopPropagation();
            clearTimeout(videoLightboxTimeout);
            recurringTabKey.removeGroup('lightboxVideo');
            $(this).parent().removeClass('visible');
            $body.removeClass('remove-scroll');
            $('#video-lightbox .video').html('');
            modules.playAllSliders();
            $video_button.focus();
        });
        $('#video-lightbox').click(function () {
            $('#video-lightbox .close-button').click();
            recurringTabKey.removeGroup('lightboxVideo');
            $video_button.focus();
        });
        $('#video-lightbox .video').click(function (e) {
            e.stopPropagation();
        });

        $('.news-post-content .main-video .video-button').click(function (e) {
            e.preventDefault();
            var $this = $(this);
            var video = tools.getVideoEmbedCode($this.attr('href'));
            if (video) {
                $this.parent().find('.video').html(video).css({ backgroundImage: '' });
                $this.remove();
            }
        });
        $('.news-post-content a.back-button').click(function (e) {
            var document_referrer = document.referrer;
            if (document_referrer) {
                e.preventDefault();
                window.location = document_referrer;
            }
        });
        $('.module-hero-buttons .bg .image').each(function () {
            var $this = $(this);
            var src = $this.data('image');
            var position = $this.data('position');
            var img;
            if (src) {
                img = new Image();
                img.onload = function () {
                    $this.css({ backgroundImage: 'url(' + this.src + ')' }).addClass('loaded');
                }
                img.src = $this.data('image');
            }
        })

        //--- MODULE TEXT SLIDER ---//
        $('.module-text-slider').on("change_slide", function (e, params) {
            var $this = $(this);
            var $slidesWrapper = $this.find('.slides');
            var $slides = $this.find('.slides .slide');
            var currentSlide;
            var n;
            //
            clearTimeout($this.data('timeout'));
            //
            if (params.next) {
                currentSlide = $this.data('current') == undefined ? 0 : $this.data('current') + 1;
            } else {
                currentSlide = !params.index ? 0 : params.index;
            }
            if (currentSlide >= $slides.length) {
                currentSlide = 0;
            } else if (currentSlide < 0) {
                currentSlide = $slides.length - 1;
            }
            $this.data('current', currentSlide);
            //
            $this.find('.dots .button').removeClass('selected');
            $this.find('.dots .button').eq(currentSlide).addClass('selected');
            //
            $slidesWrapper.stop(true).css({ height: $slidesWrapper.height() });
            $slides.removeClass('visible');
            $slides.eq(currentSlide).addClass('visible');
            $slidesWrapper.animate({ height: $slides.eq(currentSlide).outerHeight() }, 500, function () {
                $slidesWrapper.css({ height: 'auto' });
            });
            if ($this.data('autoplay') && $this.data('autoplaystatus')) {
                $this.data('timeout', setTimeout(function () {
                    $this.trigger('change_slide', { next: true });
                }, 8000));
            }
        }).on('pause_slider', function () {
            $(this).data('autoplaystatus', false);
        }).on('play_slider', function () {
            $(this).data('autoplaystatus', true);
        }).each(function () {
            var $this = $(this);
            $this.data('autoplaystatus', true);
            $this.trigger('change_slide', { index: 0 });
            $this.addClass('loaded');
        });
        $('.module-text-slider .dots .button').click(function () {
            var $this = $(this);
            var index = $this.index();
            $this.parent().parent().parent().parent().trigger('change_slide', { index: index });
        });

        //--- MODULE BY THE NUMBERS ---//
        $('.module-by-the-numbers').on("change_slide", function (e, params) {
            var $this = $(this);
            var $slidesWrapper = $this.find('.slides');
            var $slides = $this.find('.slides .slide');
            var currentSlide;
            var n;
            clearTimeout($this.data('timeout'));
            if (params.next) {
                currentSlide = $this.data('current') == undefined ? 0 : $this.data('current') + 1;
            } else {
                currentSlide = !params.index ? 0 : params.index;
            }
            if (currentSlide >= $slides.length) {
                currentSlide = 0;
            } else if (currentSlide < 0) {
                currentSlide = $slides.length - 1;
            }
            $this.data('current', currentSlide);
            $this.find('.dots .button').removeClass('selected');
            $this.find('.dots .button').eq(currentSlide).addClass('selected');
            $slidesWrapper.stop(true).css({ height: $slidesWrapper.height() });
            $slides.removeClass('visible');
            $slides.eq(currentSlide).addClass('visible');
            $slidesWrapper.animate({ height: $slides.eq(currentSlide).outerHeight() }, 500, function () {
                $slidesWrapper.css({ height: 'auto' });
            });
            if ($this.data('autoplay') && $this.data('autoplaystatus')) {
                $this.data('timeout', setTimeout(function () {
                    $this.trigger('change_slide', { next: true });
                }, 8000));
            }
        }).on('pause_slider', function () {
            $(this).data('autoplaystatus', false);
        }).on('play_slider', function () {
            $(this).data('autoplaystatus', true);
        }).each(function () {
            var $this = $(this);
            $this.data('autoplaystatus', true);
            $this.trigger('change_slide', { index: 0 });
            $this.addClass('loaded');
        });
        if ($('.module-by-the-numbers .dots .button').length > 1) {
            $('.module-by-the-numbers .dots .button').click(function () {
                var $this = $(this);
                var index = $this.index();
                $this.parent().parent().parent().parent().trigger('change_slide', { index: index });
            });
        } else {
            $('.module-by-the-numbers .dots .button').remove();
        }

        //--- MODULE VIDEO ---//
        $('.module-hero-video .video-button, .module-hero-slider .video-button').click(function (e) {
            const $this = $(this);
            let html;
            $video_button = $this;
            e.preventDefault();
            if ($body.hasClass('nav-open')) $headerSecondaryNavBtn.click();

            $('#video-lightbox').addClass('visible');
            $body.addClass('remove-scroll');
            modules.pauseAllSliders();
            videoLightboxTimeout = setTimeout(function () {
                html = tools.getVideoEmbedCode($this.attr('href'));
                $('#video-lightbox .video').html(html);
                $('#video-lightbox .close-button').focus();

                recurringTabKey.addGroup('lightboxVideo', document.querySelector('#video-lightbox'));

                document.querySelector('#video-lightbox iframe').addEventListener('blur', (e) => {
                    document.querySelector('#video-lightbox .close-button').focus();
                    e.target.classList.remove('focus');
                });
                document.querySelector('#video-lightbox iframe').addEventListener('focus', (e) => {
                    e.target.classList.add('focus');
                });
            }, 200);

        });

        $('.module-hero-video .bg').each(function () {
            var img;
            var $this = $(this);
            if ($this.data('image')) {
                img = new Image();
                img.onload = function () {
                    //$this.css({backgroundImage:'url('+this.src+')'}).addClass('loaded');
                    $this.addClass('loaded');
                }
                img.src = $this.data('image');
            }
        });
        //
        //--- MODULE HERO SLIDER ---//
        //
        $('.module-hero-slider .outer .inner .wrapper .lower .cta-button').click(function (e) {
            $this = $(this);
            var href = $this.data('href');
            var target = $this.data('target');
            if (href.indexOf('vimeo') !== -1 || href.indexOf('youtu') !== -1) {
                let html;
                $video_button = $this;
                e.preventDefault();
                if ($body.hasClass('nav-open')) $headerSecondaryNavBtn.click();
                $('#video-lightbox').addClass('visible');
                $body.addClass('remove-scroll');
                modules.pauseAllSliders();
                videoLightboxTimeout = setTimeout(function () {
                    html = tools.getVideoEmbedCode(href);
                    $('#video-lightbox .video').html(html);
                    $('#video-lightbox .close-button').focus();
                    recurringTabKey.addGroup('lightboxVideo', document.querySelector('#video-lightbox'));
                    document.querySelector('#video-lightbox iframe').addEventListener('blur', (e) => {
                        document.querySelector('#video-lightbox .close-button').focus();
                        e.target.classList.remove('focus');
                    });
                    document.querySelector('#video-lightbox iframe').addEventListener('focus', (e) => {
                        e.target.classList.add('focus');
                    });
                }, 200);
            } else if (href && target == '_blank') {
                window.open(href, target);
            } else if (href) {
                window.location = href;
            }
        });
        $('.module-hero-slider').on("change_slide", function (e, params) {
            var $this = $(this);
            var $slides = $this.find('.slides .slide');
            var currentSlide;
            var n, img;
            //
            clearInterval($this.data('interval'));
            //
            if (params.next) {
                currentSlide = $this.data('current') == undefined ? 0 : $this.data('current') + 1;
            } else {
                currentSlide = !params.index ? 0 : params.index;
            }
            if (currentSlide >= $slides.length) {
                currentSlide = 0;
            } else if (currentSlide < 0) {
                currentSlide = $slides.length - 1;
            }
            $this.data('current', currentSlide);
            //
            $this.find('.dots .button').removeClass('selected');
            $this.find('.dots .button').eq(currentSlide).addClass('selected')
            //$this.find('.dots .button').eq(currentSlide).append('<div class="preloader slider-dot"></div>');
            //
            $this.find('.preloader').stop(true).remove();
            $this.find('.inner').append('<div class="preloader opacity-0"></div>');
            $this.find('.preloader').delay(100).animate({ opacity: 1 }, 100);
            //
            //$this.find('.multiple-text').html('').removeClass('loaded');
            $this.find('.multiple-text').removeClass('loaded');
            //
            if ($this.data('img')) {
                $this.data('img').onload = null;
            }
            $this.data('img', new Image());
            $this.data('img').onload = function () {
                var $img = $this.find('.bg .img');
                $img.stop(true);
                $this.find('.bg').append('<div role="img" class="img" alt="" style="background-image:url(' + $this.data('img').src + ')"></div>');
                /*
                $this.find('.bg .img').last().animate({opacity:1},500,function(){
                    $img.remove();
                    if($this.data('autoplay')){
                        $this.data('interval',setInterval(function(){
                            if($this.data('autoplaystatus')){
                                $this.trigger('change_slide',{next:true});
                            }
                        },8000));
                    }
                });
                */

                $this.find('.bg .img').last().animate({ opacity: 1 }, {
                    duration: 500, easing: 'easeOutSine', complete: function () {
                        $img.remove();
                        if ($this.data('autoplay')) {
                            $this.data('interval', setInterval(function () {
                                if ($this.data('autoplaystatus')) {
                                    $this.trigger('change_slide', { next: true });
                                }
                            }, 8000));
                        }
                    }
                });

                //easeOutQuad
                //$this.find('.preloader.slider-dot').remove();
                $this.find('.preloader').stop(true).remove();
                $this.find('.multiple-text').html($slides.eq(currentSlide).html()).addClass('loaded');
                var $a = $('.module-hero-slider .outer .inner .wrapper .upper .text a');
                var $ctaBtn = $('.module-hero-slider .outer .inner .wrapper .lower .cta-button');
                if ($a.length) {
                    $a.css({ display: 'none' });
                    var href = $a.attr('href');
                    var target = $a.attr('target');
                    $ctaBtn.stop(true).text($a.text()).data('href', href).data('target', target).css({ visibility: 'visible', opacity: 0 }).delay(700).animate({ opacity: 1 }, 500);
                } else {
                    $ctaBtn.stop(true).css({ visibility: 'hidden', opacity: 0 }).removeData('href', href).removeData('target');
                }
            }
            $this.data('img').src = $slides.eq(currentSlide).data('image');
        }).on('pause_slider', function () {
            $(this).data('autoplaystatus', false);
        }).on('play_slider', function () {
            $(this).data('autoplaystatus', true);
        }).each(function () {
            var $this = $(this);
            $this.data('autoplaystatus', true);
            $this.trigger('change_slide', { index: 0 });
            $this.find('.text').addClass('loaded');
            $this.find('.dots .button').addClass('loaded');
        });
        $('.module-hero-slider').find('.dots .button-dot').on("click", function () {
            var $this = $(this);
            var $slider, index;
            if (!$this.hasClass('selected')) {
                $slider = $this.parent().parent().parent().parent().parent().parent().parent();
                index = $this.index();
            }
            $slider.trigger('change_slide', { index: index });
        });
        $('.module-hero-slider').find('.dots .button-play').on("click", function () {
            const $this = $(this),
                $thisModule = $this.closest('.module-hero-slider');
            if ($this.hasClass('paused')) {
                $thisModule.trigger('play_slider');
                $this.removeClass('paused');
            } else {
                $thisModule.trigger('pause_slider');
                $this.addClass('paused');
            }
        });
        modules.pauseAllSliders = function () {
            $('.module-hero-slider').each(function () {
                $(this).trigger('pause_slider');
            });
        }
        modules.playAllSliders = function () {
            $('.module-hero-slider').each(function () {
                $(this).trigger('play_slider');
            });
        }
        //
        //--- MODULE STORIES SLIDER ---//
        //
        $('.module-stories-slider').on("change_slide", function (e, params) {
            var $this = $(this);
            var $slides = $this.find('.slides .slide');
            var currentSlide;
            var n, img;
            //
            clearInterval($this.data('interval'));
            //
            if ($slides.length == 1) {
                $this.data('autoplay', false);
                $this.find('.dots .button').eq(0).css({ display: 'none' });
            }
            if (params.next) {
                currentSlide = $this.data('current') == undefined ? 0 : $this.data('current') + 1;
            } else {
                currentSlide = !params.index ? 0 : params.index;
            }
            if (currentSlide >= $slides.length) {
                currentSlide = 0;
            } else if (currentSlide < 0) {
                currentSlide = $slides.length - 1;
            }
            $this.data('current', currentSlide);
            $this.find('.dots .button').removeClass('selected');
            $this.find('.dots .button').eq(currentSlide).addClass('selected')
            $this.find('.preloader').stop(true).remove();
            $this.find('.column.img').append('<div class="preloader opacity-0"></div>');
            $this.find('.preloader').delay(100).animate({ opacity: 1 }, 100);
            //
            $this.find('.content-holder').removeClass('loaded');
            //
            if ($this.data('img')) {
                $this.data('img').onload = null;
            }
            $this.data('img', new Image());
            $this.data('img').onload = function () {
                var $img = $this.find('.image-wrapper .image');
                $img.stop(true);
                $this.find('.image-wrapper').append('<div role="img" alt="" class="image" style="background-image:url(' + this.src + ')"></div>');
                $this.find('.image-wrapper .image').last().animate({ opacity: 1 }, {
                    duration: 500, easing: 'easeOutSine', complete: function () {
                        $img.remove();
                        if ($this.data('autoplay')) {
                            $this.data('interval', setInterval(function () {
                                if ($this.data('autoplaystatus')) {
                                    $this.trigger('change_slide', { next: true });
                                }
                            }, 8000));
                        }
                    }
                });
                $this.find('.preloader').stop(true).remove();
                $this.find('.content-holder').html($slides.eq(currentSlide).html()).addClass('loaded');
            }
            $this.data('img').src = $slides.eq(currentSlide).data('image');
        }).on('pause_slider', function () {
            $(this).data('autoplaystatus', false);
        }).on('play_slider', function () {
            $(this).data('autoplaystatus', true);
        }).each(function () {
            var $this = $(this);
            $this.data('autoplaystatus', true);
            $this.trigger('change_slide', { index: 0 });
            $this.find('.label, .bottom-area .cta-button').addClass('loaded');
            $this.find('.dots .button').addClass('loaded');
        });
        $('.module-stories-slider').find('.dots .button-dot').on("click", function () {
            var $this = $(this);
            var $slider, index;
            if (!$this.hasClass('selected')) {
                $slider = $this.parent().parent().parent().parent().parent().parent().parent();
                index = $this.index();
            }
            $slider.trigger('change_slide', { index: index });
        });
        $('.module-stories-slider').find('.dots .button-play').on("click", function () {
            const $this = $(this),
                $thisModule = $this.closest('.module-stories-slider');
            if ($this.hasClass('paused')) {
                $thisModule.trigger('play_slider');
                $this.removeClass('paused');
                console.log('PAUSED')
            } else {
                $thisModule.trigger('pause_slider');
                $this.addClass('paused');
                console.log('play')
            }
        });
        //
        //--- MODULE BOXES ---//
        //
        $('.module-boxes .box').each(function (i) {
            var $this = $(this);
            var $img = $this.find('.image')
            var src = $img.data('image');
            var image;
            if (src) {
                image = new Image();
                image.onload = function () {
                    $img.css({ backgroundImage: 'url(' + this.src + ')' }).addClass('loaded');
                }
                image.src = src;
            }
        });
        //
        //--- ARCHIVE LOAD MORE ---//
        //
        pagination.init();
        //
        //--- FIX LAS MODULE HEIGHT IN LARGE SCREENS ---//
        //
        /*
        $win.bind('resize.last_module',function(){
            var $module = $('.module');
            var $lastModule = $module.last().hasClass('module-subscription') && $module.length > 1 ? $module.eq(($module.length - 2)) :
                $module.last();
            var minHeight = 0;
            var h = 0;
            $lastModule.css({'min-height': 0});
            $module.each(function(){
                h += $(this).outerHeight();
            });
            if(h < $('#main-content').height()){
                minHeight = $('#main-content').height() - h + 1 + $lastModule.outerHeight();
                $lastModule.css({'min-height': minHeight});
            }else{
                $lastModule.css({'min-height': 0});
            }
        });
        $win.trigger('resize.last_module');
        */
    }
}

const pagination = {
    init: function () {
        var postsPerPage, postsTotal, totalPages, currentPage, jqxhr, url, ajaxLoading, html, $items;
        var $loadMoreButton = $('.load-more-button');
        if ($('.module.archive').length && $loadMoreButton.length) {
            ajaxLoading = false;
            $items = $('.module.archive .items');
            url = window.location.href.split('?')[0];
            var urlParams = new URLSearchParams(window.location.search);
            postsPerPage = $('.module.archive .items').data('posts-per-page');
            postsTotal = $('.module.archive .items').data('total');
            totalPages = Math.ceil(postsTotal / postsPerPage);
            currentPage = parseInt(urlParams.get('page')) || 1;
            $loadMoreButton.data('default', $loadMoreButton.text());
            $loadMoreButton.click(function () {
                if (!ajaxLoading) {
                    html = '';
                    currentPage++;
                    ajaxLoading = true;
                    $loadMoreButton.html('Loading...');
                    urlParams.set('page', currentPage);
                    var requestUrl = url + (urlParams.toString() ? '?' + urlParams.toString() : '');
                    console.log('Loading page:', currentPage, 'URL:', requestUrl);
                    jqxhr = $.ajax(requestUrl)

                        .done(function (result) {
                            var parts = result.split('<!-- PAGINATION -->');
                            if (parts.length >= 2) {
                                html = parts[1].split('<!-- PAGINATION -->')[0];
                                $items.append(html);
                            } else {
                                console.error('No se encontró el marcador de paginación en la respuesta');
                            }
                        })
                        .fail(function (xhr, status, error) {
                            console.error('Error en AJAX:', status, error);
                            alert("Error al cargar más posts");
                            currentPage--; // Revertir el incremento
                        })
                        .always(function () {
                            ajaxLoading = false;
                            $loadMoreButton.html($loadMoreButton.data('default'));
                            if (currentPage >= totalPages) {
                                $loadMoreButton.remove();
                            }
                        });
                }
            });
        }
    }
}

const safeURL = {
    init: function () {
        safeURL.test();
        $(window).bind('hashchange', function () {
            safeURL.test();
        });
    },
    test: function () {
        var tmpurl = unescape(String(window.location));
        if (tmpurl.indexOf('#') !== -1 && (tmpurl.indexOf('<') !== -1 || tmpurl.indexOf('>') !== -1 || tmpurl.indexOf('(') !== -1 || tmpurl.indexOf(')') !== -1 || tmpurl.indexOf('{') !== -1 || tmpurl.indexOf('}') !== -1 || tmpurl.indexOf('[') !== -1 || tmpurl.indexOf(']') !== -1)) {
            location.replace(safeURL.sanitize(tmpurl));
        }
    },
    sanitize: function (str) {
        return String(str).replace(/<[^>]*>?/gm, '').replace(/[\])}[{(]/g, '');
    }
}

//-------------//
//--- TOOLS ---//
//-------------//

const copyToClipboardButtons = {
    init: function () {
        $(".copy-clipboard-button").click(function (e) {
            e.preventDefault();
            $(".copied-txt").stop(true).remove();
            var txt = String(window.location);
            copyTextToClipboard(txt);
            $(this).css({ transition: 'none', opacity: 0 }).animate({ opacity: 1 }, 500);
            $(this).parent().append('<span class="copied-txt"> Copied...</span>');
            $(".copied-txt").css({ transition: 'none', opacity: 0 }).animate({ opacity: 1 }, 500, function () {
                $(this).delay(1200).animate({ opacity: 0 }, 200, function () {
                    $(this).remove();
                });
            });
        });
    }
}

function copyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = 0;
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        //console.log('Copying text command was ' + msg);
    } catch (err) {
        //console.log('Oops, unable to copy');
    }
    document.body.removeChild(textArea);
}

const tools = {
    slugify: function (text) {
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-')           // Replace spaces with -
            .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
            .replace(/\-\-+/g, '-')         // Replace multiple - with single -
            .replace(/^-+/, '')             // Trim - from start of text
            .replace(/-+$/, '');            // Trim - from end of text
    },
    removeHoverCSSRule: function () {
        try {
            var ignore = /:hover/;
            for (var i = 0; i < document.styleSheets.length; i++) {
                var sheet = document.styleSheets[i];
                var rules = sheet.cssRules || sheet.rules;
                if (!rules) {
                    continue;
                }

                for (var j = rules.length - 1; j >= 0; j--) {
                    var rule = rules[j];
                    if (rule.type === CSSRule.STYLE_RULE && ignore.test(rule.selectorText)) {
                        sheet.deleteRule(j);
                    }
                }
            }
        }
        catch (e) {
        }
    },
    getScroll: function () {
        if (window.pageYOffset != undefined) {
            return { left: pageXOffset, top: pageYOffset };
        } else {
            var sx, sy, d = document, r = d.documentElement, b = d.body;
            sx = r.scrollLeft || b.scrollLeft || 0;
            sy = r.scrollTop || b.scrollTop || 0;
            return { left: sx, top: sy };
        }
    },
    hasScrollbar: function () {
        // The Modern solution
        if (typeof window.innerWidth === 'number')
            return window.innerWidth > document.documentElement.clientWidth

        // rootElem for quirksmode
        var rootElem = document.documentElement || document.body

        // Check overflow style property on body for fauxscrollbars
        var overflowStyle

        if (typeof rootElem.currentStyle !== 'undefined')
            overflowStyle = rootElem.currentStyle.overflow

        overflowStyle = overflowStyle || window.getComputedStyle(rootElem, '').overflow

        // Also need to check the Y axis overflow
        var overflowYStyle

        if (typeof rootElem.currentStyle !== 'undefined')
            overflowYStyle = rootElem.currentStyle.overflowY

        overflowYStyle = overflowYStyle || window.getComputedStyle(rootElem, '').overflowY

        var contentOverflows = rootElem.scrollHeight > rootElem.clientHeight
        var overflowShown = /^(visible|auto)$/.test(overflowStyle) || /^(visible|auto)$/.test(overflowYStyle)
        var alwaysShowScroll = overflowStyle === 'scroll' || overflowYStyle === 'scroll'

        return (contentOverflows && overflowShown) || (alwaysShowScroll)
    },
    cssColor: function (color) {
        var rgba = color.split(",");
        for (var i = 0; i < rgba.length; i++) {
            rgba[i] = rgba[i].replace(/[^0-9.]/g, '');
        }
        if (rgba[3] == undefined) {
            rgba[3] = 1;
        }
        result = {
            hexa: ("#" + ("0" + parseInt(rgba[0], 10).toString(16)).slice(-2) + ("0" + parseInt(rgba[1], 10).toString(16)).slice(-2) + ("0" + parseInt(rgba[2], 10).toString(16)).slice(-2)).toUpperCase(),
            array: rgba,
            rgba: "rgba(" + rgba[0] + "," + rgba[1] + "," + rgba[2] + "," + rgba[3] + ")",
            rgb: "rgb(" + rgba[0] + "," + rgba[1] + "," + rgba[2] + ")",
        }
        return result;
    },
    numRange: function (a, b) {
        d = a - b;
        if (d < 0) {
            d = -d;
        }
        return d;
    },
    hexaToRGBA: function (hex, opacity) {
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function (m, r, g, b) {
            return r + r + g + g + b + b;
        });
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        result = result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
        if (isNaN(opacity)) {
            return "rgba(" + result.r + "," + result.g + "," + result.b + ")";
        } else {
            return "rgba(" + result.r + "," + result.g + "," + result.b + "," + opacity + ")";
        }
    },
    cleanHtmlTags: function ($target) {
        return $target.text().split("\r").join(" ").split("\n").join(" ").split("	").join(" ").split("  ").join(" ").split("  ").join(" ");
    },
    array: {
        removeRepeat: function (target) {
            var result = [];
            target.forEach(function (item) {
                if (result.indexOf(item) < 0) {
                    result.push(item);
                }
            });
            return result;
        }
    },
    getVideoEmbedCode: function (url) {
        var videoID, regExp, match, result;
        var url = String(url);
        if (url.indexOf('vimeo') !== -1) {
            regExp = /^.*(vimeo\.com\/)((channels\/[A-z]+\/)|(groups\/[A-z]+\/videos\/))?([0-9]+)/;
            match = url.match(regExp);
            videoID = (match && match[5]) ? match[5] : false;
            result = '<iframe tabindex="0" src="https://player.vimeo.com/video/' + videoID + '?autoplay=1" width="100%" height="100%" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>'
        } else if (url.indexOf('youtu') !== -1) {
            url = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
            url = (url[2] !== undefined) ? url[2].split(/[^0-9a-z_\-]/i)[0] : url[0];
            videoID = url;
            result = '<iframe tabindex="0" width="100%" height="100%" src="https://www.youtube.com/embed/' + videoID + '?autoplay=1&rel=0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
        } else if (url.indexOf('http') !== '') {
            result = '<iframe tabindex="0" width="100%" height="100%" src="' + url + '?autoplay=1" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
        } else {
            result = '';
        }
        return result;
    },
    getDevicePixelRatio: function () {
        var ratio = 1;
        // To account for zoom, change to use deviceXDPI instead of systemXDPI
        if (window.screen.systemXDPI !== undefined && window.screen.logicalXDPI !== undefined && window.screen.systemXDPI > window.screen.logicalXDPI) {
            // Only allow for values > 1
            ratio = window.screen.systemXDPI / window.screen.logicalXDPI;
        }
        else if (window.devicePixelRatio !== undefined) {
            ratio = window.devicePixelRatio;
        }
        return ratio;
    },
    getSupportedTransform: function () {
        var prefixes = 'transform WebkitTransform MozTransform OTransform msTransform'.split(' ');
        for (var i = 0; i < prefixes.length; i++) {
            if (document.createElement('div').style[prefixes[i]] !== undefined) {
                return Boolean(prefixes[i]);
            }
        }
        return false;
    },
    pointerEventToXY: function (e) {
        var out = { x: 0, y: 0 };
        if (e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel') {
            var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
            out.x = touch.pageX;
            out.y = touch.pageY;
        } else if (e.type == 'mousedown' || e.type == 'mouseup' || e.type == 'mousemove' || e.type == 'mouseover' || e.type == 'mouseout' || e.type == 'mouseenter' || e.type == 'mouseleave') {
            out.x = e.pageX;
            out.y = e.pageY;
        }
        return out;
    }
}

const cookies = {
    create: function (name, value, days) {
        var expires;
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toGMTString();
        } else {
            expires = "";
        }
        document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
    },
    read: function (name) {
        var nameEQ = encodeURIComponent(name) + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
        }
        return null;
    },
    erase: function (name) {
        cookies.create(name, "", -1);
    }
}

Array.prototype.sortByKey = function (key) {
    return this.sort(function (a, b) {
        var x = a[key];
        var y = b[key];

        if (typeof x == "string") {
            x = x.toLowerCase();
            y = y.toLowerCase();
        }
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}
Array.prototype.shuffle = function () {
    var i = this.length, j, temp;
    if (i == 0) return this;
    while (--i) {
        j = Math.floor(Math.random() * (i + 1));
        temp = this[i];
        this[i] = this[j];
        this[j] = temp;
    }
    return this;
}
Array.prototype.sortOn = function (key, numeric) {
    if (numeric) {
        this.sort(function (a, b) {
            return a[key] - b[key];
        });
    } else {
        this.sort(function (a, b) {
            if (a[key] < b[key]) {
                return -1;
            } else if (a[key] > b[key]) {
                return 1;
            }
            return 0;
        });
    }
}

const helper = {
    init: function () {
        if ($("#helper-124").length == 0) {
            $body.append('<div id="helper-124" style="z-index:1000000;display:none;position:fixed;top:0px;padding:10px;background:orange;"></div>');
        }
    },
    text: function (text) {
        //helper.show(text);
    },
    show: function (text) {
        $("#helper-124").css({ display: "block" }).html(text);
    },
    hide: function () {
        $("#helper-124").css({ display: "none" }).html('');
    }
}

jQuery.easing['jswing'] = jQuery.easing['swing'];
jQuery.extend(jQuery.easing,
    {
        def: 'jswing',
        swing: function (x, t, b, c, d) {
            return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
        },
        easeInQuad: function (x, t, b, c, d) {
            return c * (t /= d) * t + b;
        },
        easeOutQuad: function (x, t, b, c, d) {
            return -c * (t /= d) * (t - 2) + b;
        },
        easeInOutQuad: function (x, t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t + b;
            return -c / 2 * ((--t) * (t - 2) - 1) + b;
        },
        easeInCubic: function (x, t, b, c, d) {
            return c * (t /= d) * t * t + b;
        },
        easeOutCubic: function (x, t, b, c, d) {
            return c * ((t = t / d - 1) * t * t + 1) + b;
        },
        easeInOutCubic: function (x, t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t + 2) + b;
        },
        easeInQuart: function (x, t, b, c, d) {
            return c * (t /= d) * t * t * t + b;
        },
        easeOutQuart: function (x, t, b, c, d) {
            return -c * ((t = t / d - 1) * t * t * t - 1) + b;
        },
        easeInOutQuart: function (x, t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
            return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
        },
        easeInQuint: function (x, t, b, c, d) {
            return c * (t /= d) * t * t * t * t + b;
        },
        easeOutQuint: function (x, t, b, c, d) {
            return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
        },
        easeInOutQuint: function (x, t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
        },
        easeInSine: function (x, t, b, c, d) {
            return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
        },
        easeOutSine: function (x, t, b, c, d) {
            return c * Math.sin(t / d * (Math.PI / 2)) + b;
        },
        easeInOutSine: function (x, t, b, c, d) {
            return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
        },
        easeInExpo: function (x, t, b, c, d) {
            return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
        },
        easeOutExpo: function (x, t, b, c, d) {
            return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
        },
        easeInOutExpo: function (x, t, b, c, d) {
            if (t == 0) return b;
            if (t == d) return b + c;
            if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
            return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
        },
        easeInCirc: function (x, t, b, c, d) {
            return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
        },
        easeOutCirc: function (x, t, b, c, d) {
            return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
        },
        easeInOutCirc: function (x, t, b, c, d) {
            if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
            return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
        },
        easeInElastic: function (x, t, b, c, d) {
            var s = 1.70158; var p = 0; var a = c;
            if (t == 0) return b; if ((t /= d) == 1) return b + c; if (!p) p = d * .3;
            if (a < Math.abs(c)) { a = c; var s = p / 4; }
            else var s = p / (2 * Math.PI) * Math.asin(c / a);
            return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        },
        easeOutElastic: function (x, t, b, c, d) {
            var s = 1.70158; var p = 0; var a = c;
            if (t == 0) return b; if ((t /= d) == 1) return b + c; if (!p) p = d * .3;
            if (a < Math.abs(c)) { a = c; var s = p / 4; }
            else var s = p / (2 * Math.PI) * Math.asin(c / a);
            return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
        },
        easeInOutElastic: function (x, t, b, c, d) {
            var s = 1.70158; var p = 0; var a = c;
            if (t == 0) return b; if ((t /= d / 2) == 2) return b + c; if (!p) p = d * (.3 * 1.5);
            if (a < Math.abs(c)) { a = c; var s = p / 4; }
            else var s = p / (2 * Math.PI) * Math.asin(c / a);
            if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
            return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
        },
        easeInBack: function (x, t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            return c * (t /= d) * t * ((s + 1) * t - s) + b;
        },
        easeOutBack: function (x, t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
        },
        easeInOutBack: function (x, t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
            return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
        },
        easeInBounce: function (x, t, b, c, d) {
            return c - $.easing.easeOutBounce(x, d - t, 0, c, d) + b;
        },
        easeOutBounce: function (x, t, b, c, d) {
            if ((t /= d) < (1 / 2.75)) {
                return c * (7.5625 * t * t) + b;
            } else if (t < (2 / 2.75)) {
                return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
            } else if (t < (2.5 / 2.75)) {
                return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
            } else {
                return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
            }
        },
        easeInOutBounce: function (x, t, b, c, d) {
            if (t < d / 2) return $.easing.easeInBounce(x, t * 2, 0, c, d) * .5 + b;
            return $.easing.easeOutBounce(x, t * 2 - d, 0, c, d) * .5 + c * .5 + b;
        }
    });
/*
* .addClassSVG(className)
* Adds the specified class(es) to each of the set of matched SVG elements.
*/
$.fn.addClassSVG = function (className) {
    $(this).attr('class', function (index, existingClassNames) {
        return existingClassNames + ' ' + className;
    });
    return this;
};

/*
* .removeClassSVG(className)
* Removes the specified class to each of the set of matched SVG elements.
*/
$.fn.removeClassSVG = function (className) {
    $(this).attr('class', function (index, existingClassNames) {
        var re = new RegExp(className, 'g');
        return existingClassNames.replace(re, '');
    });
    return this;
};
if (!Date.prototype.adjustDate) {
    Date.prototype.adjustDate = function (days) {
        var date;

        days = days || 0;

        if (days === 0) {
            date = new Date(this.getTime());
        } else if (days > 0) {
            date = new Date(this.getTime());

            date.setDate(date.getDate() + days);
        } else {
            date = new Date(
                this.getFullYear(),
                this.getMonth(),
                this.getDate() - Math.abs(days),
                this.getHours(),
                this.getMinutes(),
                this.getSeconds(),
                this.getMilliseconds()
            );
        }

        this.setTime(date.getTime());

        return this;
    };
}
$.fn.hasFocus = function () {
    if (this.length === 0) { return false; }
    if (document.activeElement) {
        return this.get(0) === document.activeElement;
    }
    return this.data('hasFocus');
};
$.fn.sort = [].sort;
(function ($) {
    $.fn.shuffle = function () {
        // credits: http://bost.ocks.org/mike/shuffle/
        var m = this.length, t, i;

        while (m) {
            i = Math.floor(Math.random() * m--);

            t = this[m];
            this[m] = this[i];
            this[i] = t;
        }

        return this;
    };
}(jQuery));

$.fn.wipetouch = function (settings) {
    if (typeof settings == "object") {
        var data = { xMin: 40, yMax: 40, t: 0, x: [], y: [], wipeLeft: function () { }, wipeRight: function () { } };
        $.extend(data, settings);
        $(this).bind("touchstart", function (e) {
            data.t = e.originalEvent.touches.length;
            data.x = [];
            data.y = [];
            data.x.push(e.originalEvent.touches[0].pageX);
            data.y.push(e.originalEvent.touches[0].pageY);
        });
        $(this).bind("touchmove", function (e) {
            data.x.push(e.originalEvent.touches[0].pageX);
            data.y.push(e.originalEvent.touches[0].pageY);
        });
        $(this).bind("touchend", function () {
            if (data.t == 1) {
                if (data.x.length > 2) {
                    var y1 = data.y[0];
                    var y2 = data.y[data.y.length - 1];
                    var y = data.yMax;
                    if (y2 >= y1) {
                        y = y2 - y1;
                    } else {
                        y = y1 - y2;
                    }
                    if (y < data.yMax) {
                        var x1 = data.x[0];
                        var x2 = data.x[data.x.length - 1];
                        var x = data.xMin;
                        if (x2 >= x1) {
                            x = x2 - x1;
                        } else {
                            x = x1 - x2;
                        }
                        if (x > data.xMin) {
                            if (x1 > x2) {
                                data.wipeLeft();
                            } else {
                                data.wipeRight();
                            }
                        }
                    }
                }
                data.t = 0;
                data.x = [];
                data.y = [];
            }
        });

    }
};

// Restricts input for the set of matched elements to the given inputFilter function.
// https://jsfiddle.net/emkey08/tvx5e7q3
(function ($) {
    $.fn.inputFilter = function (inputFilter) {
        return this.on("input keydown keyup mousedown mouseup select contextmenu drop", function () {
            if (inputFilter(this.value)) {
                this.oldValue = this.value;
                this.oldSelectionStart = this.selectionStart;
                this.oldSelectionEnd = this.selectionEnd;
            } else if (this.hasOwnProperty("oldValue")) {
                this.value = this.oldValue;
                this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
            } else {
                this.value = "";
            }
        });
    };
}(jQuery));