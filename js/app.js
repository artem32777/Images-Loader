(() => {
    "use strict";
    const modules_flsModules = {};
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(webP.height == 2);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = support === true ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    let isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function() {
            return isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows();
        }
    };
    function addLoadedClass() {
        window.addEventListener("load", (function() {
            setTimeout((function() {
                document.documentElement.classList.add("loaded");
            }), 0);
        }));
    }
    function getHash() {
        if (location.hash) return location.hash.replace("#", "");
    }
    function fullVHfix() {
        const fullScreens = document.querySelectorAll("[data-fullscreen]");
        if (fullScreens.length && isMobile.any()) {
            window.addEventListener("resize", fixHeight);
            function fixHeight() {
                let vh = window.innerHeight * .01;
                document.documentElement.style.setProperty("--vh", `${vh}px`);
            }
            fixHeight();
        }
    }
    let bodyLockStatus = true;
    let bodyUnlock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            setTimeout((() => {
                for (let index = 0; index < lock_padding.length; index++) {
                    const el = lock_padding[index];
                    el.style.paddingRight = "0px";
                }
                body.style.paddingRight = "0px";
                document.documentElement.classList.remove("lock");
            }), delay);
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    let bodyLock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            for (let index = 0; index < lock_padding.length; index++) {
                const el = lock_padding[index];
                el.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            }
            body.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            document.documentElement.classList.add("lock");
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    function menuInit() {
        if (document.querySelector(".header__burger")) document.addEventListener("click", (function(e) {
            if (bodyLockStatus && e.target.closest(".header__burger")) document.documentElement.classList.toggle("menu-open"); else document.documentElement.classList.remove("menu-open");
        }));
    }
    function menuClose() {
        bodyUnlock();
        document.documentElement.classList.remove("menu-open");
    }
    function functions_FLS(message) {
        setTimeout((() => {
            if (window.FLS) console.log(message);
        }), 0);
    }
    class Popup {
        constructor(options) {
            let config = {
                logging: false,
                init: true,
                attributeOpenButton: "data-popup",
                attributeCloseButton: "data-close",
                fixElementSelector: "[data-lp]",
                youtubeAttribute: "data-popup-youtube",
                youtubePlaceAttribute: "data-popup-youtube-place",
                setAutoplayYoutube: true,
                classes: {
                    popup: "popup",
                    popupContent: "popup__content",
                    popupActive: "popup_show",
                    bodyActive: "popup-show"
                },
                focusCatch: true,
                closeEsc: true,
                bodyLock: true,
                hashSettings: {
                    location: false,
                    goHash: true
                },
                on: {
                    beforeOpen: function() {},
                    afterOpen: function() {},
                    beforeClose: function() {},
                    afterClose: function() {}
                }
            };
            this.youTubeCode;
            this.isOpen = false;
            this.targetOpen = {
                selector: false,
                element: false
            };
            this.previousOpen = {
                selector: false,
                element: false
            };
            this.lastClosed = {
                selector: false,
                element: false
            };
            this._dataValue = false;
            this.hash = false;
            this._reopen = false;
            this._selectorOpen = false;
            this.lastFocusEl = false;
            this._focusEl = [ "a[href]", 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', "button:not([disabled]):not([aria-hidden])", "select:not([disabled]):not([aria-hidden])", "textarea:not([disabled]):not([aria-hidden])", "area[href]", "iframe", "object", "embed", "[contenteditable]", '[tabindex]:not([tabindex^="-"])' ];
            this.options = {
                ...config,
                ...options,
                classes: {
                    ...config.classes,
                    ...options?.classes
                },
                hashSettings: {
                    ...config.hashSettings,
                    ...options?.hashSettings
                },
                on: {
                    ...config.on,
                    ...options?.on
                }
            };
            this.bodyLock = false;
            this.options.init ? this.initPopups() : null;
        }
        initPopups() {
            this.popupLogging(`Проснулся`);
            this.eventsPopup();
        }
        eventsPopup() {
            document.addEventListener("click", function(e) {
                const buttonOpen = e.target.closest(`[${this.options.attributeOpenButton}]`);
                if (buttonOpen) {
                    e.preventDefault();
                    this._dataValue = buttonOpen.getAttribute(this.options.attributeOpenButton) ? buttonOpen.getAttribute(this.options.attributeOpenButton) : "error";
                    this.youTubeCode = buttonOpen.getAttribute(this.options.youtubeAttribute) ? buttonOpen.getAttribute(this.options.youtubeAttribute) : null;
                    if (this._dataValue !== "error") {
                        if (!this.isOpen) this.lastFocusEl = buttonOpen;
                        this.targetOpen.selector = `${this._dataValue}`;
                        this._selectorOpen = true;
                        this.open();
                        return;
                    } else this.popupLogging(`Ой ой, не заполнен атрибут у ${buttonOpen.classList}`);
                    return;
                }
                const buttonClose = e.target.closest(`[${this.options.attributeCloseButton}]`);
                if (buttonClose || !e.target.closest(`.${this.options.classes.popupContent}`) && this.isOpen) {
                    e.preventDefault();
                    this.close();
                    return;
                }
            }.bind(this));
            document.addEventListener("keydown", function(e) {
                if (this.options.closeEsc && e.which == 27 && e.code === "Escape" && this.isOpen) {
                    e.preventDefault();
                    this.close();
                    return;
                }
                if (this.options.focusCatch && e.which == 9 && this.isOpen) {
                    this._focusCatch(e);
                    return;
                }
            }.bind(this));
            if (this.options.hashSettings.goHash) {
                window.addEventListener("hashchange", function() {
                    if (window.location.hash) this._openToHash(); else this.close(this.targetOpen.selector);
                }.bind(this));
                window.addEventListener("load", function() {
                    if (window.location.hash) this._openToHash();
                }.bind(this));
            }
        }
        open(selectorValue) {
            if (bodyLockStatus) {
                this.bodyLock = document.documentElement.classList.contains("lock") ? true : false;
                if (selectorValue && typeof selectorValue === "string" && selectorValue.trim() !== "") {
                    this.targetOpen.selector = selectorValue;
                    this._selectorOpen = true;
                }
                if (this.isOpen) {
                    this._reopen = true;
                    this.close();
                }
                if (!this._selectorOpen) this.targetOpen.selector = this.lastClosed.selector;
                if (!this._reopen) this.previousActiveElement = document.activeElement;
                this.targetOpen.element = document.querySelector(this.targetOpen.selector);
                if (this.targetOpen.element) {
                    if (this.youTubeCode) {
                        const codeVideo = this.youTubeCode;
                        const urlVideo = `https://www.youtube.com/embed/${codeVideo}?rel=0&showinfo=0&autoplay=1`;
                        const iframe = document.createElement("iframe");
                        iframe.setAttribute("allowfullscreen", "");
                        const autoplay = this.options.setAutoplayYoutube ? "autoplay;" : "";
                        iframe.setAttribute("allow", `${autoplay}; encrypted-media`);
                        iframe.setAttribute("src", urlVideo);
                        if (!this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) {
                            this.targetOpen.element.querySelector(".popup__text").setAttribute(`${this.options.youtubePlaceAttribute}`, "");
                        }
                        this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).appendChild(iframe);
                    }
                    if (this.options.hashSettings.location) {
                        this._getHash();
                        this._setHash();
                    }
                    this.options.on.beforeOpen(this);
                    document.dispatchEvent(new CustomEvent("beforePopupOpen", {
                        detail: {
                            popup: this
                        }
                    }));
                    this.targetOpen.element.classList.add(this.options.classes.popupActive);
                    document.documentElement.classList.add(this.options.classes.bodyActive);
                    if (!this._reopen) !this.bodyLock ? bodyLock() : null; else this._reopen = false;
                    this.targetOpen.element.setAttribute("aria-hidden", "false");
                    this.previousOpen.selector = this.targetOpen.selector;
                    this.previousOpen.element = this.targetOpen.element;
                    this._selectorOpen = false;
                    this.isOpen = true;
                    setTimeout((() => {
                        this._focusTrap();
                    }), 50);
                    this.options.on.afterOpen(this);
                    document.dispatchEvent(new CustomEvent("afterPopupOpen", {
                        detail: {
                            popup: this
                        }
                    }));
                    this.popupLogging(`Открыл попап`);
                } else this.popupLogging(`Ой ой, такого попапа нет.Проверьте корректность ввода. `);
            }
        }
        close(selectorValue) {
            if (selectorValue && typeof selectorValue === "string" && selectorValue.trim() !== "") this.previousOpen.selector = selectorValue;
            if (!this.isOpen || !bodyLockStatus) return;
            this.options.on.beforeClose(this);
            document.dispatchEvent(new CustomEvent("beforePopupClose", {
                detail: {
                    popup: this
                }
            }));
            if (this.youTubeCode) if (this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).innerHTML = "";
            this.previousOpen.element.classList.remove(this.options.classes.popupActive);
            this.previousOpen.element.setAttribute("aria-hidden", "true");
            if (!this._reopen) {
                document.documentElement.classList.remove(this.options.classes.bodyActive);
                !this.bodyLock ? bodyUnlock() : null;
                this.isOpen = false;
            }
            this._removeHash();
            if (this._selectorOpen) {
                this.lastClosed.selector = this.previousOpen.selector;
                this.lastClosed.element = this.previousOpen.element;
            }
            this.options.on.afterClose(this);
            document.dispatchEvent(new CustomEvent("afterPopupClose", {
                detail: {
                    popup: this
                }
            }));
            setTimeout((() => {
                this._focusTrap();
            }), 50);
            this.popupLogging(`Закрыл попап`);
        }
        _getHash() {
            if (this.options.hashSettings.location) this.hash = this.targetOpen.selector.includes("#") ? this.targetOpen.selector : this.targetOpen.selector.replace(".", "#");
        }
        _openToHash() {
            let classInHash = document.querySelector(`.${window.location.hash.replace("#", "")}`) ? `.${window.location.hash.replace("#", "")}` : document.querySelector(`${window.location.hash}`) ? `${window.location.hash}` : null;
            const buttons = document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) ? document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) : document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash.replace(".", "#")}"]`);
            if (buttons && classInHash) this.open(classInHash);
        }
        _setHash() {
            history.pushState("", "", this.hash);
        }
        _removeHash() {
            history.pushState("", "", window.location.href.split("#")[0]);
        }
        _focusCatch(e) {
            const focusable = this.targetOpen.element.querySelectorAll(this._focusEl);
            const focusArray = Array.prototype.slice.call(focusable);
            const focusedIndex = focusArray.indexOf(document.activeElement);
            if (e.shiftKey && focusedIndex === 0) {
                focusArray[focusArray.length - 1].focus();
                e.preventDefault();
            }
            if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
                focusArray[0].focus();
                e.preventDefault();
            }
        }
        _focusTrap() {
            const focusable = this.previousOpen.element.querySelectorAll(this._focusEl);
            if (!this.isOpen && this.lastFocusEl) this.lastFocusEl.focus(); else focusable[0].focus();
        }
        popupLogging(message) {
            this.options.logging ? functions_FLS(`[Попапос]: ${message}`) : null;
        }
    }
    modules_flsModules.popup = new Popup({});
    let gotoblock_gotoBlock = (targetBlock, noHeader = false, speed = 500, offsetTop = 0) => {
        const targetBlockElement = document.querySelector(targetBlock);
        if (targetBlockElement) {
            let headerItem = "";
            let headerItemHeight = 0;
            if (noHeader) {
                headerItem = "header.header";
                const headerElement = document.querySelector(headerItem);
                if (!headerElement.classList.contains("_header-scroll")) {
                    headerElement.style.cssText = `transition-duration: 0s;`;
                    headerElement.classList.add("_header-scroll");
                    headerItemHeight = headerElement.offsetHeight;
                    headerElement.classList.remove("_header-scroll");
                    setTimeout((() => {
                        headerElement.style.cssText = ``;
                    }), 0);
                } else headerItemHeight = headerElement.offsetHeight;
            }
            let options = {
                speedAsDuration: true,
                speed,
                header: headerItem,
                offset: offsetTop,
                easing: "easeOutQuad"
            };
            document.documentElement.classList.contains("menu-open") ? menuClose() : null;
            if (typeof SmoothScroll !== "undefined") (new SmoothScroll).animateScroll(targetBlockElement, "", options); else {
                let targetBlockElementPosition = targetBlockElement.getBoundingClientRect().top + scrollY;
                targetBlockElementPosition = headerItemHeight ? targetBlockElementPosition - headerItemHeight : targetBlockElementPosition;
                targetBlockElementPosition = offsetTop ? targetBlockElementPosition - offsetTop : targetBlockElementPosition;
                window.scrollTo({
                    top: targetBlockElementPosition,
                    behavior: "smooth"
                });
            }
            functions_FLS(`[gotoBlock]: Юхуу...їдемо до ${targetBlock}`);
        } else functions_FLS(`[gotoBlock]: Йой... Такого блоку немає на сторінці: ${targetBlock}`);
    };
    let addWindowScrollEvent = false;
    function pageNavigation() {
        document.addEventListener("click", pageNavigationAction);
        document.addEventListener("watcherCallback", pageNavigationAction);
        function pageNavigationAction(e) {
            if (e.type === "click") {
                const targetElement = e.target;
                if (targetElement.closest("[data-goto]")) {
                    const gotoLink = targetElement.closest("[data-goto]");
                    const gotoLinkSelector = gotoLink.dataset.goto ? gotoLink.dataset.goto : "";
                    const noHeader = gotoLink.hasAttribute("data-goto-header") ? true : false;
                    const gotoSpeed = gotoLink.dataset.gotoSpeed ? gotoLink.dataset.gotoSpeed : 500;
                    const offsetTop = gotoLink.dataset.gotoTop ? parseInt(gotoLink.dataset.gotoTop) : 0;
                    if (modules_flsModules.fullpage) {
                        const fullpageSection = document.querySelector(`${gotoLinkSelector}`).closest("[data-fp-section]");
                        const fullpageSectionId = fullpageSection ? +fullpageSection.dataset.fpId : null;
                        if (fullpageSectionId !== null) {
                            modules_flsModules.fullpage.switchingSection(fullpageSectionId);
                            document.documentElement.classList.contains("menu-open") ? menuClose() : null;
                        }
                    } else gotoblock_gotoBlock(gotoLinkSelector, noHeader, gotoSpeed, offsetTop);
                    e.preventDefault();
                }
            } else if (e.type === "watcherCallback" && e.detail) {
                const entry = e.detail.entry;
                const targetElement = entry.target;
                if (targetElement.dataset.watch === "navigator") {
                    document.querySelector(`[data-goto]._navigator-active`);
                    let navigatorCurrentItem;
                    if (targetElement.id && document.querySelector(`[data-goto="#${targetElement.id}"]`)) navigatorCurrentItem = document.querySelector(`[data-goto="#${targetElement.id}"]`); else if (targetElement.classList.length) for (let index = 0; index < targetElement.classList.length; index++) {
                        const element = targetElement.classList[index];
                        if (document.querySelector(`[data-goto=".${element}"]`)) {
                            navigatorCurrentItem = document.querySelector(`[data-goto=".${element}"]`);
                            break;
                        }
                    }
                    if (entry.isIntersecting) navigatorCurrentItem ? navigatorCurrentItem.classList.add("_navigator-active") : null; else navigatorCurrentItem ? navigatorCurrentItem.classList.remove("_navigator-active") : null;
                }
            }
        }
        if (getHash()) {
            let goToHash;
            if (document.querySelector(`#${getHash()}`)) goToHash = `#${getHash()}`; else if (document.querySelector(`.${getHash()}`)) goToHash = `.${getHash()}`;
            goToHash ? gotoblock_gotoBlock(goToHash, true, 500, 20) : null;
        }
    }
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    function uploadSidebar() {
        const allowedTypes = [ "image/jpeg", "image/png", "image/gif", "image/bmp", "image/tif", "image/webp", "image/heic", "image/pdf", "image/jpg", "image/pdf", "image/tiff", " image/heif" ], imageInput = document.querySelector(".upload__input"), uploadArea = document.querySelector(".upload"), previewsContainer = document.querySelector(".previews"), renewBtn = document.querySelector(".upload__renew"), uploadResults = document.querySelector(".results"), resultLinks = document.querySelector(".results__links"), form = document.querySelector(".upload__form"), body = document.documentElement;
        let idCounter = 0;
        let startY = 0;
        let endY = 0;
        let swipeThreshold = 50;
        function uploadClose() {
            body.classList.remove("upload-active");
            body.removeEventListener("touchstart", handleTouchStart, {
                passive: true
            });
            body.removeEventListener("touchend", handleTouchEnd, {
                passive: true
            });
        }
        function handleTouchStart(e) {
            startY = e.touches[0].clientY;
        }
        function handleTouchEnd(e) {
            endY = e.changedTouches[0].clientY;
            let swipeLength = endY - startY;
            if (endY < startY && Math.abs(swipeLength) > swipeThreshold) {
                body.classList.remove("upload-active");
                body.removeEventListener("touchstart", handleTouchStart, {
                    passive: true
                });
                body.removeEventListener("touchend", handleTouchEnd, {
                    passive: true
                });
            }
        }
        body.addEventListener("click", (e => {
            if (e.target.closest(".header__upload-btn") && !body.classList.contains("upload-active") && !body.classList.contains("preload") && !body.classList.contains("uploaded")) {
                body.addEventListener("touchstart", handleTouchStart, {
                    passive: true
                });
                body.addEventListener("touchend", handleTouchEnd, {
                    passive: true
                });
            }
            if (e.target.closest(".header__upload-btn") || e.target.closest(".upload__close")) body.classList.toggle("upload-active"); else if (!e.target.closest(".upload") & !e.target.closest(".popup")) {
                e.stopPropagation();
                uploadClose();
            }
        }));
        window.addEventListener("keydown", (e => e.key === "Escape" && uploadClose()));
        uploadArea.addEventListener("dragover", (e => e.preventDefault()));
        uploadArea.addEventListener("drop", (e => e.dataTransfer.files || e.dataTransfer.files.length ? (e.preventDefault(), 
        handleFiles(e.dataTransfer.files)) : null));
        imageInput.addEventListener("change", (() => {
            if (imageInput.files || imageInput.files.length) {
                handleFiles(imageInput.files);
                body.classList.add("upload-active");
            }
        }));
        document.querySelector(".main").addEventListener("click", (() => {
            imageInput.value = "";
            imageInput.file = [];
            previewsContainer.innerHTML = "";
            body.classList.remove("preload");
            body.classList.remove("uploaded");
            resultLinks.innerHTML = "";
            imageInput.click();
        }));
        const handleFiles = files => {
            files = [ ...files ];
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (!allowedTypes.includes(file.type)) alert(file.name + "Имеет недопустимый формат изображения" + allowedTypes.toString()); else if (file.size > 33554432) alert(file.name + "Имеет недопустимый размер изображения (необходимо менее 32Мб)"); else {
                    const reader = new FileReader;
                    reader.addEventListener("load", (() => {
                        const preview = document.createElement("a");
                        preview.classList.add("previews__item");
                        preview.setAttribute("data-id", idCounter++);
                        preview.setAttribute("target", "_blank");
                        const img = document.createElement("img");
                        img.src = reader.result;
                        img.classList.add("previews__image", "_loading");
                        img.addEventListener("load", (() => img.classList.remove("_loading")));
                        preview.appendChild(img);
                        const deleteButton = document.createElement("button");
                        deleteButton.classList.add("previews__delete", "_icon-xmark");
                        deleteButton.setAttribute("title", "Удалить");
                        preview.appendChild(deleteButton);
                        deleteButton.addEventListener("click", (e => {
                            e.stopPropagation();
                            const preview = e.target.closest(".previews__item");
                            if (preview) {
                                file.delete = true;
                                previewsContainer.removeChild(preview);
                                if (!document.querySelector(".previews__item")) {
                                    imageInput.value = "";
                                    body.classList.remove("preload");
                                }
                                document.querySelectorAll(".page__form").forEach((el => el.dataset.id === preview.dataset.id && document.querySelector(".page__settings-forms").removeChild(el)));
                            }
                        }));
                        const editButton = document.createElement("button");
                        editButton.classList.add("previews__edit", "_icon-edit");
                        editButton.setAttribute("title", "Изменить");
                        const idItem = idCounter - 1;
                        editButton.setAttribute("data-popup", "#popup-" + idItem);
                        preview.appendChild(editButton);
                        previewsContainer.appendChild(preview);
                        editButton.addEventListener("click", (e => {
                            const preview = e.target.closest(".previews__item");
                            if (preview) {
                                const ifCreated = preview.querySelector(".settings");
                                if (!ifCreated) {
                                    const pictureSettings = document.createElement("div");
                                    pictureSettings.classList.add("page__form");
                                    pictureSettings.setAttribute("data-id", idItem);
                                    document.querySelector(".page__settings-forms").appendChild(pictureSettings);
                                    const imgObj = new Image;
                                    imgObj.src = reader.result;
                                    modules_flsModules.popup.open(editButton.dataset.popup);
                                    pictureSettings.innerHTML = `\n                  <div id="popup-${idItem}" aria-hidden="true" class="popup">\n                  <div class="popup__wrapper">\n                    <div class="popup__content">\n                      <button data-close type="button" class="popup__close _icon-xmark" title="Закрыть"></button>\n                      <div class="popup__text settings">\n                        <h3 class="settings__title">Редактировать</h3>\n                        <img class="settings__image" src="${reader.result}">\n                        <form class="settings__form">\n                          <label class="settings__label">\n                            Заголовок <span>(необязательно)</span>\n                            <input class="settings__input" value="${file.name.substring(0, file.name.lastIndexOf("."))}" type="text" name="name[${idItem}]">\n                          </label>\n                          <label class="settings__label settings__label_size">\n                            <p>Изменить размер изображения</p>\n                            <input class="settings__input" value="${imgObj.naturalWidth}" type="number" min="10" max="2000" name="width[${idItem}]" title="Ширина" autocomplete="off">\n                            <input class="settings__input" value="${imgObj.naturalHeight}" type="number" min="10" max="2000" name="height[${idItem}]" title="Высота" autocomplete="off">\n                          </label>\n                          <label class="settings__label">\n                            Описание <span>(необязательно)</span>\n                            <textarea class="settings__input" rows="3" type="text" name="description[${idItem}]" placeholder="краткое описание изображения"></textarea>\n                          </label>\n                          <button class="settings__submit btn" type="submit">Сохранить</button> \n                        </form>\n                      </div>\n                    </div>\n                  </div>\n                  </div>\n                `;
                                    pictureSettings.querySelector(".settings__submit").addEventListener("click", (e => {
                                        e.preventDefault();
                                        const newName = document.querySelector(`input[name="name[${idItem}]"]`).value;
                                        const description = document.querySelector(`textarea[name="description[${idItem}]"]`).value;
                                        const newWidth = document.querySelector(`input[name="width[${idItem}]"]`).value;
                                        const newHeight = document.querySelector(`input[name="height[${idItem}]"]`).value;
                                        const canvas = document.createElement("canvas");
                                        canvas.width = newWidth;
                                        canvas.height = newHeight;
                                        const ctx = canvas.getContext("2d");
                                        ctx.drawImage(imgObj, 0, 0, newWidth, newHeight);
                                        const newBase64 = canvas.toDataURL();
                                        file.settings = {
                                            newBase64,
                                            newName,
                                            description
                                        };
                                        modules_flsModules.popup.close(editButton.dataset.popup);
                                    }));
                                }
                            }
                        }));
                    }));
                    reader.readAsDataURL(file);
                    if (file) {
                        body.classList.add("preload");
                        body.removeEventListener("touchstart", handleTouchStart, {
                            passive: true
                        });
                        body.removeEventListener("touchend", handleTouchEnd, {
                            passive: true
                        });
                    }
                }
            }
        };
        form.addEventListener("submit", (e => {
            e.preventDefault();
            upload();
            document.querySelectorAll(".previews__delete").forEach((el => el.remove()));
            document.querySelectorAll(".previews__edit").forEach((el => el.remove()));
        }));
        async function upload() {
            body.classList.add("_uploading");
            const promises = [];
            for (let i = 0; i < imageInput.files.length; i++) if (!imageInput.files[i].delete) promises.push(fetchImage(imageInput.files[i]));
            const results = await Promise.all(promises);
            const shortLinkS = results.map((result => result.data.url_viewer));
            const fullLinkS = results.map((result => result.data.url));
            renderLinks(shortLinkS, fullLinkS);
        }
        async function fetchImage(img) {
            try {
                const formData = new FormData;
                let fileName = "";
                if (img.settings) {
                    const base64 = img.settings.newBase64;
                    fileName = img.settings.newName;
                    const dataPrefix = "data:";
                    const commaIndex = base64.indexOf(",", base64.indexOf(dataPrefix));
                    const newBase64 = base64.substring(commaIndex + 1);
                    formData.append("image", newBase64);
                } else formData.append("image", img);
                const apiKey = "5adf6814441a623f5157d8a3fe1490eb";
                const url = `https://api.imgbb.com/1/upload?expiration=${expiration}&name=${fileName}&key=${apiKey}`;
                const config = {
                    method: "POST",
                    body: formData
                };
                const response = await fetch(url, config);
                if (response.status === 400) {
                    alert("Ошибка при получением данных от сервера. Вероятно, закончится ключ бесплатного использования. Посмотрите консоль");
                    return;
                }
                const json = await response.json();
                return json;
            } catch (error) {
                alert("Ошибка: " + error);
            }
        }
        async function renderLinks(shortLinkS, fullLinkS) {
            body.classList.add("uploaded");
            body.classList.remove("preload");
            body.classList.remove("_uploading");
            const previewLinks = document.querySelectorAll(".previews__item");
            for (let i = 0; i < previewLinks.length; i++) previewLinks[i].setAttribute("href", shortLinkS[i]);
            resultLinks.innerHTML = shortLinkS.map((el => `<li><a href="${el}" target="_blank">${el}</a></li>`)).join("");
            document.querySelector(".results__select").addEventListener("change", (() => {
                const opt = uploadResults.querySelectorAll("option");
                opt[0].selected ? resultLinks.innerHTML = shortLinkS.map((el => `<li><a href="${el}" target="_blank">${el}</a></li>`)).join("") : opt[1].selected ? resultLinks.innerHTML = fullLinkS.map((el => `<li><a href="${el}" target="_blank">${el}</a></li>`)).join("") : opt[2].selected ? resultLinks.innerHTML = fullLinkS.map((el => `<li>&ltimg src="${el}" alt="01" border="0"></li>`)).join("") : opt[3].selected ? resultLinks.innerHTML = fullLinkS.map((el => `<li>&lta href="${el}">&ltimg src="${el}" alt="01" border="0"></a></li>`)).join("") : opt[4].selected ? resultLinks.innerHTML = shortLinkS.map((el => `<li>&lta href="https://imgbb.com/">&ltimg src="${el}" alt="01" border="0"></a></li>`)).join("") : opt[5].selected ? resultLinks.innerHTML = shortLinkS.map((el => `<li>&lta href="${el}">&ltimg src="${el}" alt="01" border="0"></a></li>`)).join("") : opt[6].selected ? resultLinks.innerHTML = fullLinkS.map((el => `<li>[img]${el}[/img]</li>`)).join("") : opt[7].selected ? resultLinks.innerHTML = shortLinkS.map((el => `<li>[url=${el}][img]${el}[/img][/url]</li>`)).join("") : opt[8].selected ? resultLinks.innerHTML = shortLinkS.map((el => `<li>[url=https://imgbb.com/][img]${el}[/img][/url]</li>`)).join("") : opt[9].selected ? resultLinks.innerHTML = fullLinkS.map((el => `<li>[url=${el}][img]${el}[/img][/url]</li>`)).join("") : null;
            }));
            document.querySelector(".results__copy").addEventListener("click", (function() {
                const elementToCopy = document.querySelector(".results__links").innerHTML;
                const html = elementToCopy.replace(/<li[^>]*>/g, "").replace(/<\/li>/g, "");
                navigator.clipboard.writeText(html);
            }));
        }
        renewBtn.addEventListener("click", (() => {
            previewsContainer.innerHTML = "";
            imageInput.value = "";
            imageInput.file = [];
            resultLinks.innerHTML = "";
            body.classList.remove("preload");
            body.classList.remove("uploaded");
            body.addEventListener("touchstart", handleTouchStart, {
                passive: true
            });
            body.addEventListener("touchend", handleTouchEnd, {
                passive: true
            });
        }));
        let expiration = 0;
        const timeSelect = document.querySelector(".upload__autodelete-time");
        timeSelect.addEventListener("change", (() => {
            const timeOpt = timeSelect.querySelectorAll("option");
            timeOpt[0].selected ? expiration = 0 : timeOpt[1].selected ? expiration = 300 : timeOpt[2].selected ? expiration = 900 : timeOpt[3].selected ? expiration = 1800 : timeOpt[4].selected ? expiration = 3600 : timeOpt[5].selected ? expiration = 10800 : timeOpt[6].selected ? expiration = 21600 : timeOpt[7].selected ? expiration = 43200 : timeOpt[8].selected ? expiration = 86400 : timeOpt[9].selected ? expiration = 259200 : timeOpt[10].selected ? expiration = 604800 : timeOpt[11].selected ? expiration = 1209600 : timeOpt[12].selected ? expiration = 3628800 : timeOpt[13].selected ? expiration = 7257600 : null;
        }));
    }
    uploadSidebar();
    function domainName(url) {
        const result = url.replace(/.*?:\/\//, "").replace(/www./, "").replace(/\..*$/, "");
        return result;
    }
    console.log(domainName("http://github.com/carbonfive/raygun"));
    console.log(domainName("http://www.zombie-bites.com"));
    console.log(domainName("https://www.cnet.com"));
    isWebp();
    addLoadedClass();
    menuInit();
    fullVHfix();
    pageNavigation();
})();