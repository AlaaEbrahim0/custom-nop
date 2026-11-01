# Troubleshooting

## Theme doesn't appear in Admin → Settings → General
- Folder must be exactly `Themes/ModernStore` and `theme.json`'s `SystemName` must be
  `ModernStore`.
- **Restart the app** — themes are discovered at startup only.
- A second folder with the same `SystemName` can break discovery; remove duplicates.

## Theme selected but unstyled / 404s on `/Themes/ModernStore/...`
- Folder renamed without updating `SystemName` (or vice-versa). The path is
  `~/Themes/{workingThemeName}`; the working theme name must match the folder.
- Views show an error about a missing theme path → the theme wasn't found; confirm it loads.

## CSS changes don't show
- nop's WebOptimizer caches bundles: clear `wwwroot/bundles/*` and hard-refresh.
- Confirm the rule isn't overridden by a later layer (`atelier.css` loads last and wins over
  `design-system.css`). Check the cascade order comment in `Head.cshtml`.

## Brand colour didn't change
- You edited `design-system.css` `:root`. The live palette is in `atelier.css` `:root`, which
  loads after and overrides it. Edit `atelier.css`.

## Light mode looks wrong / low contrast
- Add the light value in `atelier.css` `:root[data-ms-theme="light"]`. A colour tuned for the
  obsidian canvas is usually too light as text on ivory; re-check status colours there.

## Mobile menu is missing
- Without JS the menu relies on `@media (scripting: none)`. If a custom CSS override hides
  `.header-menu`, restore it. The drawer needs `id="mobile-nav"` on `.header-menu` (present).

## Price "Clear all" empties the grid (RTL)
- Fixed: a full reset sets `[min,max]` ascending in both directions. If you see this again,
  a local override has reintroduced a descending range.

## Uploaded logo doesn't show
- The `Logo` component renders the admin logo when `StoreInformationSettings.LogoPictureId`
  is set; otherwise the wordmark. Check **Store information → Logo** is saved; clear cache.

## Search / cart / checkout misbehaves
- The theme preserves nop's element ids and AJAX hooks. If you overrode a page, confirm you
  kept every `asp-for`, id/name, `data-*` attribute and widget-zone call.

## `T("Something")` renders the key
- The locale resource doesn't exist in the DB. Themes can't add locale strings; add them via
  Admin → Languages (or a plugin). Core keys already exist.

## Dev files publicly reachable
- Anything inside `Themes/ModernStore/` is published and served. Keep docs/logs/samples
  outside the theme folder (this repo uses `docs/` and `_samples/`).

## Upgrade broke styling
- `styles.css`/`styles.rtl.css` were forked; a nop upgrade can overwrite them. Re-merge your
  changes (or move them into the upper layers). Re-sync `_ViewImports.cshtml` with core.
