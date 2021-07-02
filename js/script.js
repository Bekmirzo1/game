'use strict';
// *Эта функция проверяет поддерживается ли браузером формат изображения webp и если поддерживается, то эта функция добавляет из css-документа внутрь html-документа класс с изобажением формата webp
function testWebP(callback) {

    var webP = new Image();
    webP.onload = webP.onerror = function () {
        callback(webP.height == 2);
    };
    webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}

testWebP(function (support) {

    if (support == true) {
        document.querySelector('body').classList.add('webp');
    } else {
        document.querySelector('body').classList.add('no-webp');
    }
});
// *Burger
let menuBody = document.querySelector('.menu__body');
let iconMenu = document.querySelector('.icon-menu');
if (iconMenu) {
    iconMenu.addEventListener('click', function () {
        iconMenu.classList.toggle('_active');
        menuBody.classList.toggle('_active');
        document.body.classList.toggle('_lock');
    })
}
;
const selects = document.querySelectorAll('.select');
for (let index = 0; index < selects.length; index++) {
    const select = selects[index];
    const selectHeader = select.querySelector('.select__header');
    let selectCurrent = select.querySelector('.select__current');
    const selectItems = select.querySelectorAll('.select__item');
    selectHeader.addEventListener('click', function () {
        select.classList.toggle('_active');
    });
    for (let index = 0; index < selectItems.length; index++) {
        const selectItem = selectItems[index];
        selectItem.addEventListener('click', function (e) {
            e.stopPropagation();
            const selectItemText = selectItem.textContent;
            if (selectCurrent) {
                selectCurrent.textContent = selectItemText;
                select.classList.remove('_active');
            }
        });
    }
    document.addEventListener('click', function (e) {
        const selectIcon = select.querySelector('.select__icon');
        if (e.target !== selectHeader && e.target !== selectCurrent && e.target !== selectIcon) {
            select.classList.remove('_active');
        }
    });
};
const scrollDown = document.querySelector('.scroll-down');
if (scrollDown) {
    const fls = document.querySelector('.fullscreen');
    if (fls) {
        scrollDown.addEventListener('click', function (e) {
            const flsBottom = fls.getBoundingClientRect().bottom + pageYOffset;
            window.scrollTo({
                top: flsBottom,
                behavior: 'smooth'
            })
            // e.preventDefault();
        });
    }
};
const sliders = document.querySelectorAll('.slider');
if (sliders.length > 0) {
    for (let index = 0; index < sliders.length; index++) {
        const slider = sliders[index];
        window.addEventListener('resize', sliderChange);
        function sliderChange() {
            new Swiper(slider, {
                navigation: {
                    nextEl: '.slider__next',
                },
                pagination: {
                    // *Пагинация
                    el: '.swiper-pagination',
                    clickable: true,
                },
                effect: "coverflow",
                // loop: true,
                slidesPerView: 'auto',
                // centeredSlides: true,
                simulateTouch: true,
                coverflowEffect: {
                    rotate: 0,
                    stretch: 45,
                    depth: 110,
                    slideShadows: false,
                    modifier: 6,
                    spaceBetween: -400,
                },
                breakpoints: {
                    280: {
                        simulateTouch: false,
                        spaceBetween: -150,
                        coverflowEffect: {
                            stretch: 15,
                            depth: 100,
                        },
                    },
                    767: {
                        spaceBetween: 0,
                        coverflowEffect: {
                            stretch: 43,
                            depth: 100,
                        },
                    },
                    992: {
                        spaceBetween: -300,
                    },
                    1212: {
                        spaceBetween: -400,
                    }
                }
            });
        }
        sliderChange();
    }
};
// *Spoller
const spollersArray = document.querySelectorAll('[data-spollers]');
if (spollersArray.length > 0) {
    // Инициализация обычных спойлеров
    initSpollers(spollersArray);
    // Инициализация
    function initSpollers(spollersArray, matchMedia = false) {
        spollersArray.forEach(spollersBlock => {
            spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
            if (matchMedia.matches || !matchMedia) {
                spollersBlock.classList.add('_init');
                initSpollerBody(spollersBlock);
                spollersBlock.addEventListener('click', setSpollerAction);
            } else {
                spollersBlock.classList.remove('_init');
                initSpollerBody(spollersBlock, false);
                spollersBlock.removeEventListener('click', setSpollerAction);
            }
        });
    }
    // Работа с контентом
    function initSpollerBody(spollersBlock, hideSpollerBody = true) {
        const spollerTitles = spollersBlock.querySelectorAll('[data-spoller]');
        if (spollerTitles.length > 0) {
            spollerTitles.forEach(spollerTitle => {
                if (hideSpollerBody) {
                    spollerTitle.removeAttribute('tabindex');
                    if (!spollerTitle.classList.contains('_active')) {
                        spollerTitle.nextElementSibling.hidden = true;
                    }
                } else {
                    spollerTitle.setAttribute('tabindex', '-1');
                    spollerTitle.nextElementSibling.hidden = false;
                }
            });
        }
    }
    function setSpollerAction(e) {
        const el = e.target;
        if (el.hasAttribute('data-spoller') || el.closest('[data-spoller]')) {
            const spollerTitle = el.hasAttribute('data-spoller') ? el : el.closest('[data-spoller]');
            const spollersBlock = spollerTitle.closest('[data-spollers]');
            const oneSpoller = spollersBlock.hasAttribute('data-one-spoller') ? true : false;
            if (!spollersBlock.querySelectorAll('._slide').length) {
                if (oneSpoller && !spollerTitle.classList.contains('_active')) {
                    hideSpollersBody(spollersBlock)
                }
                spollerTitle.classList.toggle('_active')
                _slideToggle(spollerTitle.nextElementSibling, 500);
            }
            e.preventDefault();
        }
    }

    function hideSpollersBody(spollersBlock) {
        const spollerActiveTitle = spollersBlock.querySelector('[data-spoller]._active');
        if (spollerActiveTitle) {
            spollerActiveTitle.classList.remove('_active');
            _slideUp(spollerActiveTitle.nextElementSibling, 500);
        }
    }
}

// Slide Toggle
let _slideUp = (target, duration = 500) => {
    if (!target.classList.contains('_slide')) {
        target.classList.add('_slide')
        target.style.transitionProperty = 'height, margin, padding';
        target.style.transitionDuration = duration + 'ms';
        target.style.height = target.offsetHeight + 'px';
        target.offsetHeight;
        target.style.overflow = 'hidden';
        target.style.height = 0;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        window.setTimeout(() => {
            target.hidden = true;
            target.style.removeProperty('height');
            target.style.removeProperty('padding-top');
            target.style.removeProperty('padding-bottom');
            target.style.removeProperty('margin-top');
            target.style.removeProperty('margin-bottom');
            target.style.removeProperty('overflow');
            target.style.removeProperty('transition-duration');
            target.style.removeProperty('transition-property');
            target.classList.remove('_slide')
        }, duration);
    }
};
let _slideDown = (target, duration = 500) => {
    if (!target.classList.contains('_slide')) {
        target.classList.add('_slide')
        if (target.hidden) {
            target.hidden = false;
        }
        let height = target.offsetHeight;
        target.style.overflow = 'hidden';
        target.style.height = 0;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        target.offsetHeight;
        target.style.boxSizing = 'border-box';
        target.style.transitionProperty = "height, margin, padding";
        target.style.transitionDuration = duration + 'ms';
        target.style.height = height + 'px';
        target.style.removeProperty('padding-top');
        target.style.removeProperty('padding-bottom');
        target.style.removeProperty('margin-top');
        target.style.removeProperty('margin-bottom');
        window.setTimeout(() => {
            target.style.removeProperty('height');
            target.style.removeProperty('overflow');
            target.style.removeProperty('transition-duration');
            target.style.removeProperty('transition-property');
            target.classList.remove('_slide');
        }, duration);
    }
};
let _slideToggle = (target, duration = 500) => {
    if (target.hidden) {
        return _slideDown(target, duration);
    } else {
        return _slideUp(target, duration);
    }
};;
const animItems = document.querySelectorAll('._anim-items');
if (animItems.length > 0) {
    window.addEventListener('scroll', animOnScroll);
    function animOnScroll() {
        for (let index = 0; index < animItems.length; index++) {
            const animItem = animItems[index];
            const animItemHeight = animItem.offsetHeight;
            const animItemOffset = animItem.getBoundingClientRect().top + pageYOffset;
            const animStart = 4;
            let animItemPoint = window.innerHeight - animItemHeight / animStart;
            if (animItemHeight > window.innerHeight) {
                animItemPoint = window.innerHeight - window.innerHeight / animStart;
            }

            if ((pageYOffset > animItemOffset - animItemPoint) && pageYOffset < (animItemOffset + animItemHeight)) {
                animItem.classList.add('_anim')
            }
        }
    }
    setTimeout(() => {
        animOnScroll();
    }, 300);
};

