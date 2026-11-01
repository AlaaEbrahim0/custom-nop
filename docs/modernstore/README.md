# ModernStore — nopCommerce 4.90 Theme

A custom, full-override storefront theme for **nopCommerce 4.90** (`.NET 9`). It ships the
**Obsidian Atelier** visual identity by default (dark-first, champagne on obsidian) and is
built so a developer can re-skin it for a different store by editing a small, well-marked
set of files — no build step, no plugins.

## Highlights

- **No build step.** All CSS and JS are hand-written, literal files. The theme runs from a
  folder copy; nothing is compiled for the theme itself.
- **Three-layer CSS cascade:** pristine upstream base → design-system → identity layer.
- **Dark + light modes**, dark by default, persisted and flicker-free.
- **RTL / Arabic**: RTL stylesheet swap for the base layer, logical properties and
  `[dir="rtl"]` rules in the modern layers, Cairo fallback font.
- **Full nopCommerce integration**: theme.json schema-exact for 4.90, view overrides that
  keep every form field / antiforgery / AJAX contract, 18 view-component overrides.

## Technology

| Layer | Files |
|---|---|
| Base (upstream, forked) | `Content/css/styles.css`, `styles.rtl.css`, `print.css` |
| Design system (tokens + components) | `Content/css/design-system.css` |
| Identity layer (per-store brand) | `Content/css/atelier.css` |
| Behaviour | `Content/js/theme.js` (vanilla, 1 IIFE, no global writes) |
| Views | 50+ Razor overrides under `Views/` (components + pages) |

CSS load order (set in `Views/Shared/Head.cshtml`):
`styles(.rtl).css` → `design-system.css` → `atelier.css` (last wins).

## Install (summary)

1. Copy the `ModernStore` folder into `src/Presentation/Nop.Web/Themes/`
   (the folder name **must** equal `theme.json`'s `SystemName`).
2. Restart the application (nop discovers themes at startup).
3. Admin → **Configuration → Settings → General common settings →** pick **ModernStore** → Save.

See **[INSTALLATION.md](INSTALLATION.md)** for the zip-upload path, verification and rollback.

## Rebrand / new store (summary)

Edit **`Content/css/atelier.css`** `:root` (brand ramp) + its light block, replace the logo
via Admin → Store information, and swap the two hero/editorial images. Nothing else is
required. Full walkthrough: **[CUSTOMIZATION.md](CUSTOMIZATION.md)**.

## Documentation

- [ARCHITECTURE.md](ARCHITECTURE.md) — how the theme fits nop 4.90, view resolution, the CSS layers, coverage model, extension points.
- [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md) — tokens, dark/light modes, contrast, RTL.
- [COMPONENTS.md](COMPONENTS.md) — the view components and shared partials you can reuse/replace.
- [CUSTOMIZATION.md](CUSTOMIZATION.md) — rebrand a store, create a new theme from this base, add components/assets safely.
- [INSTALLATION.md](INSTALLATION.md) — install, verify, upgrade, rollback.
- [VERIFICATION.md](VERIFICATION.md) — what was actually checked vs. needs a running store.
- [CHANGELOG.md](CHANGELOG.md) — what changed and why.

## Scope / non-goals

This theme owns **presentation**. Business workflows, integrations, admin features, payment
and shipping belong in nopCommerce plugins, not here. Performance tuning and security review
are intentionally out of scope for this documentation pass.

## License

The theme is distributed under the repository's nopCommerce Public License (AGPLv3 + the
"Powered by nopCommerce" attribution, which is kept gated by the admin `HidePoweredByNopCommerce`
flag in the footer — do not strip that gate). Third-party image/font provenance is noted in
`_samples/ModernStore-atelier-demo-content/catalog/SOURCES.txt` and in [COMPONENTS.md](COMPONENTS.md#third-party-assets).
