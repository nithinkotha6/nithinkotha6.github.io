# 🔍 Front-End Audit Report
**Files Audited:** `index.html` (455 lines) · `styles.css` (1,248 lines)  
**Date:** 2026-02-27  
**Auditor:** Senior Front-End Engineer & Security Specialist

---

## Overall Summary

### ✅ Strengths
- Clean, well-structured single-page portfolio with good visual hierarchy.
- Strong use of CSS custom properties (design tokens) for palette, radius, shadows, and transitions — excellent maintainability baseline.
- Semantic HTML is largely correct: `<header>`, `<nav>`, `<section>`, `<article>`, `<footer>` are used appropriately.
- Good responsive strategy with two breakpoints (`900px` and `480px`), grid → single-column stacking, and mobile burger menu.
- Modern layout: Flexbox and CSS Grid used throughout — no floats or table-based layouts.
- `rel="noopener noreferrer"` present on external `target="_blank"` links — good security hygiene.
- Intersection Observer used for scroll-reveal animations — performant, no library dependency.
- Google Fonts loaded with `preconnect` hints — correct performance pattern.

### ⚠️ Weaknesses
- All `<a href="#">` project links are dead placeholders — no content or `aria-label`.
- Duplicate CSS rule block (`.available-badge` defined twice).
- Missing `:focus-visible` states on interactive elements — keyboard navigation unfriendly.
- `burger.onclick` inline assignment in script — no `aria-expanded` toggle for accessibility.
- Mobile menu has no close-on-outside-click or close-on-nav-link-click behavior.
- No `<meta name="theme-color">`, favicon, or Open Graph tags.
- Orphaned CSS classes (`.photo-placeholder`, `.sg-icon`, `.edu-*`, `.cert-*`, `.footer-brand`, `.footer-copy`) for elements not present in `index.html`.
- One stray unclosed `</span>` tag on line 150.
- CSS file is 1,248 lines with ~200+ lines of dead code for unused components.
- No `defer` or `async` on the inline script — blocks HTML parsing if moved to external file.

---

## 1. HTML Structure & Semantics

- **Issue: Stray `</span>` tag (line 150)**
  - **Problem:** `<span>SQL</span> </span>` has an extra closing `</span>` with no matching open tag. This can cause browser rendering inconsistencies and is a validation error.
  - **Fix:** Remove the orphan `</span>`:
    ```html
    <!-- Before -->
    <span>Python</span> <span>SQL</span> </span>
    <!-- After -->
    <span>Python</span> <span>SQL</span>
    ```

- **Issue: `<div class="hero-stats">` not closed before `</section>` (line 104)**
  - **Problem:** The `</div>` on line 104 closes `hero-stats`, but there is a stray orphan `</div>` on the same line (`</div></section>` structure is off). Review the nesting — `hero-stats` lies outside `hero-content` but inside `hero`, and the closing `</div>` at line 104 for `hero-content` may be misplaced (line 81 closes `hero-content`, line 104 is a floating `</div>`).
  - **Fix:** Validate HTML at [validator.w3.org](https://validator.w3.org) to confirm nesting. Remove the extra `</div>` on line 104.

- **Issue: `<div class="mobile-menu">` placed after `<header>` at the body root level**
  - **Problem:** The mobile menu is a sibling of `<header>` rather than a child. This is fine structurally, but semantically it should be either inside `<header>` or managed via `aria-hidden`.
  - **Fix:** Add `aria-hidden="true"` (toggled to `"false"` when open) and `role="dialog"` to the mobile menu div for proper accessibility semantics.

- **Issue: `<div class="section-label">` used as a section label instead of a semantic element**
  - **Problem:** The eyebrow labels like "About", "Skills", etc. rendered in `<div class="section-label">` carry no semantic meaning. Screen readers won't understand this element's role.
  - **Fix:** Use `<p>` or `<span>` with `aria-hidden="true"` if purely decorative, or keep as-is but add `role="doc-subtitle"` or wrap in an `<hgroup>`.

- **Issue: `LangGraph` listed twice in the skills section (line 163)**
  - **Problem:** "LangGraph" appears both as part of "Agent Frameworks (AutoGen, LangGraph)" chip AND as its own standalone `<span>LangGraph</span>` chip. This is a content error.
  - **Fix:** Remove the redundant standalone `<span>LangGraph</span>`.

- **Issue: Project link icons `<a href="#">` have no descriptive text or `aria-label`**
  - **Problem:** Lines 191, 208, 225, 241 — each project card's external link icon is `<a href="#">` with only an inline SVG and no text, `title`, or `aria-label`. Screen readers announce these as "link" with no context.
  - **Fix:**
    ```html
    <a href="https://github.com/..." class="pc-link" aria-label="View Document QA System on GitHub" target="_blank" rel="noopener noreferrer">
    ```

- **Issue: `<em>` used for presentational italic in headings rather than semantic emphasis**
  - **Problem:** Throughout the file, `<em>` is used purely for visual italic styling (e.g., `<h1>Nithin <em>Kotha</em></h1>`). `<em>` carries semantic stress emphasis meaning in HTML — screen readers may stress-read highlighted words.
  - **Fix:** Use `<span class="text-italic">` or CSS `font-style: italic` on a styled `<span>` for purely decorative italics.

- **Issue: Hero `<section>` has no `aria-label` or `aria-labelledby`**
  - **Problem:** The `<section id="hero">` doesn't have a heading directly as its first child or an accessible label. The `<h1>` is nested deep in divs.
  - **Fix:** Add `aria-labelledby="hero-heading"` to the section and `id="hero-heading"` on the `<h1>`.

- **Issue: `<div class="section-label reveal">About</div>` precedes `<div class="about-heading"><h2>…</h2></div>`**
  - **Problem:** The About section has no `<h2>` at the section level; the `<h2>` is buried inside a nested div. This is acceptable, but `section-label` should not be confused for the heading.
  - **Fix:** No structural change needed, but confirm heading hierarchy is correct: `h1` (hero) → `h2` (section titles) → `h3` (sub-items). Currently this hierarchy is correct.

---

## 2. CSS Quality & Architecture

- **Issue: `.available-badge` rule block is duplicated (lines 476–479 and 482–486)**
  - **Problem:** `.available-badge` is defined twice with the same `border-color` and `transition` properties. The second block adds `box-shadow`, which should have just been part of the first block.
  - **Fix:** Merge into a single rule:
    ```css
    .available-badge {
      border-color: rgba(212, 98, 42, 0.3);
      transition: all 0.3s ease;
      box-shadow: 0 0 10px rgba(212, 98, 42, 0.12), 0 1px 3px rgba(0,0,0,.05);
    }
    ```

- **Issue: ~200+ lines of orphaned CSS for elements not in `index.html`**
  - **Problem:** Rules for `.edu-section`, `.edu-cards`, `.edu-card`, `.edu-year`, `.edu-body`, `.edu-school`, `.edu-detail`, `.certs-grid`, `.cert-card`, `.cert-featured`, `.cert-icon`, `.cert-body`, `.cert-badge`, `.cert-badge-grey`, `.footer-brand`, `.footer-copy`, `.photo-placeholder`, `.sg-icon`, `.sg-icon.blue`, `.sg-icon.orange` — none of these classes appear anywhere in `index.html`. This is dead code that increases file size and reader confusion.
  - **Fix:** Either add the corresponding HTML (if these sections are planned) or remove the dead CSS. Use a tool like [PurgeCSS](https://purgecss.com/) for automated detection.

- **Issue: `--r-sm` CSS variable referenced but never defined**
  - **Problem:** `.cert-icon` uses `border-radius: var(--r-sm)` (line 989), but `:root` only defines `--r-md`, `--r-lg`, `--r-xl`, `--r-full`. This will silently fall back to `0`, making cert icons have sharp corners unexpectedly.
  - **Fix:** Add `--r-sm: 8px;` to `:root`.

- **Issue: Transition shorthand `transition: all` used excessively**
  - **Problem:** `transition: all var(--t)` and `transition: all var(--ts)` are used on nearly every interactive element. `all` transitions every CSS property — including properties like `width`, `height`, `color` that don't need it — causing unnecessary repaints and potential jank.
  - **Fix:** Be explicit:
    ```css
    /* Instead of transition: all var(--t) */
    transition: background-color var(--t), box-shadow var(--t), border-color var(--t), transform var(--t);
    ```

- **Issue: Magic number `72px` appears in both CSS (`scroll-padding-top: 72px`) and `height: 100vh; padding: 72px 28px 40px` in `.mobile-menu`**
  - **Problem:** The navbar height (`72px`) is a magic number that must be manually coordinated across two places. If the navbar height changes, both places must be updated.
  - **Fix:** Add a CSS variable `--navbar-h: 72px;` and use it in both places.

- **Issue: `height: 100vh` on `.mobile-menu` doesn't account for mobile browser chrome**
  - **Problem:** On iOS Safari/Chrome, `100vh` doesn't account for dynamic browser toolbar height, causing the menu to be clipped or overflow.
  - **Fix:** Use `height: 100dvh` (dynamic viewport height) with a fallback:
    ```css
    height: 100vh;
    height: 100dvh;
    ```

- **Issue: `.delay-1` and `.delay-2` defined but `.delay-3`, `.delay-4` are missing**
  - **Problem:** In the reveal animation section (lines 104–110), only `.delay-1` and `.delay-2` are defined, but HTML uses `class="reveal delay-3"` and `class="reveal delay-4"`. These classes have no CSS definition, so delays 3 and 4 do not animate with stagger.
  - **Fix:** Add:
    ```css
    .delay-3 { transition-delay: .3s; }
    .delay-4 { transition-delay: .4s; }
    ```

- **Issue: `font-size: 15px` used directly on `.sg-chips span` and `.ec-tech span` instead of tokens**
  - **Problem:** Pixel font sizes scattered throughout (e.g., `15px`, `16px`, `17px`, `18px`) are not mapped to any scale or token, making typography inconsistent and hard to maintain.
  - **Fix:** Define a type scale in `:root`:
    ```css
    --text-xs: 0.75rem;
    --text-sm: 0.875rem;
    --text-base: 1rem;
    --text-lg: 1.125rem;
    ```

- **Issue: `border: 1px solid rgba(255, 255, 255, 0.1)` on `.btn-primary` / `.btn-secondary` is overridden immediately by `.btn-secondary`'s more specific border**
  - **Problem:** The shared `.btn-primary, .btn-secondary` rule sets `border: 1px solid rgba(255,255,255,0.1)`, then `.btn-secondary` immediately overwrites with `border: 1px solid var(--border-2)`. This is redundant — the shared border value serves no purpose for `.btn-secondary`.
  - **Fix:** Move border declaration to `.btn-primary` only, or set it to `none` in the shared rule and define separately.

- **Issue: `.navbar` uses `transition: all var(--ts)` while only `background`, `backdrop-filter`, and `border-bottom` change on scroll**
  - **Problem:** `transition: all` on the navbar transitions everything including layout properties unnecessarily.
  - **Fix:** `transition: background-color var(--ts), backdrop-filter var(--ts), border-color var(--ts);`

---

## 3. Security & Safety

- **Issue: Inline `<script>` block with no Content Security Policy (CSP)**
  - **Problem:** The inline `<script>` at lines 429–452 would be blocked by any strict `Content-Security-Policy: script-src 'self'` header, requiring an `'unsafe-inline'` exception. This is acceptable for a static GitHub Pages site, but it's worth noting. Additionally, there's no `nonce` or hash-based CSP approach.
  - **Fix:** Move the JavaScript to an external file (`main.js`) and load it with `<script src="main.js" defer></script>`. This removes the need for `unsafe-inline` and improves maintainability.

- **Issue: `burger.onclick = () => {...}` uses direct `onclick` property assignment**
  - **Problem:** This is slightly less idiomatic than `addEventListener` and prevents attaching multiple handlers. Not a security risk per se, but bad practice.
  - **Fix:**
    ```js
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      menu.classList.toggle('open');
    });
    ```

- **Issue: No `aria-expanded` state toggled on the burger button when menu opens/closes**
  - **Problem:** Assistive technologies rely on `aria-expanded` to know whether the associated menu is open or closed. Without it, screen reader users have no indication that clicking the burger does anything.
  - **Fix:**
    ```js
    burger.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('open');
      burger.classList.toggle('open');
      burger.setAttribute('aria-expanded', isOpen);
    });
    ```
    Start with `<button ... aria-expanded="false" aria-controls="mobileMenu">`.

- **Issue: No `X-Frame-Options` or CSP `frame-ancestors` equivalent metadata**
  - **Problem:** The page can be embedded in iframes by any third party, enabling potential clickjacking. Not in scope for a `<meta>` tag, but if deploying via custom server/Nginx alongside GitHub Pages, add:
    ```
    X-Frame-Options: DENY
    Content-Security-Policy: frame-ancestors 'none';
    ```

- **Issue: Profile image referenced with cache-busting query string `profile.jpg?v=1.1`**
  - **Problem:** Query string versioning works but is not supported by all CDN/proxy layers. Not a security issue, but worth noting.
  - **Fix:** Use filename versioning instead: `profile-v1.1.jpg`.

- **Issue: All project card links point to `href="#"` — dead anchors**
  - **Problem:** Clicking these links scrolls the page to the top (since `#` navigates to the top), which is misleading and unprofessional. It also causes confusion with anchor-based navigation.
  - **Fix:** Either link to real GitHub repos or use `href="javascript:void(0)"` with a `disabled` or `aria-disabled="true"` attribute, but ideally just link to the actual projects.

---

## 4. Accessibility & Usability

- **Issue: No `:focus-visible` styles defined anywhere in CSS**
  - **Problem:** The global CSS removes default text-decoration from all links (`a { text-decoration: none; }`). Without `:focus-visible` styles, keyboard users (Tab navigation) have no visual indicator of focus on any interactive element.
  - **Impact:** WCAG 2.1 SC 2.4.7 (Focus Visible) failure — high severity.
  - **Fix:** Add globally:
    ```css
    :focus-visible {
      outline: 2px solid var(--orange);
      outline-offset: 3px;
      border-radius: 4px;
    }
    ```

- **Issue: `<span class="chip-dot">●</span>` uses a Unicode bullet character as a status indicator**
  - **Problem:** The `●` character will be read aloud by screen readers as "black circle" or similar, which is confusing as a status indicator.
  - **Fix:** Use a CSS-only dot with `aria-hidden="true"` on the decorative span:
    ```html
    <span class="chip-dot" aria-hidden="true">●</span>
    Open to roles
    ```
    Or use a proper `<svg>` with `role="img" aria-label="Available"`.

- **Issue: Profile photo `alt="Nithin Kotha"` is acceptable but minimal**
  - **Problem:** The alt text is correct (person's name), but a more descriptive alt like `"Nithin Kotha, Azure Data Engineer"` would be more informative for screen reader users.
  - **Fix:**
    ```html
    <img src="./profile.jpg?v=1.1" alt="Nithin Kotha — Azure Data Engineer" class="photo-img" />
    ```

- **Issue: `hero-name` with `white-space: nowrap` can overflow on narrow screens**
  - **Problem:** CSS `white-space: nowrap` on `.hero-name` prevents line wrapping of the name. On very small screens (<320px), this can cause horizontal overflow.
  - **Fix:** Remove `white-space: nowrap` or add `overflow: hidden; text-overflow: ellipsis;` as a fallback.

- **Issue: Mobile menu has no trap focus or close-on-Escape behavior**
  - **Problem:** When the mobile menu opens, keyboard focus is not trapped inside. Users can Tab out of it to hidden background content. Additionally, pressing `Escape` does not close the menu.
  - **Fix:**
    ```js
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('open')) {
        menu.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        burger.focus();
      }
    });
    ```

- **Issue: Text color `var(--muted)` (#8C857C) on cream `#FAF8F4` background may fail WCAG AA**
  - **Problem:** `#8C857C` on `#FAF8F4` yields approximately a 3.4:1 contrast ratio — below the 4.5:1 required for normal text (WCAG 2.1 SC 1.4.3). Used on `.hstat-l`, `.pc-chips span`, `.ec-loc`, `.ec-client`, `.ec-tech span`.
  - **Fix:** Darken muted text color to approximately `#706860` to achieve ≥4.5:1, or use `var(--body)` (#4A4540) where text is meaningful.

- **Issue: `font-size: 10px` on `.photo-placeholder span` and `font-size: 0.65rem` on `.cert-badge`**
  - **Problem:** Text at 10px or 0.65rem (~10.4px) is below the WCAG recommended minimum of 12px for readable text. Also fails browser default zoom behavior gracefully.
  - **Fix:** Minimum `0.75rem` (12px) for any rendered text.

- **Issue: `<ul>` in mobile menu has no `aria-label`**
  - **Problem:** The nav list inside the mobile menu carries no label explaining its purpose to screen readers.
  - **Fix:**
    ```html
    <ul aria-label="Mobile navigation">
    ```

---

## 5. Responsiveness & Layout

- **Issue: Only two breakpoints (`900px` and `480px`) — no intermediate tablet breakpoint**
  - **Problem:** Between 481px and 899px, the layout goes straight from full desktop (2-column grids) to ... nothing. The 900px breakpoint fixes this, but content between ~600–899px may feel crammed. The `exp-card` at 900px drops to 1 column (fine), but `projects-grid` at 4 cards with full-width single column could feel like a lot of scrolling.
  - **Fix:** Consider a `640px` mid-breakpoint for project cards to go `2-column → 1-column` more gracefully.

- **Issue: `.exp-card` uses `grid-template-columns: 200px 1fr` — fixed pixel left column**
  - **Problem:** The 200px fixed column for `.ec-meta` works fine on desktop but is hard-coded and not flexible. On narrow desktops near 900px before the breakpoint kicks in, it can feel tight.
  - **Fix:** Use `minmax()` or a percentage: `grid-template-columns: minmax(180px, 220px) 1fr;`

- **Issue: `.hero-name` has `white-space: nowrap` (mentioned in Accessibility) combined with `clamp(3rem, 7.5vw, 6rem)`**
  - **Problem:** On viewport widths between 400–600px (after mobile breakpoint kicks in), this causes the name to potentially extend beyond its container since `nowrap` prevents wrapping but width is responsive.
  - **Fix:** Remove `white-space: nowrap` and trust the `clamp()` to handle scaling.

- **Issue: `hero-stats` has no side padding on desktop but has `padding: 0 24px` on mobile**
  - **Problem:** On desktop, `.hero-stats` is limited by `max-width: 1080px` and `margin: 0 auto`, but there's no left padding. On very wide viewports, the stats bar can appear misaligned relative to the hero content.
  - **Fix:** Add `padding: 0 40px` to `.hero-stats` consistent with `.hero-content`'s `padding: 24px 40px 12px`.

- **Issue: Contact section uses `padding: 104px 0` — hardcoded, not using the `.section` utility class**
  - **Problem:** All other sections use `.section` (80px padding), but the contact section uses a custom `104px` padding inline in the CSS. This is intentional for emphasis but not documented, making it appear like an inconsistency. Also, on mobile this isn't overridden in the responsive block.
  - **Fix:** Add `@media (max-width: 900px) { .contact-section { padding: 72px 0; } }` for mobile consistency.

- **Issue: `photo-frame` has fixed `width: 220px; height: 260px`**
  - **Problem:** On the mobile breakpoint, `.hero-center` collapses to 1 column and centers its content, but the `photo-frame` retains a fixed `220×260px` size. This is fine for most phones but doesn't scale with very small screens.
  - **Fix:** Consider making it responsive: `width: min(220px, 60vw);` while maintaining the aspect ratio via `aspect-ratio: 220/260`.

---

## 6. Performance & Best Practices

- **Issue: Inline `<script>` at end of `<body>` without `defer`**
  - **Problem:** While placing script before `</body>` avoids render blocking, the modern best practice is `<script src="main.js" defer>` on an external file. Inline scripts can't be cached by the browser between navigations.
  - **Fix:** Extract to `main.js` and use `<script src="main.js" defer></script>` in `<head>`.

- **Issue: Google Font loads 6 weights/styles of DM Sans (line 13)**
  - **Problem:** The font URL requests `DM Sans` in 6 variations (`300`, `400`, `500`, `600` opsz range). The site primarily uses `300`, `400`, `500`, and `600`. Check if all 6 variants are actually used.
  - **Fix:** Audit font usage: if only `300`/`400`/`500` are used, remove `600` to reduce download size.

- **Issue: `backdrop-filter: blur()` used on multiple elements without performance consideration**
  - **Problem:** `backdrop-filter: blur()` is GPU-intensive. Used on `.navbar.scrolled`, `.btn-primary`, `.btn-secondary`, and `.contact-box` — the buttons apply `backdrop-filter: blur(8px)` even on opaque backgrounds where it has no visible effect.
  - **Fix:** Remove `backdrop-filter` from `.btn-primary` and `.btn-secondary` since their backgrounds are opaque — it has zero visual effect but still triggers a compositor layer.

- **Issue: No `loading="lazy"` on the profile image**
  - **Problem:** The profile image is in the hero (above the fold), so `loading="lazy"` would actually be wrong here — but for completeness, if more images are added to the page (project screenshots, etc.), they should have `loading="lazy"`.
  - **Note:** Current image is fine, but set a habit for future additions.

- **Issue: `profile.jpg?v=1.1` — no explicit `width` and `height` attributes on the `<img>`**
  - **Problem:** Without explicit `width` and `height` attributes, the browser cannot reserve layout space for the image before it loads, causing Cumulative Layout Shift (CLS) — a Core Web Vital metric.
  - **Fix:**
    ```html
    <img src="./profile.jpg?v=1.1" alt="Nithin Kotha — Azure Data Engineer"
         class="photo-img" width="220" height="260" />
    ```

- **Issue: CSS file is 1,248 lines with a large block of unused code**
  - **Problem:** Roughly 200–250 lines of CSS for `.edu-*`, `.cert-*`, and `.photo-placeholder` components that don't exist in the HTML. This unnecessarily increases stylesheet size.
  - **Fix:** Remove dead code. The resulting file should be ~1,000 lines.

- **Issue: `transition: all .6s` on stagger classes + `transition: all .65s` on `.reveal`**
  - **Problem:** `transition: all` on every stagger class means browser recalculates all properties (layout, paint) during animation. Use `opacity` and `transform` explicitly, which are GPU-composited and don't trigger layout.
  - **Fix:**
    ```css
    .reveal { transition: opacity .65s var(--ts), transform .65s var(--ts); }
    .stagger-1, .stagger-2 ... { transition: opacity .6s var(--ts), transform .6s var(--ts); }
    ```

---

## 7. Code Style & Consistency

- **Issue: Mixed pixel units vs. rem for font sizes**
  - **Problem:** Font sizes flip between `px` (`font-size: 16px`, `font-size: 17px`, `font-size: 15px`) and `rem` (`font-size: .9rem`, `font-size: 1.05rem`) throughout the CSS without a clear pattern. This makes it hard to maintain a consistent type scale.
  - **Fix:** Pick one system (rem preferred for accessibility — respects user font-size preferences) and stick to it throughout.

- **Issue: Inconsistent quote style**
  - **Problem:** `content: "—"` on line 863 uses double quotes, while most CSS uses single inside `content: ''`. Minor inconsistency but worth normalizing.
  - **Fix:** Use single quotes consistently: `content: '—';`

- **Issue: HTML attributes ordering is inconsistent**
  - **Problem:** Some elements put `class` before `href` (`<a href="..." class="...">`), others reverse this. Standard convention is `href/src` then `class` for anchor/img, or `class` first for divs.
  - **Fix:** Adopt and stick to a consistent attribute ordering: `id` → `class` → `href/src` → `type` → `aria-*` → `data-*`.

- **Issue: Abbreviations in class names (`.pc-`, `.ec-`, `.hstat-`, `.sg-`, `.btn-`) are inconsistent**
  - **Problem:** Some components use abbreviations (`.pc-` for project card, `.ec-` for experience card), others are spelled out (`.section-label`, `.about-layout`). While abbreviated BEM-like naming can be fine if documented, mixing styles creates confusion.
  - **Recommendation:** Add a brief comment block at the top of each section explaining abbreviations (already partially done — add `.pc-` = project card, `.ec-` = experience card notes).

- **Issue: Inline HTML comments good, but script section has no comments explaining aria implications**
  - **Problem:** The JS at the bottom toggles classes and observes intersections but doesn't document that it should also toggle `aria-expanded` or `aria-hidden`.
  - **Fix:** Add brief comments noting what accessibility attributes should be updated when state changes.

- **Issue: `window.addEventListener('load', ...)` for stagger vs `DOMContentLoaded`**
  - **Problem:** `window.load` fires after all resources (images, fonts) are loaded — this can delay the stagger animation start by several hundred milliseconds if images are slow. `DOMContentLoaded` fires earlier.
  - **Fix:**
    ```js
    document.addEventListener('DOMContentLoaded', () => {
      [1, 2, 3, 4, 5].forEach(n => setTimeout(() =>
        document.querySelectorAll(`.stagger-${n}`).forEach(el => el.classList.add('in')), n * 140));
    });
    ```

---

## 8. Design & UX

- **Issue: Project card external link icons point to `#` with no actual destination**
  - **Problem:** The arrow-out SVG icons in project cards imply clickable external links (GitHub, live demo). Currently they navigate nowhere. This is the biggest UX deficiency — users who want to see your code have no path.
  - **Fix:** Connect each icon to the relevant GitHub repo or a `Coming soon` notice.

- **Issue: No active/current section indicator in the navbar**
  - **Problem:** As the user scrolls, no nav link is highlighted as "active." This is a standard UX pattern for single-page portfolio sites and helps users understand their current position.
  - **Fix:** Use IntersectionObserver to apply an `.active` class to the correct nav link as sections enter the viewport.

- **Issue: No scroll-to-top button for long pages**
  - **Problem:** The page has 7 sections. After scrolling down fully, returning to the top requires manual scrolling (4+ experience cards + projects are long). Consider a subtle scroll-to-top button that appears after scrolling past the hero.

- **Issue: `hero-tagline` is very long (lines 58–60) — wall of text at first glance**
  - **Problem:** The hero tagline is a 37-word single sentence. Research shows hero text performs better when concise (8–15 words max). The length reduces scanning efficiency.
  - **Fix:** Trim to a punchy 2-line version:
    > *Architecting AI-powered data systems — from raw ingestion to intelligent decision-making.*

- **Issue: `.meta-chip` font-size is `15px` which looks slightly oversized relative to the surrounding photo frame**
  - **Problem:** At 15px, the meta chips (cert, location) appear larger than the body text nearby, creating an unintended visual hierarchy imbalance.
  - **Fix:** Reduce to `13px` or `0.8rem` for a more subtle badge-like feel.

- **Issue: Skills section uses 2-column grid but the 3rd card (`.skill-group.reveal.delay-3`) spans a full row awkwardly**
  - **Problem:** With the 3rd skill group on a 2-column grid, the last card is left-aligned and spans only one column, looking unfinished and off-center.
  - **Fix:** Change the grid to `grid-template-columns: 1fr 1fr 1fr` for 3 equal columns, or center the 3rd card using `grid-column: 1 / -1` with `max-width: 50%; margin: 0 auto;`:
    ```css
    .skill-group:last-child {
      grid-column: 1 / -1;
      max-width: calc(50% - 10px);
      margin: 0 auto;
    }
    ```

- **Issue: No visual feedback on form/contact actions (email link is plain)**
  - **Problem:** The email `mailto:` link looks identical to the GitHub link button — if clicking email opens a mail client, there's no warning or visual indication that this will happen vs. navigating to a new page.
  - **Fix:** Add a subtle mail icon SVG or a `title="Opens in mail client"` tooltip to the email button.

- **Issue: Hover states exist but no hover state on skill chips (`.sg-chips span`)**
  - **Problem:** Skill chips could benefit from a subtle hover to indicate interactivity or just to feel more alive, even if they're not clickable.
  - **Fix:**
    ```css
    .sg-chips span:hover {
      background: var(--cream-mid);
      border-color: var(--border-2);
    }
    ```

---

## 📋 Prioritized TODO List

### 🔴 High Priority

| # | Issue | Why Critical |
|---|-------|-------------|
| 1 | Add `:focus-visible` styles globally | WCAG 2.4.7 failure — keyboard users are completely lost |
| 2 | Fix stray `</span>` tag on line 150 | DOM validation error, rendering risk |
| 3 | Add `aria-expanded` toggle to burger button + close on Escape | Accessibility — menu is currently opaque to screen readers |
| 4 | Link project card arrows to real GitHub repos | Core UX gap — users can't see your work |
| 5 | Fix `.delay-3` and `.delay-4` missing CSS rules | Stagger animations silently broken for 3rd/4th items |
| 6 | Fix duplicate `.available-badge` rule | Confusing maintainability issue |
| 7 | Add `width` and `height` to `<img>` for profile photo | Prevents CLS (Core Web Vital impact) |

### 🟡 Medium Priority

| # | Issue | Why Important |
|---|-------|--------------|
| 1 | Remove ~200 lines of orphaned CSS (`.edu-*`, `.cert-*`, etc.) | Reduces file size, improves readability |
| 2 | Add `--r-sm` variable to `:root` | Fixes undefined CSS variable fallback |
| 3 | Fix muted text contrast (`#8C857C` → `#706860`) | WCAG AA contrast compliance |
| 4 | Replace `transition: all` with specific properties on animations | Performance improvement |
| 5 | Extract inline `<script>` to `main.js` with `defer` | Cacheability + CSP compliance |
| 6 | Fix 3rd skill card orphan in 2-column grid | Visual imbalance |
| 7 | Add `aria-label` to project link icons and mobile menu `<ul>` | Screen reader usability |
| 8 | Change `window.load` → `DOMContentLoaded` for stagger init | Faster animation start |

### 🟢 Low Priority

| # | Issue | Why Nice to Have |
|---|-------|-----------------|
| 1 | Add scroll-active indicator to navbar | Standard portfolio UX polish |
| 2 | Remove `backdrop-filter` from `.btn-primary`/`.btn-secondary` | Minor GPU savings |
| 3 | Remove duplicate `LangGraph` in skills | Content accuracy |
| 4 | Use filename versioning instead of query string for `profile.jpg` | CDN compatibility |
| 5 | Shorten hero tagline to ≤15 words | Conversion/scannability improvement |
| 6 | Add `height: 100dvh` for mobile menu on iOS | iOS Safari chrome bug fix |
| 7 | Add hover state to `.sg-chips span` | Minor delight improvement |
| 8 | Add Open Graph / `<meta name="theme-color">` / favicon | Social sharing + PWA readiness |
| 9 | Standardize font-size units to `rem` throughout CSS | Maintainability + accessibility |
| 10 | Add active section nav highlighting via IntersectionObserver | UX polish |

---

## 9. Screen Resolution Compatibility

This section evaluates how the page behaves at every major device class, from the smallest phones to ultrawide monitors.

### Resolution Test Matrix

| Viewport | Device Class | Overall Rating | Notes |
|----------|-------------|---------------|-------|
| 320px | iPhone SE / Small Android | ⚠️ Partial | Hero name overflow risk (`white-space: nowrap`); stats bar may compress |
| 375px | iPhone 14 / Standard Mobile | ✅ Good | Single-column hero works; nav → burger correct |
| 390px | iPhone 14 Pro | ✅ Good | No layout issues expected |
| 414px | iPhone Plus / Pro Max | ✅ Good | Adequate white space |
| 480px | Small Tablet Portrait | ✅ Good | Second breakpoint activates: buttons go full-width |
| 600px | Large Phone / Small Tablet | ⚠️ Partial | No breakpoint here; 2-column grids can feel wide |
| 768px | iPad Mini Portrait | ⚠️ Partial | Still on pre-900px styles; grids 2-col at this width may feel tight |
| 900px | iPad Landscape / Small Laptop | ✅ Good | Primary breakpoint activates: all grids go 1-col |
| 1024px | 13" Laptop | ✅ Good | Desktop layout with comfortable spacing |
| 1280px | HD Laptop | ✅ Excellent | Ideal viewport for this design |
| 1440px | 27" iMac / Desktop | ✅ Excellent | `max-width: 1080px` container centers content correctly |
| 1920px | Full HD Monitor | ✅ Good | Layout well-constrained; no line stretching |
| 2560px+ | 4K / Ultrawide | ⚠️ Partial | Large empty margins on sides — page feels narrow at this scale |

---

### 📱 Mobile (320px – 480px)

**Behavior:** One breakpoint at `480px` handles button layout; nav collapses to burger at `900px`.

**Issues:**

- **320px — Hero name overflow risk.**  
  `.hero-name` uses `white-space: nowrap` + `clamp(3rem, 7.5vw, 6rem)`. At 320px, `7.5vw = 24px` (below the 3rem min), so clamp holds at `3rem = 48px`. The name "Nithin Kotha" in a 48px serif should fit, but it's close. The `nowrap` rule creates a fragile situation.  
  **Fix:** Remove `white-space: nowrap` from `.hero-name`.

- **320px — Hero stats bar wraps awkwardly.**  
  `.hstat` uses `flex: 1 1 50%` at `<900px`, so 4 stats become a 2×2 grid. At 320px wide, each 50% column is `~144px`, which is tight if stat labels are long ("Business Analytics", "Azure Certified").  
  **Fix:** Add `text-align: center` to `.hstat` in the `480px` breakpoint, or switch to `flex: 1 1 100%` at `<480px`.

- **480px — Buttons go full-width correctly** (`flex-direction: column` + `width: 100%`). ✅

- **No tap-target size check.** Burger spans are `20×1.5px` — very small touch targets. The `<button>` wraps them with `4px` padding, giving `~28×28px` total, below Apple's 44×44px and Google's 48×48px minimum touch target guidelines.  
  **Fix:** Add `padding: 10px` to `.burger` to bring its touch area to `~48×48px`.

---

### 📱 Tablet (481px – 899px)

**Behavior:** No breakpoint fires in this range — the page uses full desktop 2-column layouts.

**Issues:**

- **600–768px — Skills and project grids are 2-column at 50% each.**  
  Project cards at `~280px` width display `32px` of padding + text content. This is functional, but the project descriptions (very long paragraph text) create tall, uneven cards.  
  **Fix:** Add a `640px` breakpoint:
  ```css
  @media (max-width: 640px) {
    .projects-grid,
    .skills-grid {
      grid-template-columns: 1fr;
    }
  }
  ```

- **768px–899px — Experience cards still 2-column (`minmax(180px,220px) 1fr`).**  
  The meta column (date, company, location) at 200px next to content at `~520px` is fine but feels cramped. No fix needed unless design goals change.

- **No intermediate hero photo adjustment.**  
  The photo frame is fixed at `220×260px` until `900px`, where it goes 1-column centered. Between `600px–899px`, the hero is 2-column with the photo beside the text. Photo at 220px + 40px gap + text column = `~760px min`, which can overflow at ~720px viewports.  
  **Fix:** Add `min-width: 0` to `.hero-text` and let the grid column shrink naturally.

---

### 💻 Desktop (900px – 1440px)

**Behavior:** Primary breakpoint at `900px` activates. Desktop grid layout for all sections. Container max-width `1080px`.

**Assessment:**

- **900px – 1080px:** Container fills full width (no side padding except the `40px` from `.container`). Looks correct but dense.
- **1080px – 1440px:** Container centers with growing side margins. ✅ This is the sweet spot for this design.
- **Experience cards** are the widest elements — 4 cards stacked vertically with `minmax(180px,220px)` left column. Looks great at 1080–1440px. ✅
- **Hero name** at `clamp(3rem, 7.5vw, 6rem)`: at 1440px = `7.5 × 14.4 = 108px`, capped at `6rem = 96px`. Good scaling. ✅
- **Contact section** dark background with centered `max-width: 680px` block looks excellent on large screens. ✅

**Issue:** Hero stat bar has no `padding: 0 40px` on desktop (only mobile gets padding). The stat numbers can visually misalign vs. hero content above them.  
**Fix:** Add `padding: 0 40px` to `.hero-stats` in the base styles.

---

### 🖥️ Widescreen (1440px – 2560px+)

**Behavior:** Content stays within `max-width: 1080px`, centered horizontally. Very large side margins appear.

**Issues:**

- **1920px+:** `max-width: 1080px` means the page occupies only ~56% of a full-HD monitor. The sides are large cream-colored empty zones. While this is a design choice (readability), it can feel underwhelming on ultrawide displays.  
  **Options:**
  - Keep current approach (safe, readable) — no change needed.
  - Increase container: `max-width: 1280px` for large screens:
    ```css
    @media (min-width: 1600px) {
      .container { max-width: 1280px; }
      .hero-content { max-width: 1280px; }
      .hero-stats { max-width: 1280px; }
    }
    ```

- **2560px (4K Ultrawide):** The `radial-gradient` hero decoration (`500×500px`) positioned at `top: -100px, right: -100px` looks tiny relative to the massive viewport. No layout issues, but visually the decorative gradient is imperceptible.  
  **Fix (cosmetic):** Scale the gradient using `vw`-based sizing:
  ```css
  .hero::before {
    width: clamp(500px, 40vw, 900px);
    height: clamp(500px, 40vw, 900px);
  }
  ```

- **`overflow-x: hidden` on `<body>`** ensures no horizontal scroll at any resolution. ✅

---

### Resolution Compatibility Summary

| Category | Score | Key Fix Needed |
|----------|-------|---------------|
| 320px Mobile | 6/10 | Remove `white-space: nowrap` on hero name |
| 375–480px Mobile | 8/10 | Increase burger touch target to 48px |
| 481–899px Tablet | 6/10 | Add `640px` breakpoint for grids |
| 900–1440px Desktop | 9/10 | Add `padding: 0 40px` to `.hero-stats` |
| 1440–1920px HD | 9/10 | No critical issues |
| 2560px+ Ultrawide | 6/10 | Consider larger container + scale decorative elements |

