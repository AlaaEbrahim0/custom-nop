# Design System

Tokens and conventions live in `design-system.css` (defaults + structure) and are
re-pointed by `atelier.css` (the store identity). This page documents the system and how to
change it.

## 1. Token roles

All components consume CSS custom properties from `:root`. Never hard-code a colour in a
component rule — use a token.

### Brand ramp
`--color-brand-{50,100,…,900}-rgb` — RGB **triplets** (e.g. `197 168 128`). The solid
`--color-brand-500` etc. are derived with `rgb(var(--color-brand-*-rgb))`. Change the triplet
once; every fill, border and wash that references it follows.

### Semantic roles (consumed by components)
- Actions: `--color-primary`, `--color-primary-hover`, `--color-primary-active`,
  `--color-primary-text`, `--color-primary-light`, `--color-primary-muted`,
  `--color-primary-foreground`
- Links: `--color-link`, `--color-link-hover`
- Surfaces: `--color-bg-page`, `--color-bg`, `--color-bg-elevated`, `--color-bg-subtle`,
  `--color-bg-muted`, `--color-bg-recess`
- Text: `--color-text`, `--color-text-heading`, `--color-text-muted`, `--color-text-light`
- Borders: `--color-border`, `--color-border-strong`, `--color-border-card`, `--color-border-accent`
- Status: `--color-success`, `--color-danger`, `--color-warning`, `--color-info`, `--color-accent`
  (each with `-rgb` and `-bg`)

### Type, space, geometry
- Fonts: `--font-display` (Playfair Display), `--font-sans` (Inter), `--font-label`
  (Plus Jakarta Sans), each with a Cairo fallback for Arabic.
- Sizes: `--font-size-caption|xs|sm|md|lg|xl|2xl|3xl|4xl`; weights `--font-weight-*`;
  line-heights `--line-height-*`.
- Space scale: `--space-1|2|3|4|5|6|8|10|12|16|20|24`.
- Radii: `--radius-sm…--radius-2xl`, `--radius-full`. The Atelier identity sets these to `0`
  (sharp / architectural) except the functional pill.
- Shadows/transitions: `--shadow-*`, `--transition-fast|base|slow`.
- Layout: `--max-content-width` (1440px), `--page-horizontal-padding`, `--header-height`.

### Chrome primitives (translucency)
`--at-veil-rgb` (wash over canvas), `--at-scrim-rgb` (overlay dim), `--at-shadow-rgb` (depth),
`--at-surface-rgb` (frosted surface). These flip between modes so hairline/wash/overlay
colours derive from one value.

## 2. Dark vs light

Dark is the default identity; light is derived. Light overrides live in one block in
`atelier.css`:

```css
:root[data-ms-theme="light"] { … }
```

Vary only tokens there — architecture is identical. When adding a token that carries colour,
add its light value in that block too.

**Contrast:** status colours are re-tuned in light mode to pass WCAG AA as *text* on the
ivory canvas (verified ratios on `--color-bg` #FBF9F4): danger 6.38, success 5.10,
warning 4.63, info 6.08; accent/champagne text drops to bronze (~6.4). Keep this contract if
you change the palette: a status/tint that looks right on obsidian is usually too light as
text on ivory.

## 3. The two "gold" paths
- `--at-champagne-text` / `--color-brand-300` → readable accent **text** (bronze in light).
- `--at-champagne` / `--color-brand-500` → accent **fill** (champagne in both modes).
Use the `-text` token when the colour sits on a light surface as text.

## 4. Rebranding the palette (the common task)

1. Open `atelier.css`, section `1. TOKENS`.
2. Edit the `--color-brand-*-rgb` triplets (RGB, space-separated) to the client's ramp.
   Keep the documented role comments (300 = readable tint, 500 = CTA fill, 400 = hover).
3. Edit the light-mode block's `--color-brand-300-rgb` / `--color-brand-200-rgb` if the
   brand needs a different readable tint on ivory.
4. Re-check status colours against the new surfaces if you changed surfaces.

You do **not** need to touch component rules — they read the tokens.

## 5. Fonts

Loaded from Google Fonts in `Head.cshtml`:
Playfair Display (display), Inter (prose/data), Plus Jakarta Sans (labels), Cairo (Arabic
fallback), with `display=swap` and `preconnect`. To change typefaces, edit `--font-display` /
`--font-sans` / `--font-label` in `atelier.css` and update the `<link>` request in `Head.cshtml`.

> Note: the Google Fonts CDN is an external dependency (offline/air-gapped stores lose the
> typography). Self-hosting the font files under `Content/fonts/` is a valid improvement but
> out of scope here.

## 6. RTL

- The base layer swaps to `styles.rtl.css` when the store language is RTL
  (`SupportRTL: true` in `theme.json`; selected via `Html.ShouldUseRtlThemeAsync()` in
  `Head.cshtml`).
- The modern layers use logical properties (`margin-inline`, `inset-inline`, `padding-block`)
  plus explicit `[dir="rtl"]` sections in `atelier.css`.
- Arabic gets Cairo in every font stack, with display/label roles swapped for RTL.
- When adding new visual surfaces, use logical properties first; only add `[dir="rtl"]` rules
  for genuinely direction-sensitive effects.
