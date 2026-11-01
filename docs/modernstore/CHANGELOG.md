# Changelog

## [Unreleased] — stabilization pass

Stability/correctness fixes, light-mode completeness, and de-branding cleanup. No
performance or security changes in this pass (explicitly out of scope for this round).

### Fixed
- **RTL price filter "Clear all"** collapsed the catalogue to the single cheapest price and
  never recovered; a full reset is now the ascending `[min,max]` in both directions, with a
  slider-init guard so clearing can't abort the catalogue refresh.
- **Search autocomplete DOM-XSS**: result/"view all" links and thumbnails are built with DOM
  APIs + `URLSearchParams`; the raw query is never spliced into HTML or an `href`; the search
  URL is routed instead of hardcoded.
- **Store logo restored**: new `Logo` view-component override renders the admin-uploaded logo
  when configured, otherwise the Atelier wordmark.
- **Mobile navigation works without JavaScript**: `.header-menu` carries `id="mobile-nav"` and
  a `@media (scripting: none)` reveal; previously it depended on `theme.js`.
- **Review stars restored** on the shared product card (shown when reviews exist).
- **Checkout side rail** derives its step numbers from the real checkout steps (respects the
  disable-billing-address option).
- **Breadcrumb** double separator removed for the product breadcrumb.
- **Footer block accordion** is scoped to the footer (no longer hijacks drawer headings).
- **`aria-expanded`** is kept in sync on every trigger of a drawer (not just the first).
- **Header count regex** handles Arabic-Indic digits (the RTL storefront no longer leaves
  `(٣)` unformatted).
- **Quantity stepper** buttons have accessible names and are no longer `aria-hidden` while
  focusable.
- **Light-mode contrast**: status colours (success/danger/warning/info) and accent are
  re-tuned in `atelier.css` to meet WCAG AA as text on the ivory canvas. The resolved dark
  palette is unchanged (verified).

### Changed / de-branding
- **Homepage feature-category** is now a documented, editable slug constant (matched by slug,
  RTL/rename-safe) instead of a buried literal category name; hardcoded theme-name image paths
  use the working theme name.
- **Wordmark fallback finished**: a store with its own name no longer shows a stray
  `ATELIER`; the header, footer and auth panels use the shared `Logo` component.
- **`theme.json`** metadata corrected (removed the stale "Tailwind" / "built on DefaultClean"
  claims; declares nopCommerce 4.90, hand-written token CSS, Obsidian Atelier identity, RTL).
- **Demo assets and log moved out of the served theme**: the 20 orphan Atelier catalogue
  images + `SOURCES.txt` now live in `_samples/ModernStore-atelier-demo-content/`; the
  engineering log lives at the repo root (`ModernStore-ENGINEERING-LOG.md`). The theme folder
  no longer publicly serves them.
- Reverted an over-engineered attempt to move shared chrome primitives into the base sheet;
  the cascade remains `styles → design-system → atelier` where `atelier.css` owns the identity
  palette.

### Documentation
- Added this documentation set under `docs/modernstore/`.

### Known limitations (not changed)
- `preview.jpg` is still the stock nop image.
- Some heavy POST partials (checkout `Opc*` step bodies, product-detail internals) and
  low-traffic informational pages remain core-rendered and are styled by the design system
  rather than overridden — this is intentional to protect nopCommerce form/AJAX contracts.
- The base `styles.css` / `styles.rtl.css` remain forked from upstream (merge on nop upgrade).
- Google Fonts is an external CDN dependency.

### Owner actions required (not performed by tooling)
- Rotate the API key that was committed to `.qoder/settings.local.json`, and untrack `.qoder/`.
- Revert the two core views that were modified in the repo's first commit
  (`Nop.Web/Views/Shared/_Header.cshtml`, `Nop.Web/Views/Home/Index.cshtml`).
- Review and commit the staged theme changes; gitignore `_samples/`, screenshots, design-source
  archives and the nop source zip.
