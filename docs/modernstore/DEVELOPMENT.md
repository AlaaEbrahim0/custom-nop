# Development

## Local workflow

- **No theme build step.** Edit CSS/JS/views in `Themes/ModernStore/` and reload. Views are
  Razor runtime-compiled; CSS/JS are served as files.
- **Compile check for Razor:** the theme's views are precompiled into `Nop.Web`, so a normal
  build validates them and is the fastest way to catch Razor syntax errors:
  ```
  dotnet build src/Presentation/Nop.Web/Nop.Web.csproj
  ```
- **JS syntax check:** `node --check Themes/ModernStore/Content/js/theme.js`.
- **Bundling cache:** after CSS edits, clear `src/Presentation/Nop.Web/wwwroot/bundles/*`
  so nop's WebOptimizer serves the new CSS.
- Restart the app after adding/renaming a theme folder (theme discovery is startup-only).

## Asset pipeline (app-wide, not theme)

`src/Presentation/Nop.Web/package.json` + `gulpfile.js` copy npm dependencies into
`wwwroot/lib_npm` and prepare CLDR. **This does not touch theme CSS.** Do not run
`npm run build` just to change theme styling — and note it deletes/regenerates the committed
`wwwroot/lib_npm`, so avoid it unless you intend to refresh those libs.

## Editing conventions

- Put structural changes in `design-system.css`; identity/brand changes in `atelier.css`;
  don't edit `styles(.rtl).css` unless you must.
- Use tokens, not raw colours.
- Preserve nop contracts in views: `asp-for`, `asp-validation-for`, element ids/names,
  `data-*` AJAX attributes, antiforgery (global via `_Root.Head`), widget-zone invocations.
- Use logical CSS properties (`margin-inline`, `inset-inline`) so RTL keeps working; add
  `[dir="rtl"]` only for direction-specific effects.
- Keep dev-only files (docs, logs, `.md`/`.txt`, samples) **outside** `Themes/` — the theme
  folder is published and served.

## Testing checklist (manual)

Because there is no visual test harness, verify by clicking through a running store:

- [ ] Home: hero, editorial sections, news/polls collapse when empty, HomepageTop widget zone.
- [ ] Category/search: filters, sorting, pagination, price "Clear all" (LTR **and** RTL).
- [ ] Product: gallery, variants/attributes, add to cart, reviews, tabs.
- [ ] Cart: quantities, remove, coupon/gift card, estimate shipping, checkout button.
- [ ] Checkout: billing/shipping steps, payment, confirm (use a test payment method).
- [ ] Account: login, register, addresses, orders, wishlist, compare.
- [ ] Header/footer: menu (incl. mobile drawer without JS), search autocomplete, theme toggle.
- [ ] Both `data-ms-theme` modes; an RTL language; a narrow viewport (no horizontal overflow).

## Debugging tips

- CSS not applying? Confirm load order in `Head.cshtml` (it registers in **reverse**; see the
  comment block). Check `wwwroot/bundles` cache.
- Theme not showing? Folder name ≠ `SystemName`, or the app wasn't restarted.
- View override ignored? Path must match core's exactly; `Shared/` matches controller-agnostic
  partials. A component override must be at `Views/Shared/Components/<Name>/Default.cshtml`.
- `T("…")` shows the raw key? That locale resource isn't in the DB (themes can't register
  their own locale strings; use admin Languages or a plugin).
