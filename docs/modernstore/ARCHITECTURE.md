# Architecture

ModernStore is a standard nopCommerce 4.90 theme. It does **not** modify nopCommerce core.
This document explains how the pieces fit so you can extend it without breaking it.

## 1. How nopCommerce resolves a theme

- A theme is a folder under `src/Presentation/Nop.Web/Themes/<SystemName>/` containing
  `theme.json`. nop scans for `theme.json` **at startup** (recursively) — a new theme or a
  renamed folder needs an **application restart** to be discovered.
- `theme.json` fields are exactly nop's `ThemeDescriptor`: `SystemName`, `FriendlyName`,
  `SupportRTL`, `PreviewImageUrl`, `PreviewText`. There is **no version or compatibility
  field**; a theme zip has no version gate. Keep the target nop version in `PreviewText`.
- The **folder name must equal `SystemName`** (`ModernStore`). Assets are addressed as
  `~/Themes/{workingThemeName}/...`; the theme uses the working theme name (not a literal)
  so folder renames don't 404.
- **View resolution:** a theme overrides a core view by placing a file at the *same relative
  path* under `Themes/ModernStore/Views/`. Missing views fall back to core `Nop.Web/Views/`.
  `Views/Shared/` also matches controller-agnostic partials. There is **no theme inheritance**
  in nop — a theme only overrides its own files then falls back to core.
- `Views/_ViewImports.cshtml` is a byte-faithful copy of **core's** imports (not
  DefaultClean's, which is stale). Keep it in sync with core on nop upgrades.

## 2. CSS architecture (the important part)

Three layers, loaded in this order (set in `Views/Shared/Head.cshtml`):

```
styles(.rtl).css   →   design-system.css   →   atelier.css
(upstream base)        (tokens + components)    (per-store identity)
```

How the order is produced: `NopHtml.AppendCssFileParts` **inserts at index 0**, so the file
registered *last* in `Head.cshtml` renders *last* and wins. `Head.cshtml` registers them in
reverse (`atelier` first, `styles` last). Read the comment block at the top of `Head.cshtml`
before reordering — it is easy to invert by accident.

| Layer | Owns | Edit it to… |
|---|---|---|
| `styles.css` / `styles.rtl.css` | Upstream base rules, forked in place (tokenised). | **Usually don't.** New rules belong in the layers above. Revert-to-upstream is a known backlog item. |
| `design-system.css` | Design tokens (`:root`) + all component structure + both light/dark primitives. | Change structure/layout/components. |
| `atelier.css` | **The per-store identity**: brand ramp re-point, fonts, editorial `at-*` surfaces. | **Rebrand a store** (edit its `:root` + light block). |

**Token authority:** `design-system.css` declares the default token set; `atelier.css`
loads after and re-points the brand palette (`--color-brand-*-rgb`) and a few chrome
primitives (`--at-veil/scrim/shadow/surface-rgb`) to the active identity. To change the
store's brand colour, **edit `atelier.css`'s `:root`** — editing the brand values in
`design-system.css` has no visible effect.

The solid colours are derived (`--color-danger: rgb(var(--color-danger-rgb))`), so you change
**one `-rgb` triplet** and every fill/wash/text that uses it follows, in both modes.

## 3. Dark / light modes

- The `<html>` element carries `data-ms-theme="dark"|"light"`. **Dark is the default and the
  identity**; light is derived.
- A tiny inline script in `Head.cshtml` (`asp-location="None"`) applies the saved choice
  **before first paint** (no flash). It reads `localStorage['ms-theme']`.
- `theme.js` flips the attribute and mirrors `aria-pressed` on the toggle; persistence is the
  same `localStorage` key shared with the inline script.
- Light values live in `atelier.css` `:root[data-ms-theme="light"]`. Status colours are
  re-tuned there for AA contrast on the ivory canvas — see [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md).

## 4. JavaScript

`Content/js/theme.js` — one IIFE, `'use strict'`, no global writes, loaded in the footer.
It depends on a few core globals only (`CatalogProducts`, `jQuery` + jQuery UI for the price
slider, `setSelectedPriceRange`). It is AJAX-safe: delegated handlers and a `MutationObserver`
re-bind for the flyout cart and quantity steppers after nop's AJAX re-renders. No third-party
JS is vendored in the theme; Swiper/jQuery UI come from nop's `~/lib_npm`.

## 5. View components & shared partials

The theme overrides 18 nop view components (same folder name + `Default.cshtml`) and shared
partials such as `_ProductBox`, `_Header`, `_Notifications`, `_Poll`. See
[COMPONENTS.md](COMPONENTS.md). Because these sit at the theme-prefixed component paths,
nop's view engine resolves them automatically.

## 6. Coverage model — "full override" in nop terms

nopCommerce themes fall back to core views for anything they don't override; that is the
supported model, not a defect. ModernStore therefore:

- **Overrides the page shells and chrome** that carry the Atelier design (home, catalog,
  product, checkout entry, account, cart components, header/footer, auth).
- **Restyles core-rendered markup via `design-system.css`/`atelier.css`** for the rest
  (core partials such as the checkout `Opc*` step bodies, product-detail internals, and
  low-traffic informational pages). These render inside the theme's page shells and inherit
  the design system's inputs, tables, buttons, spacing and colour.

This keeps all nopCommerce form/AJAX/antiforgery contracts intact (a benefit: overriding
heavy POST partials is where themes usually break checkout). To convert a specific
core-rendered surface into theme markup, add a view at the same relative path under
`Themes/ModernStore/Views/` and keep **every** form field, validation attribute, element id
and AJAX hook unchanged — see [CUSTOMIZATION.md](CUSTOMIZATION.md#extending-a-page).

### Known coverage / cosmetic backlog
- `preview.jpg` is still DefaultClean's stock image (replace with a real screenshot).
- `_ColumnsTwo.cshtml` suppresses Manufacturer / Recently-viewed / Popular-tags blocks on
  category pages by design (restore if you want them).
- Homepage editorial sections are gated on a configurable feature-category slug (see
  Customization); on a store without that category they hide and the stock homepage widgets
  are the fallback.

## 7. Where things live (map)

```
Themes/ModernStore/
  theme.json                     theme metadata (SystemName must == folder)
  preview.jpg                    admin picker thumbnail
  Views/
    _ViewImports.cshtml          copy of CORE imports (keep in sync on upgrade)
    Shared/Head.cshtml           CSS/JS registration + no-flash theme script + fonts
    Shared/_Root.cshtml          layout contract (RenderBody + widget zones)
    Shared/_Header.cshtml        masthead; invokes Logo/MainMenu/HeaderLinks
    Shared/_ColumnsTwo.cshtml    two-column layout
    Shared/_ProductBox.cshtml    the catalog card used everywhere
    Shared/Components/<Name>/    view-component overrides (18)
    Home/ Catalog/ Product/ Customer/ Checkout/ Order/ ShoppingCart/ ReturnRequest/
  Content/
    css/{styles,styles.rtl,design-system,atelier,print}.css
    js/theme.js
    images/                      UI icons (from core) + atelier/ (2 live art images)
```

## 8. Out of scope (by design)

Payments, shipping, integrations, business workflows, admin features → **plugins**, not the
theme. Performance and security hardening are not covered by these docs.
