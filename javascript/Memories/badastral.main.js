var badastral = badastral || {};



badastral.gallery = function($gallery) {
    "use strict";
    var $slides = $('.gallery-slide', $gallery),
        $slider = $('.gallery-slides', $gallery),
        current = 0,
        total = $slides.length,
        pos = parseInt($slider.css('left'), 10),
        ratio = 1,
        leftRatio = 0.25,
        rightRatio = 1.75,
        touch = {
            startX: 0,
            dist: 0
        },
        self = {

        init: function() {
            self.setDimensions();
            self.setPosition();

            // $gallery.on('mousemove', function(e) {
            //     ratio = (e.clientX) / (window.innerWidth / 2);

            //     if (ratio < leftRatio && current > 0) {
            //         $slider.addClass('bump-left');
            //     } else if (ratio > rightRatio && current < total-1) {
            //         $slider.addClass('bump-right');
            //     } else {
            //         $slider.removeClass('bump-left bump-right');
            //     }

            // });

            $('.gallery-expand', $gallery).on('click', self.showLightbox);

            $gallery.on('mouseleave', function() {
                $slider.css({ 'left': pos });
            });

            $('.gallery-shield.prev', $gallery)
                .on('click', function() {
                    self.updateCurrent(-1);
                })
                .on('mouseover', function() {
                    if (current > 0) {
                        $slider.addClass('bump-left').removeClass('bump-right');
                    }
                });

            $('.gallery-shield.next', $gallery)
                .on('click', function() {
                    self.updateCurrent(1);
                })
                .on('mouseover', function() {
                    if (current < total-1) {
                        $slider.addClass('bump-right').removeClass('bump-left');
                    }
                });

            $('.gallery-shield', $gallery).on('mouseleave', function() {
                $slider.removeClass('bump-left bump-right');
            });

            // $gallery.on('click', function(e) {
            //     if (ratio < leftRatio) {
            //         self.updateCurrent(-1);
            //     } else if (ratio > rightRatio) {
            //         self.updateCurrent(1);
            //     }
            // });

            $gallery
                .on('touchstart', function(e) {
                    $slider.addClass('noanimate');
                    var touchEvt = e.originalEvent.touches[0];
                    touch.startX = touchEvt.clientX;
                    touch.dist = 0;
                })
                .on('touchmove', function(e) {
                    e.preventDefault();
                    var touchEvt = e.originalEvent.touches[0];
                    touch.dist = touchEvt.clientX - touch.startX;

                    $slider.css({ 'left': pos + touch.dist });
                })
                .on('touchend', function(e) {
                    $slider.removeClass('noanimate');
                    var touchEvt = e.originalEvent.touches[0];
                    if (touch.dist < -100) {
                        self.updateCurrent(1);
                    } else if (touch.dist > 100) {
                        self.updateCurrent(-1);
                    } else {
                        $slider.css({ 'left': pos });
                    }
                });

            badastral.lightbox.init();

            $(window).on('resize', function() {
                self.setPosition(true);
                self.setDimensions();
            });
        },

        updateCurrent: function(dir) {
            current += dir;
            if (current > total-1) current = total-1;
            if (current < 0) current = 0;
            self.setPosition();
        },

        setDimensions: function() {
            $slider.width(total * $('#container').width());
            var newHeight = Math.round(0.5 * $('#container').width());
            $slider.height(newHeight);
        },

        // todo: this noanimate thing doesn't work
        setPosition: function(noanimate) {
            if (noanimate === true) {
                $slider.addClass('noanimate');
            }
            pos = -(current * $('#container').width());
            $slider.css({ 'left': pos });
            $slides.removeClass('active');
            $($slides.get(current)).addClass('active');
            $slider.removeClass('noanimate');
        },

        showLightbox: function() {
            badastral.lightbox.load($slides[current].src);
        }

    };

    return self;
};


badastral.lightbox = (function() {
    "use strict";
    var $container = null,
        $content = null,
        self = {

        init: function() {
            $container = $('#lightbox-container');
            $content = $('#lightbox-content');
            $('#lightbox-close').on('click', self.close);
        },

        load: function(src) {
            return; // not done, don't do anything yet
            if (src === undefined) return;
            $content.html('<img src="'+ src +'">');
            self.open();
        },

        open: function() {
            $container.fadeIn('fast');
        },

        close: function(e) {
            if (e !== undefined) e.preventDefault();
            $container.fadeOut('fast', function() {
                console.log('empty');
            });
        }
    };
    return self;
}());



badastral.main = (function() {
    "use strict";
    var searchOpen = false,
        searchLabels = [
            'That hot guy who hangs out with Astro',
            'That one guy who plays the mobile piano',
            'The guy with glasses',
			'The Jackie Chan-looking guy',
			'How to tune astral projection',
			'OOBE leads to death. What should I do?',
			'How to be photogenic',
			'E = ?',
			'Sir William McGeek'
        ],
        currentLabel = Math.floor(Math.random() * searchLabels.length),
        self = {

        init: function() {

            $(window).on('scroll', function(e) {
                self.scrollHandler($(this).scrollTop());
            });

            $('#btn-menu').on('click', self.toggleMenu);

            $('#btn-search').on('click', function(e) {
                e.preventDefault();
                self.toggleSearch();
            });

            $('#btn-search-close,#search-overlay').on('click', function(e) {
                e.preventDefault();
                self.toggleSearch(true);
            });

            $('#field-search').on('keyup focus', function(e) {
                if ($(this).val() != '') {
                    $('#form-label').addClass('active');
                } else {
                    $('#form-label').removeClass('active');
                }
            })

            $('.feature-image').fitVids();

            $(window).on('resize', function() {
                self.resizeHandler();
            });

            self.scrollHandler();
            self.resizeHandler();
        },

        toggleMenu: function() {
            $('nav').toggleClass('open');
            $('#btn-menu').toggleClass('open');
            // in case search is open on mobile, close it
            if (searchOpen === true) {
                self.toggleSearch(true);
            }
        },

        scrollHandler: function(scrollTop) {
            if (scrollTop === undefined) {
                scrollTop = $(window).scrollTop();
            }

            // if the search form is open, don't change the header
            if (searchOpen === true) {
                return;
            }

            if (scrollTop <= 48 && scrollTop > 3 && window.innerWidth > 760) {
                $('#logo').css({ 'top': 'auto', 'bottom': 0, 'width': 160-scrollTop, 'left': Math.floor(60 + (scrollTop / 4)) });
            } else {
                $('#logo').removeAttr('style');
            }

            if (scrollTop >= 48) {
                $('body').addClass('short');
            } else {
                $('body').removeClass('short');
            }
        },

        resizeHandler: function() {
            var width = $('#container').width()-2;
            $('.gallery-slide').width(width);
            // close search if width switches to tablet view
            if (searchOpen === true) {
                if (window.innerWidth < 760) {
                    self.toggleSearch(true);
                }
            }
        },

        toggleSearch: function(forceClose) {
            if (forceClose === true) {
                searchOpen = true;
            }

            if (searchOpen === true) {
                searchOpen = false;
                $('body').removeClass('tall');
                $('nav').hide();
                setTimeout(function() {
                    $('nav').fadeIn('fast');
                }, 300);
                if ($('body').scrollTop() < 48) {
                    $('body').addClass('fixed')
                    setTimeout(function() {
                        $('body').removeClass('fixed');
                    }, 300);
                }
                $('#search-container').removeClass('open');
                $('#search-overlay').fadeOut('fast');
                self.scrollHandler();
            } else {
                searchOpen = true;
                $('body').addClass('tall').removeClass('short');
                $('#search-container').addClass('open');
                $('#search-overlay').fadeIn('fast');
                //$('#field-search').attr('placeholder', searchLabels[Math.floor(Math.random() * searchLabels.length)]);

                $('#field-search').attr('placeholder', window.innerWidth < 500 ? 'Search' : searchLabels[currentLabel]).focus();
                currentLabel++;
                if (currentLabel >= searchLabels.length) currentLabel = 0;

                // short delay to wait for animation to complete
                setTimeout(function() {
                    $('#field-search').focus();
                }, 1000);
            }
        },

        getParam: function(name) {
            name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        }
    };
    return self;
}());

// search results page
badastral.searchresults = (function() {
    "use strict";
    var $btn,
        $field,
        self = {

        init: function() {
            $btn = $('#btn-search-close-extra');
            $field = $('#field-search-extra');

            $field.on('keyup', function() {
                if ($field.val() != '') {
                    $btn.fadeIn();
                    $('#search-overlay').fadeIn();
                } else {
                    $btn.fadeOut();
                    $('#search-overlay').fadeOut();
                }
            });

            $('#filter-news').on('click', function(e) {
                e.preventDefault();
                $('#search-results-news').show();
                $('#search-results-people').hide();
                $(this).addClass('active');
                $('#filter-people').removeClass('active');
            });

            $('#filter-people').on('click', function(e) {
                e.preventDefault();
                $('#search-results-news').hide();
                $('#search-results-people').show();
                $(this).addClass('active');
                $('#filter-news').removeClass('active');
            });

            $btn.on('click', function(e) {
                e.preventDefault();
                $('#field-search-extra').val('');
                $btn.fadeOut();
                $field.focus();
                $('#search-overlay').fadeOut();
            });

        }
    };
    return self;
}());





// 10yr home page carousel
badastral.carousel = (function() {
    "use strict";
    var $slider,
        current = 0,
        total = 0,
        timer = null,
        delay = 5000,   // milliseconds
        pos = 0,
        touch = {
            startX: 0,
            dist: 0
        },
        player = null,
        self = {

        init: function() {
            $slider = $('#slide-projector');
            total = $('#carousel .slide').length;

            $('#carousel')
                .on('mouseenter', function() {
                    self.stopTimer();
                })
                .on('mouseleave', function() {
                    self.startTimer();
                })
                .on('touchstart', function(e) {
                    self.stopTimer();
                    $slider.addClass('noanimate');
                    var touchEvt = e.originalEvent.touches[0];
                    pos = parseInt($slider.css('left'), 10);
                    touch.startX = touchEvt.clientX;
                    touch.dist = 0;
                })
                .on('touchmove', function(e) {
                    //e.preventDefault();
                    var touchEvt = e.originalEvent.touches[0];
                    touch.dist = touchEvt.clientX - touch.startX;
                    // if (touch.dist > 300) {
                    //     e.preventDefault();
                    //     return;
                    // }
                    $slider.css({ 'left': pos + touch.dist });
                })
                .on('touchend', function(e) {
                    self.startTimer();
                    $slider.removeClass('noanimate');
                    var touchEvt = e.originalEvent.touches[0];
                    if (touch.dist < -100) {
                        current++;
                        if (current > total - 1) current = total - 1;
                        self.slideTo(current);
                    } else if (touch.dist > 100) {
                        current--;
                        if (current < 0) current = 0;
                        self.slideTo(current);
                    } else {
                        $slider.css({ 'left': pos });
                    }
                });


            $('#carousel-pagination .dot').on('click', function() {
                self.slideTo($(this).data('slide'));
            });

            $('#link-learn-more, #link-kubo-trailer').on('click', function(e) {
                e.preventDefault();
                self.playVideo($(this).data('ytid'));
                self.stopTimer();
            });

            $(window).on('resize', self.resizeHandler);

            self.startTimer();
        },

        slideTo: function(num) {
            if (num < 0) num = total -1;
            if (num >= total) num = 0;
            current = num;
            $slider.css({ 'left': -(current * 100) +'%' });
            $('#carousel-pagination .dot').removeClass('active');
            $('#dot-'+ current).addClass('active');
        },

        autoSlide: function() {
            current++;
            self.slideTo(current);
        },

        startTimer: function() {
            if (timer === null) {
                timer = setInterval(self.autoSlide, delay);
            }
        },

        stopTimer: function() {
            if (timer !== null) {
                clearInterval(timer);
                timer = null;
            }
        },

        playVideo: function(id) {
            player = new YT.Player('player', {
                height: '510',
                width: '907',
                videoId: id,
                playerVars: {
                    rel: 0,
                    modestbranding: 1,
                    fs: 1,
                    showinfo: 0,
                    autoplay: 1
                },
                events: {
                    'onReady': function() {
                        $('#player-close').show();
                        self.resizeHandler();
                    }
                }
            });

            $('#player-close').on('click', function(e) {
                e.preventDefault();
                self.closeVideo();
            });

            $('#player-container').fitVids();
            $('#player-wrapper').fadeIn();
        },

        closeVideo: function() {
            if (player === null) return;
            player.stopVideo();
            player.destroy();
            player = null;
            $('#player-wrapper').fadeOut();
            self.startTimer();
        },

        resizeHandler: function() {
            var viewportOffset = document.getElementById('player').getBoundingClientRect();

            $('#player-close').css('top', viewportOffset.top - 60);
        }
    };
    return self;
}());



badastral.people = (function() {
    "use strict";
    var $thumbs,
        page = 0,
        perPage = 30,
        total = 0,
        start = 0,
        end = 0,
        self = {

        init: function() {
            $thumbs = $('.person-thumb');
            total = $thumbs.length;
            self.loadMore();
            $('#btn-load-more').on('click', function(e) {
                e.preventDefault();
                self.loadMore();
            });

            $(window).on('resize', self.fadeLast);
        },

        loadMore: function() {
            start = page * perPage;
            end = start + perPage;

            if (start > total) {
                self.end();
            }
            if (end > total) {
                end = total;
                self.end();
                return;
            }

            page++;

            for (var i=start; i<end; i++) {
                $($thumbs[i]).fadeIn();
            }
            self.fadeLast();
        },

        fadeLast: function() {
            if (window.innerWidth < 701) {
                $('.person-thumb').removeClass('fade');
                return;
            }

            $('.person-thumb').removeClass('fade').slice(end - (window.innerWidth < 881 ? 2 : 3), end).addClass('fade');
        },

        end: function() {
            $('#btn-load-more').remove();
            $('.person-thumb').removeClass('fade');
            $(window).off('resize', self.fadeLast);
        }

    };
    return self;
}());






$(function() {
    badastral.main.init();
    $('.gallery-container').each(function() {
        badastral.gallery($(this)).init();
    });
});


function onYouTubePlayerAPIReady() {
    // required for youtube api
}
