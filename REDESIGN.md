# ProRack Global redesign

## Current direction â€” 10 October 2026

The editorial direction is finalized. The homepage has seven purposeful sections:
hero, portfolio, requirements, three businesses, technology ecosystem, team and
enquiry. The industry list is a compact note inside the requirement guide. Five
image-free capability cards remain below the hero and the Team card links to the
homepage team section. GSAP provides selective, reduced-motion-aware reveals;
Embla adds drag, swipe, keyboard and button navigation to the eight-system
portfolio. The requirement guide retains independent state and matched enquiries.
Blue and orange remain controlled accents. Shared gutters, typography, inner-page
heroes and catalog styling are refined across the 12 existing routes.

Existing hero/product imagery remains illustrative. One new industrial detail
concept was generated, compressed into desktop/mobile WebP assets and explicitly
labelled. The team section uses the existing leadership portrait and company copy.
See [the latest handoff](artifacts/editorial-upgrade/README.md) for screenshots,
checks, dependency versions and the exact image generation prompt. The local
preview and current dist.zip are ready; no production deployment was made.

## Previous implementation record

Implemented directly in the existing repository. React, esbuild, all 12 static
routes, deployment settings, existing logo and suitable imagery are retained.
No production publication or hosting changes were made.

## Preview

Run `npm.cmd run bundle` followed by `npm.cmd start` and open
http://localhost:4600/. `npm.cmd run check` checks all local links, image assets,
fragment targets, the eight-system portfolio and the consultation form.

## Design and content

- Warm off-white, graphite and restrained ProRack orange; generous space,
  confident typography, large warehouse imagery and architectural product layouts.
- A new homepage with an accessible eight-system product explorer, project
  delivery sequence, the three business units, digital intelligence, company
  heritage, industries and project consultation.
- Shared navigation, native accessible menu/search dialogs, digital subnavigation,
  consistent inner-page introductions and responsive layouts throughout.
- Reviewed the current website and all five supplied references. Used the approved
  `ProRack_Storage_Solutions_Website_Copy_Final_V1.docx` downloaded from the shared
  SharePoint folder. Added its wider product configurations and careers content.
- Preserved current contact details and leadership. The approved document excludes
  historical parent-company credentials, so those references were removed.
- Existing platform interactions remain, with demonstrations and sample data
  explicitly labelled. Named sample customers were replaced with neutral examples.
- Responsive WebP hero: approximately 275 KB desktop / 82 KB mobile, down from
  the existing 2.4 MB PNG. Existing source imagery remains in the repository.

## Verification evidence

Final result: all 72 route/viewport combinations passed with no overflow, failed
images, browser errors, failed requests or automated WCAG A/AA violations. Fourteen
interaction test groups passed. Static checks and the existing production build
passed. The build output was compared with the current page/component/style files.

- Build: `npm.cmd run build`.
- Static checks: `npm.cmd run check`.
- Browser layout/accessibility audit: `node tmp/browser-audit.mjs`; evidence in
  `tmp/browser-audit.json`. All 12 routes at 320, 390, 768, 1024, 1440 and 1920 pixels.
- Interaction checks: `node tmp/interaction-tests.mjs`; evidence in
  `tmp/interaction-results.json`. Covers eight product selectors, search keyboard
  controls and focus restoration, mobile menu, telemetry pause/resume, connectors,
  simulated sync, clipboard copy, workstream filters, role simulation, copilot and
  RFQ validation/product preselection. Form submission was intercepted; no enquiry
  was sent.
- Desktop/mobile screenshots: `tmp/redesign-{route}-desktop.png` and
  `tmp/redesign-{route}-mobile.png`. Homepage viewport screenshots:
  `tmp/homepage-desktop-preview.png` and `tmp/homepage-mobile-preview.png`.
- Final screenshots and JSON verification reports are also packaged in
  `artifacts/prorack-redesign/`.
- Browser verification uses temporary Playwright/axe tooling in
  `tmp/browser-tools`; application dependencies are unchanged.

## Colour, components and scroll enhancements

Orange, teal, lime and blue now distinguish storage, engineering, execution and
digital intelligence. The homepage adds a four-part capability navigation strip
and a five-priority storage selector that opens the relevant existing portfolio
system. All eight product choices remain available. Inner-page hero backgrounds,
product dividers, execution sections and the contact form share the colour system.

IntersectionObserver adds one-time section reveals and highlights delivery stages
as they enter view. Desktop hero imagery moves gently within its frame. A reading
progress line and a keyboard-accessible back-to-top control work across all routes.
The implementation uses existing React islands and browser APIs without adding
application dependencies. Content remains readable without motion or JavaScript;
reduced-motion preferences disable animation and image movement, including when
the preference changes while the page is open. Phone images remain stationary.

`node tmp/colour-effects-tests.mjs` verifies priority selection, keyboard access,
section reveals, progress, back-to-top positioning/focus, reduced motion and
capability links. `node tmp/responsive-sweep.mjs` checks another 120 route/width
combinations at 360, 414, 600, 760, 761, 820, 1040, 1041, 1100 and 1280 pixels with
a landscape-height viewport. Tablet access-role controls now wrap rather than
extending outside their panel. Reports and component screenshots are included in
`artifacts/prorack-redesign/`.

## Colour, components and scroll enhancements

Orange, teal, lime and blue now distinguish storage, engineering, execution and
digital intelligence. The homepage adds a four-part capability navigation strip
and a five-priority storage selector that opens the relevant existing portfolio
system. All eight product choices remain available. Inner-page hero backgrounds,
product dividers, execution sections and the contact form share the colour system.

IntersectionObserver adds one-time section reveals and highlights delivery stages
as they enter view. Desktop hero imagery moves gently within its frame. A reading
progress line and a keyboard-accessible back-to-top control work across all routes.
The implementation uses existing React islands and browser APIs without adding
application dependencies. Content remains readable without motion or JavaScript;
reduced-motion preferences disable animation and image movement, including when
the preference changes while the page is open. Phone images remain stationary.

`node tmp/colour-effects-tests.mjs` verifies priority selection, keyboard access,
section reveals, progress, back-to-top positioning/focus, reduced motion and
capability links. `node tmp/responsive-sweep.mjs` checks another 120 route/width
combinations at 360, 414, 600, 760, 761, 820, 1040, 1041, 1100 and 1280 pixels with
a landscape-height viewport. Tablet access-role controls now wrap rather than
extending outside their panel. Reports and component screenshots are included in
`artifacts/prorack-redesign/`.

## Remaining limitations

The original RFQ uses `mailto:sales@prorack.ai`; no server-side submission endpoint
exists in this repository. Its behavior is preserved and explained on the form.
Delivery requires the visitor's email application and sending the resulting email.
An actual external email delivery was not tested.

The approved copy leaves final Promech positioning open. The existing Promech
Integration Services capabilities are retained, as requested. Existing detailed
product capacities and engineering claims require final specification confirmation
before publication, as the approved copy itself states. IIT-Powai work remains
clearly labelled as planned.

Automated accessibility checks and keyboard tests do not replace testing with
assistive technology or physical mobile devices. No production integration access
or real machine connection was provided; digital interactions are demonstrations.

Homepage people section removed at user request. The text-only Team card now
links to `company.html#leadership`; company leadership content is retained.

## Editorial direction update — 12 October 2026

Applied the editorial-first brief to the existing local website. The homepage now
opens with an oversized headline and project introduction above a broad warehouse
image. Five quiet, ruled capability links replace decorative navigation cards.
Shared product and page-image frames use square edges; orange is concentrated in
small accents and the closing enquiry section. Added an engineering-notes story
using the existing custom SVG to explain receiving, lift, shuttle and dispatch.
Removed staggered entrance animation from navigation and informational lists;
headline reveals remain reduced-motion-aware and essential text stays readable.

Imagery remains explicitly illustrative/conceptual where appropriate. Verified
ProRack installation, manufacturing and facility photography is still required
for the final photography brief. No generated asset is presented as a real project.
The existing leadership portrait remains in use.

Validation: npm run check, npm run build; responsive checks on all 12 routes at
320, 390, 768 and 1440 px; automated homepage WCAG checks on mobile and desktop;
portfolio, requirement enquiry and live reduced-motion checks. Evidence lives in
artifacts/editorial-direction/. Local build only; no production deployment.

## Finalized homepage brief — 12 October 2026

The latest brief supersedes the headline-above-image variation. The homepage now
has exactly seven purposeful sections: full-width hero with the headline directly
over its image, interactive product portfolio, requirement guide, three businesses,
technology/ecosystem, team, and enquiry. Removed the repetitive capability strip
and extra engineering-notes section; technical diagrams remain in the solutions
page. Condensed industries into one sentence and team disciplines into a short row.

The portfolio uses a large image with an overlapping numbered editorial caption,
button/keyboard/drag controls on desktop, and swipe plus a native picker on mobile.
The requirement guide has clearer goal-oriented copy, an explicit suggested system,
and a compact mobile picker without forced scrolling. Shared internal-page heroes,
image frames, typography and catalog spacing follow the same language.

At the user's instruction, imagery uses only assets already in the project. No
new imagery was generated. Existing illustrative/concept labels are retained;
no available concept image is represented as verified ProRack project photography.
Six existing internal-page JPEGs were converted to WebP: 5,596,758 bytes became
784,346 bytes (86% reduction). Original files remain available. No homepage video.

Verification: static checks, production bundle/build, 48 route/viewport layout
checks, automated homepage accessibility on desktop/mobile, desktop and mobile
portfolio selection, keyboard navigation, requirement enquiry links, seven-section
structure, hero overlay, and live reduced-motion changes. Evidence and screenshots:
artifacts/editorial-final/. Preview runs at http://localhost:4600/. No deployment.

## Portfolio crawlability for answer engines - 12 October 2026

The eight-system portfolio rendered only through the React storage explorer, so
`index.html` shipped an empty mount point for it. Google renders JavaScript and
saw the portfolio, but most answer-engine crawlers (GPTBot, ClaudeBot,
PerplexityBot and similar) do not execute scripts, so the core product range was
absent from the page they actually read.

Added a `<noscript>` mirror of the explorer inside the portfolio section. It is
generated from the component's own `storageSystems` array in `src/app.jsx`, so the
two cannot drift, and it carries each system's image, name, description and deep
link to the matching `solutions.html` anchor. Styling lives in `assets/editorial.css`
under `.portfolio-fallback`. The block also makes the portfolio readable when
JavaScript fails to load.

Static `index.html` went from 3 images and 41 links to 11 images and 49 links,
with all eight system names and 14 `solutions.html#` deep links now present. The
JavaScript-rendered page is unchanged (12 images, 718 words, 93 links), so there
is no duplicate content, no flash of fallback markup and no layout change.

The remaining empty mounts are the labelled interactive demonstrations
(`react-platform-matrix`, `react-operations-monitor`, `react-telemetry`,
`react-copilot-interactive`, `react-rbac-simulator`) and the requirement guide.
These were deliberately left script-only: they carry sample data, and putting it
in static markup risks answer engines citing demonstration telemetry as real
operating figures. The requirement guide only maps priorities onto the same eight
systems the fallback already exposes.

Validation: `npm run check` and `npm run build` pass; all eight fallback anchors
resolve against `solutions.html`; rendered-versus-static DOM compared with
JavaScript enabled and disabled. Evidence in `artifacts/portfolio-crawlability/`.
Local build only; no deployment.

## OpenSourceUI motion adaptation — 12 October 2026

Adapted Fine Grain, Graph Paper and Soft Spotlight from opensourceui.in into the
existing CSS system, retaining the MIT notice in assets/opensourceui-LICENSE.txt.
Added drifting texture and a soft spotlight to heroes/editorial surfaces, a moving
engineering grid to the ecosystem, desktop scroll-driven image parallax, restrained
image hover zoom, directional link feedback and content-change transitions.
Current content and sections were preserved. No dependency additions.

Pause motion disables decorative loops and GSAP motion. Loops pause off-screen
and in hidden tabs. Reduced-motion disables loops/parallax; mobile has stationary
images and static hero grain, with a slower light effect. Animation controls remain
keyboard accessible. The JavaScript-free site keeps its existing readable content.

Validation: static checks, bundle and production build; 24 desktop/mobile route
checks; moving texture, pause/resume, duplicate-layer cleanup, live reduced-motion,
mobile image stability and homepage automated accessibility. Evidence is in
artifacts/editorial-motion/. Preview: http://localhost:4600/. Local only.

## Cinematic imagery and tinted glass — 12 October 2026

Applied the supplied photographs as visual references: deeper contrast, restrained
saturation, cool industrial shadows, warm light and subtle vignette/frame depth.
The references were not inserted as ProRack projects. Existing source imagery and
concept labels remain. Content photography and inner-page background photos share
a CSS treatment; diagrams/logos are excluded, portraits use only a gentle grade.
Product compositions remain readable without altering depicted rack geometry.

Five homepage capability cards retain peach, mint, lime, blue and warm-neutral
hues while using translucent gradients, frosted backdrop blur, edge highlights and
light shadows. Added a coloured backdrop behind the cards, lighter mobile blur,
a fallback for browsers without backdrop-filter, and retained keyboard focus.

Validation: static check; 48 responsive route checks; automated accessibility on
homepage, solutions, engineering and company at desktop/mobile; five glass cards,
image loading, and unchanged logo rendering. Evidence: artifacts/cinematic-glass/.
Copied the shared stylesheet to dist. Existing ZIP files were left untouched.

## Hero logo editorial signature — 12 October 2026

Latest direction supersedes the blue/orange logo spotlight treatment. Removed the
CSS halo, duplicated wordmark and all logo container effects. Signature width is
60% of the preceding design (204–276 px desktop; 204 px mobile), aligned with the
headline. Original JPEG logo pixels are embedded in a transparent SVG wrapper:
background knockout plus white lettering, with original orange pixels composited
back in. Geometry is not redrawn; the generated logo is no longer used in the hero.
Full wordmark opacity retained. Photograph, typography, navigation and motion are
preserved. Six responsive widths and desktop/mobile hero accessibility passed.
Evidence: artifacts/hero-brand-blend/. Source and dist updated; ZIPs untouched.

## Editorial photography replacement and exposure pass — 12 October 2026

Replaced the homepage hero with a generated editorial warehouse scene: naturally
sunlit pale concrete wall/floor on left, storage depth and forklift on right. Navy
headline and unchanged blue/orange logo are now readable on the architectural
surface. No logo glow/container. Hero uses optimized desktop/mobile WebP sources.
Latest supplied blue/orange logo is used directly via prorack-hero-logo.webp.

Replaced 17 content photography assets with refined editorial versions across all
pages and CSS hero backgrounds: eight storage systems, six engineering/production/
technology scenes, component detail, rack-clad/platform and ASRS concept. Source
files remain preserved. New assets reside in assets/editorial-photography/. Added
low-key display exposure to the component detail, selected warehouse systems,
quality inspection and technology images, inspired by supplied cinematic refs.
Logo/portrait/technical diagrams retain their identities. All generated imagery
is illustrative; no new image is described as a verified ProRack installation.

Generation used built-in image_gen. Complete prompts and asset mapping are saved
in artifacts/editorial-photography/image-generation-prompts.json. A later optional
mobile recompose attempt failed due to image-tool authentication; existing completed
hero imagery is used with responsive left-aligned cropping. The latest exposure
pass uses CSS grading, preserving the completed image geometry.

Validation: npm run check and production bundle; 48 responsive route checks,
eight automated accessibility checks, six hero layout widths, image-loading checks.
Evidence: artifacts/cinematic-glass/, artifacts/hero-brand-blend/ and detail captures
in artifacts/editorial-photography/. Source synced to dist without replacing ZIPs.
Local preview only; production site not changed.
