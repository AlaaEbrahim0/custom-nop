# Installation

Target: **nopCommerce 4.90** (.NET 9). The theme has **no build step** — CSS/JS are literal
files. The only external runtime dependencies are nop's own `~/lib_npm` assets (Swiper,
jQuery UI — shipped with nop) and Google Fonts (CDN).

## Requirements

- nopCommerce 4.90 running.
- Write access to `src/Presentation/Nop.Web/Themes/`.
- (Optional) Node is **not** required to install or run the theme. `npm run build` is nop's
  app-wide asset pipeline and is unrelated to theme CSS.

## Install (folder copy)

1. Copy the `ModernStore` folder to:
   ```
   src/Presentation/Nop.Web/Themes/ModernStore
   ```
   The folder name **must** equal `theme.json` → `"SystemName": "ModernStore"`, or assets and
   view resolution 404 while the theme still appears in admin.
2. **Restart the application.** nop discovers themes only at startup.
3. Admin → **Configuration → Settings → General common settings** → choose **ModernStore** →
   **Save**.
4. (Per-store) optionally set the store name and logo under **Store information**.

A rebuild is **not** required (theme views are Razor runtime-compiled). If you installed via a
compiled build that precompiled the views, on-disk theme files still shadow them per request.

## Install (admin zip upload)

Admin → **Configuration → Plugins → Upload** accepts a theme zip whose root is a single folder
named `ModernStore/` containing `theme.json`. Upload → the app prompts a restart → select the
theme. (Do not zip `Themes/ModernStore/…` with an extra `Themes` prefix.)

## Verify

- `GET /Themes/ModernStore/Content/css/atelier.css` → 200 (and `design-system.css`,
  `styles.rtl.css` on an RTL store, `Content/js/theme.js`).
- `GET /Themes/ModernStore/preview.jpg` → 200.
- Home page renders with the Obsidian Atelier styling; toggle light/dark; check a category,
  a product, the cart and checkout.
- Ensure dev files are **not** reachable inside the theme (this repo keeps docs in `docs/`,
  samples in `_samples/`, so they are not under `Themes/`).

## Upgrade (nop 4.9x → newer)

- Bump the theme against the new nop version and re-sync `Views/_ViewImports.cshtml` from the
  new core imports.
- `styles.css` / `styles.rtl.css` were forked in place; compare with the new DefaultClean and
  merge only what you changed. (Reverting them to pristine upstream and moving your tweaks
  into a token-driven section is a recommended future cleanup.)
- Clear `wwwroot/bundles/*` (nop's WebOptimizer cache) so regenerated CSS is served.

## Rollback

Switch the store's theme back in Admin → Settings → General (select DefaultClean) — no data
change. Or remove/replace the `ModernStore` folder and restart.

## Uninstall

Select a different theme in admin, then delete `Themes/ModernStore` and restart.

## Notes

- Fonts come from Google Fonts CDN; offline/air-gapped installs lose the typography (self-host
  under `Content/fonts/` to remove the dependency).
- Keep nop's runtime CSS/JS bundling enabled (it is on by default) — the theme ships readable,
  unminified CSS and relies on nop's bundler for production minification.
