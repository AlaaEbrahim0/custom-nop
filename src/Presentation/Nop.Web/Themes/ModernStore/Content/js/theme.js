/* ModernStore theme interactions — vanilla JS, no dependencies.
   Runs after DOM ready; jQuery is not required. */
(function () {
    'use strict';

    // Quantity stepper. This nopCommerce release renders the PDP quantity as a
    // bare <input class="qty-input"> with no controls, so the stepper is layered
    // on at runtime: the input keeps its id, name and validation attributes and
    // is only relocated inside the wrapper, so model binding is untouched.
    // Cart rows are skipped — they already ship .quantity.up/.down controls, and
    // wrapping them produced a duplicate stepper next to the legacy arrows.
    function initQtySteppers(root) {
        var inputs = (root || document).querySelectorAll('input.qty-input');
        Array.prototype.forEach.call(inputs, function (input) {
            if (input.dataset.msStepper) return;
            if (input.closest('.product-quantity')) return;
            input.dataset.msStepper = '1';

            var wrap = document.createElement('div');
            wrap.className = 'qty-stepper';
            input.parentNode.insertBefore(wrap, input);

            var minus = document.createElement('button');
            minus.type = 'button';
            minus.className = 'qty-step';
            minus.setAttribute('aria-label', input.getAttribute('data-ms-decrease-label') || 'Decrease quantity');
            minus.textContent = '−';

            var plus = document.createElement('button');
            plus.type = 'button';
            plus.className = 'qty-step';
            plus.setAttribute('aria-label', input.getAttribute('data-ms-increase-label') || 'Increase quantity');
            plus.textContent = '+';

            wrap.appendChild(minus);
            wrap.appendChild(input);
            wrap.appendChild(plus);

            function value() {
                var n = parseInt(input.value, 10);
                return isNaN(n) || n < 1 ? 1 : n;
            }

            function set(n) {
                input.value = n < 1 ? 1 : n;
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
            }

            minus.addEventListener('click', function () { set(value() - 1); });
            plus.addEventListener('click', function () { set(value() + 1); });
        });
    }

    // Drawers. Two overlays share one controller: the mini cart (#flyout-cart) and
    // the mobile navigation (#mobile-nav), each opened by a trigger that names its
    // target through aria-controls.
    //
    // public.ajaxcart.js:143 does `$(selector).replaceWith(html)` — the whole
    // #flyout-cart element is destroyed and rebuilt on every add/remove, so no
    // listener is bound to a drawer itself and every handler is delegated on
    // document. The open class does live on the drawer root (a page can hold several
    // drawers and only one is open), and the swap observer below re-applies it to the
    // replacement node.
    var DRAWER_LOCK_CLASS = 'ms-drawer-open';
    var DRAWER_STATE_CLASS = 'ms-drawer--open';
    var openDrawerId = null;
    var drawerReturnFocus = null;

    function drawerById(id) {
        return id ? document.getElementById(id) : null;
    }

    function drawerTriggersFor(id) {
        return id ? document.querySelectorAll('[aria-controls="' + id + '"]') : [];
    }

    // A drawer can have several triggers (e.g. the search sheet is opened both from the
    // mobile menu link and the always-visible header icon). aria-expanded must be kept
    // in sync on EVERY trigger, not just the first in document order — otherwise the
    // visible desktop icon reports the opposite state to assistive tech.
    function setTriggersExpanded(id, expanded) {
        Array.prototype.forEach.call(drawerTriggersFor(id), function (trigger) {
            trigger.setAttribute('aria-expanded', expanded);
        });
    }

    function drawerMarkClosed(id) {
        var el = drawerById(id);
        if (el) el.classList.remove(DRAWER_STATE_CLASS);
        setTriggersExpanded(id, 'false');
    }

    function drawerOpen(el) {
        if (!el) return;

        if (openDrawerId) {
            drawerMarkClosed(openDrawerId);
        } else {
            drawerReturnFocus = document.activeElement;
        }

        openDrawerId = el.id;
        document.body.classList.add(DRAWER_LOCK_CLASS);
        el.classList.add(DRAWER_STATE_CLASS);

        setTriggersExpanded(el.id, 'true');

        // The search sheet opens on its input, not on its container.
        var searchInput = el.id === 'atelier-search' ? el.querySelector('#small-searchterms') : null;
        (searchInput || el).focus({ preventScroll: true });
    }

    function drawerClose() {
        if (!openDrawerId) return;

        var id = openDrawerId;
        openDrawerId = null;
        document.body.classList.remove(DRAWER_LOCK_CLASS);
        drawerMarkClosed(id);

        if (drawerReturnFocus && document.contains(drawerReturnFocus)) {
            drawerReturnFocus.focus();
        }
        drawerReturnFocus = null;
    }

    function drawerOnKeydown(event) {
        if (!openDrawerId) return;

        var el = drawerById(openDrawerId);
        if (!el) return;

        if (event.key === 'Escape' || event.key === 'Esc') {
            event.preventDefault();
            drawerClose();
            return;
        }

        if (event.key !== 'Tab') return;

        var focusable = el.querySelectorAll(
            'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );

        if (!focusable.length) {
            event.preventDefault();
            el.focus();
            return;
        }

        var first = focusable[0];
        var last = focusable[focusable.length - 1];

        if (!el.contains(document.activeElement)) {
            event.preventDefault();
            first.focus();
        } else if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    }

    function drawerOnDocumentClick(event) {
        var target = event.target;
        if (!target || !target.closest) return;

        var toggle = target.closest('[data-ms-drawer-toggle]');
        if (toggle) {
            // A cart trigger is a real link to /cart. Modified clicks and non-primary
            // buttons are left to the browser so ctrl/middle click still reaches the
            // cart page, and a visitor without JavaScript still gets a working link.
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;

            var el = drawerById(toggle.getAttribute('aria-controls'));
            if (!el) return;

            event.preventDefault();

            if (openDrawerId === el.id) drawerClose();
            else drawerOpen(el);

            return;
        }

        if (target.closest('[data-ms-drawer-close]')) drawerClose();
    }

    function initDrawers() {
        document.addEventListener('click', drawerOnDocumentClick);
        document.addEventListener('keydown', drawerOnKeydown);

        // The navigation is a horizontal bar from 1280px up; a drawer left open across
        // that boundary would keep the page scroll-locked. The filter sheet and the
        // account sheet are sheets only below 1024px — above it they are the rail.
        window.addEventListener('resize', function () {
            if (openDrawerId === 'mobile-nav' && window.innerWidth >= 1280) drawerClose();
            if (window.innerWidth >= 1024 &&
                (openDrawerId === 'catalog-filter-panel' || openDrawerId === 'account-nav-panel')) drawerClose();
        });

        var cart = drawerById('flyout-cart');
        if (!cart || !cart.parentNode) return;

        var holder = cart.parentNode;
        var swap = new MutationObserver(function (records) {
            for (var i = 0; i < records.length; i++) {
                var added = records[i].addedNodes;
                for (var j = 0; j < added.length; j++) {
                    if (added[j].nodeType === 1 && added[j].id === 'flyout-cart') {
                        // Cart content just changed. If the drawer is already open, keep
                        // it open and move focus into the replacement so a screen reader
                        // does not land on a detached node; if it is closed, open it so
                        // the add is visible.
                        var fresh = drawerById('flyout-cart');
                        if (!fresh) return;

                        if (openDrawerId === 'flyout-cart') {
                            fresh.classList.add(DRAWER_STATE_CLASS);
                            fresh.focus({ preventScroll: true });
                        } else {
                            drawerOpen(fresh);
                        }
                        return;
                    }
                }
            }
        });

        swap.observe(holder, { childList: true });
    }

    // Active-filter chips. The chips are server-rendered inside the AJAX partial, so
    // they always describe the state the last response was built from; clearing one
    // unchecks the control in the filter panel and asks for a new page. Only one
    // getProducts() call per click, so a clear never fires twice.
    function reloadProducts() {
        syncFilterCount();
        if (window.CatalogProducts && typeof window.CatalogProducts.getProducts === 'function') {
            window.CatalogProducts.getProducts();
        }
    }

    // Catalog filter sidebar. The panel is server markup shared with the desktop
    // rail, so this only maintains the mobile chrome: the trigger badge counts
    // checked options, "Clear all" unchecks them and asks the catalog for a fresh
    // page, and the dialog role exists only while the panel actually overlays the
    // page as an end-side drawer.
    function filterSheetPanel() {
        return document.getElementById('catalog-filter-panel');
    }

    function syncFilterCount() {
        var panel = filterSheetPanel();
        var badge = document.querySelector('[data-at-filter-count]');
        if (!panel || !badge) return;

        var count = panel.querySelectorAll('.filter-content input[type="checkbox"]:checked').length;
        badge.textContent = count;
        badge.hidden = count === 0;
    }

    function syncFilterRole() {
        var panel = filterSheetPanel();
        if (!panel || !document.querySelector('.at-filter-trigger')) return;

        if (window.matchMedia('(max-width: 1023.98px)').matches) {
            panel.setAttribute('role', 'dialog');
            panel.setAttribute('aria-modal', 'true');
        } else if (panel.hasAttribute('role')) {
            panel.removeAttribute('role');
            panel.removeAttribute('aria-modal');
        }
    }

    function initCatalogFilterSheet() {
        var panel = filterSheetPanel();
        var trigger = document.querySelector('.at-filter-trigger');

        // A page can call the catalog selectors without rendering the filter panel;
        // a trigger there would open nothing.
        if (!panel || !trigger) {
            Array.prototype.forEach.call(document.querySelectorAll('.at-filter-trigger'), function (el) {
                el.hidden = true;
            });
            return;
        }

        syncFilterRole();
        window.addEventListener('resize', syncFilterRole, { passive: true });

        panel.addEventListener('change', syncFilterCount);
        syncFilterCount();

        var clear = panel.querySelector('[data-at-filter-clear]');
        if (!clear) return;

        clear.addEventListener('click', function () {
            var checked = panel.querySelectorAll('.filter-content input[type="checkbox"]:checked');
            Array.prototype.forEach.call(checked, function (input) {
                input.checked = false;
            });
            resetPriceRange();
            syncFilterCount();
            reloadProducts();
        });
    }

    function resetPriceRange() {
        var $ = window.jQuery;
        if (!$ || !$('#price-range-slider').length) return;

        var $slider = $('#price-range-slider');
        // Guard against calling option/value getters before jQuery UI has
        // initialised the widget: an uninitialised element throws, and this runs
        // inside the Clear-all handler *before* reloadProducts(), so a throw here
        // would leave the checkboxes cleared but the catalog un-refreshed.
        if (!$slider.data('ui-slider')) return;

        var min = parseFloat($slider.slider('option', 'min'));
        var max = parseFloat($slider.slider('option', 'max'));
        if (isNaN(min) || isNaN(max)) return;

        // A full-range reset is the ascending pair [min, max] in BOTH directions.
        // _FilterPriceBox mirrors only its *initial* selection for RTL (toInternal is
        // an involution about the range midpoint), but the slider's own options.min/max
        // are the real bounds, so 'values' always wants the ascending pair. Sending
        // [max, min] in RTL hands jQuery UI a descending range whose width is negative,
        // and the server then clamps From=To=the cheapest price — the whole catalog
        // collapses to one price point and never self-heals (the filter panel is a
        // sibling of .products-wrapper, so the AJAX reload never re-initialises it).
        $slider.slider('values', [min, max]);

        // Programmatic value sets do not fire `slide`, so repaint the read-out by hand.
        if (typeof window.setSelectedPriceRange === 'function') {
            window.setSelectedPriceRange(min, max);
        }
    }

    function initFilterChips() {
        document.addEventListener('click', function (event) {
            var target = event.target;
            if (!target || !target.closest) return;

            var chip = target.closest('[data-ms-clear]');
            if (!chip) return;

            event.preventDefault();

            var name = chip.getAttribute('data-ms-clear');
            if (name === 'price') {
                resetPriceRange();
                reloadProducts();
                return;
            }

            var input = document.getElementById(name);
            if (!input || !input.checked) return;

            input.checked = false;
            reloadProducts();
        });
    }

    // Category navigation disclosure. Sublists are rendered in normal flow and
    // hidden with the hidden attribute, so opening one always pushes the following
    // categories down. There is no absolute positioning to overlap.
    function initCategoryTree() {
        var nav = document.querySelector('.at-category-nav');
        if (!nav) return;

        nav.addEventListener('click', function (event) {
            var toggle = event.target.closest ? event.target.closest('[data-at-category-toggle]') : null;
            if (!toggle || !nav.contains(toggle)) return;

            var list = document.getElementById(toggle.getAttribute('aria-controls'));
            if (!list) return;

            var expanded = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
            list.hidden = expanded;
        });
    }

    // PDP thumb rail. The base view swaps the main image on click but leaves no trace
    // of which thumbnail is showing, so the rail marks it here.
    function initGalleryThumbs() {
        var rail = document.querySelector('.picture-thumbs');
        if (!rail) return;

        var first = rail.querySelector('.thumb-item');
        if (first) first.classList.add('is-active');

        rail.addEventListener('click', function (event) {
            var target = event.target;
            var item = target && target.closest ? target.closest('.thumb-item') : null;
            if (!item || !rail.contains(item)) return;

            var active = rail.querySelectorAll('.thumb-item.is-active');
            Array.prototype.forEach.call(active, function (el) {
                if (el !== item) el.classList.remove('is-active');
            });
            item.classList.add('is-active');
        });
    }

    // nopCommerce writes the cart and wishlist counts as the localized "(3)" string
    // (ShoppingCart/Wishlist.HeaderQuantity) both on page load and on every AjaxCart
    // refresh. The header design wants bare numerals on the icon badge, so strip the
    // parentheses and flag zero counts for CSS to hide.
    // Matches "(N)" / "N" for both Latin and Arabic-Indic digit systems, plus the
    // Arabic decimal/thousands separators (U+066B/U+066C). The previous \d-only pattern
    // silently failed on the RTL storefront this theme supports, leaving "(٣)" as-is
    // and never applying the is-zero hide.
    var DIGIT_CLASS = '0-9\u0660-\u0669\u06F0-\u06F9';
    var SEPARATOR_CLASS = '.,\u066B\u066C';
    var COUNT_RE = new RegExp('^\\(?([' + DIGIT_CLASS + '][' + DIGIT_CLASS + SEPARATOR_CLASS + ']*)\\)?$');
    var STRIP_SEP_RE = new RegExp('[' + SEPARATOR_CLASS + ']', 'g');
    var ZERO_RE = /^[0\u0660\u06F0]+$/;

    function syncHeaderCount(el) {
        var text = (el.textContent || '').trim();
        var match = COUNT_RE.exec(text);
        if (!match) return;

        var digits = match[1];
        if (text !== digits) el.textContent = digits;

        var isZero = ZERO_RE.test(digits.replace(STRIP_SEP_RE, ''));
        if (el.classList.contains('is-zero') !== isZero) el.classList.toggle('is-zero', isZero);
    }

    function initHeaderCounters() {
        var counts = document.querySelectorAll('.header-links .cart-qty, .header-links .wishlist-qty');
        Array.prototype.forEach.call(counts, function (el) {
            syncHeaderCount(el);
            new MutationObserver(function () {
                syncHeaderCount(el);
            }).observe(el, { childList: true, characterData: true, subtree: true });
        });
    }

    // The theme attribute is set before first paint by the inline script in Head.cshtml;
    // this only mirrors it onto the toggle's aria-pressed and flips it on click.
    function initTheme() {
        var root = document.documentElement;
        var buttons = document.querySelectorAll('[data-ms-theme-toggle]');
        if (!buttons.length) return;

        var isLight = function () {
            return root.getAttribute('data-ms-theme') === 'light';
        };

        var sync = function () {
            var pressed = isLight() ? 'true' : 'false';
            Array.prototype.forEach.call(buttons, function (el) {
                el.setAttribute('aria-pressed', pressed);
            });
        };

        Array.prototype.forEach.call(buttons, function (el) {
            el.addEventListener('click', function () {
                root.setAttribute('data-ms-theme', isLight() ? 'dark' : 'light');
                sync();
                try { localStorage.setItem('ms-theme', isLight() ? 'light' : 'dark'); } catch (e) { /* private mode */ }
            });
        });

        sync();
    }

    // The sticky menu pins below the header; the bar is a fixed 80px on desktop but
    // grows with its wrapped rows on narrow screens, so publish the live height.
    function syncHeaderOffset() {
        var header = document.querySelector('.header');
        if (!header) return;
        document.documentElement.style.setProperty('--header-offset', header.offsetHeight + 'px');
    }

    function init() {
        syncHeaderOffset();

        // Below 1024px the menu bar itself is the off-canvas drawer, but it is
        // rendered without an id; the burger's aria-controls names #mobile-nav.
        var menuBar = document.querySelector('.header-menu');
        if (menuBar && !menuBar.id) menuBar.id = 'mobile-nav';

        window.addEventListener('resize', syncHeaderOffset, { passive: true });
        window.addEventListener('load', syncHeaderOffset, { once: true });

        // Shadow on the sticky menu bar once it pins to the top. offsetTop is not a
        // usable threshold here (a sticky element reports the offset it has scrolled
        // to), so ask the box directly where it ended up.
        var menu = document.querySelector('.header-menu');
        if (menu) {
            var onScroll = function () {
                var pinned = menu.getBoundingClientRect().top <= 0 && window.scrollY > 0;
                menu.classList.toggle('is-stuck', pinned);
            };
            window.addEventListener('scroll', onScroll, { passive: true });
            onScroll();
        }

        // Back-to-top button
        var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'ms-back-to-top';
        btn.setAttribute('aria-label', 'Back to top');
        btn.innerHTML = '<span class="ms-back-to-top-icon" aria-hidden="true"></span>';
        btn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
        });
        document.body.appendChild(btn);

        var toggleBtn = function () {
            btn.classList.toggle('is-visible', window.scrollY > 480);
        };
        window.addEventListener('scroll', toggleBtn, { passive: true });
        toggleBtn();
        initQtySteppers(document);
        initDrawers();
        initFilterChips();
        initCatalogFilterSheet();
        initCategoryTree();
        initGalleryThumbs();
        initHeaderCounters();
        initTheme();

        // Wishlist rows and ajax-rendered add-to-cart blocks arrive later.
        var observer = new MutationObserver(function (mutations) {
            for (var i = 0; i < mutations.length; i++) {
                var nodes = mutations[i].addedNodes;
                for (var j = 0; j < nodes.length; j++) {
                    var node = nodes[j];
                    if (node.nodeType !== 1) continue;
                    if (node.matches && node.matches('input.qty-input')) { initQtySteppers(node.parentNode); }
                    else if (node.querySelector && node.querySelector('input.qty-input')) { initQtySteppers(node); }
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
