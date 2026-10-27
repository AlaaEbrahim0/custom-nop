/* ModernStore theme interactions — vanilla JS, no dependencies.
   Runs after DOM ready; jQuery is not required. */
(function () {
    'use strict';

    function init() {
        // Shadow on the sticky menu bar once it pins to the top
        var menu = document.querySelector('.header-menu');
        if (menu) {
            var onScroll = function () {
                menu.classList.toggle('is-stuck', window.scrollY > menu.offsetTop);
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
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
