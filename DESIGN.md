---
version: alpha
name: Notion
description: "Notion is an all-in-one productivity and AI workspace brand whose marketing surface is a crisp white canvas interrupted by a single, purposeful blue — the kind of blue that says 'start here' without shouting. The hero typographic gesture is a 96 px near-black headline with aggressive -1.5 px tracking, set in a custom-cut humanist sans (NotionInter) that reads equally well at display scale and in 14 px sidebar labels. Decorative character: seven illustrated avatar medallions float above the hero text, communicating 'people and agents working together' through charm rather than data visualisation. The only chromatic accent is a soft periwinkle pill wrapping the animated word 'Think', which pulses inside the headline itself — the brand's signature trick of embedding UI inside copy. Surfaces are pure white and off-white; every edge is a 1 px rgba-black hairline at 10 % opacity, never a solid border; every CTA is an 8 px corner-radius blue rectangle, deliberate contrast to the 9999 px pill-shaped ghost buttons that sit beside it."
colors:
  primary: "#0075de"
  primary-active: "#005bab"
  primary-soft: "#e6f3fe"
  primary-muted: "#f2f9ff"
  on-primary: "#ffffff"
  ink: "#000000f2"
  body: "#000000bf"
  mute: "#78736f"
  mute-light: "#a39e98"
  hairline: "#0000001a"
  hairline-strong: "#dfdcd9"
  canvas: "#ffffff"
  canvas-soft: "#f9f9f8"
  card-accent: "#097fe8"
  link: "#0075de"
  success: "#1aae39"
  error: "#dd5b00"
  teal: "#2a9d99"
  purple: "#7237ae"
  purple-deep: "#391c57"
  pink: "#ff64c8"
  alpha-white-400: "#ffffff4d"
  alpha-black-100: "#0000000d"
typography:
  display-xl:
    fontFamily: NotionInter, Inter, -apple-system, system-ui, Segoe UI, Helvetica, Arial, sans-serif
    fontSize: 96px
    fontWeight: 600
    lineHeight: 100px
    letterSpacing: -1.5px
  display-lg:
    fontFamily: NotionInter, Inter, -apple-system, system-ui, Segoe UI, Helvetica, Arial, sans-serif
    fontSize: 54px
    fontWeight: 600
    lineHeight: 56px
    letterSpacing: -1.875px
  display-md:
    fontFamily: NotionInter, Inter, -apple-system, system-ui, Segoe UI, Helvetica, Arial, sans-serif
    fontSize: 36px
    fontWeight: 600
    lineHeight: 40px
    letterSpacing: -0.8px
  display-sm:
    fontFamily: NotionInter, Inter, -apple-system, system-ui, Segoe UI, Helvetica, Arial, sans-serif
    fontSize: 24px
    fontWeight: 600
    lineHeight: 28px
    letterSpacing: -0.4px
  body-lg:
    fontFamily: NotionInter, Inter, -apple-system, system-ui, Segoe UI, Helvetica, Arial, sans-serif
    fontSize: 18px
    fontWeight: 400
    lineHeight: 28px
  body-md:
    fontFamily: NotionInter, Inter, -apple-system, system-ui, Segoe UI, Helvetica, Arial, sans-serif
    fontSize: 16px
    fontWeight: 400
    lineHeight: 24px
  body-md-strong:
    fontFamily: NotionInter, Inter, -apple-system, system-ui, Segoe UI, Helvetica, Arial, sans-serif
    fontSize: 16px
    fontWeight: 500
    lineHeight: 24px
  body-sm:
    fontFamily: NotionInter, Inter, -apple-system, system-ui, Segoe UI, Helvetica, Arial, sans-serif
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
  body-sm-strong:
    fontFamily: NotionInter, Inter, -apple-system, system-ui, Segoe UI, Helvetica, Arial, sans-serif
    fontSize: 14px
    fontWeight: 500
    lineHeight: 20px
  caption:
    fontFamily: NotionInter, Inter, -apple-system, system-ui, Segoe UI, Helvetica, Arial, sans-serif
    fontSize: 12px
    fontWeight: 400
    lineHeight: 16px
  caption-strong:
    fontFamily: NotionInter, Inter, -apple-system, system-ui, Segoe UI, Helvetica, Arial, sans-serif
    fontSize: 12px
    fontWeight: 600
    lineHeight: 16px
  label-eyebrow:
    fontFamily: NotionInter, Inter, -apple-system, system-ui, Segoe UI, Helvetica, Arial, sans-serif
    fontSize: 14px
    fontWeight: 600
    lineHeight: 20px
    letterSpacing: 0px
  button-md:
    fontFamily: NotionInter, Inter, -apple-system, system-ui, Segoe UI, Helvetica, Arial, sans-serif
    fontSize: 14px
    fontWeight: 500
    lineHeight: 20px
  button-lg:
    fontFamily: NotionInter, Inter, -apple-system, system-ui, Segoe UI, Helvetica, Arial, sans-serif
    fontSize: 16px
    fontWeight: 500
    lineHeight: 24px
rounded:
  none: 0px
  xs: 4px
  sm: 6px
  button: 8px
  card: 12px
  lg: 16px
  xl: 24px
  pill: 9999px
  full: 9999px
spacing:
  xxs: 4px
  xs: 6px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  2xl: 32px
  3xl: 48px
  4xl: 64px
  5xl: 96px
  6xl: 128px
  section: 192px
components:
  nav-bar:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    height: 64px
    padding: "{spacing.sm} {spacing.xl}"
    borderBottom: 1px solid {colors.hairline}
  nav-link:
    textColor: "{colors.body}"
    typography: "{typography.body-sm}"
    padding: "{spacing.sm} {spacing.md}"
    rounded: "{rounded.pill}"
  nav-cta-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-lg}"
    rounded: "{rounded.button}"
    padding: "{spacing.xs} {spacing.lg}"
    height: 36px
  nav-cta-login:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.button}"
    padding: "{spacing.sm} {spacing.lg}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-lg}"
    rounded: "{rounded.button}"
    padding: "{spacing.xs} {spacing.lg}"
  button-primary-active:
    backgroundColor: "{colors.primary-active}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-lg}"
    rounded: "{rounded.button}"
    padding: "{spacing.xs} {spacing.lg}"
  button-ghost:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.button}"
    padding: "{spacing.sm} {spacing.lg}"
    border: 1px solid {colors.hairline}
  button-ghost-pill:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.button}"
    padding: "{spacing.sm} {spacing.lg}"
    border: 1px solid {colors.hairline}
  hero-band:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.display-xl}"
    padding: "{spacing.4xl} {spacing.xl}"
  hero-inline-pill:
    backgroundColor: "{colors.primary-muted}"
    textColor: "{colors.primary}"
    typography: "{typography.display-xl}"
    rounded: "{rounded.pill}"
    padding: "{spacing.xs} {spacing.xl}"
  avatar-medallion:
    backgroundColor: "{colors.canvas}"
    borderColor: "{colors.hairline}"
    rounded: "{rounded.full}"
    size: 64px
  card-feature:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.card}"
    padding: "{spacing.xl}"
    border: 1px solid {colors.hairline}
  card-soft:
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.card}"
    padding: "{spacing.xl}"
    border: 1px solid {colors.hairline}
  logo-strip:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.mute}"
    typography: "{typography.body-sm}"
    padding: "{spacing.lg} {spacing.xl}"
  form-input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.body-md}"
    rounded: "{rounded.button}"
    padding: "{spacing.xs} {spacing.lg}"
    height: 40px
  badge-soft:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary}"
    typography: "{typography.caption-strong}"
    rounded: "{rounded.pill}"
    padding: "{spacing.xxs} {spacing.sm}"
  footer:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.mute}"
    typography: "{typography.body-sm}"
    padding: "{spacing.4xl} {spacing.xl}"
    borderTop: 1px solid {colors.hairline}
  link-inline:
    textColor: "{colors.primary}"
    typography: "{typography.body-md}"
  section-band:
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.display-lg}"
    padding: "{spacing.5xl} {spacing.xl}"
  ex-pricing-tier:
    description: Default pricing tier card on canvas with hairline border.
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    rounded: "{rounded.card}"
    padding: "{spacing.xl}"
  ex-pricing-tier-featured:
    description: Featured pricing tier — polarity-flipped to primary blue surface with white text.
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.card}"
    padding: "{spacing.xl}"
  ex-product-selector:
    description: Feature summary card on canvas-soft — used for AI / Teams / Enterprise tiers.
    backgroundColor: "{colors.canvas-soft}"
    rounded: "{rounded.card}"
    padding: "{spacing.xl}"
  ex-cart-drawer:
    description: Subscription summary panel — line items per add-on.
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.card}"
    padding: "{spacing.xl}"
    item-divider: "{colors.hairline}"
  ex-app-shell-row:
    description: Sidebar nav row. Active state uses primary blue as left-edge indicator.
    backgroundColor: "{colors.canvas}"
    activeIndicator: "{colors.primary}"
    rounded: "{rounded.sm}"
    padding: "{spacing.xxs} {spacing.sm}"
  ex-data-table-cell:
    description: Table chrome — header uses caption-strong uppercase; body uses body-sm.
    headerBackground: "{colors.canvas-soft}"
    headerTypography: "{typography.caption-strong}"
    bodyTypography: "{typography.body-sm}"
    cellPadding: "{spacing.sm} {spacing.lg}"
    rowBorder: "{colors.hairline}"
  ex-auth-form-card:
    description: Sign-in / sign-up card. Mirrors card-feature chrome with form-input primitives.
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.card}"
    padding: "{spacing.xl}"
  ex-modal-card:
    description: Modal dialog surface — card-feature chrome with elevated shadow.
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.card}"
    padding: "{spacing.xl}"
  ex-empty-state-card:
    description: Empty-state frame — generous padding on canvas-soft.
    backgroundColor: "{colors.canvas-soft}"
    rounded: "{rounded.card}"
    padding: "{spacing.3xl}"
    captionTypography: "{typography.body-md}"
  ex-toast:
    description: Toast notification — card-feature chrome, compact padding.
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.card}"
    padding: "{spacing.sm} {spacing.lg}"
    typography: "{typography.body-sm}"
---
## Overview

Notion's marketing surface is among the most restrained in the productivity software category — and it earns that restraint. The page is a pure white field with a single chromatic voice: a precise royal blue (`{colors.primary}` `#0075de`) that carries every conversion action from the nav CTA to the hero button. Nothing else competes with it. The muted gray palette (`{colors.mute}`, `{colors.mute-light}`) handles supporting text and decorative chrome; the hairline border (`{colors.hairline}`, 10% black alpha) handles every card edge and input stroke without ever reading as a heavy line. The brand's restraint is structural, not accidental.

Typography does most of the expressive work. NotionInter — a custom-tuned variant of Inter — runs the entire system at one face, two weights (400 / 500 / 600), and a display scale that opens at 96 px with -1.5 px tracking. The hero headline is enormous and almost architectural at that size, then immediately drops to a 16 px / 400-weight lead sentence below. The contrast between those two sizes IS the brand's editorial gesture. Negative letter-spacing is mandatory at display sizes; body text tracks neutral. Headlines are sentence-case with period punctuation, matching the brand's calm, direct tone.

The hero's signature moment is the inline animated pill — a soft periwinkle capsule (`{colors.primary-muted}` background, `{colors.primary}` text, `{rounded.pill}` shape) that wraps the rotating word "Think" inside the display-xl headline itself. This is the brand's only decorative trick at hero scale: no full-bleed gradient, no hero illustration, no video — just seven hand-drawn avatar medallions floating above the text and a single embedded UI element inside the copy. The restraint is deliberate and immediately legible as "Notion."

Surfaces cycle between `{colors.canvas}` white and `{colors.canvas-soft}` near-white (#f9f9f8) in alternating bands. Cards live on both surfaces and are always differentiated by a 1 px rgba hairline border — never a filled shadow. The only elevation cue is the card border itself. Button geometry splits into two precise shapes: `{rounded.button}` 8 px corner radius for every primary CTA (blue fill, white text), and `{rounded.pill}` 9999 px for every ghost / secondary action. These two shapes coexist in the same button row and are never swapped.

## Colors

### Brand & Primary
- **Primary Blue** (`{colors.primary}` — `#0075de`): The single conversion color. Appears on the "Get Notion free" nav CTA, the hero button, and all primary interactive elements. Never diluted to a tint for hero decorative use.
- **Primary Active** (`{colors.primary-active}` — `#005bab`): The pressed / focused state for primary buttons. Visible as `--color-button-primary-background-active` and `--color-blue-700` in the token set.
- **Primary Soft** (`{colors.primary-soft}` — `#e6f3fe`): A light sky-blue fill used for soft badge backgrounds, informational callout surfaces, and the hero inline-pill background.
- **Primary Muted** (`{colors.primary-muted}` — `#f2f9ff`): The palest blue surface — the near-white tint used for the hero animated-word pill and hover states on info banners.
- **Card Accent** (`{colors.card-accent}` — `#097fe8`): A slightly brighter mid-blue used as a decorative left-edge accent bar on feature cards and illustrated card headers.

### Surface
- **Canvas** (`{colors.canvas}` — `#ffffff`): Pure white — the primary card, modal, and nav surface.
- **Canvas Soft** (`{colors.canvas-soft}` — `#f9f9f8`): The near-white page-body background and alternating-band fill. Warm 98% white that reads as off-white next to pure canvas cards.
- **Hairline** (`{colors.hairline}` — `#0000001a`): 10% alpha black — every card border, input stroke, and table row divider. The brand never uses a solid gray border; every edge is this translucent ring.
- **Hairline Strong** (`{colors.hairline-strong}` — `#dfdcd9`): The named gray-300 token — used for slightly more visible dividers and focus-ring surfaces.
- **Alpha Black 100** (`{colors.alpha-black-100}` — `#0000000d`): A near-invisible 5% fill used for hover state backgrounds on ghost buttons and subtle interactive zones.

### Text
- **Ink** (`{colors.ink}` — `#000000f2`): 95% alpha black — every headline, primary body paragraph, and nav label on light surfaces.
- **Body** (`{colors.body}` — `#000000bf`): 75% alpha black — secondary body text, nav dropdown links, card supporting copy.
- **Mute** (`{colors.mute}` — `#78736f`): The gray-500 tone — logo strip labels, footer column body, de-emphasised captions.
- **Mute Light** (`{colors.mute-light}` — `#a39e98`): The gray-400 tone — placeholder text, fine print, lowest-priority labels.
- **On Primary** (`{colors.on-primary}` — `#ffffff`): All text on `{colors.primary}` surfaces — button labels, featured card text.

### Semantic
- **Success** (`{colors.success}` — `#1aae39`): Green-500 — status indicators, confirmation states.
- **Error** (`{colors.error}` — `#dd5b00`): Orange-600 — warning and error states.
- **Teal** (`{colors.teal}` — `#2a9d99`): A secondary accent visible in feature-area illustrations and icon highlights.
- **Purple** (`{colors.purple}` — `#7237ae`): A tertiary accent used in AI-feature callouts and avatar illustration details.
- **Purple Deep** (`{colors.purple-deep}` — `#391c57`): The deeper purple tone for dark-mode feature surfaces.
- **Pink** (`{colors.pink}` — `#ff64c8`): Pink-500 — occasional accent in AI-persona illustrated circles.

## Typography

### Font Family
The entire system runs on a single face: **NotionInter**, a custom-tuned build of Inter optimized for Notion's product and marketing surfaces. No second face is introduced — no mono, no serif, no display alternate. The brand's typographic voice comes entirely from size contrast and weight contrast within one humanist sans.

Open-source substitute: *Inter* (400 / 500 / 600) at matching sizes is effectively identical; `font-feature-settings: "ss01"` enables the circular punctuation that matches NotionInter's character.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 96px | 600 | 100px | -1.5px | Hero headline ("Where teams and agents Think together.") — the brand's architectural opening gesture. |
| `{typography.display-lg}` | 54px | 600 | 56px | -1.875px | Section headlines — the tightest tracked size in the scale. |
| `{typography.display-md}` | 36px | 600 | 40px | -0.8px | Mid-section headlines and feature-card cluster titles. |
| `{typography.display-sm}` | 24px | 600 | 28px | -0.4px | Card-level headlines and pricing-tier names. |
| `{typography.body-lg}` | 18px | 400 | 28px | 0 | Hero lead paragraph directly below the display-xl headline. |
| `{typography.body-md}` | 16px | 400 | 24px | 0 | Default body text, card descriptions, feature copy. |
| `{typography.body-md-strong}` | 16px | 500 | 24px | 0 | Bolded inline body, CTA label at marketing scale. |
| `{typography.body-sm}` | 14px | 400 | 20px | 0 | Nav links, secondary card copy, footer body. |
| `{typography.body-sm-strong}` | 14px | 500 | 20px | 0 | Nav dropdown headers, table-row emphasis. |
| `{typography.label-eyebrow}` | 14px | 600 | 20px | 0 | Section eyebrow labels above display-lg headlines. |
| `{typography.caption}` | 12px | 400 | 16px | 0 | Footer fine print, badge secondary labels. |
| `{typography.caption-strong}` | 12px | 600 | 16px | 0 | Badge labels, table column headers. |
| `{typography.button-md}` | 14px | 500 | 20px | 0 | Ghost pill button labels, nav-scale actions. |
| `{typography.button-lg}` | 16px | 500 | 24px | 0 | Primary CTA button labels at marketing scale. |

### Principles
- **Negative tracking is mandatory at display scale.** The 96 px hero headline tracks at -1.5 px; the 54 px section headline tracks at -1.875 px — tighter relative to size. Default tracking breaks the brand voice immediately.
- **Sentence-case headlines, period-terminated.** "Where teams and agents Think together." — the period is deliberate, part of the calm declarative tone.
- **One face, all roles.** NotionInter carries every surface. There is no mono face for technical contexts, no serif for editorial warmth — the brand's calm comes from typographic uniformity.
- **Weight 600 is the ceiling.** Headlines never appear at 700 or 800. The display sizes read massive because of size contrast, not weight contrast.
- **Size as the only dimension.** Colour is not used to create typographic hierarchy — only size, weight, and the alpha-black opacity steps (`{colors.ink}` vs `{colors.body}` vs `{colors.mute}`) differentiate levels.

## Layout

### Spacing System
- **Base unit**: 4 px. Every measured value on the page is a multiple of 4 (or the occasional 6 px micro-gap between inline badge elements).
- **Tokens**: `{spacing.xxs}` 4 px · `{spacing.xs}` 6 px · `{spacing.sm}` 8 px · `{spacing.md}` 12 px · `{spacing.lg}` 16 px · `{spacing.xl}` 24 px · `{spacing.2xl}` 32 px · `{spacing.3xl}` 48 px · `{spacing.4xl}` 64 px · `{spacing.5xl}` 96 px · `{spacing.6xl}` 128 px · `{spacing.section}` 192 px.
- **Section padding**: marketing bands use `{spacing.4xl}` to `{spacing.5xl}` top/bottom. The hero band is the most generous at near-section scale to give the display-xl headline vertical breathing room.
- **Card interior padding**: all feature and content cards use `{spacing.xl}` 24 px interior padding — the brand's consistent interior unit.
- **Button padding**: primary CTA buttons use `6px 15px` (mapped to `{spacing.xs}` vertical, `{spacing.lg}` horizontal). Ghost pill buttons use `8px 16px` (mapped to `{spacing.sm}` vertical, `{spacing.lg}` horizontal).
- **Inline gap**: button pairs in the hero (primary + ghost) use `{spacing.sm}` 8 px gap. Nav item gaps are `{spacing.md}` 12 px.

### Grid & Container
- **Max width**: approximately 1280 px; content centres with `{spacing.xl}` 24 px horizontal gutters on desktop scaling to `{spacing.lg}` 16 px on mobile.
- **Column patterns**:
  - Hero: single centred column, headline + sub-copy + button pair, avatar row floats above.
  - Feature card grid: 3-up at desktop, 1-up at mobile.
  - Logo strip: single fluid row of customer logos at consistent height, centred.
  - Pricing tier grid: 3-up at desktop, vertical stack at mobile.

### Whitespace Philosophy
The brand earns its calm through generous band-to-band spacing and tight interior packing. Display-xl headlines sit with large vertical margins above and below; the lead sentence beneath is tight to the headline (`{spacing.xl}` gap), then a wider gap before the CTA row. Cards pack tightly — `{spacing.xl}` interior padding, `{spacing.xl}` gap between cards in the grid. The page reads as orderly and unhurried, never cramped, never loosely assembled.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Level 0 — Flat | No shadow, no border. | Full-bleed hero and section bands. |
| Level 1 — Hairline Ring | `1px solid rgba(0,0,0,0.10)` border only. | Default card chrome — the brand's universal card cue. No drop-shadow. |
| Level 2 — Hairline + Soft Fill | `1px solid rgba(0,0,0,0.10)` border on `{colors.canvas-soft}` surface. | Inset or nested card panels, form surfaces inside cards. |
| Level 3 — Overlay | `1px solid {colors.hairline}` border + `box-shadow: 0 4px 16px rgba(0,0,0,0.08)`. | Dropdown menus, nav mega-menu panels, tooltip surfaces. |
| Level 4 — Modal | `1px solid {colors.hairline}` + `box-shadow: 0 8px 32px rgba(0,0,0,0.12)`. | Modal / dialog overlays. |

Notion's elevation system is among the flattest in the productivity software category. Cards are differentiated from their background by hairline border alone — never by drop-shadow on the default marketing surface. This reflects the product's own UI philosophy: Notion pages are flat documents; elevation is functional, not decorative.

### Decorative Depth
- **Avatar medallion stack**: seven circular illustrated avatars arranged in a horizontal overlapping row above the hero headline — each a `{rounded.full}` circle with a `{colors.hairline}` border ring. The overlap creates implied depth without any shadow.
- **Inline hero pill**: the animated word-switcher pill inside the headline (periwinkle fill, `{rounded.pill}`) is the only intra-text UI element — it reads as slightly elevated inside the copy stream because of its background fill, but carries no shadow.
- **Band alternation**: switching surfaces from `{colors.canvas}` to `{colors.canvas-soft}` every two sections is the brand's primary depth and rhythm cue — not shadows.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Full-bleed hero / footer bands, image flush-edge moments. |
| `{rounded.xs}` | 4px | Tightest badge / chip shape — rarely used. |
| `{rounded.sm}` | 6px | Small interactive targets, tag chips. |
| `{rounded.button}` | 8px | **The primary CTA shape.** Every "Get Notion free" button, every blue primary action. Deliberately rectangular compared to ghost pills. |
| `{rounded.card}` | 12px | Feature cards, pricing cards, content panels, form containers. |
| `{rounded.lg}` | 16px | Larger content panels, image-cap cards. |
| `{rounded.xl}` | 24px | Largest card chrome, modal dialog corners. |
| `{rounded.pill}` | 9999px | Ghost / secondary buttons ("Request a demo"), nav links on hover, badge pills, the hero inline animated word. The brand's "soft" shape vocabulary. |
| `{rounded.full}` | 9999px | Avatar medallions, icon-button circular containers. |

### Key Shape Tension
The brand deliberately operates two button shapes simultaneously: the 8 px rectangular primary CTA beside the 9999 px pill ghost CTA. This tension — hard corner vs. full pill — is intentional and distinctive. Flattening both to the same radius breaks the visual grammar.

## Components

### Navigation

**`nav-bar`** — The sticky top navigation, white surface with a bottom hairline.
- Height 64 px, background `{colors.canvas}`, padding `{spacing.sm} {spacing.xl}`. Layout: Notion mark logo left, dropdown link row centre-left, "Request a demo" ghost + "Get Notion free" blue CTA + "Log in" text right.

**`nav-link`** — Navigation dropdown trigger links ("Product", "AI", "Solutions" etc.).
- Text `{colors.body}`, typography `{typography.body-sm}`, pill-shaped hover state at `{rounded.pill}`, padding `{spacing.sm} {spacing.md}`.

**`nav-cta-primary`** — The blue "Get Notion free" button in the nav.
- Background `{colors.primary}`, text `{colors.on-primary}`, typography `{typography.button-lg}`, radius `{rounded.button}` 8 px (the brand's measured CTA radius), padding `{spacing.xs} {spacing.lg}`, height 36 px.

**`nav-cta-login`** — The "Log in" text button.
- Transparent background, text `{colors.ink}`, typography `{typography.body-sm}`, `{rounded.pill}`.

### Buttons

**`button-primary`** — The canonical marketing CTA.
- Background `{colors.primary}`, text `{colors.on-primary}`, typography `{typography.button-lg}`, radius `{rounded.button}` 8 px. Appears at hero scale and inside section bands.

**`button-primary-active`** — Pressed / focused state of the primary CTA.
- Background `{colors.primary-active}` (`#005bab`), otherwise identical to `button-primary`.

**`button-ghost`** — The secondary marketing action.
- Background `{colors.canvas}`, text `{colors.ink}`, typography `{typography.button-md}`, radius `{rounded.pill}` 9999 px, 1 px solid `{colors.hairline}` border. Pairs beside `button-primary` in every hero CTA row.

**`button-ghost-pill`** — A borderless pill ghost for in-section lighter actions.
- Transparent background, text `{colors.ink}`, typography `{typography.button-md}`, radius `{rounded.pill}`, hairline border.

### Cards & Containers

**`card-feature`** — The canonical feature / content card.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.xl}` 24 px, radius `{rounded.card}` 12 px, `1px solid {colors.hairline}` border. No drop-shadow on the marketing surface.

**`card-soft`** — The inset / nested card on canvas-soft sections.
- Background `{colors.canvas-soft}`, same border and radius as `card-feature`.

**`hero-inline-pill`** — The animated word-switcher embedded inside the hero headline.
- Background `{colors.primary-muted}`, text `{colors.primary}`, typography `{typography.display-xl}`, radius `{rounded.pill}`. This is a UI element living inside display copy — unique to Notion's hero pattern.

**`avatar-medallion`** — The circular illustrated character avatar used in the hero row.
- Background `{colors.canvas}`, `{rounded.full}`, 1 px `{colors.hairline}` border ring, 64 px diameter. Arranged in an overlapping horizontal sequence above the headline.

**`badge-soft`** — Small metadata badge / status pill.
- Background `{colors.primary-soft}`, text `{colors.primary}`, typography `{typography.caption-strong}`, radius `{rounded.pill}`, padding `{spacing.xxs} {spacing.sm}`.

### Inputs & Forms

**`form-input`** — Text input at standard height.
- Background `{colors.canvas}`, text `{colors.ink}`, 1 px solid `{colors.hairline}` border, typography `{typography.body-md}`, radius `{rounded.button}` 8 px, padding `{spacing.xs} {spacing.lg}`, height 40 px.

### Layout Bands

**`hero-band`** — The white hero section with avatar row + display headline + lead + CTA pair.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.4xl} {spacing.xl}`. Headlines at `{typography.display-xl}`, lead at `{typography.body-lg}`.

**`section-band`** — A standard alternating marketing section.
- Background `{colors.canvas-soft}`, text `{colors.ink}`, padding `{spacing.5xl} {spacing.xl}`. Section headline at `{typography.display-lg}`, supporting body at `{typography.body-md}`.

**`logo-strip`** — The customer-logo wrapping row (OpenAI, Figma, Ramp, Cursor, Vercel, Nvidia, Volvo, L'Oréal, Discord).
- Background `{colors.canvas}`, text `{colors.mute}`, padding `{spacing.lg} {spacing.xl}`. Logos rendered as monochrome marks at consistent height, dot-separated.

**`footer`** — The bottom multi-column navigation.
- Background `{colors.canvas}`, text `{colors.mute}`, typography `{typography.body-sm}`, padding `{spacing.4xl} {spacing.xl}`, `1px solid {colors.hairline}` top border.

**`link-inline`** — Inline body-copy links.
- Text `{colors.primary}`, typography `{typography.body-md}`.

## Do's and Don'ts

### Do
- Use `{rounded.button}` 8 px for every primary blue CTA and `{rounded.pill}` for every ghost / secondary button. The two-shape system is the brand's most visible grammar rule.
- Set hero headlines in `{typography.display-xl}` 96 px / 600 weight with -1.5 px tracking. The large-to-small contrast between headline and lead paragraph IS the brand's editorial voice.
- Keep the primary blue (`{colors.primary}` `#0075de`) as the singular conversion color. It appears on exactly one element per view — the primary CTA. Do not apply it to decorative elements or backgrounds except the `primary-soft` / `primary-muted` tints.
- Use `1px solid rgba(0,0,0,0.10)` hairline borders to differentiate cards from their background surface. Never substitute a gray hex border; the alpha transparency is how the border adapts across light and dark contexts.
- Alternate sections between `{colors.canvas}` and `{colors.canvas-soft}` surfaces to create band rhythm without introducing additional colors.
- Sentence-case every headline, period-terminated. Notion speaks declaratively and calmly.
- Use the avatar medallion row (`{rounded.full}` circle, hairline border) as the hero's decorative element — it is the brand's illustrated signature at marketing scale.

### Don't
- Don't round primary CTA buttons to pill shape. The 8 px rectangular button is non-negotiable; rounding to 9999 px erases the primary/secondary button distinction.
- Don't introduce drop-shadows on feature cards. Hairline border only — this is fundamental to the brand's flat, document-like surface philosophy.
- Don't introduce a second typeface. NotionInter is the entire typographic system; adding a mono or display alternate breaks the brand's calm uniformity.
- Don't render headlines in all-caps or apply positive letter-spacing at display size. Negative tracking at display scale is the voice.
- Don't use the blue primary (`{colors.primary}`) for decorative fills, background bands, or illustration details. It belongs exclusively to interactive conversion targets.
- Don't set body or secondary text in weight 600. Weight 600 is the display ceiling; body-md-strong tops at 500.
- Don't omit the period at the end of display headlines. "Where teams and agents Think together." — the punctuation is editorial, not optional.
