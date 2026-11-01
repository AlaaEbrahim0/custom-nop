# Customization — rebrand a store & create future themes

This is the practical guide for turning ModernStore into a client store, and for spawning a
**new** theme from this base. It assumes the developer-led workflow: you edit files directly,
no build step, no generators.

---

## A. Rebrand an existing ModernStore store (most common)

You change identity only — never structure.

### A1. Brand colours
Edit `Themes/ModernStore/Content/css/atelier.css`:

- Section **1. TOKENS**, `:root` → the `--color-brand-*-rgb` triplets (RGB, space-separated).
  Keep 300 = readable text tint, 500 = CTA fill, 400 = hover.
- `:root[data-ms-theme="light"]` → the light-mode `--color-brand-300-rgb` / `--color-brand-200-rgb`
  (the readable tint on ivory), and re-check the status colours if you changed surfaces.

That's it — every component reads the tokens. See [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md#4-rebranding-the-palette-the-common-task).

### A2. Logo
Admin → **Configuration → Settings → General common settings → Store information → Logo**.
The header, footer and auth panels render the uploaded logo automatically (via the `Logo`
view component). If no logo is set, the Atelier SVG wordmark shows.

### A3. Store name / wordmark text
Set **Store information → Store name**. When set, the theme shows your store's name (it only
shows the theme's default `OBSIDIAN / ATELIER` wordmark when the name is empty or still the
sample `Your store name`). No file edit required.

### A4. Hero & editorial imagery
Replace the two live images (keep the filenames, or update the two references in
`Views/Home/Index.cshtml`):

```
Content/images/atelier/atelier-hero.jpg     (home hero)
Content/images/atelier/atelier-bench.jpg    (editorial split)
```

Both are referenced by `Views/Home/Index.cshtml` with `~/Themes/{themeName}/...` (rename-safe).

### A5. Homepage feature category
The editorial homepage branches on a "flagship" category. Set it in
`Views/Home/Index.cshtml`, in the `Per-store IDENTITY config` block:

```csharp
const string featureCategorySlug = "the-atelier"; // ← the category URL slug
const string featureCategoryName = "The Atelier"; // ← fallback display-name match
```

Match is by **slug** (rename- and Arabic-safe), falling back to display name. If the store
has no such category, the editorial sections hide and the stock homepage widgets are used.

### A6. Fonts (optional)
To change typefaces, update `--font-display` / `--font-sans` / `--font-label` in
`atelier.css` and the Google Fonts `<link>` in `Head.cshtml`.

### A7. Preview screenshot
Replace `Themes/ModernStore/preview.jpg` with a real screenshot (the admin theme picker and
marketplace listing use it; the shipped one is still the stock nop image).

---

## B. Create a NEW theme from this base (studio workflow)

nopCommerce has **no theme inheritance**, so "reuse the base" means **copy the folder, then
edit the identity**. Do not try to make one theme depend on another.

1. **Duplicate** `Themes/ModernStore` → `Themes/<NewTheme>`
   (folder name must match the new `SystemName`).
2. **`theme.json`**: set
   `"SystemName": "<NewTheme>"`, a new `"FriendlyName"`, `"PreviewText"`, and a new
   `"PreviewImageUrl"` path `~/Themes/<NewTheme>/preview.jpg`. Keep `"SupportRTL": true` if
   you keep RTL support.
3. **Identity**: edit `Content/css/atelier.css` `:root` + light block for the new brand;
   replace the two `atelier/*.jpg` art images; set the client's store name/logo in admin.
4. **Homepage feature category**: set `featureCategorySlug` / `featureCategoryName` in
   `Views/Home/Index.cshtml` (or blank them to use the stock homepage widgets).
5. **Copy/brand words**: the theme still contains Atelier marketing copy in a few views
   (home, auth, checkout rail, header/footer). Search for the brand strings (`Atelier`,
   `Obsidian`, `Maison`, `atelier`) and replace them, or leave the architectural layout and
   only swap the words you care about. (A theme-specific locale/copy system is intentionally
   not included — nop themes can't register locale strings without a DB plugin.)
6. **Rename class prefix if you like** (`at-` → your own) — optional; it's cosmetic. If you
   keep `at-`, future updates to the base are easier to diff.
7. **Restart** the app and select the new theme in Admin → Settings → General.

**Keep the base intact:** the reusable part is `design-system.css` (tokens + structure) +
`theme.js` + the view shells + `_ViewImports` + `_Root`. The *variable* part is `atelier.css`
identity tokens, the art images, and the copy strings. Preserve nop hooks in views exactly.

### What NOT to do
- Don't fork `styles.css` further; put changes in the layers above.
- Don't remove widget zones or nop element ids/names — plugins and core JS break.
- Don't put dev-only files (docs, logs, `.md`/`.txt` manifests, sample imagery) inside
  `Themes/<Theme>/` — nop **publishes and serves the whole theme folder**. Keep them outside
  (this repo keeps docs in `docs/`, samples in `_samples/`).

---

## C. Extending a page (add a view override)

1. Copy the core view from `src/Presentation/Nop.Web/Views/<SameRelativePath>.cshtml`.
2. Paste it at the same relative path under `Themes/<Theme>/Views/`.
3. Change **markup and classes only**. Keep every `asp-for`, `asp-validation-for`,
   `nop-antiforgery-token` (global), element `id`/`name`, `data-*` AJAX attribute and
   `@await Component.InvokeAsync(...)` widget-zone call.
4. Style with tokens / existing `ms-*`/`at-*` classes; avoid inventing parallax JS.
5. Verify: build (`dotnet build src/Presentation/Nop.Web`) catches Razor errors; then click
   through the page (POST forms, AJAX, validation) in the running store.

> The theme currently leaves some heavy POST partials (checkout `Opc*` step bodies,
> product-detail internals) to core **on purpose** — they are styled by the design system and
> keeping them core avoids breaking checkout. Only override them if you need structural change.

---

## D. Adding assets safely

- **Runtime images** (used by views/CSS): `Content/images/…`. Reference from Razor with
  `~/Themes/{themeName}/Content/images/…`.
- **CSS-referenced sprites**: `Content/images/…` via `url('../images/…')` (relative to
  `Content/css/`). Keep the `css/` and `images/` siblings.
- **Dev/demo/sample files**: keep OUT of the theme (they'd be published + publicly served).
- Optimise large hero/editorial images (target ~1400px wide JPEG/WebP); the theme does not
  generate responsive variants automatically for theme-owned images.

---

## E. Deployment recap

Copy the theme folder (or zip-upload) → restart the app → select in admin. See
[INSTALLATION.md](INSTALLATION.md).
