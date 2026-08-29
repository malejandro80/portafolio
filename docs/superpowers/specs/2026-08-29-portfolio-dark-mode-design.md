# Portfolio Dark Mode Design Spec

## Overview

Add dark mode to the static portfolio site (`index.html`, deployed via GitHub Actions to
`malejandro80.github.io/portafolio/`), matching the palette and behavior already implemented in the
Astro blog (`thoughtsBlog`). The mechanism reuses the existing CSS-variable theming in `css/premium.css`
and needs no changes to the light theme.

- Mechanism: a `[data-theme="dark"]` scope in a new `css/theme-dark.css` overrides the palette variables
  redefined by `premium.css` plus targeted rules for hardcoded light values.
- Toggle: a sun/moon button in the navbar, same look as the blog.
- Persistence: `localStorage`; OS `prefers-color-scheme` respected on first visit; no flash of the wrong
  theme (inline `<head>` script runs before paint).
- No-JS visitors keep the light theme (CSS defaults are light).

## Dark Palette (identical to thoughtsBlog)

| Token (`premium.css` var name) | Light (current) | Dark override |
|---|---|---|
| `--bg-dark` | `#f8fafc` | `#0f172a` |
| `--bg-surface` | `#ffffff` | `#1e293b` |
| `--bg-surface-hover` | `#f1f5f9` | `#334155` |
| `--text-main` | `#0f172a` | `#f1f5f9` |
| `--text-muted` | `#64748b` | `#94a3b8` |
| `--accent-primary` | `#046bd2` | `#3b82f6` |
| `--accent-secondary` | `#26b7cd` | `#22d3ee` |
| `--accent-gradient` | … | `linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))` |
| `--glass-border` | `rgba(255,255,255,0.8)` | `rgba(255,255,255,0.06)` |
| `--glass-border-darker` | `rgba(0,0,0,0.05)` | `rgba(0,0,0,0.45)` |
| `--glass-shadow` | `0 20px 40px -15px rgba(0,0,0,0.05)` | `0 20px 40px -15px rgba(0,0,0,0.45)` |

## Files

| File | Action | Purpose |
|---|---|---|
| `css/theme-dark.css` | Create | `[data-theme="dark"]` palette + targeted overrides |
| `index.html` | Modify | Inline no-flash script in `<head>`, link to `theme-dark.css`, toggle button in navbar |
| `js/main.js` | Modify | Toggle click handler, button state init, persistence, meta theme-color sync |
| `css/premium.css` | Modify | Base styles for `.theme-toggle` button (works in both themes) |

## Implementation Details

### 1. `css/theme-dark.css`

Everything scoped under `[data-theme="dark"]`:

- Redefine the palette variables listed above (same variable names as `premium.css` so the cascade
  overrides them).
- `body::before` grid pattern → `linear-gradient(rgba(59,130,246,0.05) 1px, transparent 1px)` (both axes).
- `.navbar-b` → `background: rgba(15,23,42,0.85)`, `border-bottom: var(--glass-border-darker)`,
  `box-shadow: 0 4px 30px rgba(0,0,0,0.3)`; `.navbar-b.navbar-reduce` → `rgba(15,23,42,0.9)`.
- `.box-shadow-full, .service-box, .work-box` → `background: rgba(30,41,59,0.85)`, `border: var(--glass-border)`,
  `box-shadow: var(--glass-shadow)`; `:hover` → `rgba(30,41,59,0.96)`, shadow `rgba(0,0,0,0.5)`.
- `.quote-card` (inline `index.html` style `#255`) uses a hardcoded `background: rgba(255,255,255,0.95) !important`.
  An inline `!important` cannot be overridden by any stylesheet rule, so `index.html` is edited to replace the
  hardcoded white with a variable: `background: var(--bg-surface) !important` (value identical in light mode).
- Quote avatar (`index.html` `#264`, inline `border: 6px solid #fff`) → `border: 6px solid var(--bg-surface)`.
- `.about-img img` → `border: 8px solid rgba(255,255,255,0.1)`, `box-shadow: 0 20px 40px rgba(0,0,0,0.35)`.
- `.work-img[style*='min-height']::after` shimmer → `rgba(255,255,255,0.08)`.
- Scrollbar → track `var(--bg-dark)`, thumb `#334155` (hover `var(--accent-primary)`).
- Accent-blue tints (`rgba(4,107,210,…)`) are left untouched; they read fine on the dark background.

### 2. `index.html` `<head>`

- Add the inline no-flash script immediately after the `<meta charset>` line, before the theme CSS link:

```html
<script>
  (function () {
    var t;
    try { t = localStorage.getItem('theme'); } catch (e) {}
    if (!t) t = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.documentElement.dataset.theme = t;
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = t === 'dark' ? '#0f172a' : '#f8fafc';
  })();
</script>
```

- Add `<link href="css/theme-dark.css" rel="stylesheet" />` after `css/premium.css` (line ~81).
- Change `<meta name="theme-color" content="#046bd2" />` to `content="#f8fafc"` (the script syncs it at
  runtime to `#f8fafc` / `#0f172a`).
- Swap the two hardcoded inline whites for variables (see Section 2): the `.quote-card` background/border
  (line ~255) and the quote avatar border (line ~264). Both render identically in light mode.

### 3. Toggle button (navbar)

Inside `.navbar-collapse` (`#navbarDefault`), after the closing `</ul>` (line ~126), add:

```html
<button class="theme-toggle" id="theme-toggle" type="button" aria-label="Toggle theme" aria-pressed="false">
  <svg class="icon-sun" ...>...</svg>
  <svg class="icon-moon" ...>...</svg>
</button>
```

Same sun/moon SVGs as the blog's `Header.astro`.

### 4. `css/premium.css` — `.theme-toggle` base styles

Pill button `2.25rem`, `background: var(--bg-surface-hover)`, `border: 1px solid var(--glass-border)`,
color `var(--text-main)`, hover accent, `:focus-visible` ring, `.icon-moon` hidden by default and
`.is-dark .icon-sun` hidden / `.is-dark .icon-moon` shown,
`@media (prefers-reduced-motion: reduce) { transition: none }`.

### 5. `js/main.js` — toggle logic

Append a vanilla-JS IIFE:

1. `updateButton(theme)` → `aria-pressed`, `classList.toggle('is-dark', theme === 'dark')`.
2. `setTheme(theme)` → set `document.documentElement.dataset.theme`, `localStorage.setItem('theme', theme)`
   (inside try/catch), sync `#theme-color` meta.
3. Init state from `document.documentElement.dataset.theme || 'light'`.
4. Click handler flips between `dark`/`light`.

## Behavior Matrix

| Situation | Result |
|---|---|
| No stored choice | Follows OS `prefers-color-scheme` |
| `theme=light` stored | Light |
| `theme=dark` stored | Dark |
| First render | No flash (script in `<head>`) |
| localStorage blocked | Script catches, falls back to OS preference |
| JS disabled | Light theme (CSS default) |

## Accessibility

- Toggle is a real `<button>`: keyboard operable (Tab + Enter/Space), `aria-label` + `aria-pressed`.
- Sun/moon SVGs `aria-hidden="true"`.
- Focus-visible ring on the button.
- Color tokens reused from the blog, which maintains WCAG AA contrast in both themes.

## Testing

Static site with no test framework. Verification approach:

1. Syntax-check the inline no-flash script and the `js/main.js` additions with `node` (extract / `node -c`).
2. Serve `portafolio/` locally and confirm via HTTP fetch: dark CSS link present, toggle button in the
   navbar, inline script present.
3. Manual browser checklist:
   - Toggle switches the whole page instantly, no reload.
   - Refresh preserves the chosen theme.
   - Incognito/first visit respects OS preference.
   - No flash of light theme when dark is selected.
   - All sections readable: hero, about, quote, services, experience/portfolio, contact/socials, footer.
   - Navbar glass, cards, avatar border, scrollbar look correct in dark.
   - Button accessible by keyboard and visible in both themes; mobile layout unaffected.

## Deployment

Unchanged: the existing GitHub Actions workflow (`static.yml`) publishes on push to `master`. The new
`css/theme-dark.css` is committed to the repo and served from the deployed site automatically.

## Out of Scope

- The deleted `home.html` / `blog-single.html` pages (removed from the working tree).
- The unused `css/style-{color}.css` theme variants.
- Translating or restructuring the site.