# Verification Matrix

Evidence-based record of what is **actually** checked vs **not tested**. Legend:
**Passed** = executed and observed. **Inspected** = verified by code/build/static analysis
(no runtime). **Not tested** = needs a running store / browser (out of scope here — you run
nopCommerce against a live DB; that's your environment).

## Build & integration

| Check | Result | Evidence |
|---|---|---|
| Theme Razor views compile | **Passed** | `dotnet build src/Presentation/Nop.Web` → EXIT 0, 0 warnings / 0 errors (precompiles `Themes/ModernStore/Views/**`) |
| `theme.json` is valid JSON, schema-exact | **Passed** | parsed with `JSON.parse`; keys match `ThemeDescriptor` |
| `theme.js` is valid JS | **Passed** | `node --check Content/js/theme.js` |
| `theme.js` RTL/regex logic behaves | **Passed** | node unit test: "(3)"→"3", "(٣)"→"٣", "(٠)"→zero, junk→no-op |
| CSS brace balance (design-system, atelier) | **Passed** | `{`/`}` counts equal (1593/1593, 1414/1414) |
| Dark palette unchanged after light-mode work | **Passed** | cascade-aware token resolver: resolved dark map diff IDENTICAL before/after |
| No theme file served from repo-root (docs/samples) | **Passed** | docs in `docs/`, samples in `_samples/` — not under `Themes/` |

## Functional integrity (by inspection)

| Check | Result | Evidence |
|---|---|---|
| Model binding / antiforgery preserved | **Inspected** | Audit diff of every `asp-for`/`asp-validation-for`/antiforgery across all theme views: zero dropped |
| AJAX cart/catalog/poll/notifications DOM hooks | **Inspected** | ids/selectors (`#flyout-cart`, `.cart-qty`, `#poll-block-*`, `#dialog-notifications-*`) retained |
| Store logo shows when configured | **Inspected** | `Logo` override reads `LogoModel.LogoPath`, falls back to wordmark |
| Review stars render | **Inspected** | `_ProductBox` emits `product-rating-box`/`.rating`; styled by `design-system.css:1810` |
| Mobile nav reachable without JS | **Inspected** | `.header-menu` has `id`/`tabindex`; `@media (scripting: none)` reveal |
| RTL price "Clear all" returns full range | **Inspected** | `theme.js` sets `[min,max]`; server clamps descending → fix removes descending input |

## Visual / runtime — NOT TESTED (requires a running store + browser)

| Check | Result | Why |
|---|---|---|
| Page renders as designed (home, category, product, cart, checkout, account) | **Not tested** | No browser run against your DB |
| Dark/light toggle visually correct; no flash | **Not tested** | runtime |
| Responsive layouts; no horizontal overflow | **Not tested** | runtime |
| Add-to-cart, variants, filtering, sorting, checkout, payments | **Not tested** | runtime + payment credentials |
| Contrast ratios pass AA in light mode | **Inspected** (computed), **not** screen-reader tested | ratios computed; axe/VO run not done |
| Screen-reader / keyboard flow | **Inspected** (ARIA present), **not** run | no AT test |

> To close the runtime row: run the store, click the checklist in
> [DEVELOPMENT.md](DEVELOPMENT.md#testing-checklist-manual). Do not point a disposable instance
> at your production DB for checkout tests.

## Known limitations (unchanged this pass, intentional)

- `preview.jpg` still the stock nop image (needs a real screenshot).
- Checkout `Opc*` step bodies, product-detail internals, and informational modules remain
  core-rendered and styled by the design system (deliberate — see ARCHITECTURE §6).
- `styles.css`/`styles.rtl.css` remain forked from upstream (re-sync on nop upgrade).
- Google Fonts is an external CDN dependency.
- Performance and security hardening were **out of scope** for this pass by request.

## Owner actions not performed here (git / secrets / core)
- Rotate the leaked API key; untrack `.qoder/`.
- Revert the 2 contaminated core views; review + commit the staged theme files.
