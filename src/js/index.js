import '../scss/main.scss';
import 'intersection-observer';
import $ from 'jquery';
import 'bootstrap';
import 'popper.js';
import Swiper from 'swiper';
import IMask from 'imask';
//Leaflet
import L from 'leaflet';
import 'leaflet/dist/images/marker-icon-2x.png';
import 'leaflet/dist/images/marker-icon.png';
import 'leaflet/dist/images/marker-shadow.png';

/****/
(function () {

    function isInt(num) {
        //作用:是否为整数
        //返回:true是 false否
        let res = false;
        try {
            if (String(num).indexOf(".") == -1 && String(num).indexOf(",") == -1) {
                res = parseInt(num) % 1 === 0 ? true : false;
            }
        } catch (e) {
            res = false;
        }
        return res;
    }

    function isFloat(num) {
        //作用:是否为小数
        //返回:小数位数(-1不是小数)
        let res = -1;
        try {
            if (String(num).indexOf(".") != -1) {
                let index = String(num).indexOf(".") + 1; //获取小数点的位置
                let count = String(num).length - index; //获取小数点后的个数
                if (index > 0) {
                    res = count;
                }
            }
        } catch (e) {
            res = -1;
        }
        return res;
    }

    $.fn.numScroll = function (options) {

        let settings = $.extend({
            'time': 1500,
            'delay': 0
        }, options);

        return this.each(function () {
            let $this = $(this);
            let $settings = settings;

            let num = $this.attr("data-num") || $this.text(); //实际值
            let temp = 0; //初始值
            $this.text(temp);
            let numIsInt = isInt(num);
            let numIsFloat = isFloat(num);
            let step = (num / $settings.time) * 10; //步长

            setTimeout(function () {
                let numScroll = setInterval(function () {
                    if (numIsInt) {
                        $this.text(Math.floor(temp));
                    } else if (numIsFloat != -1) {
                        $this.text(temp.toFixed(numIsFloat));
                    } else {
                        $this.text(num);
                        clearInterval(numScroll);
                        return;
                    }
                    temp += step;
                    if (temp > num) {
                        $this.text(num);
                        clearInterval(numScroll);
                    }
                }, 1);
            }, $settings.delay);

        });
    };

})($);
/****/

$(window).on('load', function () {
    //leaflet map
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'img/marker-icon-2x.png',
        iconUrl: 'img/marker-icon.png',
        shadowUrl: 'img/marker-shadow.png',
    });

    const map = L.map('map');
    const defaultCenter = function () {
        if (window.innerWidth < 768) {
            return [43.262990, 76.931635];
        } else {
            return [43.244010, 76.967512];
        }
    };
    const basemap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}');

    let clinic1 = L.marker([43.23931, 76.94392]).addTo(map).bindPopup('г. Алматы, Проспект Абая, 20/14'),
        clinic2 = L.marker([43.22795, 76.9069]).addTo(map).bindPopup('г. Алматы, улица Габдуллина 94А угол Ауэзова'),
        clinic3 = L.marker([43.25944, 76.95952]).addTo(map).bindPopup('г. Алматы, улица Абдуллиных 30');

    basemap.addTo(map);

    if (map) {
        map.setView(
            defaultCenter(),
            13,
            {
                scrollWheelZoom: false
            })
            .scrollWheelZoom.disable();
    }
    /****************************************************************************************/
});

$(function () {
    // modal
    $("#videoInfo").on('hidden.bs.modal', function (e) {
        $("#videoInfo iframe").attr("src", $("#videoInfo iframe").attr("src"));
    });

    // input mask
    let maskOptions = {
        mask: '+{7}(000)000-00-00',
        // lazy:false,
        placeholderChar: '_',
    };
    let inp = document.querySelectorAll('.p-mask');

    if (inp.length > 0) {
        inp.forEach(function (field) {
            IMask(field, maskOptions);

            let placeholder = '+7(';
            field.onfocus = function () {
                if (this.value === placeholder || this.value === '') {
                    this.value = placeholder
                } else {
                    return false;
                }
            };
            field.onblur = function () {
                if (this.value === placeholder || this.value === '') {
                    this.value = ''
                }
            };
        });
    }

    // Swiper slider
    if ($('.swiper-container').length) {
        let specialistSlider;
        let specialistSlides = document.querySelectorAll('.our-specialists .swiper-slide').length;

        if (specialistSlides > 4) {
            specialistSlider = new Swiper(document.querySelector('.our-specialists'), {
                // observer: false,
                // observeParents: false,
                slidesPerView: 4,
                centeredSlides: false,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                breakpoints: {
                    992: {
                        slidesPerView: 3,
                        centeredSlides: false,
                    },
                    860: {
                        slidesPerView: 2,
                        centeredSlides: false,
                    },
                    600: {
                        centeredSlides: true,
                        slidesPerView: 1,
                    }
                }
            });
        } else {
            specialistSlider = new Swiper(document.querySelector('.our-specialists'), {
                init: false
            });
        }
    }

    // intersectionObserver
    let images = document.querySelectorAll('img[data-src]');
    let counters = document.querySelectorAll('.counter');
    let iframes = document.querySelectorAll('.video-preview');

    let observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.intersectionRatio > 0) {
                if (entry.target.hasAttribute('data-src')) {
                    let imgSrc = entry.target.getAttribute('data-src');

                    entry.target.setAttribute('src', imgSrc);
                    entry.target.removeAttribute('data-src');
                }
            }
        });
    });
    let observerC = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.intersectionRatio > 1) {
                $(entry.target).numScroll();
            }
        });
    });
    let observerFrame = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.intersectionRatio > 0) {
                let newFrame = document.createElement('iframe');
                let source = entry.target.getAttribute('data-src');

                newFrame.setAttribute('src', source);
                newFrame.setAttribute('allowfullscreen', '1');

                newFrame.onload = function() {
                    entry.target.remove();
                };

                entry.target.parentNode.appendChild(newFrame);
            }
        });
    });

    if (images.length > 0) {
        images.forEach(function (img) {
            observer.observe(img);
        });
    }

    if (counters.length > 0) {
        counters.forEach(function (counter) {
            observerC.observe(counter);
        });
    }

    if (iframes.length > 0) {
        iframes.forEach(function (frame) {
            observerFrame.observe(frame);
        });
    }
    /****************************************************************************************/
});

$(window).on('load resize', function () {
    if (window.innerWidth <= 992) {
        $('.main-section').css('padding-top', $('header').innerHeight());
    } else {
        $('.main-section').css('padding-top', 210);
    }
});