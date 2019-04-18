"use strict";

if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function(callback, thisArg) {
        thisArg = thisArg || window;
        for (var i = 0; i < this.length; i++) {
            callback.call(thisArg, this[i], i, this);
        }
    };
}

/*
    This file can be used as entry point for webpack!
 */
// import scrollLock from "static/js/libraries/scroll-lock";
// import Modernizr from "static/js/libraries/modernizr.min";
// import Swiper from "static/js/plugins/swiper";
// import smoothScroll from "static/js/plugins/plugins-scroll";
// import sticky from "static/js/plugins/jquery.scrollFollow";
// import select2 from "select2";
// import barrating from "jquery-bar-rating";
// import Isotope from "isotope-layout";
// import packery from "isotope-packery";
// import remodal from "remodal";
// import fancybox from "@fancyapps/fancybox";
// import debounce from "lodash/debounce";
// import throttle from "lodash/throttle";
import groupBy from "lodash/groupBy";
import TweenLite from 'gsap';

$(function() {
    var _document = $(document),
        _window = $(window),
        _body = $("body"),
        _overlay = $(".js-overlay");

    var $pageNavigation = $(".js-page-nav");

    $("select")
        .not(".js-rating")
        .select2({
            minimumResultsForSearch: -1
        });

    $(".js-rating").each(function() {
        var $rating = $(this);

        $rating.barrating("show", {
            theme: "css-stars",
            readonly: $rating.attr("readonly") ? true : false
        });
    });

    _document.on("click", ".product-filter__title", function() {
        $(this)
            .toggleClass("is-opened")
            .next()
            .stop()
            .slideToggle(250);
    });

    _document.on(
        "keyup",
        "[js-search-input]",
        debounce(function(e) {
            e.preventDefault();
            e.stopPropagation();

            // enter is reserved for selecting first child
            if (e.keyCode === 13) return;

            var postValue = $(this).val();
            var $sContainer = $(this).closest(".js-search");
            // var requestEndpoint = $sContainer.data("url");
            var $hintContainer = $sContainer.find(".search-site__hint");
            var $hintLoader = $sContainer.find(".search-site__loader");

            // 3 symbols are minimum
            // if (postValue.length >= 3) {
            //     $hintLoader.addClass("is-loading");
            // }

            if (postValue.length >= 3) {
                $hintLoader.addClass("is-loading");
            }

            setTimeout(function() {
                // 3 symbols are minimum
                if (postValue.length <= 2) {
                    $hintContainer.removeClass("is-active");
                    _overlay.removeClass("is-visible");
                    $hintLoader.removeClass("is-loading");
                    $hintLoader.removeClass("is-active");
                    return;
                } else {
                    $hintContainer.addClass("is-active");
                    _overlay.addClass("is-visible");
                    $hintLoader.removeClass("is-loading");
                    $hintLoader.addClass("is-active");
                }
            }, 3000);
        })
    );

    _document.on("click", function(e) {
        if (
            !$(e.target).closest(".js-search").length > 0 ||
            !$(e.target).closest(".search-site__hint").length > 0
        ) {
            $(".search-site__hint").removeClass("is-active");
            $(".search-site__loader").removeClass("is-active");
        }
    });

    $pageNavigation.mousemove(function(event) {
        if (_window.width() > 1260) {
            if ($(event.target).closest(".page-nav__item").length) {
                _overlay.addClass("is-visible");
            } else {
                _overlay.removeClass("is-visible");
            }
        }
    });

    function Dropdown(el, settings) {
        var _this = this;

        _this.el = $(el);
        _this.settings = settings;
        _this.state = false;

        function open() {
            scrollLock.hide();

            _body.addClass(_this.settings.bodyClass);
            _overlay.addClass("is-visible");
            _this.state = true;
        }

        function close() {
            scrollLock.show();

            _body.removeClass(_this.settings.bodyClass);
            _overlay.removeClass("is-visible");
            _this.state = false;
        }

        function toggle() {
            _this.state ? close() : open();
        }

        _this.open = open;
        _this.close = close;
        _this.toggle = toggle;
    }

    var nav = new Dropdown(".js-page-menu", {
        bodyClass: "page--menu"
    });

    var filter = new Dropdown(".js-filter", {
        bodyClass: "page--filter"
    });

    _document.on("click", ".js-nav-toggle", function() {
        filter.state ? filter.close() : nav.toggle();
    });

    _document.on("click", ".js-filter-toggle", filter.toggle);

    _overlay.on("click", function() {
        nav.close();
        filter.close();
    });

    new Swiper(".js-promo-slider", {
        loop: true,
        navigation: {
            prevEl: ".swiper-button-prev",
            nextEl: ".swiper-button-next"
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true
        },
        breakpoints: {
            574: {
                // autoHeight: true
            }
        }
    });

    new Swiper(".js-products-slider", {
        slidesPerView: 5,
        slidesPerGroup: 5,
        loop: true,
        navigation: {
            prevEl: ".js-products-nav .swiper-button-prev",
            nextEl: ".js-products-nav .swiper-button-next"
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true
        },
        breakpoints: {
            1260: {
                slidesPerView: 4,
                slidesPerGroup: 4
            },
            1023: {
                slidesPerView: 3,
                slidesPerGroup: 3
            },
            767: {
                slidesPerView: 2,
                slidesPerGroup: 2
            },
            574: {
                slidesPerView: 1,
                slidesPerGroup: 1,
                autoHeight: true
            }
        }
    });

    new Swiper(".js-wiget-slider", {
        loop: true,
        navigation: {
            prevEl: ".swiper-button-prev",
            nextEl: ".swiper-button-next"
        }
    });

    new Swiper(".js-compare-slider", {
        slidesPerView: 4,
        navigation: {
            prevEl: ".swiper-button-prev",
            nextEl: ".swiper-button-next"
        },
        pagination: {
            el: ".swiper-pagination",
            type: "custom",
            renderCustom: function(swiper, current, total) {
                return current * 2 - 1 + "," + current * 2 + " / " + total * 2;
            }
        },
        breakpoints: {
            1260: {
                slidesPerView: 3
            },
            1024: {
                slidesPerView: 2
            }
        }
    });

    var media = new Swiper(".js-media-large", {
        pagination: {
            el: ".swiper-pagination",
            clickable: true
        },
        on: {
            slideChange: function() {
                var thumbsCount = thumbsCountSlides();

                $countThumbsMore.html(thumbsCount);
            }
        },

        thumbs: {
            swiper: {
                el: ".js-media-thumbs",
                direction: "vertical",
                slidesPerView: 4,
                slidesPerGroup: 4,
                spaceBetween: 10,
                breakpoints: {
                    1260: {
                        direction: "horizontal"
                    }
                },

                on: {
                    slideChange: function() {
                        var thumbsCount = thumbsCountSlides();

                        $countThumbsMore.html(thumbsCount);
                    }
                }
            }
        }
    });

    function thumbsCountSlides() {
        // var slides = $(media.thumbs.swiper.slides).filter('.swiper-slide-visible').last().nextAll('.swiper-slide').length;
        var slides;

        return slides ? slides : 0;
    }

    var thumbsCount = thumbsCountSlides();
    var $countThumbsMore = $(".js-thumbs-count").html(thumbsCount);

    _document.on("click", ".js-thumbs-more", function() {
        media.thumbs.swiper.slideNext(400);
    });

    function articleSlider() {
        var $slider = $(".js-articles-slider-xl");
        var swiper = undefined;

        function init() {
            var screenWidth = _window.width();
            var breakpoint = 1260;
            var options = {
                slidesPerView: 3,
                slidesPerGroup: 3,
                pagination: {
                    el: ".swiper-pagination",
                    clickable: true
                },
                breakpoints: {
                    1023: {
                        slidesPerView: 2,
                        slidesPerGroup: 2
                    },
                    574: {
                        slidesPerView: 1,
                        slidesPerGroup: 1
                    }
                }
            };

            if (screenWidth <= breakpoint) {
                if (swiper === undefined) {
                    $slider
                        .addClass("swiper-container")
                        .children(".grid")
                        .addClass("swiper-wrapper")
                        .children(".col")
                        .addClass("swiper-slide");

                    swiper = new Swiper($slider, options);
                }
            } else {
                if (swiper !== undefined) {
                    swiper.destroy(true, true);
                    swiper = undefined;

                    $slider
                        .removeClass("swiper-container")
                        .children(".grid")
                        .removeClass("swiper-wrapper")
                        .children(".col")
                        .removeClass("swiper-slide");
                }
            }
        }

        _window.on("load resize", init);
    }

    articleSlider();

    var $grid = document.querySelectorAll(".js-grid");

    $grid.forEach(function(grid, index) {
        new Isotope(grid, {
            itemSelector: ".col",
            percentPosition: true,
            layoutMode: "packery"
        });
    });

    function buildMenuOnMobile() {
        var $pageMenu = $(".js-page-menu").children();

        var primaryNav = {
            $el: $(".js-primary-nav")
                .clone(true)
                .removeClass("page-header__primary-nav")
                .addClass("page-menu__primary-nav"),
            appended: false
        };

        var pageNav = {
            $el: $(".js-page-nav").clone(true),
            appended: false
        };

        var language = {
            $el: $(".js-language").clone(),
            appended: false
        };

        var compare = {
            $el: $(".js-compare-link").clone(),
            appended: false
        };

        var search = {
            $el: $(".js-search").clone(),
            appended: false
        };

        var $megaMenu = pageNav.$el.find(".mega-menu, .mega-menu__list");

        var linkReturn = function(title) {
            return (
                '<li class="mega-menu__item mega-menu__item--return"><span class="mega-menu__title">' +
                title +
                "</span></li>"
            );
        };

        $megaMenu.each(function() {
            $megaMenu = $(this);

            var title = $megaMenu.prev().html();

            $(linkReturn(title)).prependTo($megaMenu);
        });

        $pageMenu.on("click", ".page-nav__link, .mega-menu__link", function(
            event
        ) {
            var $link = $(this);

            if ($link.siblings($megaMenu).length) {
                event.preventDefault();

                $link.parent().addClass("is-opened");
            }
        });

        $pageMenu.on("click", ".mega-menu__title", function(event) {
            event.preventDefault();

            $(this)
                .closest(".is-opened")
                .removeClass("is-opened");
        });

        function init() {
            var screenWidth = _window.width();
            var breakpoints = {
                xl: screenWidth <= 1260,
                md: screenWidth <= 767
            };

            if (breakpoints.xl) {
                if (!pageNav.appended) {
                    pageNav.$el.appendTo($pageMenu);
                    pageNav.appended = true;
                }

                if (!primaryNav.appended) {
                    primaryNav.$el.appendTo($pageMenu);
                    primaryNav.appended = true;
                }
            } else {
                pageNav.appended = false;
                primaryNav.appended = false;
            }

            if (breakpoints.md) {
                if (!language.appended) {
                    language.$el.appendTo($pageMenu.parent());
                    language.appended = true;
                }

                if (!compare.appended) {
                    compare.$el.appendTo($pageMenu.parent());
                    compare.appended = true;
                }

                if (!search.appended) {
                    search.$el.prependTo($pageMenu);
                    search.appended = true;
                }
            } else {
                language.appended = false;
                compare.appended = false;
                search.appended = false;
            }
        }

        _window.on("load resize", init);
    }

    buildMenuOnMobile();

    _document.on("click", ".js-language .language__selected", function() {
        $(this)
            .parent()
            .toggleClass("is-opened");
    });

    try {
        $.browserSelector();
        if ($("html").hasClass("chrome")) {
            $.smoothScroll();
        }
    } catch (err) {}

    function Sticky(el, offsetOption) {
        var _this = this;
        _this.offsetTop = 0
        _this.cachedElements = [] // an array of sticky elements and their chars
        _this.scrollRequest = 0
        _this.requestId = null

        // INIT / RESIZE function with heavy calcs
        function init() {
            var maxHeight = 0;

            $(el).each(function() {
                var $el = $(this)
                var height = parseInt($el.outerHeight());

                if (height > maxHeight) {
                    maxHeight = height;
                }

                TweenLite.set($el, {
                  rotation: 0.01, force3D: true
                });

                _this.cachedElements.push({
                  $el: $el,
                  elTop: $el.parent().offset().top
                })

            });

            _this.offsetTop
            if (offsetOption === 1){
              if ( window.innerWidth <= 768 ){
                _this.offsetTop = $(".page__navbar").height() + $(".compare__nav").height() - 2
              } else {
                _this.offsetTop = $(".page__navbar").height()
              }
            } else if ( offsetOption === 2 ){
              _this.offsetTop = $(".page__navbar").height()
            }

            // set same heights to all elements
            $(el).outerHeight(maxHeight);

        }


        // scroll function
        function scroll(){
            _this.scrollRequest++;
            if (!_this.requestId) {
              _this.requestId = requestAnimationFrame(transformScrollY);
            }
        }

        function transformScrollY(){
          var winTop =  $(window).scrollTop()
          var firstObj = _this.cachedElements[0]

          // we check position for first element only as they are on the same line always
          if (winTop + _this.offsetTop >= firstObj.elTop) {
              const transformY = winTop - firstObj.elTop + _this.offsetTop
              $.each(_this.cachedElements, function(i, obj) {
                // obj.$el.css({
                //   transform: "translate3d(0, " + transformY + "px, 0)"
                // })
                TweenLite.set(obj.$el, {
                  y: transformY
                });

                if ( !obj.$el.is('.is-sticky') ){
                  obj.$el.addClass("is-sticky");
                }
              })
          } else{
            $.each(_this.cachedElements, function(i, obj) {
              obj.$el.css({
                  transform: "translate3d(0, 0, 0)"
              }).removeClass("is-sticky");
            })
            _this.scrollRequest = 0;
            _this.requestId = null
          }

          _this.requestId = _this.scrollRequest > 0 ? requestAnimationFrame(transformScrollY) : null;
        }

        // initializaers and listeners
        init()
        scroll()
        _window.on("scroll", scroll);
        _window.on("resize", debounce(init, 50))
    }

    // element constructors
    new Sticky(".js-compare-fixed", 1);
    new Sticky(".compare__nav", 2);

    ////////
    // TABS
    ////////
    $(".js-tabs").on("click", ".js-tabs-btn", function() {
        var $btn = $(this);

        $btn.addClass("is-active")
            .siblings()
            .removeClass("is-active");
        $btn.closest(".js-tabs")
            .find(".js-tab")
            .eq($btn.index())
            .addClass("is-active")
            .siblings()
            .removeClass("is-active");
    });

    $(".js-tab").on("click", ".tabs__btn", function() {
        var $btn = $(this);

        $btn.addClass("is-active")
            .siblings()
            .removeClass("is-active");
        $btn.parent()
            .find(".tabs__inner")
            .stop()
            .slideToggle(250)
            .parent()
            .siblings()
            .find(".tabs__inner")
            .stop()
            .slideUp(250);
    });

    $(".js-category-filter").on("click", ".category-filter__link", function(
        event
    ) {
        event.preventDefault();

        var $link = $(this);

        $link.toggleClass("is-active");
    });

    // COMPARE EQ. HEIGHTS
    var compareRows = [];

    function getCompareProperties() {
        var $cols = $(".js-properties");
        if ($cols.length === 0) return;
        var cells = []; // collect an array

        // interate through all cols
        $cols.each(function(colIndex, col) {
            var $col = $(col);
            var $cells = $col.children();
            if ($cells.length === 0) return;

            // find cells and interate getting an index
            $cells.each(function(cellIndex, cell) {
                var $cell = $(cell);
                cells.push({
                    colIndex: colIndex,
                    cellIndex: cellIndex,
                    $cell: $cell
                });
            });
        });

        // convert array of cells to array of rows
        var grouped = groupBy(cells, "cellIndex");
        var rows = [];
        $.each(Object.values(grouped), function(i, group) {
            var rowOfCells = [];
            $.each(group, function(i, row) {
                rowOfCells.push(row.$cell);
            });
            rows.push(rowOfCells);
        });

        compareRows = rows; // store globally
        setCompareProperties(); // set on initial call
    }

    function setCompareProperties() {
        $.each(compareRows, function(i, row) {
            // find max height in each row
            var maxCellHeight = 0;
            $.each(row, function(i, $cell) {
                var cellHeight = $cell.height();
                if (cellHeight > maxCellHeight) {
                    maxCellHeight = cellHeight;
                }
            });

            // set same height to all cells in row
            $.each(row, function(i, $cell) {
                $cell.css({
                    height: maxCellHeight
                });
            });
        });
    }

    getCompareProperties();
    _window.on("resize", debounce(setCompareProperties, 200));

    function resizeHeaderCompare() {
        var maxHeight = 0;

        $(".js-compare-header").each(function() {
            var height = parseInt($(this).outerHeight());

            if (height > maxHeight) {
                maxHeight = height;
            }
        });

        $(".js-compare-header").outerHeight(maxHeight);
    }

    _window.on("load resize", resizeHeaderCompare);
});
