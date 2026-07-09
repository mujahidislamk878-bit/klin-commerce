# Klin Landing Page — Build Plan

A premium, cinematic landing page for Klin (visual website builder). Single-page experience in TanStack Start with real Puck editor embedded in Section 3.

## Stack notes
The project runs on TanStack Start (React 19 + Vite 7 + Tailwind v4), not Next.js. I'll keep every other library you listed: **Puck, Framer Motion, GSAP + ScrollTrigger, Lenis, shadcn/ui, TypeScript, Tailwind**. Functionally identical — TanStack Start is Lovable's supported React framework.

## Design system (src/styles.css)
- Base `#F6F7FB`, blob colors: lavender `#E7E4FF`, mint `#DFF7EE`, sky `#E5F1FF`, cream `#FFF7E9`.
- Tokens: `--radius-card: 28px`, `--shadow-float`, `--shadow-lift`, `--grain` SVG data-URL utility.
- Type: display font (Instrument Serif or Cabinet Grotesk-style via fontsource) + Inter body. Loaded via `<link>` in `__root.tsx`.
- Utilities: `.floating-card`, `.blob`, `.grain`, `.magnetic`, `.tilt`.

## Sections (single route `/`)
1. **Global chrome** — Lenis smooth scroll provider, cursor-follow glow, floating status chips (Live Editing / Draft Saved / Published / Responsive) that swap on scroll progress.
2. **Hero** — Left: headline "Let's Play. Build websites that grow your business.", subheading, Start Free + Watch Demo (magnetic), 120K+ / 4.9★ stats. Right: floating universe of ~32 template preview cards rendered from the shared Puck template data (see below). Cards drift with spring physics, react to mouse (parallax + tilt), hover pauses + lifts + glows + reveals Preview / Edit Template.
3. **Section 2 — Template wall** — Organic drifting cards driven by GSAP ScrollTrigger; y-translate, blur, scale, rotate keyed to scroll. No grid.
4. **Section 3 — Interactive Playground (real Puck)** — Full Puck editor with custom config (Navbar, Hero, FeatureGrid, Gallery, Testimonials, Pricing, FAQ, CTA, Footer). Loaded with a default template. Floating category chips above swap the Puck data with animated canvas reload. Custom top toolbar (Undo/Redo/Preview/Desktop/Tablet/Mobile/Save/Publish), left sidebar tabs (Pages/Navigator/Components/Templates/Media/Theme), right sidebar tabs (Typography/Spacing/Colors/Background/Borders/Animations/Responsive/Visibility/Advanced). Between sections: floating `+` insert button opening a section picker. Row/column hover controls via a custom DropZone wrapper.
5. **Section 4 — Storytelling** — Four full-viewport pinned cards with GSAP ScrollTrigger: (1) Drag visually, (2) Customize freely, (3) Responsive (desktop→tablet→mobile morph), (4) Publish (deployment animation).
6. **Section 5 — Built with Klin** — Horizontal marquee of website cards (Framer Motion infinite scroll), hover pauses, click opens template in the playground.
7. **Section 6 — Pricing** — Three large floating cards, monthly/yearly toggle with spring animation.
8. **Section 7 — Final CTA** — "Stop imagining. Start building." + Start Free.

## Shared template data
`src/lib/klin-templates.ts` exports Puck-compatible JSON per industry (Restaurant, Fashion, Agency, Medical, Gym, Store, Portfolio, Photography, Construction, Salon, Real Estate, Interior, Law Firm, Cafe, Startup). Both the hero card universe, Section 2 wall, Section 5 marquee, and Section 3 editor render from this **same source** — a lightweight `<TemplateThumbnail data={puckData} />` component renders miniature previews from the same config, so landing page and builder stay in sync.

## Puck config
`src/lib/puck-config.tsx` — component definitions for Navbar, Hero, FeatureGrid, Gallery, Testimonials, Pricing, FAQ, CTA, Footer, plus custom DropZone wrappers that render the row/column hover chrome. Uses `@measured/puck` and `@measured/puck/puck.css`.

## Files to create
- `src/lib/klin-templates.ts` — shared Puck data per industry.
- `src/lib/puck-config.tsx` — Puck component config + thumbnail renderer.
- `src/components/klin/*` — Hero, TemplateUniverse, TemplateWall, Playground, Storytelling, Marquee, Pricing, FinalCTA, StatusChips, CursorGlow, MagneticButton, TemplateThumbnail, FloatingBlobs, Grain.
- `src/lib/lenis-provider.tsx` — Lenis + rAF loop, integrated with GSAP ScrollTrigger.
- `src/routes/index.tsx` — assembles all sections, replaces placeholder.
- `src/routes/__root.tsx` — real title/description/OG, font links.
- `src/styles.css` — design tokens, utilities, `@source inline` safelist for dynamic blob classes.
- `public/robots.txt`, `src/routes/sitemap[.]xml.ts`.

## Packages to install
`@measured/puck`, `framer-motion`, `gsap`, `lenis`.

## Verification
- Build passes.
- Playwright: screenshot hero, section 2, playground (drag a Hero block into canvas), storytelling scroll, pricing toggle. Confirm no placeholder image, Puck canvas mounts, category chip swap works.

## Scope note
This is a large single-page app. I'll implement in one pass but scope Puck's row/column custom chrome to a clean useful subset (add row above, duplicate, delete, split 50/50, 30/70, 70/30, 3-col, 4-col) rather than reinventing Puck's internal DropZone UI — Puck's own drag/resize handles remain functional.
