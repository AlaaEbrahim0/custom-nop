# Components

The reusable building blocks. Each view-component override lives at
`Views/Shared/Components/<Name>/Default.cshtml` and is resolved automatically by nop's theme
view engine. Shared partials live under `Views/Shared/`.

To **replace** a component, edit its file in place. To **add** a component, create a nop
view component (C#, in a plugin or the web project) and add your `Default.cshtml` here — the
theme will pick it up by folder name.

## View components (18)

| Component | What it renders | Key hooks to preserve |
|---|---|---|
| `Logo` | Brand: admin logo if set, else the Atelier wordmark. | `LogoModel.LogoPath`, `StoreName`. Falls back to the wordmark when no logo uploaded. |
| `HeaderLinks` | Cart/wishlist/account links + the AJAX-cart init. | Cart selectors passed to `AjaxCart.init`; `#topcartlink`; `cart-qty`/`wishlist-qty`. |
| `FlyoutShoppingCart` | The slide-out mini cart. | `#flyout-cart` (core's AJAX `replaceWith` destroys/rebuilds it). |
| `MainMenu` (`Default`, `_MenuItem`, `.List`, `.Grid`) | Primary navigation. | `public.menu.js` contract: `.menu__item-toggle` is a direct child of `.menu__item`. |
| `FooterMenu` | Footer link columns. | `mainMenu.init` invocation; absolute `_FooterItem` partial path. |
| `CategoryNavigation` | Sidebar category tree with disclosure. | `data-at-category-toggle`, `aria-controls`/`aria-expanded`, sublist ids. |
| `CustomerNavigation` | Account sidebar / mobile sheet. | `.block`/`.title`/`.listbox`; drawer trigger. |
| `SearchBox` | Header/overlay search + autocomplete. | `#small-search-box-form`, `#small-searchterms`, `appendTo: '.search-box'`, jQuery UI autocomplete. Autocomplete builds result nodes with DOM APIs (no HTML injection). |
| `Footer` | Footer bands, social, newsletter, legal, powered-by. | Newsletter component, social buttons, `HidePoweredByNopCommerce`, theme selector, Footer widget zone. |
| `SocialButtons` | Social icon links. | Platform links/classes. |
| `EuCookieLaw` | Cookie consent. | Consent cookie + close hooks. |
| `OrderSummary` | **Cart/order line items + totals trigger.** | Quantity inputs `itemquantity{Id}`, `updatecart`/`removefromcart`/`addtocart`, coupon/gift-card forms, estimate-shipping, checkout button, terms. |
| `OrderTotals` | Totals breakdown. | Core totals markup/ids. |
| `HomepageCategories`, `HomepageProducts`, `HomepageBestSellers`, `HomepageNews`, `HomepagePolls` | Homepage bands. | Each keeps its `Model.Count > 0` guard; empty bands collapse (see below). |

> `HomepageBestSellers` and the `HomepageText` topic block are **not invoked** by this
> theme's homepage (the editorial layout replaces them). Their overrides remain for stores
> that re-enable them.

## Shared partials

| File | Purpose | Notes |
|---|---|---|
| `_Root.cshtml` | Layout: `RenderBody` + BodyStart/ContentBefore/ContentAfter/BodyEnd widget zones, AdminHeaderLinks, Footer, EuCookieLaw. | Don't remove zones — plugins depend on them. |
| `_Header.cshtml` | Masthead: utility strip, wordmark, menu, search overlay, cart. | Invokes Logo/MainMenu/HeaderLinks; `id="mobile-nav"` on the menu (no-JS safe). |
| `_ColumnsTwo.cshtml` | Two-column page layout. | Category page suppresses some left blocks (see backlog). |
| `_ProductBox.cshtml` | The product card used by every listing/band. | Keeps add-to-cart/compare/wishlist hooks; review stars shown when reviews exist. |
| `_ProductBreadcrumb.cshtml` | Product breadcrumb. | Emits its own separators (`ms-crumb__sep`). |
| `_Notifications.cshtml` | Toast/notification + popups. | Keeps `#dialog-notifications-*`, `data-close`, bar-notification hooks. |
| `_Poll.cshtml` | Poll voting block. | Keeps vote ids, antiforgery, `POLL_VOTE` route. |

## Page shells

`Views/{Home,Catalog,Product,Customer,Checkout,Order,ShoppingCart,ReturnRequest}/*.cshtml`
override the matching core pages. They preserve every `asp-for`/`asp-validation-for`,
antiforgery token, element id and widget zone from core. `Checkout/OnePageCheckout.cshtml`
additionally derives its side "protocol" rail from the real checkout steps.

## Empty / loading / error states

- Listing empty state: `_ProductsInGridOrLines.cshtml` (`ms-empty`).
- Cart/wishlist/compare/orders empty states are component-specific.
- Homepage bands self-collapse when their data is empty via
  `atelier.css: .at-journal:not(:has(*)) { display:none }` (same for `.at-poll`,
  `.at-bestsellers`, `.at-departments`).

## Third-party assets

- **Fonts:** Google Fonts (SIL OFL 1.1) loaded from CDN — Playfair Display, Inter, Plus
  Jakarta Sans, Cairo.
- **Icons:** inline SVG throughout (no icon-font dependency).
- **UI icons:** the PNGs in `Content/images/` are nopCommerce's stock set.
- **Demo imagery:** the Atelier hero/editorial JPEGs are the store identity art. AI-generated
  catalog demo shots and their provenance manifest were moved out of the shipped theme to
  `_samples/ModernStore-atelier-demo-content/catalog/` (they are not referenced by the theme).

## Adding a new reusable component — convention

1. Give it a scoped class prefix (`ms-` for structural, `at-` for identity/editorial).
2. Build it from tokens, not raw values.
3. Keep all nop hooks (ids/names/AJAX attributes) if it wraps commerce behaviour.
4. Provide an empty state; don't render a styled band with no content.
5. Test both `data-ms-theme` modes and RTL.
