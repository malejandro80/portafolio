# Portfolio Dark Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a dark theme with the blog's palette to the static portfolio (`index.html`), toggled by a navbar button, persisted in `localStorage`, respecting OS preference with no flash on load.

**Architecture:** A new `css/theme-dark.css` redefines the palette variables (same names as `css/premium.css` uses) inside a `[data-theme="dark"]` scope. An inline `<head>` script sets the attribute before first paint. The two hardcoded white inline styles in `index.html` are switched to CSS variables so dark rules can affect them. A sun/moon button in the navbar and a small IIFE appended to `js/main.js` handle toggling, persistence, and the theme-color meta sync. Light mode is untouched.

**Tech Stack:** HTML, CSS custom properties, vanilla JavaScript (jQuery is present but not required for the toggle). Spec: `docs/superpowers/specs/2026-08-29-portfolio-dark-mode-design.md`.

---

## File Structure

| File | Action | Purpose |
|---|---|---|
| `css/theme-dark.css` | Create | Dark palette + targeted overrides, scoped under `[data-theme="dark"]` |
| `index.html` | Modify | Inline no-flash script, dark CSS link, meta theme-color, toggle button, two inline-style var swaps |
| `css/premium.css` | Modify | Append `.theme-toggle` base styles (works in both themes) |
| `js/main.js` | Modify | Append theme toggle IIFE |

---

### Task 1: Create `css/theme-dark.css`

**Files:**
- Create: `css/theme-dark.css`

- [ ] **Step 1: Create the dark theme stylesheet**

Create `css/theme-dark.css` in the `portafolio` repo with exactly this content:

```css
/**
 * Dark theme — palette matches thoughtsBlog.
 * Scoped under [data-theme="dark"], set on <html> by an inline head script in index.html.
 *
 * @format
 */

[data-theme="dark"] {
  --bg-dark: #0f172a;
  --bg-surface: #1e293b;
  --bg-surface-hover: #334155;
  --text-main: #f1f5f9;
  --text-muted: #94a3b8;
  --accent-primary: #3b82f6;
  --accent-secondary: #22d3ee;
  --accent-gradient: linear-gradient(
    135deg,
    var(--accent-primary),
    var(--accent-secondary)
  );
  --glass-border: 1px solid rgba(255, 255, 255, 0.06);
  --glass-border-darker: 1px solid rgba(0, 0, 0, 0.45);
  --glass-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.45);
}

/* Background grid (premium.css uses hardcoded rgba) */
[data-theme="dark"] body::before {
  background-image:
    linear-gradient(rgba(59, 130, 246, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(59, 130, 246, 0.05) 1px, transparent 1px);
}

/* Glassmorphism navbar (premium.css uses !important) */
[data-theme="dark"] .navbar-b {
  background: rgba(15, 23, 42, 0.85) !important;
  border-bottom: var(--glass-border-darker);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
}
[data-theme="dark"] .navbar-b.navbar-reduce {
  background: rgba(15, 23, 42, 0.9) !important;
}

/* Glass cards (premium.css uses !important) */
[data-theme="dark"] .box-shadow-full,
[data-theme="dark"] .service-box,
[data-theme="dark"] .work-box {
  background: rgba(30, 41, 59, 0.85) !important;
  border: var(--glass-border);
  box-shadow: var(--glass-shadow);
}
[data-theme="dark"] .box-shadow-full:hover,
[data-theme="dark"] .service-box:hover,
[data-theme="dark"] .work-box:hover {
  background: rgba(30, 41, 59, 0.96) !important;
  box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.5);
}

/* About image border/shadow */
[data-theme="dark"] .about-img img {
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35);
}

/* Work placeholder shimmer */
[data-theme="dark"] .work-img[style*='min-height']::after {
  background: linear-gradient(
    to right,
    transparent,
    rgba(255, 255, 255, 0.08),
    transparent
  );
}

/* Custom scrollbar */
[data-theme="dark"] ::-webkit-scrollbar-track {
  background: var(--bg-dark);
}
[data-theme="dark"] ::-webkit-scrollbar-thumb {
  background: #334155;
  border: 3px solid var(--bg-dark);
}
[data-theme="dark"] ::-webkit-scrollbar-thumb:hover {
  background: var(--accent-primary);
}
```

- [ ] **Step 2: Verify file exists**

Run: `ls -la css/theme-dark.css`
Expected: file listed in output

- [ ] **Step 3: Commit**

```bash
git add css/theme-dark.css
git commit -m "feat: add dark theme stylesheet for portfolio"
```

---

### Task 2: Add no-flash script, dark CSS link, and inline-style var swaps to `index.html`

**Files:**
- Modify: `index.html`
  - line ~17: insert inline no-flash script after `<meta charset="utf-8" />`
  - line ~26: `<meta name="theme-color" content="#046bd2" />` → `content="#f8fafc"`
  - line ~81: add `<link href="css/theme-dark.css" rel="stylesheet" />` after `css/premium.css`
  - line ~255: `.quote-card` inline style → use `var(--bg-surface)` and `var(--glass-border)`
  - line ~264: quote avatar inline style → `border: 6px solid var(--bg-surface)`

- [ ] **Step 1: Insert the no-flash script after the charset meta**

After line 17 (`<meta charset="utf-8" />`), insert:

```html
<script>
  (function () {
    var t;
    try { t = localStorage.getItem('theme'); } catch (e) { t = null; }
    if (!t) t = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.documentElement.dataset.theme = t;
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = t === 'dark' ? '#0f172a' : '#f8fafc';
  })();
</script>
```

- [ ] **Step 2: Change the static theme-color meta**

Change line 26 from:
```html
<meta name="theme-color" content="#046bd2" />
```
to:
```html
<meta name="theme-color" content="#f8fafc" />
```

- [ ] **Step 3: Link the dark stylesheet**

After the existing line `<link href="css/premium.css" rel="stylesheet" />` (line 81), add:

```html
<link href="css/theme-dark.css" rel="stylesheet" />
```

- [ ] **Step 4: Switch the `.quote-card` inline style to variables**

Change line ~255 from:
```html
style="background: rgba(255,255,255,0.95) !important; align-items: center; gap: 50px; padding: 60px; border-radius: 40px; position: relative; overflow: hidden; border: 1px solid rgba(255,255,255,0.5);"
```
to:
```html
style="background: var(--bg-surface) !important; align-items: center; gap: 50px; padding: 60px; border-radius: 40px; position: relative; overflow: hidden; border: 1px solid var(--glass-border);"
```

Light-mode result is visually identical (the variable resolves to `#ffffff`, the border to the same white border). The `!important` must stay — it is what outranks premium.css's `.box-shadow-full` `!important` rule.

- [ ] **Step 5: Switch the quote avatar border to a variable**

Change line ~264 from:
```html
style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%; border: 6px solid #fff;" />
```
to:
```html
style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%; border: 6px solid var(--bg-surface);" />
```

- [ ] **Step 6: Verify all edits are present**

Run:
```bash
rg -n "theme-dark|dataset.theme|var\(--bg-surface\)|theme-color" index.html
```
Expected: matches for the link tag, the inline script (`dataset.theme`), both `var(--bg-surface)` usages, and the theme-color meta.

- [ ] **Step 7: Commit**

```bash
git add index.html
git commit -m "feat: add theme loader, dark css link, and variable-driven inline styles"
```

---

### Task 3: Add the theme toggle button to the navbar

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Insert the toggle button after the nav `</ul>`**

In the `#navbarDefault` collapse div, immediately after the closing `</ul>` (line ~126, after `<!-- Material checked -->`), insert:

```html
      <button
        class="theme-toggle"
        id="theme-toggle"
        type="button"
        aria-label="Toggle theme"
        aria-pressed="false"
      >
        <svg class="icon-sun" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
        <svg class="icon-moon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      </button>
```

- [ ] **Step 2: Verify placement**

Run: `rg -n "theme-toggle|Material checked" index.html`
Expected: two `theme-toggle` matches (the button `class` and its `id`), inserted immediately after the closing `</ul>` and before the `Material checked` comment.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add dark mode toggle button to navbar"
```

---

### Task 4: Add `.theme-toggle` base styles to `css/premium.css`

**Files:**
- Modify: `css/premium.css` (append at the end)

- [ ] **Step 1: Append the toggle button styles**

Append the following block to the end of `css/premium.css`:

```css
/* Theme toggle button (both themes) */
.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  padding: 0;
  margin-left: 1.25rem;
  background: var(--bg-surface-hover);
  border: 1px solid var(--glass-border-darker);
  border-radius: 999px;
  color: var(--text-main);
  cursor: pointer;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;
}
.theme-toggle:hover {
  background: var(--bg-surface);
  border-color: var(--accent-primary);
  color: var(--accent-primary);
}
.theme-toggle:focus-visible {
  outline: 2px solid var(--accent-primary);
  outline-offset: 2px;
}
.theme-toggle .icon-moon {
  display: none;
}
.theme-toggle.is-dark .icon-sun {
  display: none;
}
.theme-toggle.is-dark .icon-moon {
  display: block;
}
@media (prefers-reduced-motion: reduce) {
  .theme-toggle {
    transition: none;
  }
}
```

- [ ] **Step 2: Verify the block is present**

Run: `rg -n "Theme toggle button" css/premium.css`
Expected: one match at the end of the file

- [ ] **Step 3: Commit**

```bash
git add css/premium.css
git commit -m "feat: style theme toggle button for both themes"
```

---

### Task 5: Add toggle logic to `js/main.js`

**Files:**
- Modify: `js/main.js` (append at the end)

- [ ] **Step 1: Append the toggle IIFE**

Append the following block to the end of `js/main.js`:

```js
/* Dark mode toggle */
(function () {
  var btn = document.getElementById('theme-toggle');
  if (!btn) return;

  function updateButton(theme) {
    btn.setAttribute('aria-pressed', theme === 'dark');
    btn.classList.toggle('is-dark', theme === 'dark');
  }

  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('theme', theme); } catch (e) {}
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === 'dark' ? '#0f172a' : '#f8fafc';
    updateButton(theme);
  }

  var current = document.documentElement.dataset.theme || 'light';
  updateButton(current);

  btn.addEventListener('click', function () {
    var next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  });
})();
```

- [ ] **Step 2: Syntax-check the file**

Run: `node --check js/main.js`
Expected: no output and exit code 0 (parse only; the existing jQuery content is not executed)

- [ ] **Step 3: Commit**

```bash
git add js/main.js
git commit -m "feat: wire up dark mode toggle in main.js"
```

---

### Task 6: End-to-end verification

**Files:**
- (none — verification only)

- [ ] **Step 1: Start a local server**

Run: `python3 -m http.server 8080` (in the `portafolio` directory; leave running)

- [ ] **Step 2: Verify the served page contains the theme wiring**

Run:
```bash
curl -s http://localhost:8080/ | rg -o 'theme-dark.css|theme-toggle|dataset.theme|theme-color' | sort | uniq -c
```
Expected output shows at least one each of `theme-dark.css`, `theme-toggle`, `dataset.theme`, `theme-color`.

- [ ] **Step 3: Verify the dark stylesheet serves**

Run: `curl -s -o /dev/null -w '%{http_code}' http://localhost:8080/css/theme-dark.css`
Expected: `200`

- [ ] **Step 4: Full HTML/JS parses cleanly**

Run: `node --check js/main.js`
Expected: exit 0. (Scripts are inline in HTML; the syntax of the head script is identical in pattern to the tested file.)

- [ ] **Step 5: Stop the local server**

Stop the `http.server` process (Ctrl+C).

- [ ] **Step 6: Manual browser checklist (user)**

Open `index.html` (or the local server) and confirm:
- [ ] First visit in a fresh/incognito window with OS dark mode → page loads dark, no flash
- [ ] First visit in a fresh window with OS light mode → page loads light
- [ ] Toggle switches the whole page instantly (hero, about card, quote card, services, work, contact, footer)
- [ ] Refresh preserves the chosen theme
- [ ] Toggle button shows a sun icon in light mode and a moon icon in dark mode
- [ ] Button keyboard-operable (Tab + Enter/Space) and shows a focus ring
- [ ] Navbar glass, card surfaces, avatar borders, custom scrollbar all look correct in dark
- [ ] Mobile/narrow viewport: toggle is visible below the nav links and functional

---

### Task 7: Final commit

- [ ] **Step 1: Check status**

Run: `git status --short`
Expected: only the four implemented files changed (any pending `home.html` / `blog-single.html` deletions in the working tree must NOT be committed with this feature).

- [ ] **Step 2: Commit any leftover fix-ups**

If any file from Tasks 1–5 needed a fix after verification:

```bash
git add css/theme-dark.css css/premium.css index.html js/main.js
git commit -m "fix: dark mode polish"
```

(If nothing changed, skip this step.)