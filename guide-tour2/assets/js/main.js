const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

/**
 * Hàm tải template
 *
 * Cách dùng:
 * <div id="parent"></div>
 * <script>
 *  load("#parent", "./path-to-template.html");
 * </script>
 */
function load(selector, path) {
    const cached = localStorage.getItem(path);
    if (cached) {
        $(selector).innerHTML = cached;
    }

    fetch(path)
        .then((res) => res.text())
        .then((html) => {
            if (html !== cached) {
                $(selector).innerHTML = html;
                localStorage.setItem(path, html);
            }
        })
        .finally(() => {
            window.dispatchEvent(new Event("template-loaded"));
        });
}

// Slide Show
// Cách dùng thêm class="mySlides" vào các slideshow
let slideIndex = 0;
showSlides();
function showSlides() {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
        slides[slideIndex - 1].style.display = "block";
    }
    slideIndex++;
    if (slideIndex > slides.length) {
        slideIndex = 1;
    }
    // Điều chỉnh thông số chạy slide theo giây(ms)
    setTimeout(showSlides, 5000);
}

// Chuyển tab
window.addEventListener("template-loaded", () => {
    const tabsSelector = "video-containers__item";
    const contentsSelector = "video-container";

    const tabActive = `${tabsSelector}--active`;
    const contentActive = `${contentsSelector}--active`;

    const tabContainers = $$(".js-tabs");
    tabContainers.forEach((tabContainer) => {
        const tabs = tabContainer.querySelectorAll(`.${tabsSelector}`);
        const contents = tabContainer.querySelectorAll(`.${contentsSelector}`);
        tabs.forEach((tab, index) => {
            tab.onclick = () => {
                tabContainer
                    .querySelector(`.${tabActive}`)
                    ?.classList.remove(tabActive);
                tabContainer
                    .querySelector(`.${contentActive}`)
                    ?.classList.remove(contentActive);
                tab.classList.add(tabActive);
                contents[index].classList.add(contentActive);
            };
        });
    });
});

/**
 * JS toggle
 *
 * Cách dùng:
 * <button class="js-toggle" toggle-target="#box" >Click</button>
 * <div id="box">Content show/hide</div>
 */
window.addEventListener("template-loaded", initJsToggle);

function initJsToggle() {
    $$(".js-toggle").forEach((button) => {
        const target = button.getAttribute("toggle-target");
        if (!target) {
            document.body.innerText = `Cần thêm toggle-target cho: ${button.outerHTML}`;
        }
        button.onclick = (e) => {
            e.preventDefault();

            if (!$(target)) {
                return (document.body.innerText = `Không tìm thấy phần tử "${target}"`);
            }
            const isHidden = $(target).classList.contains("hide");

            requestAnimationFrame(() => {
                $(target).classList.toggle("hide", !isHidden);
                $(target).classList.toggle("show", isHidden);
            });
        };
        document.onclick = function (e) {
            if (!e.target.closest(target)) {
                const isHidden = $(target).classList.contains("hide");
                if (!isHidden) {
                    button.click();
                }
            }
        };
    });
}

window.addEventListener("template-loaded", () => {
    const links = $$(".js-dropdown-list > li > a");

    links.forEach((link) => {
        link.onclick = () => {
            if (window.innerWidth > 991) return;
            const item = link.closest("li");
            item.classList.toggle("navbar__item--active");
        };
    });
});

// JS next
const feedbackContainers = document.querySelectorAll(".feedback__container");
const prevButton = document.querySelector(".feedback-action__btn.prev");
const nextButton = document.querySelector(".feedback-action__btn.next");
let currentIndex = 0;

function updateFeedbackDisplay() {
    feedbackContainers.forEach((container, index) => {
        if (index === currentIndex) {
            container.classList.add("feedback__container--active");
        } else {
            container.classList.remove("feedback__container--active");
        }
    });
}

prevButton.addEventListener("click", () => {
    currentIndex =
        (currentIndex - 1 + feedbackContainers.length) %
        feedbackContainers.length;
    updateFeedbackDisplay();
});

nextButton.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % feedbackContainers.length;
    updateFeedbackDisplay();
});

updateFeedbackDisplay();

// let slide = 0;
// const slides = document.querySelectorAll(".partner__inner a");
// const totalSlides = slides.length;

// function showSlide(index) {
//     const partnerInner = document.getElementById("partner");
//     partnerInner.style.transform = `translateX(${-index * 100}%)`;
// }

// function autoSlide() {
//     slide = (slide + 1) % totalSlides;
//     showSlide(slide);
// }

// setInterval(autoSlide, 1000);

// // Initial display
// showSlide(slide);
