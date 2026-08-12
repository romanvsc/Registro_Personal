# Design QA — Login

**Source visual truth**

- Conversation attachment: desktop login reference supplied by the user.
- Source dimensions: 1536 × 1024 px.
- Intended comparison viewport: 1536 × 1024 CSS px at device scale factor 1.
- State: initial login form, password hidden, no validation error.

**Implementation evidence**

- Route: `http://127.0.0.1:5173/login`.
- Implementation screenshot path: unavailable.
- Browser-rendered CSS size and pixel dimensions: unavailable.
- Density normalization: not possible without a browser capture.

**Findings**

- [P0] Browser-rendered comparison unavailable
  - Location: complete login screen.
  - Evidence: neither the in-app browser nor Chrome is available in this session, so the implementation could not be captured at the reference viewport.
  - Impact: typography, spacing, crop, responsive behavior and interaction states cannot be visually accepted against the reference.
  - Fix: open `/login` in an available browser at 1536 × 1024, capture it, place it beside the supplied reference, then run the visual comparison loop.

**Required fidelity surfaces**

- Fonts and typography: implemented with Nunito and DM Sans; visual comparison blocked.
- Spacing and layout rhythm: implemented as a two-column desktop layout with responsive single-column mobile layout; visual comparison blocked.
- Colors and visual tokens: uses the approved cream, sand, cocoa, Dorito, Felicia and Felipa palette; visual comparison blocked.
- Image quality and asset fidelity: revised group portrait saved at `public/auth/cats-login-hero-v2.png`; hard arch removed and outer background changed to cream; final browser comparison blocked.
- Copy and content: adapted from the reference to the existing `Mi registro` product and Rioplatense Spanish.

**Interaction checks**

- Source-level behavior implemented: required-field message, password visibility toggle, loading state, demo-session persistence and navigation to dashboard.
- Browser interaction test: blocked because no browser surface is available.
- Console errors: not checked for the same reason.

**Full-view comparison evidence**

- Source reference opened in the conversation.
- No implementation screenshot could be captured, so a combined side-by-side comparison was not possible.

**Focused region comparison evidence**

- Not performed because the required full implementation capture is unavailable.

**Comparison history**

- Iteration 1: implementation completed and production build passed; visual capture blocked before the first comparison.
- Iteration 2: user evidence showed a P1 hard arch/crop around the portrait. Replaced the orange background with a cream version, removed the arch and reduced the transition to a soft lower fade. Post-fix browser capture remains unavailable.
- Iteration 3: user evidence still showed a P1 rectangular color boundary. Sampled the image edges (`#FDF7EC`), matched the panel background to that value and added intersecting horizontal/vertical masks so all four image edges fade into the panel. Post-fix browser capture remains unavailable.

**Implementation checklist**

- Capture `/login` at 1536 × 1024.
- Compare overall two-column proportions and hero crop.
- Compare form-card width, padding, typography and vertical rhythm.
- Test password toggle, empty submit, valid submit and mobile breakpoint.
- Check browser console and repeat after P0/P1/P2 fixes.

**Follow-up polish**

- Evaluate whether the generated portrait needs a slightly lower crop after the first browser capture.

final result: blocked
