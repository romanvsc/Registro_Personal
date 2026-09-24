# Design QA — Sistema neobrutalista amable 1.2.0

## Source visual truth

- Conversation source: ImageGen ideation option 3, the selected neo-brutalist friendly direction.
- Source visual dimensions: 1440 × 1024 px concept shown inline in the conversation; no separate source file was created.
- Intent used for comparison: warm paper canvas, cocoa ink, editorial rails, flat semantic blocks, offset shadows and a horizontal hero.

## Implementation evidence

- Local route used for capture: `http://127.0.0.1:5125/registro_gatos/`.
- Capture method: Edge CUA browser, inline screenshots reviewed in this turn.
- Desktop viewport: 1440 × 1000 CSS px, default device scale factor.
- Mobile viewport: 390 × 844 CSS px, default device scale factor.
- States: authenticated synthetic `Usuario Demo`, 36 journal entries, 20 trend points, three active types; public login/register states were also captured after synthetic logout.
- The API was a temporary mock process. No backend, database or `backend/config.php` was changed.

## Full-view comparison evidence

- Dashboard desktop top and lower scroll: hero remains the focal point; summary, trend, quick actions and wellbeing use distinct semantic blocks rather than uniform white cards.
- Dashboard mobile: header, hero, summary and trend reflow without horizontal overflow.
- Record desktop and mobile: active type tabs, score panel, dynamic field rail and action bar share the same border/shadow language.
- History, type administration and profile: rails, separators, cocoa borders and orange primary actions remain consistent.
- Login and register desktop/mobile: public surfaces use the same palette, field borders, focus treatment and CTA hierarchy.
- The comparison was performed against the inline source direction and the inline implementation captures; no composite image artifact was required because the source exists only in the conversation.

## Focused-region evidence

- Hero: 3 px cocoa border, solid offset shadow and warm flat surface; cat and score remain visually dominant.
- Trend: lavender editorial block with visible date range, textual summary and horizontal-scroll hint.
- Journal score panel: orange focal surface with a genuine empty score state and no competing animation.
- Navigation and menus: cocoa rule, orange active block, compact seals/icons and bounded playful hover.
- Dialogs, toasts and version badge: semantic rails, solid shadows and preserved keyboard semantics.

## Findings

- No remaining P0, P1 or P2 visual findings after the final pass.
- Known pre-existing copy/encoding artifacts such as `Estado de ?nimo` remain outside this presentation-only iteration; historical text/data repair was intentionally not included.

## Comparison history

- Initial 1.2.0 record capture exposed a P2 horizontal overflow in the journal submenu after adding offset shadows/transforms.
- Fixed the issue in `JournalNavigation.vue` with bounded menu overflow, `min-width: 0` links and right padding that preserves the shadow inside the rail.
- Post-fix desktop capture measured document and body widths equal to the viewport; the journal menu reported `scrollWidth === clientWidth` with `overflow-x: hidden`.
- Mobile dashboard capture measured no horizontal overflow at 390 px. Reduced-motion capture reported decorative hero/cat animations as `none` while preserving the same layout.

## Acceptance checks

- Routes captured: `/login`, `/registro`, `/`, `/registrar/comida`, `/historial`, `/configuracion/tipos` and `/perfil`.
- Viewports captured: 390 × 844 and 1440 × 1000.
- `v1.2.0` is visible in the application.
- No horizontal scroll at the primary mobile viewport.
- Focus styling, keyboard-oriented controls, dialog Escape/focus restoration, alert semantics and reduced-motion policy remain present.
- Build, focused motion/insights/toast/journal/identity/trend tests and `git diff --check` passed.

final result: passed
