(function ($) {
    "use strict";

    window.$ = $;
    /*****************************************
    Wyde Core
    /******************************************/
    $.extend(window, {
        
        wyde: {
            init: function () {
                this.version = "1.2.1";
                this.browser = {};
                this.detectBrowser();

                Modernizr.addTest("boxsizing", function () {
                    return Modernizr.testAllProps("boxSizing") && (document.documentMode === undefined || document.documentMode > 7);
                });

            },
            detectBrowser: function () {

                this.browser.touch = (Modernizr.touch) ? true : false;
                this.browser.css3 = (Modernizr.csstransforms3d) ? true : false;


                var self = this;
                var getBrowserScreenSize = function(){
                    var w = $(window).width();
                    self.browser.xs = w < 768;
                    self.browser.sm = (w > 767 && w < 992);
                    self.browser.md = (w > 991 && w < 1200);
                    self.browser.lg = w > 1199;                 
                };

                getBrowserScreenSize();

                var ua = window.navigator.userAgent;
                var msie = ua.indexOf("MSIE ");

                // IE 10 or older
                if (msie > 0) {
                    this.browser.msie = parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
                }

                // IE 11
                var trident = ua.indexOf('Trident/');
                if (trident > 0) {
                    var rv = ua.indexOf('rv:');
                    this.browser.msie = parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
                }

                // IE 12
                var edge = ua.indexOf('Edge/');
                if (edge > 0) {
                    this.browser.msie = parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
                }

                this.browser.prefix = "";

                if (this.browser.css3 === true) {
                    var styles = window.getComputedStyle(document.documentElement, "");
                    this.browser.prefix = "-" + (Array.prototype.slice.call(styles).join("").match(/-(moz|webkit|ms)-/) || (styles.OLink === "" && ["", "o"]))[1] + "-";
                }

                $(window).smartresize(function (event) {
                     getBrowserScreenSize();
                });

            }
        }
    
    });

    wyde.init();

    /*****************************************
    String Extension
    /*****************************************/
    $.extend(String, {

        format: function () {
            if (arguments.length == 0) return null;
            var args;
            if (arguments.length == 1) args = arguments[0];
            else args = arguments;

            var result = args[0];
            for (var i = 1; i < args.length; i++) {
                var re = new RegExp("\\{" + (i - 1) + "\\}", "gm");
                result = result.replace(re, args[i]);
            }
            return result;
        }
    
    });

    $.extend(String.prototype, {

        trim: function (ch) {
            if (!ch) ch = ' ';
            return this.replace(new RegExp("^" + ch + "+|" + ch + "+$", "gm"), "").replace(/(\n)/gm, "");
        },
        ltrim: function () {
            return this.replace(/^\s+/, "");
        },
        rtrim: function () {
            return this.replace(/\s+$/, "");
        },
        reverse: function () {
            var res = "";
            for (var i = this.length; i > 0; --i) {
                res += this.charAt(i - 1);
            }
            return res;
        },
        startWith: function (pattern) {
            return this.match('^' + pattern);
        },
        endsWith: function (pattern) {
            return this.match(pattern + '$');
        }
    
    });

    /*****************************************
    Utilities
    /*****************************************/
    $.extend(window, {

        /*  Convert Hex color to RGB color */
        hex2rgb: function (hex, opacity) {

            var hex = hex.replace("#", "");
            var r = parseInt(hex.substring(0, 2), 16);
            var g = parseInt(hex.substring(2, 4), 16);
            var b = parseInt(hex.substring(4, 6), 16);

            return String.format("rgba({0},{1},{2},{3})", r, g, b, opacity);
        },
        /*  Convert RGB color to Hex color */
        rgb2hex: function (rgb) {
            rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
            return (rgb && rgb.length === 4) ? "#" +
              ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
              ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
              ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
        },
        getViewPort: function () {
            var win = $(window);
            var viewport = {
                top: win.scrollTop(),
                left: win.scrollLeft()
            };
            viewport.right = viewport.left + win.width();
            viewport.bottom = viewport.top + win.height();

            return viewport;
        },
        getHash: function (url) {
            return (url && url.indexOf("#") > -1) ? url.substr(url.indexOf("#")) : null;
        },
        getUrlVars: function(url)
        {
            if(!url) url = window.location.href;
            var vars = [], params;
            if(window.location.href.indexOf('?')!=-1) {
                var queries = url.slice(window.location.href.indexOf('?') + 1).split('&');                
                for(var i = 0; i < queries.length; i++)
                {
                    params = queries[i].split('=');                
                    vars.push(params[0]);
                    vars[params[0]] = params[1] ? params[1] : "";
                }
            }
            return vars;
        },
        updateQueryStringParameter: function(uri, key, value) {
            var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
            var separator = uri.indexOf('?') !== -1 ? "&" : "?";
            if (uri.match(re)) {
                return uri.replace(re, '$1' + key + "=" + value + '$2');
            }
            else {
                return uri + separator + key + "=" + value;
            }
        }

    });

    /*****************************************
    Is on screen 
    /*****************************************/
    $.fn.isOnScreen = function () {

        var viewport = getViewPort();

        var bounds = this.offset();
        bounds.right = bounds.left + this.outerWidth();
        bounds.bottom = bounds.top + this.outerHeight();

        return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));
    };

    /*****************************************
    Request Animation frame
    /*****************************************/
    (function () {

        var lastTime = 0;
        var vendors = ['ms', 'moz', 'webkit', 'o'];
        for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
                                 || window[vendors[x] + 'CancelRequestAnimationFrame'];
        }

        if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = function (callback) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function () { callback(currTime + timeToCall); },
          timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
        }

        if (!window.cancelAnimationFrame) {
            window.cancelAnimationFrame = function (id) {
                clearTimeout(id);
            };
        }

    })();


    /*****************************************
    Wyde Scroller
    /*****************************************/
    function WydeScroller(element, options, callback) {

        var defaults = {
            height: null,
            scrollbar: true
        };

        var settings = $.extend({}, defaults, options || {});

        var $el = $(element);

        var maxHeight = settings.height ? settings.height : $el.height();

        $el.bind("mousewheel", function () {
            return false;
        });

        $el.wrapInner("<div class=\"w-scroller scroll-loading\"><div class=\"w-wrapper\"><div class=\"w-content-inner\"></div></div></div>");

        var $content = $el.find(".w-content-inner");
        var hasScroll = $content.outerHeight() > maxHeight;

        var $container = $el.find(".w-scroller");
        var $scrollbar = $("<div class=\"w-scrollbar\"><div class=\"w-bar\"><div class=\"w-holder\"></div></div>");
        $container.append($scrollbar);

        if (hasScroll) {
            $container.addClass("active");
        } else {
            $scrollbar.hide();
        }

        if (!settings.scrollbar) {
            $scrollbar.hide();
        }

        var $wrapper = $el.find(".w-wrapper");        
        $wrapper.css("max-height", maxHeight);

        $wrapper.sly({
            scrollBar: $scrollbar,
            easing: "easeOutExpo",
            speed: 800,
            scrollBy: 120,
            syncSpeed: 0.1,
            dragHandle: 1,
            dynamicHandle: 1,
            clickBar: 1,
            mouseDragging: 1,
            touchDragging: 1,
            releaseSwing: 1,
            elasticBounds: 1
        });

        this.refresh = function (height) {

            $container.addClass("scroll-loading");
            
            maxHeight = height ? height : $el.height();

            $wrapper.css("max-height", maxHeight);

            hasScroll = $content.outerHeight() > maxHeight;

            if (hasScroll) {
                $container.addClass("active");
                if (settings.scrollbar) $scrollbar.show();
            } else {
                $container.removeClass("active");
                $scrollbar.hide();
            }

            setTimeout(function(){
                $wrapper.sly("reload");
            }, 500);
            

            setTimeout(function () {
                $container.removeClass("scroll-loading");
            }, 1500);
        };

        this.destroy = function () {
            $el.unbind("mousewheel");
            $wrapper.sly(false);
        };

        var self = this;
        $(window).smartresize(function () {
            self.refresh();
        });

        setTimeout(function () {
            $container.removeClass("scroll-loading");
        }, 1500);

    }
    //jQuery proxy
    $.fn.wydeScroller = function (options, callbackMap) {
        var method, methodArgs;

        // Attributes logic
        if (!$.isPlainObject(options)) {
            if (typeof options === "string" || options === false) {
                method = options === false ? "destroy" : options;
                methodArgs = Array.prototype.slice.call(arguments, 1);
            }
            options = {};
        }

        // Apply to all elements
        return this.each(function (i, element) {
            // Call with prevention against multiple instantiations
            var plugin = $.data(element, "wydeScroller");

            if (!plugin && !method) {
                // Create a new object if it doesn't exist yet
                plugin = $.data(element, "wydeScroller", new WydeScroller(element, options, callbackMap));
            } else if (plugin && method) {
                // Call method
                if (plugin[method]) {
                    plugin[method].apply(plugin, methodArgs);
                }
            }
        });
    };

    /*****************************************
    Vertical Menu
    /*****************************************/
    function WydeVerticalMenu(element, options, callback) {
   

        var defaults = {            
            changed: function () { }
        };

        var settings = $.extend({}, defaults, options || {});       

        var $el = $(element);
        var self = this;

        var menuDepth = 0;

        this.menuSelected = function(menuItem, depth) {

            if(depth) menuDepth = depth;

            var $sub = $(menuItem);
            var h = $sub.height();
            $el.css("height", h);
            if (wyde.browser.css3) {
                $el.find(".vertical-menu").css(wyde.browser.prefix + "transform", "translateX(" + (-menuDepth * 100) + "%)");
            } else {
                $el.find(".vertical-menu").animate({ left: -(menuDepth * 100) + "%" }, 300);
            }

            setTimeout(function () {
                settings.changed($el);
            }, 300);
        }

        $el.find(".vertical-menu .sub-menu").each(function () {
            var $sub = $(this);
            var padTop = $el.offset().top + parseInt($el.css("padding-top"));
            $sub.css("top", -parseInt($sub.offset().top) + padTop);
        }).each(function () {
            $(this).hide();
        });

        this.refresh = function(){          

            $el.find(".vertical-menu ul > li.back-to-parent span").on("click", function (event) {
                menuDepth--;
                if (menuDepth < 0) menuDepth = 0;
                var $sub = $(this).closest(".sub-menu");
                $sub.fadeOut(300);
                self.menuSelected($sub.closest(".menu-item-has-children").closest("ul"));                
                return false;
            });

            $el.find(".vertical-menu li.menu-item-has-children > a").each(function(){

                var $menu = $(this);
                var $sub = $menu.parent().find("> ul");               
                if ($sub.length > 0) {  

                    var toggle = false;

                    if( $menu.attr("href") == "#" || this.pathname == window.location.pathname ){                        
                        toggle = true;
                    }                  
                    
                    $menu.on("click", function (event) { 
                        if(toggle) event.preventDefault();
                        menuDepth++;
                        $sub.fadeIn(300);
                        self.menuSelected($sub);     
                        if(toggle) return false;                                         
                    });                                      
                }

            });                   
            
            $el.css("height", $el.height());
            var delay = 0;            
            delay = self.openSubMenu();            

            setTimeout(function(){
                if( typeof settings.changed == "function" ){
                    settings.changed($el);
                } 
            }, (delay*300+100) );

           
        };

        this.openSubMenu = function(){
            // Select sub menu item  
            var $selectedItem = $el.find(".current-menu-item").last();
            if( !$selectedItem.length ) return 0;

            var $parents = $selectedItem.parents(".current-menu-ancestor");
            
            menuDepth = $parents.length;               

            if( menuDepth > 0 ){
                var $sub = $parents.first().find("> ul").first();
                $parents.find("> ul").fadeIn(300);
                
                if( $selectedItem.find("> ul").length ){
                    var $subs = $selectedItem.find("> ul");
                    $subs.fadeIn(300);
                    $sub = $subs.first();
                    menuDepth += 1;   
                }   

                this.menuSelected($sub, menuDepth); 

                return menuDepth; 

            } 

            return 0;
        };

        this.refresh();

     
    };
    //jQuery proxy
    $.fn.wydeVerticalMenu = function (options, callbackMap) {
        var method, methodArgs;

        // Attributes logic
        if (!$.isPlainObject(options)) {
            if (typeof options === "string" || options === false) {
                method = options === false ? "destroy" : options;
                methodArgs = Array.prototype.slice.call(arguments, 1);
            }
            options = {};
        }

        // Apply to all elements
        return this.each(function (i, element) {
            // Call with prevention against multiple instantiations
            var plugin = $.data(element, "wydeVerticalMenu");

            if (!plugin && !method) {
                // Create a new object if it doesn't exist yet
                plugin = $.data(element, "wydeVerticalMenu", new WydeVerticalMenu(element, options, callbackMap));
            } else if (plugin && method) {
                // Call method
                if (plugin[method]) {
                    plugin[method].apply(plugin, methodArgs);
                }
            }
        });
    };


    /*****************************************
    Wyde Page
    /*****************************************/
    $.extend(wyde, {

        page: {

            init: function () {

                this.id = this.getPageId();
                this.isHome = $("body").hasClass("home");
                this.onePage = $("body").hasClass("onepage");

                if (typeof page_settings != "undefined") $.extend(this, page_settings);

                this.createPreloader();

                this.showLoader();

                this.initMenu();

                this.improveScrolling();

                this.ready = false;

                var self = this;

                $(window).bind("wyde.page.beforechange", function () {
                    /* Save Expand Navigation State */
                    //self.expandNavActive = $("body.expand-nav").hasClass("full-nav-active");                    
                    self.hideSlidingBar();
                    self.hideSearch();
                    self.hideNav();
                    self.hideFullScreenNav();
                    setTimeout(function(){

                    }, 500);
                    $("body").addClass("changing");
                });

                $(window).bind("wyde.page.pageloaded", function () {
                    self.load();
                    /* Set Expand Navigation State */
                    //if (self.expandNavActive) $("body.expand-nav").addClass("full-nav-active");
                });

                $(window).bind("wyde.page.ready", function () {
                    $("body").removeClass("changing");
                    self.ready = true;
                });

                $(window).bind("wyde.page.statechange", function (event) {
                    self.stateChange();
                });

                $(window).bind("scroll", function (event) {
                    self.scrolled(event);
                });

                $(window).smartresize(function (event) {
                    self.resize(event);
                });

                this.preloadImages(function () {
                    if (self.ready) {
                        self.contentLoad();
                        $(window).trigger("wyde.page.ready");
                    } else {
                        self.load();
                    }
                });

                $(document).ready(function () {
                    if (self.ready) {
                        self.contentLoad();
                        $(window).trigger("wyde.page.ready");
                    } else {
                        self.load();
                    }
                });

                if (this.ajax_page) {
                    this.ajaxPage();
                }

                if (this.ajax_search) {
                    this.ajaxSearch();
                }

            },
            getPageId: function(){
                var bodyClasses = $("body").attr("class").split(' ');
                bodyClasses = jQuery.grep(bodyClasses, function( n, i ) {                    
                  return (n && n.indexOf("page-id-")>-1);
                });
                var id = "";
                if(bodyClasses.length > 0 && bodyClasses[0]){
                    id = bodyClasses[0].replace(/^\D+/g, '');
                }
                return id;
            },
            createPreloader: function () {
                this.preloader = $("#preloader");
                if (!this.preloader.length) return;
                this.preloader.bind("mousewheel", function () {
                    return false;
                });
            },
            showLoader: function () {
                if (!this.preloader.length) return false;
                this.preloader.show();
                $("body").removeClass("loaded").addClass("loading");
                return true;
            },
            hideLoader: function () {
                if (!this.preloader.length) return false;

                var self = this;
                setTimeout(function () {
                    $("body").removeClass("loading").addClass("loaded");
                }, 200);

                setTimeout(function () {
                    self.preloader.hide();
                }, 700);

                return true;
            },
            preloadImages: function (callback) {

                if (this.showLoader()){           

                    var self = this;

                    if(this.isPreload){

                        $("body").waitForImages({
                            finished: function () {
                                if (typeof callback == "function") {
                                    callback();
                                }
                                self.hideLoader();
                            },
                            waitForAll: true
                        });

                        return;
                        
                    }            
                }    

                if (typeof callback == "function") {
                    callback();
                }

                this.hideLoader();

            },
            improveScrolling: function () {
                //Remove Hover Effect to Improve Scrolling Performance 
                if (wyde.browser.touch === false && (!wyde.browser.msie || wyde.browser.msie > 9)) {
                    var body = document.body, timer;
                    window.addEventListener("scroll", function () {
                        if (timer) clearTimeout(timer);
                        if (!body.classList.contains("scrolling")) {
                            body.classList.add("scrolling");
                        }
                        timer = setTimeout(function () {
                            body.classList.remove("scrolling");
                        }, 200);
                    }, false);
                }

            },
            stateChange: function () {
                this.windowScroll = $(window).scrollTop();
                this.id = this.getPageId();
                this.isHome = $("body").hasClass("home");
                this.header = $("#header");
                this.headerTop = this.header.length ? this.header.position().top : 0;
                this.stickyHeight = $("body:not(.no-header) #header.w-sticky").length > 0 ? 65 : 0;
                this.mobileMenu = $("body.mobile-nav").length > 0;
                this.pageTop = $("#content").offset().top;
                this.titleArea = $(".title-wrapper");
                if (this.titleArea.length) {
                    if (this.titleArea.hasClass("w-size-full")) {
                        this.titleArea.css("height", $(window).height());
                    }
                    this.titleBottom = (this.titleArea.offset().top + this.titleArea.outerHeight());
                } else {
                    this.titleBottom = (this.headerTop + this.header.height());
                }
            },
            load: function () {
                this.stateChange();
                this.ready = true;
            },
            contentLoad: function () {
                this.updateMenu();
                if (this.onePage) {
                    this.initOnePageMenu();
                }
                this.showNav();
                var self = this;
                setTimeout(function () {
                    self.initFooter();
                }, 500);

                var hash = window.location.hash;
                hash = hash.replace(/[^\w#_-]+/g, '');
                if (hash && $(hash).length) {
                    if (hash == $("#nav .menu > li").first().find("a").attr("href")) hash = 0;
                    this.scrollTimer = setTimeout(function () { self.scrollTo(hash); }, 500);
                }

            },
            scrolled: function (event) {

                this.windowScroll = $(window).scrollTop();
                this.headerSticky(this.windowScroll);

                if (this.onePage) {
                    this.scrollSpy();
                }

            },
            resize: function (event) {

                $(window).trigger("wyde.page.statechange");

                this.updateMenu();

                this.initFooter();

            },
            headerSticky: function (scrolled) {

                if (this.header && this.header.is(":visible") && this.stickyHeight) {
                    if (!this.titleArea.length && scrolled > 0 && (scrolled + this.pageTop) > this.headerTop) {
                        this.header.addClass("w-fixed");
                        $("body").addClass("sticky-nav");
                    } else if ((scrolled + this.pageTop) > this.titleBottom) {
                        this.header.removeClass("w-scrolled").addClass("w-fixed");
                        $("body").addClass("sticky-nav");
                    } else if (scrolled > 0 && (scrolled + this.pageTop) > this.headerTop) {
                        this.header.removeClass("w-fixed").addClass("w-scrolled");
                        $("body").addClass("sticky-nav");
                    } else {
                        this.header.removeClass("w-scrolled w-fixed");
                        $("body").removeClass("sticky-nav");
                    }
                }
            },
            scrollSpy: function () {

                if (this.sections && this.sections.length) {

                    var fromTop = this.windowScroll + this.stickyHeight + 90;

                    var currentSections = this.sections.map(function () {
                        if ($(this).offset().top < fromTop)
                            return this;
                    });

                    currentSections = currentSections[currentSections.length - 1];
                    var id = currentSections && currentSections.length ? currentSections[0].id : "";                    

                    if (this.currentSectionId !== id) {
                        this.currentSectionId = id;
                        
                        //this.menuItems.parent().removeClass("current-menu-item").end().filter("[href=#" + id + "]").parent().addClass("current-menu-item");
                        $(".top-menu .menu-item > a, .vertical-menu .menu-item > a").each(function(){
                            $(this).parent().removeClass("current-menu-item").end().filter("[href=#" + id + "]").parent().addClass("current-menu-item");
                        });                        
                    }
                }
            },
            initMenu: function () {
                
                if( wyde.browser.touch ){
                    $("#page-overlay").bind("touchmove", function(e){
                          e.preventDefault();
                          return false;
                    });
                }else{
                    $("#page-overlay").bind("mousewheel", function () {
                        return false;
                    });
                }

                $(".mobile-nav-icon").on("click", function () {
                    $("body.mobile-nav").toggleClass("side-nav-active ");
                    $(".side-nav-active #page-overlay").off("click").on("click", function () {
                        $("body.mobile-nav").removeClass("side-nav-active");
                    });
                });

                 
                this.initPrimaryNav(); 
                this.initSideNav();                         
                this.initSlidingBar();
                this.initExpandNav();
                this.initFullScreenNav();
                this.initSearch();
                this.updateScrollTarget();

            },
            initPrimaryNav:function(){
                if ( $(window).width() < 1080 ) {

                    $("body").removeClass("side-nav-active").addClass("mobile-nav");

                } else {

                    $("body").removeClass("mobile-nav");

                    var self = this;

                    setTimeout(function () {
                        
                        var winWidth = $(window).width();

                        $(".dropdown-nav li.menu-item-has-children:not(.megamenu)").each(function () {

                            var rPos = $(this).offset().left + $(this).outerWidth() + $(this).find("> .sub-menu").outerWidth();
                            
                            if (rPos > winWidth){
                                $(this).addClass("align-right");
                            } else {
                                $(this).removeClass("align-right");
                            } 

                        });
                        

                        $(".menu-cart .shopping-cart-content").each(function(){
                            
                            var $el = $(this);                             
                            var updateMiniCart = function(){
                                var maxHeight = $(window).height() - ($("#header").position().top + $("#header").height() + $(".menu-cart .buttons").outerHeight() + 150 );
                                $el.wydeScroller("refresh", maxHeight);
                            };
                                                        
                            if( $el.find(".w-scroller").length ){ 
                                updateMiniCart();
                            }else{
                                var maxHeight = $(window).height() - ($("#header").position().top + $("#header").height() + $(".menu-cart .buttons").outerHeight() + 150 );                                
                                $(".menu-cart .shopping-cart-content").wydeScroller( { height: maxHeight } );
                                $(document.body).on("added_to_cart", function(){
                                    updateMiniCart();
                                });
                            }
                            
                        });



                    }, 500);

                    this.initMegaMenu();
                }   
            },
            initMegaMenu: function () {

                setTimeout(function () {
                    $(".dropdown-nav .megamenu > ul").each(function () {

                        var $el = $(this);

                        $el.css("left", "");
                        $el.css("width", $(".dropdown-nav").width() );

                        if ( $el.position().left > 0 ) {
                            $el.css("left", - ( $el.position().left ) );
                        }
                        
                    }); 

                }, 1000);

            },
            initSideNav: function () {
                var $sidenav = $("#side-nav .side-nav-wrapper");
                $sidenav.wydeScroller({ scrollbar: false });
                $("#vertical-nav").wydeVerticalMenu({                    
                    changed: function () {                            
                        // Refresh scroller
                        $sidenav.wydeScroller("refresh");
                    }
                });    
                                                                                       
            },
            initExpandNav: function () {
                $(".full-nav-icon").on("click", function () {
                    $("body").toggleClass("full-nav-active ");
                });
            },
            initFullScreenNav: function () {

                var $el = $("#fullscreen-nav");
                var $scroller = $el.find(".full-nav-wrapper")

                if (!$el.length) return;

                var self = this;

                $el.bind("mousewheel", function () {
                    return false;
                });

                $(".full-nav-icon").on("click", function () {
                    self.showFullScreenNav();
                });                

                setTimeout(function(){

                    $scroller.height($("#full-nav").height());
                    $scroller.css("max-height", $el.height() - $el.find(".social-icons").outerHeight(true));                    

                    $scroller.wydeScroller({ scrollbar: false });
                    $("#full-nav").wydeVerticalMenu({
                        changed: function (o) {                            
                            setTimeout(function () {
                                $scroller.wydeScroller("refresh");
                            }, 600);
                        }
                    });

                }, 1000);               


                $(window).smartresize(function () {
                    $scroller.height($("#full-nav").height());
                    $scroller.css("max-height", $el.height() - $el.find(".social-icons").outerHeight(true));
                });

            },
            initSlidingBar: function () {

                $("#slidingbar .slidingbar-wrapper").wydeScroller({ scrollbar: false });
                var self = this;
                $(".menu-item-slidingbar > a").on("click", function (event) {
                    event.preventDefault();
                    if ($("body").hasClass("sliding-active")) {
                        self.hideSlidingBar();
                    } else {
                        self.showSlidingBar();
                    }
                    return false;
                });

                $(".sliding-remove-button").on("click", function (event) {
                    event.preventDefault();
                    self.hideSlidingBar();
                    return false;
                });

            },
            updateMenu:function(){                      
                this.initPrimaryNav();                                
            },
            updateMenuLinks:function(){
                this.updateScrollTarget();
                $("#vertical-nav").wydeVerticalMenu("refresh");
                $("#full-nav").wydeVerticalMenu("refresh");
            },
            showSlidingBar: function () {
                $("body").addClass("sliding-active");
                $("#slidingbar .slidingbar-wrapper").wydeScroller("refresh");

                var self = this;
                $(".sliding-active #page-overlay").off("click").on("click", function () {
                    self.hideSlidingBar();
                });
            },
            hideSlidingBar: function () {
                $("body").removeClass("sliding-active");
            },
            initOnePageMenu: function () {

                var self = this;
                if (self.isHome) {

                    $("#header-logo a, #side-nav-logo a").off("click").on("click", function (event) {
                        event.preventDefault();

                        self.scrollTo(0);

                        if (window.location.hash) {
                            if (typeof window.history.pushState == "function") {
                                history.pushState({ path: self.siteURL }, "", self.siteURL);
                            } else document.location.href = self.siteURL;
                        }

                        return false;

                    });

                    this.currentSectionId = false;
                    this.menuItems = $(".menu-item a[href^='#']");
                    this.sections = this.menuItems.map(function () {
                        var $item = $($(this).attr("href"));
                        if ($item.length) {
                            return $item;
                        }
                    });

                }
                if (this.windowScroll == 0) $("#nav li").first().addClass("current-menu-item");       

            },
            updateScrollTarget: function () {
                var self = this;

                $(".top-menu .menu-item > a[href*='#'], .vertical-menu .menu-item > a[href*='#'], .footer-menu a[href*='#']").each(function(){

                    if (this.pathname == window.location.pathname){
                        
                        var $el = $(this);                        

                        $el.on("click", function (event) {                           

                            var hash = getHash($el.attr("href"));
                            if (!hash) {
                                return true;
                            } else if (hash == '#') {

                                event.preventDefault();
                                return false;

                            } else {

                                event.preventDefault();

                                var duration = 0;

                                if($(".mobile-nav.side-nav-active").length){    
                                    duration = 600;
                                    $(".mobile-nav").removeClass("side-nav-active");                            
                                }else if($(".fullscreen-nav.full-nav-active").length){    
                                    duration = 600;
                                    self.hideFullScreenNav();                          
                                }

                                if ($el.parent().hasClass("menu-item") && $el.parents("ul").find("li").index($el.parent()) == 0) {
                                    setTimeout(function(){
                                        self.scrollTo(0);
                                    }, duration);                            
                                } else {
                                    if (self.scrollTimer) clearTimeout(self.scrollTimer);
                                    setTimeout(function(){
                                        self.scrollTo(hash);
                                    }, duration);     
                                }
                               
                                History.pushState(null, $el.attr("title") ? $el.attr("title") : "", hash);                                   

                                return false;
                            }
                        });
                    }

                });
            },
            initFooter: function () {
                var $el = $("#footer");
                if ($("#footer").hasClass("w-sticky") && !(wyde.browser.xs || wyde.browser.sm)) {
                    $("#content").css("margin-bottom", $el.height());
                } else {
                    $("#content").css("margin-bottom", "");
                }
                this.initToTopButton();
            },
            initToTopButton: function () {
                var self = this;
                $("#toplink-button, #toplink-wrapper a").off("click").on("click", function (event) {
                    event.preventDefault();
                    self.scrollTo(0);
                    return false;
                });

                $("#content").waypoint(function (direction) {
                    if (direction == "down") {
                        $("#toplink-button").show();
                        setTimeout(function () {
                            $("#toplink-button").addClass("active");
                        }, 100);
                    } else {
                        $("#toplink-button").removeClass("active");
                        setTimeout(function () {
                            $("#toplink-button").hide();
                        }, 500);
                    }
                }, {
                    offset: -400
                });

                $("#content").waypoint(function (direction) {
                    if (direction == "down") {
                        $("#toplink-button").removeClass("active");
                        setTimeout(function () {
                            $("#toplink-button").hide();
                        }, 500);
                    } else {
                        $("#toplink-button").show();
                        setTimeout(function () {
                            $("#toplink-button").addClass("active");
                        }, 100);
                    }
                }, {
                    offset: "bottom-in-view"
                });

            },
            initSearch: function () {

                var $el = $("#live-search");

                var self = this;

                $el.bind("mousewheel", function () {
                    return false;
                });

                $(".live-search-button").on("click", function (event) {
                    event.preventDefault();
                    self.showSearch();
                    return false;
                });

                $el.find(".fullscreen-remove-button").on("click", function (event) {
                    event.preventDefault();
                    self.hideSearch();
                    return false;
                });

                $el.find("input").keypress(function (event) {
                    if (event.which == 13) {
                        event.preventDefault();
                        $("form", $el).submit();
                    }
                });

            },
            showFullScreenNav: function () {
                var $el = $("#fullscreen-nav");
                if (!$el.length) return;
                $("body").bind("mousedown.prev DOMMouseScroll.prev mousewheel.prev", function (event) {
                    event.preventDefault();
                });
                $el.css("visibility", "visible");
                var self = this;
                $(".full-nav-icon").off("click").on("click", function () {
                    self.hideFullScreenNav();
                });
                setTimeout(function () {
                    $("body").addClass("full-nav-active");
                }, 100);
            },
            hideFullScreenNav: function () {
                var $el = $("#fullscreen-nav");
                if (!$el.length) return;
                if (!$("body").hasClass("full-nav-active")) return;
                $("body").unbind("mousedown.prev DOMMouseScroll.prev mousewheel.prev");
                $("body").removeClass("full-nav-active");
                var self = this;
                $(".full-nav-icon").off("click").on("click", function () {
                    self.showFullScreenNav();
                });
                setTimeout(function () {
                    $el.css("visibility", "");
                }, 500);
            },
            showSearch: function () {
                var $el = $("#live-search");
                $("body").bind("mousedown.prev DOMMouseScroll.prev mousewheel.prev", function (event) {
                    event.preventDefault();
                });
                this.hideNav();
                $el.show();
                setTimeout(function () {
                    $el.addClass("active");
                    if ($(".search-list li", $el).length > 0) {
                        $el.find(".autocomplete").addClass("open").show();
                    }
                    $el.find("input").focus();
                }, 100);
            },
            hideSearch: function () {
                var $el = $("#live-search");
                if (!$el.hasClass("active")) return;
                $("body").unbind("mousedown.prev DOMMouseScroll.prev mousewheel.prev");
                $el.find(".autocomplete").removeClass("open").hide();
                this.showNav();
                $el.removeClass("active");
                setTimeout(function () {
                    $el.hide();
                }, 500);
            },
            showNav: function () {
                $("#header").addClass("active");
            },
            hideNav: function () {
                $("#header").removeClass("active");
                $("body.mobile-nav").removeClass("side-nav-active");
                $("body").removeClass("sliding-active");
            },
            scrollTo: function (target, options) {
                if (typeof options == "function") options = { onAfter: options };
                var headerHeight = this.stickyHeight;
                if (!$("#header:visible").length || $("body.expand-nav:not(.full-nav-active)").length) headerHeight = 0;
                var settings = $.extend({}, { duration: 1000, easing: "easeInOutExpo", offset: -(this.pageTop + headerHeight) }, options);
                $(window).scrollTo(target, settings);
            }

        }

    });

    /*****************************************
    Wyde AJAX Page
    /*****************************************/
    $.extend(wyde.page, {
        ajaxPage: function () {

            // Check to see if History.js is enabled for our Browser
            if (!History.enabled) {
                return false;
            }

            this.rootUrl = History.getRootUrl();
            this.targetPos = 0;
            this.settings = {
                search: ".ajax-search-form",
                scope: "#content",
                excludeURLs: [],
                excludeSelectors: [],
                transition: "fade"
            };

            if (typeof this.ajax_page_settings != "undefined") this.settings = $.extend(this.settings, this.ajax_page_settings);

            this.searchPath = "";
            this.ignoreURLs = [];

            this.ignoreURLs.push("wp-login");
            this.ignoreURLs.push("wp-admin");
            this.ignoreURLs.push("wp-content");

            var self = this;

            $(this.settings.excludeURLs).each(function (i, v) {
                if (v) self.ignoreURLs.push(v);
            });

            $(this.settings.excludeSelectors).each(function () {
                if (this.tagName.toLowerCase() == "a") {
                    self.ignoreURLs.push(this.href);
                } else {
                    $(this).find("a").each(function () {
                        self.ignoreURLs.push(this.href);
                    });
                }

            });

            // Internal Helper
            $.expr[':'].internal = function (obj, index, meta, stack) {
                var 
				$el = $(obj),
				url = $el.attr("href") || "",
				isInternal;

                isInternal = url.substring(0, self.rootUrl.length) === self.rootUrl || url.indexOf(':') === -1;

                if ($el.attr("target") && $el.attr("target") != "_self") isInternal = false;

                return isInternal;
            };

            this.updateLink();

            if (self.settings.search) {

                $(self.settings.search).each(function (index) {

                    if ($(this).attr("action")) {
                        //Get the current action so we know where to submit to
                        self.searchPath = $(this).attr("action");

                        //bind our code to search submit, now we can load everything through ajax :)
                        //$("#searchform").name = "searchform";
                        $(this).submit(function () {
                            self.submitSearch($(this).serialize());
                            return false;
                        });
                    }
                });
            }

            $(window).bind("statechange", function () {
                var state = History.getState(),
				url = state.url;
                self.loadContent(url);
            });

        },
        updateLink: function (newElements) {

            var self = this;
            
            if (self.isIgnore(document.URL) || $("body").hasClass("woocommerce") || $("body").hasClass("woocommerce-page")) return;

            $("a:internal:not(.no-ajax)", newElements ? newElements : document.body).each(function () {

                if (!self.isIgnore(this) && !$(this).parents(".woocommerce").length ) {
                    
                    $(this).on("click", function (event) {
                        event.preventDefault();

                        var $el = $(this);
                        var url = $el.attr("href");
                        var title = $el.attr("title") || null;

                        if (event.which == 2 || event.metaKey) {
                            return true;
                        }
                        // set scroll target position
                        self.targetPos = 0;
                        var hash = getHash(url);
                        if (hash) {
                            url = url.replace(hash, "");
                            self.targetPos = hash;                            
                        }

                        History.pushState(null, title, url);

                        return false;
                    });

                }
            });

        },
        isIgnore: function (link) {

            if (!link) return true;

            var url = link.href ? link.href : link.toString();

            if (!url) return true;

            var samePage = false;
            var queryVars = getUrlVars(url);
            if(queryVars["page_id"]){              
                samePage = (this.id == queryVars["page_id"]);                
            }else{
                samePage = (link.pathname == window.location.pathname);
            }

            if(this.onepage){
                if($("body").hasClass("search")){
                    samePage = false;
                } 
            }

            var hash = getHash(url);

            if (hash == "#" || (samePage && hash)) return true;                
            
            for (var i in this.ignoreURLs) {
                if (url.indexOf(this.ignoreURLs[i]) > -1) {
                    return true;
                }
            }

            return false;
        },
        loadContent: function (url, getData) {

            this.absoluteURL = url;
           
            //this.relativeURL = this.absoluteURL.replace(/^.*\/\/[^\/]+/, '');

            this.relativeURL = this.absoluteURL.replace(this.rootUrl, '');

            var self = this;

            this.hideContent(function () {

                self.removeSlider();

                $.ajax({
                    type: "GET",
                    url: url,
                    data: getData,
                    cache: false,
                    dataType: "html",
                    success: function (response) {

                        self.updateContent(response);
                        self.updateLink();

                        $(window).trigger("wyde.page.pageloaded");

                        self.showContent(function () {

                            self.refreshSlider();

                            $(window).trigger("wyde.page.statechange");

                            if (typeof self.contentLoad == "function") {
                                self.contentLoad();
                            }

                            $(window).trigger("wyde.page.ready");

                            if (self.targetPos) {
                                setTimeout(function () {
                                    History.pushState(null, "", self.targetPos); 
                                    self.scrollTo(self.targetPos);
                                }, 800);
                            }

                        });

                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        window.location.href = url;
                    },
                    statusCode: {
                        404: function () {
                            console.log("Page not found!");
                        }
                    }
                });

            });


        },
        removeSlider: function () {
            // Revolution Slider
            if ($(".rev_slider").length && typeof $.fn.revolution == "function") {
                try {
                    $(".rev_slider").revkill();
                } catch (e) {
                    //console.log(e);
                }
            }
        },
        refreshSlider: function () {
            // Revolution Slider
            if ($(".rev_slider").length && typeof $.fn.revolution == "function") {
                /*$(".rev_slider").on("revolution.slide.onloaded", function () {
                    $(window).trigger("wyde.page.statechange");
                });*/
                $(window).trigger("resize");
            }
        },
        hideContent: function (callback) {

            $(window).trigger("wyde.page.beforechange");

            var self = this;

            var $el = $(self.settings.scope);

            var windowWidth = $(window).width() + 100;
            var windowHeight = $(window).height() + 100;

            var duration = 1000;

            switch (self.settings.transition) {
                case "fade":
                    duration = 800;
                    if (wyde.browser.css3) {
                        $el.css(wyde.browser.prefix + "transition", wyde.browser.prefix + "opacity 0.8s").css({ opacity: 0 });
                    } else {
                        $el.animate({ opacity: 0 }, duration);
                    }
                    break;
                case "slideToggle":
                    $("body").css({ overflow: "hidden" });
                    if (wyde.browser.css3) {
                        $el.css(wyde.browser.prefix + "transition", wyde.browser.prefix + "transform 1s cubic-bezier(0.785, 0.135, 0.150, 0.860)").css(wyde.browser.prefix + "transform", "translateX(" + (-windowWidth) + "px)");
                    } else {
                        $el.animate({ left: -(windowWidth) }, duration, "easeInOutCirc");
                    }
                    break;
                case "slideLeft":
                    $("body").css({ overflow: "hidden" });
                    if (wyde.browser.css3) {
                        $el.css(wyde.browser.prefix + "transition", wyde.browser.prefix + "transform 1s cubic-bezier(0.785, 0.135, 0.150, 0.860)").css(wyde.browser.prefix + "transform", "translateX(" + (-windowWidth) + "px)");
                        setTimeout(function () {
                            $el.css(wyde.browser.prefix + "transition", "").css(wyde.browser.prefix + "transform", "translateX(" + windowWidth + "px)");
                        }, duration);
                    } else {
                        $el.animate({ left: -(windowWidth) }, duration, "easeInOutCirc");
                    }
                    break;
                case "slideRight":
                    $("body").css({ overflow: "hidden" });
                    if (wyde.browser.css3) {
                        $el.css(wyde.browser.prefix + "transition", wyde.browser.prefix + "transform 1s cubic-bezier(0.785, 0.135, 0.150, 0.860)").css(wyde.browser.prefix + "transform", "translateX(" + windowWidth + "px)");
                        setTimeout(function () {
                            $el.css(wyde.browser.prefix + "transition", "").css(wyde.browser.prefix + "transform", "translateX(" + (-windowWidth) + "px)");
                        }, duration);
                    } else {
                        $el.animate({ left: windowWidth }, duration, "easeInOutCirc");
                    }
                    break;
                case "slideUp":
                    $("body").css({ overflow: "hidden" });
                    if (wyde.browser.css3) {
                        $el.css(wyde.browser.prefix + "transition", wyde.browser.prefix + "transform 1s cubic-bezier(0.785, 0.135, 0.150, 0.860), opacity 1s").css(wyde.browser.prefix + "transform", "translateY(" + (-windowHeight) + "px)").css("opacity", 0);
                        setTimeout(function () {
                            $el.css(wyde.browser.prefix + "transition", "").css(wyde.browser.prefix + "transform", "translateY(" + windowHeight + "px)");
                        }, duration);
                    } else {
                        $el.animate({ top: -(windowHeight), opacity: 0 }, duration, "easeInOutCirc");
                    }
                    break;
                case "slideDown":
                    $("body").css({ overflow: "hidden" });
                    if (wyde.browser.css3) {
                        $el.css(wyde.browser.prefix + "transition", wyde.browser.prefix + "transform 1s cubic-bezier(0.785, 0.135, 0.150, 0.860), opacity 1s").css(wyde.browser.prefix + "transform", "translateY(" + windowHeight + "px)").css("opacity", 0);
                        setTimeout(function () {
                            $el.css(wyde.browser.prefix + "transition", "").css(wyde.browser.prefix + "transform", "translateY(" + (-windowHeight) + "px)");
                        }, duration);
                    } else {
                        $el.animate({ top: windowHeight, opacity: 0 }, duration, "easeInOutCirc");
                    }
                    break;
            }

            setTimeout(function () {

                self.showLoader();

                self.scrollTo(0, {
                    duration: 100
                });

                if (typeof callback == "function") {
                    callback();
                }

            }, duration);


        },
        showContent: function (callback) {

            var self = this;
            var duration = 1000;

            var $el = $(self.settings.scope);

            var windowWidth = $(window).width() + 100;
            var windowHeight = $(window).height() + 100;

            this.preloadImages(function () {

                switch (self.settings.transition) {
                    case "fade":
                        duration = 800;
                        if (wyde.browser.css3) {
                            $el.css({ opacity: 1 });
                            setTimeout(function () {
                                $el.css(wyde.browser.prefix + "transition", "").css("opacity", "");
                            }, duration + 500);
                        } else {
                            $el.animate({ opacity: 1 }, duration);
                        }
                        break;
                    case "slideToggle":
                        if (wyde.browser.css3) {
                            $el.css(wyde.browser.prefix + "transform", "translateX(0)");
                            setTimeout(function () {
                                $el.css(wyde.browser.prefix + "transition", "").css(wyde.browser.prefix + "transform", "");
                                $("body").css({ overflow: "" });
                            }, duration + 500);
                        } else {
                            $el.animate({ left: 0 }, duration, "easeInOutCirc", function () {
                                $("body").css({ overflow: "" });
                            });
                        }
                        break;
                    case "slideLeft":
                        if (wyde.browser.css3) {
                            $el.css(wyde.browser.prefix + "transition", wyde.browser.prefix + "transform 1s cubic-bezier(0.785, 0.135, 0.150, 0.860)").css(wyde.browser.prefix + "transform", "translateX(0)");
                            setTimeout(function () {
                                $el.css(wyde.browser.prefix + "transition", "").css(wyde.browser.prefix + "transform", "");
                                $("body").css({ overflow: "" });
                            }, duration + 500);
                        } else {
                            $el.css({ left: windowWidth }).animate({ left: 0 }, duration, "easeInOutCirc", function () {
                                $("body").css({ overflow: "" });
                            });
                        }
                        break;
                    case "slideRight":
                        if (wyde.browser.css3) {
                            $el.css(wyde.browser.prefix + "transition", wyde.browser.prefix + "transform 1s cubic-bezier(0.785, 0.135, 0.150, 0.860)").css(wyde.browser.prefix + "transform", "translateX(0)");
                            setTimeout(function () {
                                $el.css(wyde.browser.prefix + "transition", "").css(wyde.browser.prefix + "transform", "");
                                $("body").css({ overflow: "" });
                            }, duration + 500);
                        } else {
                            $el.css({ left: -(windowWidth) }).animate({ left: 0 }, duration, "easeInOutCirc", function () {
                                $("body").css({ overflow: "" });
                            });
                        }
                        break;
                    case "slideUp":
                        if (wyde.browser.css3) {
                            $el.css(wyde.browser.prefix + "transition", wyde.browser.prefix + "transform 1s cubic-bezier(0.785, 0.135, 0.150, 0.860), opacity 0.5s ease-in 0.1s").css(wyde.browser.prefix + "transform", "translateY(0)").css("opacity", 1);
                            setTimeout(function () {
                                $el.css(wyde.browser.prefix + "transition", "").css(wyde.browser.prefix + "transform", "").css("opacity", "");
                                $("body").css({ overflow: "" });
                            }, duration + 500);
                        } else {
                            $el.css({ top: windowHeight }).animate({ top: 0, opacity: 1 }, duration, "easeInOutCirc", function () {
                                $("body").css({ overflow: "" });
                            });
                        }
                        break;
                    case "slideDown":
                        if (wyde.browser.css3) {
                            $el.css(wyde.browser.prefix + "transition", wyde.browser.prefix + "transform 1s cubic-bezier(0.785, 0.135, 0.150, 0.860), opacity 0.5s ease-in 0.1s").css(wyde.browser.prefix + "transform", "translateY(0)").css("opacity", 1);
                            setTimeout(function () {
                                $el.css(wyde.browser.prefix + "transition", "").css(wyde.browser.prefix + "transform", "").css("opacity", "");
                                $("body").css({ overflow: "" });
                            }, duration + 500);
                        } else {
                            $el.css({ top: -(windowHeight) }).animate({ top: 0, opacity: 1 }, duration, "easeInOutCirc", function () {
                                $("body").css({ overflow: "" });
                            });
                        }
                        break;
                }

                setTimeout(function () {

                    if (typeof callback == "function") {
                        callback();
                    }

                }, duration);


            });

        },
        getDocumentHtml: function (html) {

            var result = String(html)
				.replace(/<\!DOCTYPE[^>]*>/i, '')
				.replace(/<(html|head|body|title|meta)([\s\>])/gi, '<div class="document-$1"$2')
				.replace(/<\/(html|head|body|title|meta)\>/gi, '</div>');

            return $.trim(result);
        },
        updateContent: function (data) {

            window.$ = jQuery;

            var $doc = null;
            var $body = null;
            if (window.DOMParser) { // all browsers, except IE before version 9
                try {
                    var parser = new DOMParser();
                    $doc = $(parser.parseFromString(data, "text/html"));
                    $body = $doc.find("body");
                    parser = $doc = null;
                } catch (e) {
                    $doc = $(this.getDocumentHtml(data));
                    $body = $doc.find(".document-body:first");
                }
            } else {
                $doc = $(this.getDocumentHtml(data));
                $body = $doc.find(".document-body:first");
            }

            // Update content
            $(this.settings.scope).html($body.find(this.settings.scope).html());

            // Update Stylesheet
            var self = this;
            var $cssLinks = $body.find("link[rel='stylesheet']");
            $cssLinks.each(function () {
                if ($("body link[id='" + $(this).attr("id") + "']").length == 0) {
                    $(self.settings.scope).append(this);
                }
            });

            // Update Body Classes
            var oldClasses = $("body").attr("class");
            oldClasses = oldClasses.replace(" loading", "");

            var newClasses = $body.attr("class");
            if (newClasses) $("body").removeClass(oldClasses).addClass("changing").addClass(newClasses);


            // Update VC Custom CSS
            $("head").find("style[data-type='vc_shortcodes-custom-css'], style[data-type='vc_custom-css']").remove();
            var $vc_custom_styles = $(data).filter("style[data-type='vc_shortcodes-custom-css'], style[data-type='vc_custom-css']");
            if ($vc_custom_styles.length) $("head").append($vc_custom_styles);

            // Update the title
            $("head").find("title").replaceWith($(data).filter("title"));

            // Update WP Admin Bar
            if ($("#wpadminbar").length > 0) {
                var $adminBar = $body.find("#wpadminbar");
                if ($adminBar.length) $("#wpadminbar").html($adminBar.html());

            }

            // Update Header
            this.updateNavigation($body);

            // Update Footer
            this.updateFooter($body);

            // Inform Google Analytics of the change
            this.googleTracking();

            // Inform ReInvigorate of a state change
            if (typeof window.reinvigorate !== 'undefined' && typeof window.reinvigorate.ajax_track !== 'undefined') {
                reinvigorate.ajax_track(this.absoluteURL);
            }

        },
        updateNavigation: function ($body) {
            // Update header class
            var headerClasses = $body.find("#header").attr("class");
            $("#header").attr("class", headerClasses);

            if (this.onePage) {
                //Update menu items
                $(".menu-item").each(function(){
                    var newItem = $body.find("#" + $(this).attr("id"));                    
                    if(newItem.length){
                        $(this).attr("class", newItem.attr("class"));
                        $(this).find("> a").replaceWith(newItem.find(">a"));
                    }                    
                });
                this.updateMenuLinks();
                this.updateLink($(".menu-item"));
            } else {
                // Clear menu state
                $(".top-menu li, .vertical-menu li").removeClass("current-menu-ancestor current-menu-parent current-menu-item current_page_parent current_page_ancestor current_page_item");
                // Update current dropdown menu
                $body.find(".top-menu .current-menu-ancestor, .top-menu .current-menu-parent, .top-menu .current-menu-item").each(function () {
                    $(".top-menu ." + $(this).attr("id")).removeClass().addClass($(this).attr("class"));
                });
                // Update current vertical menu
                $body.find("#vertical-nav .current-menu-ancestor, #vertical-nav .current-menu-parent, #vertical-nav .current-menu-item").each(function () {
                    $(".vertical-menu ." + $(this).attr("id").replace("vertical-", "")).removeClass().addClass($(this).attr("class"));
                });
            }
        },
        updateFooter: function ($body) {
            // Update header class
            var $newFooter = $body.find("#footer");
            if($newFooter.length){
                var newClasses = $newFooter.attr("class");
                $("#footer").attr("class", newClasses).html($newFooter.html());
            }
            
        },
        googleTracking: function () {
            var self = this;
            // Check new version of Google Analytics
            if (typeof ga == "function") {
                ga(function () {
                    var trackers = ga.getAll();
                    $.each(trackers, function (i, v) {
                        v.send("pageview", {
                            "page": self.relativeURL,
                            "title": document.title
                        });
                        //v.send("pageview");
                    });
                });
            } else if (typeof window._gaq !== 'undefined') { // Old version of Google Analytics
                window._gaq.push(['_trackPageview', self.relativeURL]);
            }

        },
        submitSearch: function (param) {
            this.loadContent(this.searchPath, param);
        }
    });

    /*****************************************
    Wyde Ajax Search
    /*****************************************/
    $.extend(wyde.page, {

        ajaxSearch: function (options) {

            var settings = {
                delay: 500,
                element: "#live-search",
                minlength: 1
            };

            settings = $.extend(true, settings, options);

            if (!this.ajaxURL) return;

            var self = this;

            return $(settings.element).each(function () {

                var ajaxTimer = null;
                var $el = $(this);

                var $wrapper, $autocomplete, $searchlist, $more = false;

                function createAutoComplete() {
                    $wrapper = $el.find(".container");
                    $wrapper.append($("<div class=\"autocomplete\"><ul class=\"search-list\"></ul></div>"));

                    $autocomplete = $wrapper.find(".autocomplete");

                    $searchlist = $autocomplete.find(".search-list");

                    $more = $("<div class=\"search-more\"></div>");
                    $wrapper.append($more);

                    $autocomplete.wydeScroller();

                    $(window).smartresize(function () {
                        updateSearchList();
                    });

                }

                function updateSearchList() {

                    var h = ($(window).height() - $more.outerHeight()) - ($autocomplete.offset().top - $(window).scrollTop());
                    $autocomplete.css("height", h);

                    $autocomplete.wydeScroller("refresh");
                }

                function getListItems(name, items) {
                    var list = $("<ul></ul>").attr("id", String.format("{0}-list", name.toLowerCase()));
                    $.each(items, function () {
                        var image = "";
                        if (this.post_image) image = String.format("<span class=\"thumb\"><img src=\"{1}\" alt=\"{2}\"></span>", this.post_link, this.post_image, this.post_title);
                        var author = "";
                        if (this.post_author) author = String.format("<span>{0}</span> &#8211; ", this.post_author);
                        list.append($(String.format("<li><a href=\"{1}\">{0}<span><strong>{2}</strong><span class=\"post-meta\">{3}<span>{4}</span></span></span></a></li>", image, this.post_link, this.post_title, author, this.post_date)));
                    });
                    return list;
                }

                function clearSearchList() {
                    $searchlist.html("");
                    $more.html("");
                }

                function loadResults(ajaxURL) {

                    if (!$autocomplete) {
                        createAutoComplete();
                    }

                    var data = { action: "wyde_search", search_keyword: $("input", $el).val() };

                    if (data.search_keyword.length == 0) {
                        $autocomplete.hide().removeClass("open");
                        clearSearchList();
                        return;
                    }

                    $autocomplete.show().addClass("open");
                    $autocomplete.css("height", "20px");
                    $more.removeClass("selected").html("<p class=\"search-loading\"><span class=\"w-loader\"></span></p>");

                    $.post(ajaxURL, data, function (response) {

                        $searchlist.html("");

                        var results = $.parseJSON(response);

                        if (results && results.length > 0) {
                            results.sort(function (a, b) {
                                var x = a['title'];
                                var y = b['title'];
                                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
                            });
                            $.each(results, function () {
                                var $list = $(String.format("<li><h4>{0}</h4></li>", this.title));
                                $list.append(getListItems(this.name, this.items));
                                $searchlist.append($list);
                            });


                        }

                        if (results.length == 0) $more.addClass("selected");
                        $more.html(String.format("<a href=\"{0}/?s={1}\">See more results for \"{1}\"</a>", self.siteURL, $("input", $el).val()));

                        if (self.ajax_page) self.updateLink($("li", $autocomplete.not("#product-list")));

                        if ($el.hasClass("active")) {
                            $autocomplete.show().addClass("open");
                            $searchlist.focus();
                        }

                        updateSearchList();

                    });
                }

                createAutoComplete();

                $("input", $el).attr("autocomplete", "off");
                $("input", $el).keyup(function (event) {
                    if (event.keyCode != "38" && event.keyCode != "40" && event.keyCode != "13" && event.keyCode != "27" && event.keyCode != "39" && event.keyCode != "37") {
                        if ($(this).val().length < settings.minlength) {
                            clearSearchList();
                            return;
                        }
                        if (ajaxTimer != null) {
                            clearTimeout(ajaxTimer);
                        }
                        ajaxTimer = setTimeout(function () { loadResults(self.ajaxURL); }, settings.delay);
                    }
                });

            });

        }
    });

    wyde.page.init();


    /*****************************************
    Parallax Title Area 
    /*****************************************/
    function parallaxTitleArea() {

        var isBusy = false;
        var lastScrollPos, titleHeight, headerHeight;

        var refresh = function () {
            titleHeight = wyde.page.titleArea ? wyde.page.titleArea.outerHeight(true) : 0;
            headerHeight = wyde.page.header.height();
        }

        var render = function () {

            lastScrollPos = $(window).scrollTop();

            if (lastScrollPos < headerHeight + titleHeight) {

                var yPos = Math.round(lastScrollPos * 0.3);

                var transOut = 1 - (lastScrollPos / titleHeight);
                var transIn = 1 + (lastScrollPos / titleHeight);

                $(".title-wrapper.w-parallax .bg-image").css(wyde.browser.prefix + "transform", "translate3d(0px, " + yPos + "px, 0px)");

                if ($(".title-wrapper").data("effect")) {
                    switch ($(".title-wrapper").data("effect")) {
                        case "split":
                            $(".title-wrapper .container .title").css(wyde.browser.prefix + "transform", "translate3d(0px, " + (yPos * 0.1) + "px, 0px)").css("opacity", transOut);
                            $(".title-wrapper .container .subtitle").css(wyde.browser.prefix + "transform", "translate3d(0px, " + (yPos * 1.2) + "px, 0px)").css("opacity", transOut);
                            break;
                        case "fadeOut":
                            $(".title-wrapper .container").css(wyde.browser.prefix + "transform", "translate3d(0px, " + (yPos * 1.1) + "px, 0px)").css("opacity", transOut);
                            break;
                        case "fadeOutUp":
                            $(".title-wrapper .container").css(wyde.browser.prefix + "transform", "translate3d(0px, " + (yPos * 0.1) + "px, 0px)").css("opacity", transOut);
                            break;
                        case "fadeOutDown":
                            $(".title-wrapper .container").css(wyde.browser.prefix + "transform", "translate3d(0px, " + (yPos * 1.8) + "px, 0px)").css("opacity", transOut);
                            break;
                        case "zoomOut":
                            $(".title-wrapper .container").css(wyde.browser.prefix + "transform", "translate3d(0px, " + (yPos * 1.1) + "px, 0px) scale3d(" + transOut + ", " + transOut + ", 1)").css("opacity", transOut);
                            break;
                        case "zoomOutUp":
                            $(".title-wrapper .container").css(wyde.browser.prefix + "transform", "translate3d(0px, " + (yPos * 0.1) + "px, 0px) scale3d(" + transOut + ", " + transOut + ", 1)").css("opacity", transOut);
                            break;
                        case "zoomOutDown":
                            $(".title-wrapper .container").css(wyde.browser.prefix + "transform", "translate3d(0px, " + (yPos * 1.8) + "px, 0px) scale3d(" + transOut + ", " + transOut + ", 1)").css("opacity", transOut);
                            break;
                        case "zoomIn":
                            $(".title-wrapper .container").css(wyde.browser.prefix + "transform", "translate3d(0px, " + (yPos * 1.1) + "px, 0px) scale3d(" + transIn + ", " + transIn + ", 1)").css("opacity", transOut);
                            break;
                        case "zoomInUp":
                            $(".title-wrapper .container").css(wyde.browser.prefix + "transform", "translate3d(0px, " + (yPos * 0.1) + "px, 0px) scale3d(" + transIn + ", " + transIn + ", 1)").css("opacity", transOut);
                            break;
                        case "zoomInDown":
                            $(".title-wrapper .container").css(wyde.browser.prefix + "transform", "translate3d(0px, " + (yPos * 1.8) + "px, 0px) scale3d(" + transIn + ", " + transIn + ", 1)").css("opacity", transOut);
                            break;
                    }
                }
            }
        }


        var requestRender = function () {
            if (!isBusy) {
                isBusy = true;
                window.requestAnimationFrame(function () {
                    render();
                    isBusy = false;
                });
            }
        }

        $(window).on("scroll", function () {
            requestRender();
        });

        $(window).smartresize(function () {
            refresh();
        });

        refresh();

        requestRender();
    }


    /*****************************************
    Call on Wyde Page Ready event 
    /*****************************************/
    $(window).on("wyde.page.ready", function () {
        if (wyde.browser.md || wyde.browser.lg) {
            parallaxTitleArea();
        }
    });

})(jQuery);