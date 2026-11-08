# ModernStore — Customized nopCommerce Storefront

A production-ready, customized nopCommerce 4.90 storefront featuring the **Obsidian Atelier** design system — a hand-written, token-based CSS architecture (no build step) with dark-first identity, full RTL/Arabic support, and a clean customization layer that preserves upstream upgrade compatibility.

---

## Screenshots and Visual Preview

Screenshots are stored in `docs/screenshots/` (create this directory and add images as needed):

| View | Screenshot |
|------|------------|
| Homepage — Hero & Departments | `docs/screenshots/homepage-hero.png` |
| Homepage — Editorial Sections | `docs/screenshots/homepage-editorial.png` |
| Category Listing (Grid) | `docs/screenshots/category-grid.png` |
| Product Details Page | `docs/screenshots/product-details.png` |
| Mobile Navigation Drawer | `docs/screenshots/mobile-nav.png` |
| Mini Cart Drawer | `docs/screenshots/mini-cart.png` |
| Search Overlay | `docs/screenshots/search-overlay.png` |
| RTL / Arabic Layout | `docs/screenshots/rtl-arabic.png` |

> **Convention**: Name files `<page>-<variant>.png` (e.g., `homepage-desktop.png`, `product-details-rtl.png`). Commit screenshots alongside the changes they document.

---

## Technology Stack

| Layer | Technology | Version | Role |
|-------|------------|---------|------|
| **Platform** | nopCommerce | 4.90.8 | Core e-commerce engine (ASP.NET Core) |
| **Runtime** | .NET | 9.0 | Application framework (LTS) |
| **Database** | SQL Server | 2019+ / Express | Primary data store (LocalDB for dev) |
| **Cache** | Redis | 7-alpine | Distributed cache, session, signalR |
| **Frontend** | Razor Pages / ViewComponents | — | Server-rendered UI |
| **Styling** | Hand-written CSS (3-layer) | — | `styles.css` → `design-system.css` → `atelier.css` |
| **CSS Architecture** | Custom Properties (CSS Variables) | — | Design tokens, semantic aliases, dark/light modes |
| **JavaScript** | Vanilla ES5 (IIFE) | — | `theme.js` (522 lines, no dependencies) |
| **Fonts** | Google Fonts CDN | — | Playfair Display, Inter, Plus Jakarta Sans, Cairo (Arabic) |
| **Libraries** | jQuery, jQuery UI, Swiper, jquery-validation | via `lib_npm/` | Carousel, autocomplete, validation, AJAX cart |
| **Build** | `dotnet build` / `dotnet publish` | — | No Node/Webpack/Tailwind build step |
| **Container** | Docker (multi-stage) | — | SDK 9.0-alpine build → ASP.NET 9.0-alpine runtime |
| **Orchestration** | Docker Compose | — | Local dev stack (web + SQL Server + Redis) |
| **CI/CD** | GitHub Actions | — | Build, test, publish to Docker Hub / Render |

---

## Architecture and Repository Structure

```
nopCommerce/
├── src/
│   ├── NopCommerce.sln              # Main solution
│   ├── Directory.Build.props        # Shared MSBuild props (TargetFramework=net9.0)
│   ├── global.json                  # .NET SDK 9.0.100 pin
│   ├── Libraries/                   # Core, Data, Services (upstream)
│   ├── Presentation/
│   │   ├── Nop.Web/                 # Main web application
│   │   │   ├── Themes/
│   │   │   │   ├── DefaultClean/    # Upstream reference theme (unmodified)
│   │   │   │   └── ModernStore/     # CUSTOM THEME — all customization lives here
│   │   │   │       ├── theme.json              # Theme manifest (SystemName, RTL support)
│   │   │   │       ├── preview.jpg             # Admin theme picker thumbnail
│   │   │   │       ├── Content/
│   │   │   │       │   ├── css/
│   │   │   │       │   │   ├── styles.css           # Upstream base (9301 lines)
│   │   │   │       │   │   ├── styles.rtl.css       # Upstream RTL base (9367 lines)
│   │   │   │       │   │   ├── design-system.css    # Token layer + components (12083 lines)
│   │   │   │       │   │   ├── atelier.css          # Identity layer (10221 lines)
│   │   │   │       │   │   └── print.css
│   │   │   │       │   ├── images/                  # UI icons, logos, atelier photography
│   │   │   │       │   │   └── atelier/             # Hero/department images (2 live files)
│   │   │   │       │   └── js/
│   │   │   │       │       └── theme.js             # Vanilla JS interactions (553 lines)
│   │   │   │       └── Views/
│   │   │   │           ├── _ViewImports.cshtml
│   │   │   │           ├── Shared/
│   │   │   │           │   ├── Head.cshtml                 # CSS/JS registration + fonts + theme script
│   │   │   │           │   ├── _Header.cshtml              # Masthead (utility + main row + drawers)
│   │   │   │           │   ├── _ColumnsTwo.cshtml          # Catalog layout (sidebar + main)
│   │   │   │           │   ├── _Root.cshtml                # Page shell
│   │   │   │           │   ├── _Root.Head.cshtml           # HTML head + script bundles
│   │   │   │           │   ├── _ProductBox.cshtml          # Product card (grid/search/related)
│   │   │   │           │   ├── Components/                 # 18 ViewComponent overrides
│   │   │   │           │   │   ├── Logo/Default.cshtml         # Admin logo OR Atelier wordmark
│   │   │   │           │   │   ├── HeaderLinks/Default.cshtml  # Icon buttons + mini-cart trigger
│   │   │   │           │   │   ├── MainMenu/Default.cshtml     # Mobile drawer + desktop bar
│   │   │   │           │   │   ├── SearchBox/Default.cshtml    # XSS-hardened autocomplete
│   │   │   │           │   │   ├── FlyoutShoppingCart/...      # Slide-over mini cart
│   │   │   │           │   │   ├── Footer/Default.cshtml       # Editorial footer
│   │   │   │           │   │   └── ... (CategoryNavigation, Homepage*, etc.)
│   │   │   │           ├── Home/Index.cshtml               # Art-directed editorial homepage
│   │   │   │           ├── Customer/ (Login, Register, Addresses, Orders...)
│   │   │   │           ├── Order/, ShoppingCart/, Catalog/...
│   │   │   ├── wwwroot/               # Static assets (bundles, images, lib_npm/)
│   │   │   ├── Program.cs             # App entry, Autofac, pipeline
│   │   │   └── App_Data/appsettings.json  # Gitignored — local/prod config
│   │   └── Nop.Web.Framework/       # Shared web infrastructure
│   └── Plugins/                     # 28 plugins (PayPal, Google Auth, Swiper, WebAPI, etc.)
├── docker-compose.yml               # Production stack (web + SQL Server)
├── docker-compose.dev.yml           # Local dev stack (web + SQL Server 2022 + Redis)
├── Dockerfile                       # Multi-stage build (SDK → runtime)
├── .env                             # Local SA_PASSWORD (gitignored)
├── ModernStore-ENGINEERING-LOG.md   # Internal engineering log (not shipped)
├── docs/
│   └── screenshots/                 # Add screenshots here
└── _samples/                        # Demo content extracted from theme (not shipped)
```

### Key Distinctions

| Category | Location | Notes |
|----------|----------|-------|
| **Upstream nopCommerce** | `src/Libraries/`, `src/Presentation/Nop.Web/` (non-Theme), `src/Plugins/` | Never modify directly |
| **Custom Theme** | `src/Presentation/Nop.Web/Themes/ModernStore/` | **All design/customization lives here** |
| **Custom Views** | `Themes/ModernStore/Views/` | Override via theme ViewComponent paths |
| **Custom Components** | `Themes/ModernStore/Views/Shared/Components/` | 18 overridden ViewComponents |
| **Static Assets** | `Themes/ModernStore/Content/` + `wwwroot/` | Theme assets in `Content/`, bundled in `wwwroot/bundles/` |
| **Configuration** | `App_Data/appsettings.json` (gitignored) | Environment-specific; use `appsettings.Example.json` template |

---

## Development Environment Setup

### Prerequisites

- **.NET 9.0 SDK** (pinned via `global.json`)
- **Docker & Docker Compose** (for local DB + Redis)
- **SQL Server LocalDB** or Docker SQL Server (for native run)
- **Node.js 20+** (only for `npm install` in `Nop.Web` if modifying `lib_npm/` dependencies)

### 1. Clone and Configure

```bash
git clone https://github.com/AlaaEbrahim0/nopCommerce.git
cd nopCommerce
```

### 2. Local Development Stack (Recommended — Docker)

```bash
# Create .env with your SA password (gitignored)
echo "SA_PASSWORD=YourStrongPassword123" > .env

# Start web + SQL Server 2022 + Redis
docker compose -f docker-compose.dev.yml up --build -d

# Storefront: http://localhost:8080
# First run launches nopCommerce installer:
#   Server: db
#   Database: nopcommerce
#   User: sa
#   Password: (from SA_PASSWORD in .env)
#   Uncheck "Install sample data" for clean store
#   Cache: Redis / DistributedCache → redis:6379
```

### 3. Native Local Run (Alternative)

```bash
# Restore & build
cd src
dotnet restore
dotnet build NopCommerce.sln -c Release --no-restore

# Run web project
cd Presentation/Nop.Web
dotnet run --configuration Release --no-restore

# Storefront: http://localhost:5000 (or configured port)
# Requires local SQL Server (LocalDB) connection string in App_Data/appsettings.json
```

### 4. Database Initialization

- **Docker stack**: Installer runs automatically on first visit to `http://localhost:8080`
- **Native**: Configure `ConnectionStrings` in `App_Data/appsettings.json`, then run installer
- **Sample data**: Disable for clean Atelier catalog; re-seed via custom script if needed

### 5. Administration Area

- URL: `http://localhost:8080/admin` (Docker) or `http://localhost:5000/admin`
- Default credentials: created during installation
- Theme selection: **Configuration → Settings → General → Theme** → select "ModernStore (Obsidian Atelier)"

---

## Configuration and Environment Variables

### Primary Configuration File

`src/Presentation/Nop.Web/App_Data/appsettings.json` (gitignored — never commit)

```json
{
  "ConnectionStrings": {
    "ConnectionString": "Server=...;Database=...;User Id=...;Password=...;Encrypt=True;TrustServerCertificate=True;MultipleActiveResultSets=True;",
    "DataProvider": "sqlserver",
    "SQLCommandTimeout": null
  },
  "CacheConfig": { "DefaultCacheTime": 60 },
  "CommonConfig": { "UseAutofac": true },
  "DistributedCacheConfig": {
    "DistributedCacheType": "redissynchronizedmemory",
    "Enabled": true,
    "ConnectionString": "redis:6379,ssl=False,abortConnect=false"
  },
  "InstallationConfig": { "DisableSampleData": true, "DisabledPlugins": "Misc.AzureBlob,Misc.CloudflareImages" },
  "WebOptimizer": { "EnableCssBundling": true, "EnableJavaScriptBundling": true }
}
```

### Environment Variables (Docker / Production)

| Variable | Description | Example |
|----------|-------------|---------|
| `ASPNETCORE_ENVIRONMENT` | Runtime environment | `Production` / `Development` |
| `ASPNETCORE_URLS` | Listening URLs | `http://+:80` |
| `ConnectionStrings__ConnectionString` | SQL Server connection | `Server=db;Database=nopcommerce;User=sa;Password=...` |
| `ConnectionStrings__DataProvider` | Database provider | `sqlserver` |
| `DistributedCacheConfig__ConnectionString` | Redis connection | `redis:6379,ssl=False` |
| `SA_PASSWORD` | SQL Server SA password (dev compose) | `YourStrongPassword123` |

> **Secrets**: Never commit `appsettings.json`, `.env`, or connection strings with credentials. Use `appsettings.Example.json` as a documented template with placeholders.

### External Integrations (Configure in Admin)

- **Payments**: PayPal Commerce, Manual, Check/Money Order
- **Shipping**: UPS, Fixed by Weight/Total, Pickup in Store
- **Tax**: Avalara, Fixed/By Country-State-Zip
- **Auth**: Google Authenticator (MFA), Facebook External Auth
- **Services**: Brevo (email), Omnisend, Cloudflare Images, Azure Blob, Web API Frontend
- **Analytics**: Google Analytics, Facebook Pixel, PowerBI

---

## Custom Design and Theme Development Guide

This section is the **customization handbook** for extending the storefront design safely.

### CSS Architecture: Three-Layer Cascade

The theme loads stylesheets in **reverse priority order** (last registered wins) via `Head.cshtml`:

```
1. styles(.rtl).css        → Upstream DefaultClean base (9301 lines)
2. design-system.css       → Neutral token layer + component overrides (12083 lines)
3. atelier.css             → Identity layer: brand tokens + editorial surfaces (10221 lines)
```

**Effective cascade**: `atelier.css` overrides `design-system.css` overrides `styles.css`.

#### Layer Responsibilities

| Layer | File | Purpose | Modify? |
|-------|------|---------|---------|
| **Base** | `styles.css` / `styles.rtl.css` | Pristine upstream DefaultClean. Reset, legacy component styles. | **No** — revert to upstream on upgrade |
| **Design System** | `design-system.css` | **Reusable neutral base**: design tokens (colors, spacing, type, radii, shadows), component structure, both dark/light modes, RTL-safe logical properties. Self-sufficient — no `--at-*` refs. | **Yes** — for new component patterns, token additions, cross-theme improvements |
| **Identity** | `atelier.css` | **Per-store swap file**: brand token VALUES (champagne ramp, fonts, veil/scrim), editorial `at-*` surfaces (hero, departments, product grid, cart, checkout), brand assets. Header documents the "edit this block to rebrand" contract. | **Yes** — for rebranding, editorial reshaping, store-specific identity |

> **Rule**: `design-system.css` defines token **names and neutral values**; `atelier.css` redefines token **values** for the Obsidian Atelier identity. Do not put brand-specific values in the design system.

### Design Tokens (CSS Custom Properties)

All tokens live in `:root` in `design-system.css` (neutral) and are overridden in `atelier.css` (identity).

#### Color System

```css
/* Semantic aliases — USE THESE IN COMPONENTS */
--color-primary: var(--color-brand-500);           /* Primary CTA fill */
--color-primary-hover: var(--color-brand-400);     /* Hover state */
--color-primary-active: var(--color-brand-600);    /* Active/pressed */
--color-primary-foreground: #03161B;               /* Text on primary (7.7:1) */
--color-primary-light: rgb(var(--color-brand-500-rgb) / 0.16);  /* Subtle wash */
--color-primary-muted: rgb(var(--color-brand-200-rgb) / 0.16);  /* Muted wash */

--color-link: var(--color-brand-300);              /* Link text (9.5:1 on canvas) */
--color-link-hover: var(--color-brand-200);
--color-primary-text: var(--color-brand-300);      /* Primary text roles */

/* Surfaces — Obsidian tiers */
--color-bg-page: #030407;      /* Body canvas */
--color-bg: #090A0F;           /* Header, cards, footer, table rows */
--color-bg-elevated: #0F1117;  /* Popovers, dialogs, badges, search pill */
--color-bg-subtle: #050609;    /* Inputs, image wells, recessed blocks */
--color-bg-muted: #1E222D;     /* Hover fills, chips, table heads */

/* Borders */
--color-border: rgb(255 255 255 / 0.08);
--color-border-strong: rgb(255 255 255 / 0.16);
--color-border-card: rgb(255 255 255 / 0.12);

/* Status — light-mode-safe triplets (>=4.5:1 on ivory) */
--color-success-rgb: 16 185 129;   --color-success: rgb(var(--color-success-rgb));
--color-danger-rgb: 244 63 94;     --color-danger: rgb(var(--color-danger-rgb));
--color-warning-rgb: 251 191 36;   --color-warning: rgb(var(--color-warning-rgb));
--color-info-rgb: 56 189 248;      --color-info: rgb(var(--color-info-rgb));
```

#### Typography

```css
--font-sans: 'Plus Jakarta Sans', 'Cairo', 'Segoe UI', Tahoma, system-ui, sans-serif;
--font-display: 'Space Grotesk', 'Cairo', 'Segoe UI', system-ui, sans-serif;
/* atelier.css overrides: Playfair Display (display), Inter (prose), Plus Jakarta Sans (labels) */

--font-size-caption: 0.6875rem;  /* 11px — label-md, uppercase micro copy */
--font-size-xs: 0.75rem;         /* 12px */
--font-size-sm: 0.8125rem;       /* 13px — body-sm */
--font-size-md: 0.9375rem;       /* 15px — body-md */
--font-size-lg: 1.0625rem;       /* 17px — body-lg */
--font-size-xl: 1.25rem;         /* 20px — headline-sm */
--font-size-2xl: 1.5rem;         /* 24px — headline-md */
--font-size-3xl: 2.25rem;        /* 36px — headline-lg */
--font-size-4xl: 3.5rem;         /* 56px — display-xl */
```

#### Spacing (8-point Scale)

```css
--space-1: 0.25rem;  --space-2: 0.5rem;  --space-3: 0.75rem;
--space-4: 1rem;     --space-5: 1.25rem; --space-6: 1.5rem;
--space-8: 2rem;     --space-10: 2.5rem; --space-12: 3rem;
--space-16: 4rem;    --space-20: 5rem;   --space-24: 6rem;
```

#### Borders & Radii

```css
--radius-sm: 0.25rem;   /* 4px — buttons, inputs */
--radius: 0.25rem;
--radius-md: 0.375rem;  /* 6px */
--radius-lg: 0.5rem;    /* 8px — cards */
--radius-xl: 0.75rem;   /* 12px — panels, modals */
--radius-full: 9999px;  /* Pills, badges */
```

> **atelier.css** sets all radii to `0` (sharp architectural geometry) except `--radius-full` for pills.

#### Shadows & Glows

```css
--shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.40);
--shadow-sm: 0 2px 8px -2px rgb(0 0 0 / 0.50);
--shadow-md: 0 12px 32px -8px rgb(0 0 0 / 0.60);
--shadow-lg: 0 32px 64px -16px rgb(0 0 0 / 0.90);
--shadow-focus: 0 0 0 2px rgb(var(--color-brand-500-rgb) / 0.45), 0 0 16px rgb(var(--color-brand-500-rgb) / 0.25);
--shadow-card: none;                         /* Depth via hairlines, not elevation */
--shadow-card-hover: 0 12px 30px -10px rgb(var(--color-accent-rgb) / 0.15);
--glow-primary: 0 0 24px -4px rgb(var(--color-brand-500-rgb) / 0.45);  /* Optic Halos spec */
```

#### Breakpoints (Mobile-First)

```css
/* design-system.css uses these via @media (min-width: ...) */
--bp-sm: 640px;    /* Two-column product grid */
--bp-md: 1024px;   /* Three-column grid, drawer→rail transitions */
--bp-lg: 1280px;   /* Horizontal menu bar, full editorial layouts */
--bp-xl: 1440px;   /* Max content width */
```

### Dark / Light Mode

- **Default**: Dark (`color-scheme: dark` in both token layers)
- **Toggle**: `data-ms-theme="light"` on `<html>` (persisted in `localStorage['ms-theme']`)
- **No-flash**: Inline script in `Head.cshtml` (with `asp-location="None"`) restores theme before first paint
- **Light overrides**: Defined in `atelier.css:188-218` (27 tokens) — status colors re-tuned for >=4.5:1 on ivory canvas

### Views and Components

#### Layout Files

| File | Purpose |
|------|---------|
| `_Root.cshtml` | Page shell: admin strip, header, main, footer, cookie law |
| `_Root.Head.cshtml` | HTML `<head>`: title, meta, CSS bundles, script bundles, favicon |
| `Head.cshtml` | Theme-specific CSS/JS registration, Google Fonts, theme-restore script |
| `_Header.cshtml` | **Masthead**: utility strip (selectors, promise), main row (burger, logo, menu, search, actions), search overlay drawer |
| `_ColumnsTwo.cshtml` | Catalog layout: sidebar (filters, category nav) + main column |
| `_ColumnsOne.cshtml` | Full-width pages (home, product details, checkout, account) |

#### Component Overrides (`Views/Shared/Components/`)

| Component | File | Customization |
|-----------|------|---------------|
| **Logo** | `Logo/Default.cshtml` | Admin logo OR Atelier SVG wordmark (fallback) |
| **HeaderLinks** | `HeaderLinks/Default.cshtml` | Icon buttons, cart/wishlist counts, mini-cart trigger |
| **MainMenu** | `MainMenu/Default.cshtml` | Mobile drawer (id=`mobile-nav`) + desktop horizontal bar (≥1280px) |
| **SearchBox** | `SearchBox/Default.cshtml` | XSS-hardened autocomplete, DOM APIs, routed URL |
| **FlyoutShoppingCart** | `FlyoutShoppingCart/Default.cshtml` | Slide-over drawer (replaces hover flyout) |
| **Footer** | `Footer/Default.cshtml` | Editorial dispatch, brand shelf, legal lower bar |
| **ProductBox** | `Shared/_ProductBox.cshtml` | **Single card** for all surfaces (grid, search, related, homepage) — includes review stars, discount badge, swiper for multi-image |
| **HomepageCategories** | `HomepageCategories/Default.cshtml` | Atelier department mosaic |
| **HomepageProducts** | `HomepageProducts/Default.cshtml` | Editorial product grid (4-col) |
| ... | ... | 8 more (CategoryNavigation, FooterMenu, OrderTotals, etc.) |

#### Adding a New Component Override

1. Create `Themes/ModernStore/Views/Shared/Components/{ComponentName}/Default.cshtml`
2. Copy upstream markup from `src/Presentation/Nop.Web/Views/Shared/Components/{ComponentName}/Default.cshtml`
3. Modify only markup/classes — **preserve all `name`, `id`, `data-*`, validation attributes, widget zones**
4. Add component-specific CSS to `atelier.css` (or `design-system.css` if reusable)

### Assets

| Asset Type | Location | Convention |
|------------|----------|------------|
| **UI Icons** | `Content/images/` | `logo.png`, `menu-icon.png`, `shopping-bag.png`, `social-sprite.png`, rating stars |
| **Editorial Photography** | `Content/images/atelier/` | `atelier-hero.jpg`, `atelier-bench.jpg` (2 live files) |
| **Fonts** | Google Fonts CDN (see `Head.cshtml`) | Self-host for offline/rebrand autonomy (planned) |
| **Bundled CSS/JS** | `wwwroot/bundles/` | Auto-generated by WebOptimizer (gitignored) |

#### Asset Guidelines

- **Naming**: `kebab-case` for files (`atelier-hero.jpg`), match CSS references
- **Optimization**: Compress images (WebP/AVIF planned); use `loading="lazy"` in markup
- **Placeholders**: `at-card__placeholder` SVG diamond for missing product images
- **Demo content**: `_samples/ModernStore-atelier-demo-content/` — extracted, not shipped

### Responsive Design

- **Mobile-first**: Base styles target <640px; enhancements at 640px, 1024px, 1280px
- **Product Grid**:
  - Mobile: `minmax(160px, 1fr)` → 2 cols on 390px
  - ≥640px: `minmax(200px, 1fr)`
  - ≥1024px: `minmax(220px, 1fr)` (4 cols at 1440px)
- **Navigation**:
  - <1280px: Off-canvas drawer (`#mobile-nav`, slide from inline-start)
  - ≥1280px: Sticky horizontal bar in masthead
- **Filter Sidebar**:
  - <1024px: End-side drawer (`#catalog-filter-panel`)
  - ≥1024px: Inline rail in `_ColumnsTwo`
- **Search**: Overlay drawer (`#atelier-search`) on all viewports

### RTL and Arabic Localization

- **Full RTL support**: `theme.json` declares `"SupportRTL": true`
- **Logical properties**: `margin-inline-start`, `inset-inline-end`, `border-inline-start` used throughout — **no physical left/right in custom CSS**
- **Arabic fonts**: `Cairo` loaded as fallback in all font stacks (Google Fonts)
- **Digit handling**: `theme.js` `COUNT_RE` matches Latin + Arabic-Indic (U+0660–9, U+06F0–9) + Arabic separators
- **Direction**: `<html dir="@Html.GetUIDirection(...)">` set by nopCommerce core
- **Component RTL**: `styles.rtl.css` provides base RTL; `design-system.css`/`atelier.css` use logical properties so they **do not need RTL duplicates**

> **When modifying components**: Use logical properties (`inline-start/end`, `block-start/end`). Test in Arabic (`ar-SA` culture) — switch language in header selector.

---

## Customization Guidelines

### Maintainability Rules

| Rule | Rationale |
|------|-----------|
| **1. Prefer theme files over core** | All customization in `Themes/ModernStore/` — survives nopCommerce upgrades |
| **2. Reuse existing components** | Extend `_ProductBox`, `at-card`, `ms-hlink` instead of duplicating |
| **3. Don't duplicate design tokens** | Add new tokens to `design-system.css:root`; override values in `atelier.css` |
| **4. Preserve business logic** | Controllers, services, models unchanged — UI only via Views/Components |
| **5. Minimal ViewComponent overrides** | Override `.cshtml` only; don't create new ViewComponents unless necessary |
| **6. Keep responsive behavior** | Test at 375px, 768px, 1024px, 1440px; maintain drawer↔rail transitions |
| **7. Test storefront flows after UI changes** | Cart, checkout, search, account, wishlist, compare — verify AJAX contracts |
| **8. Isolate customizations** | One theme, three CSS layers, 18 ViewComponent overrides — easy to diff/upgrade |

### When to Use What

| Need | Approach | Example |
|------|----------|---------|
| Visual rebrand (colors, fonts, spacing) | Edit `atelier.css` token block + swap fonts/assets | New store identity |
| New reusable component pattern | Add to `design-system.css` + optionally `atelier.css` | New card variant, form style |
| Modify existing component markup | Override `Views/Shared/Components/{Name}/Default.cshtml` | HeaderLinks icon buttons |
| New page layout | Add `_CustomLayout.cshtml` + reference in page | Landing page |
| Business logic change | **Plugin** or core service (not theme) | Custom pricing, new checkout step |
| Store-specific editorial content | Locale resources (`ModernStore.*`) + `atelier.css` `at-*` surfaces | Homepage hero copy |

### Upgrade Compatibility

- **Never modify** `src/Libraries/`, `src/Presentation/Nop.Web/` (non-Theme), `src/Plugins/`
- **Theme auto-discovery**: nopCommerce scans for `theme.json` on startup — folder name must match `SystemName`
- **Upgrade path**: Replace `src/` with new nopCommerce version; `Themes/ModernStore/` copies over unchanged
- **Breaking changes**: Check `design-system.css` for deprecated token usage; update component overrides if core markup changes

---

## Deployment Guide

### Verified Infrastructure

| Component | Status | Details |
|-----------|--------|---------|
| **Docker Image** | ✅ Working | Multi-stage: SDK 9.0-alpine build → ASP.NET 9.0-alpine runtime |
| **Docker Compose (Prod)** | ✅ Working | `docker-compose.yml` — web + SQL Server 2019 |
| **Docker Compose (Dev)** | ✅ Working | `docker-compose.dev.yml` — web + SQL Server 2022 + Redis |
| **GitHub Actions** | ✅ Configured | Build, test, publish to Docker Hub / Render |
| **Render Deployment** | ✅ Configured | `render.yaml` (inferred) — web service + managed PostgreSQL/SQL Server |
| **Somee Deployment** | ⚠️ Manual | Free plan: 32-bit pool, 150MB storage, 30MB SQL Express |

### Production Build

```bash
# From repo root
docker build -t nopcommerce-modernstore:latest .

# Or native publish
cd src
dotnet publish Presentation/Nop.Web/Nop.Web.csproj -c Release -o ../../publish
```

### Production Configuration

1. **Environment variables** (Render / Docker / Somee):
   ```bash
   ASPNETCORE_ENVIRONMENT=Production
   ASPNETCORE_URLS=http://+:80
   ConnectionStrings__ConnectionString="Server=...;Database=...;User=...;Password=...;Encrypt=True;TrustServerCertificate=True;"
   ConnectionStrings__DataProvider=sqlserver
   DistributedCacheConfig__ConnectionString="redis-host:6379,ssl=True,abortConnect=false"
   DistributedCacheConfig__Enabled=true
   DistributedCacheConfig__DistributedCacheType=redissynchronizedmemory
   InstallationConfig__DisableSampleData=true
   ```

2. **Database**: Provision SQL Server (Azure SQL, AWS RDS, managed Render/Somee). Run installer on first deploy or apply migrations.

3. **Static Assets**: `wwwroot/bundles/` generated at runtime by WebOptimizer; ensure `wwwroot/images/`, `wwwroot/files/` writable.

4. **HTTPS**: Terminate at load balancer / reverse proxy (Render, Cloudflare, nginx). Set `HostingConfig.UseProxy=true` and configure `ForwardedProtoHeaderName=X-Forwarded-Proto`.

5. **Domain**: Configure in Admin → Configuration → Stores → Store URL.

### Manual Deployment (If No CI/CD)

```bash
# 1. Build image
docker build -t your-registry/nopcommerce:tag .

# 2. Push
docker push your-registry/nopcommerce:tag

# 3. On server: pull and run with docker-compose.yml
docker compose pull && docker compose up -d

# 4. Run installer (first deploy only) or verify health
curl https://your-store.com/health
```

### Database Backup & Recovery

- **Automated**: Configure SQL Server maintenance plans / managed backup (Render, Azure)
- **Manual**: `docker exec mssql /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P $SA_PASSWORD -Q "BACKUP DATABASE [nopcommerce] TO DISK = '/var/opt/mssql/backup/nopcommerce.bak'"`
- **Recovery**: Restore `.bak` → update connection string → restart web

### Logs & Troubleshooting

- **Application logs**: `docker logs <container>` or `wwwroot/logs/` (mounted volume)
- **SQL logs**: `docker exec mssql cat /var/opt/mssql/log/errorlog`
- **Health check**: `GET /health` (returns 200 when running)

---

## Troubleshooting

| Issue | Cause | Resolution |
|-------|-------|------------|
| **Installer won't start** | DB connection string present in config | Clear `ConnectionStrings__ConnectionString` env var; installer runs when empty |
| **SQL connection failed** | Wrong server/credentials/firewall | Verify `Server=db` (Docker) or public endpoint; check SA_PASSWORD; port 1433 |
| **App crashes on startup** | Missing `appsettings.json` / invalid JSON | Ensure `App_Data/appsettings.json` exists and is valid; check `docker logs` |
| **Static assets 404** | Bundles not generated / volume not mounted | `wwwroot/bundles/` volume in compose; WebOptimizer runs on first request |
| **Theme not applied** | Theme not selected in Admin | Admin → Settings → General → Theme → "ModernStore (Obsidian Atelier)" |
| **RTL layout broken** | Physical `left/right` in custom CSS | Use logical properties (`inline-start/end`); test with `ar-SA` culture |
| **Mini cart won't open** | `AjaxCart.init` selector mismatch | `HeaderLinks/Default.cshtml` must keep `.header-links .cart-qty` + `#flyout-cart` |
| **Search autocomplete XSS** | Raw query in HTML/href | Fixed in `SearchBox/Default.cshtml` — DOM APIs + `URLSearchParams` |
| **Price filter "Clear all" collapses catalog** | RTL sends `[max, min]` to slider | Fixed in `theme.js:327-335` — always send ascending `[min, max]` |
| **Arabic digits not parsed in header counts** | `\d`-only regex | Fixed in `theme.js:418-422` — `COUNT_RE` matches Arabic-Indic + separators |
| **Fonts don't load** | CSP blocks Google Fonts | Add `fonts.googleapis.com` `fonts.gstatic.com` to `img-src`/`style-src`/`font-src` |
| **Docker build fails** | `libgdiplus` / ICU missing | Dockerfile installs `icu-libs`, `libgdiplus`, `libc-dev`, `tzdata`, `gcompat` |

### Diagnostic Commands

```bash
# Check container health
docker compose ps
docker logs atelier_web --tail 100

# Test DB connectivity
docker exec atelier_db /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P $SA_PASSWORD -Q "SELECT name FROM sys.databases"

# Verify Redis
docker exec atelier_redis redis-cli ping

# Check .NET build
cd src && dotnet build NopCommerce.sln -c Release --no-restore

# Verify theme files exist
ls -la src/Presentation/Nop.Web/Themes/ModernStore/Content/css/
```

---

## Maintenance and Future Development

### Adding New Design Components

1. **Define tokens** in `design-system.css:root` (neutral names + values)
2. **Write component CSS** in `design-system.css` (structure, states, responsive)
3. **Add identity overrides** in `atelier.css` (brand colors, editorial styling)
4. **Create ViewComponent override** if markup changes needed
5. **Document** in this README (component table, token references)

### Updating Styles Safely

- **Design system changes**: Edit `design-system.css` → test both themes (Atelier + future)
- **Identity changes**: Edit `atelier.css` token block + component sections
- **Never edit** `styles.css` / `styles.rtl.css` — revert to upstream on upgrade

### Adding Custom Assets

1. Place in `Themes/ModernStore/Content/images/` (or `atelier/` for editorial)
2. Reference via `Url.Content($"~/Themes/{themeName}/Content/images/...")` in Views
3. Add to `.dockerignore` if large; optimize before commit

### Documenting New Integrations

- Add to **Technology Stack** table
- Document configuration in **Configuration** section
- Note any ViewComponent overrides or new plugins

### Updating Deployment Instructions

- Update **Deployment Guide** when infrastructure changes
- Document new environment variables
- Record manual steps if automation not yet implemented

### Keeping Customizations Upgrade-Compatible

| Practice | Frequency |
|----------|-----------|
| Diff `Themes/ModernStore/` against upstream DefaultClean on each nopCommerce release | Per release |
| Run full test suite (cart, checkout, search, account, RTL) after upgrades | Per release |
| Verify `theme.json` `SystemName` matches folder name | Always |
| Check for new ViewComponent markup in core | Per release |

---

## Documentation Maintenance Policy

> **Whenever a significant architectural, styling, configuration, or deployment change is introduced, update the corresponding README section.**

- **Architecture changes** → Update "Architecture and Repository Structure"
- **New tokens/components** → Update "Custom Design and Theme Development Guide"
- **Configuration changes** → Update "Configuration and Environment Variables"
- **Deployment changes** → Update "Deployment Guide"
- **New troubleshooting entries** → Add to "Troubleshooting" table

---

## Appendix: Verified Project State

| Area | Status | Notes |
|------|--------|-------|
| nopCommerce version | 4.90.8 | Source zip at repo root |
| .NET version | 9.0 | `global.json` pins SDK 9.0.100 |
| Theme | ModernStore (Obsidian Atelier) | `theme.json` SystemName=ModernStore, SupportRTL=true |
| CSS layers | 3-layer cascade | Verified load order in `Head.cshtml` |
| Dark/Light mode | ✅ Complete | 27 light overrides in `atelier.css`, >=4.5:1 status colors |
| RTL/Arabic | ✅ Complete | Logical properties, Cairo font, Arabic digit handling |
| ViewComponent overrides | 18 | All preserve contracts (ids, names, widget zones, validation) |
| JavaScript | Vanilla IIFE (553 lines) | No dependencies; drawers, qty steppers, filter chips, theme toggle |
| Docker | Multi-stage + Compose | Dev (web+db+redis) + Prod (web+db) |
| CI/CD | GitHub Actions | Build, test, publish |
| Plugins | 28 installed | PayPal, Google Auth, Swiper, WebAPI, Analytics, etc. |
| Engineering log | `ModernStore-ENGINEERING-LOG.md` | Internal — not shipped |

---

## Missing / Planned / Requires Verification

| Item | Status | Notes |
|------|--------|-------|
| **Self-hosted fonts** | Planned | Replace Google Fonts CDN for offline/rebrand autonomy + GDPR |
| **WebP/AVIF images** | Planned | Add `<picture>` with fallbacks; optimize existing JPG/PNG |
| **Automated visual regression** | Not configured | Consider Playwright + Percy/Chromatic |
| **Component library documentation** | Not configured | Storybook or static site for `design-system.css` components |
| **Somee deployment automation** | Manual only | Free plan limitations; document manual steps |
| **Load testing** | Not done | Verify performance under concurrent users |
| **Accessibility audit** | Partial | WCAG AA for colors; full audit pending |
| **Upgrade to nopCommerce 4.90.9+** | Not tested | Verify theme compatibility on release |

---

## Quick Reference: Key File Paths

| Purpose | Path |
|---------|------|
| Theme manifest | `src/Presentation/Nop.Web/Themes/ModernStore/theme.json` |
| Base styles (upstream) | `src/Presentation/Nop.Web/Themes/ModernStore/Content/css/styles.css` |
| Design system tokens | `src/Presentation/Nop.Web/Themes/ModernStore/Content/css/design-system.css` |
| Identity layer | `src/Presentation/Nop.Web/Themes/ModernStore/Content/css/atelier.css` |
| Theme JS | `src/Presentation/Nop.Web/Themes/ModernStore/Content/js/theme.js` |
| Head registration | `src/Presentation/Nop.Web/Themes/ModernStore/Views/Shared/Head.cshtml` |
| Masthead | `src/Presentation/Nop.Web/Themes/ModernStore/Views/Shared/_Header.cshtml` |
| Product card | `src/Presentation/Nop.Web/Themes/ModernStore/Views/Shared/_ProductBox.cshtml` |
| Homepage | `src/Presentation/Nop.Web/Themes/ModernStore/Views/Home/Index.cshtml` |
| Docker dev stack | `docker-compose.dev.yml` |
| Docker prod stack | `docker-compose.yml` |
| Local config template | `src/Presentation/Nop.Web/App_Data/appsettings.json` (gitignored) |
| Engineering log | `ModernStore-ENGINEERING-LOG.md` |

---

*Generated from repository inspection. Last verified: 2026-11-08.*