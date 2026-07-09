# Walkthrough — Phase 3.5: Klin Website Runtime, Renderer & Publishing Pipeline (Enterprise v3.5)

This walkthrough documents the implemented modules, pipelines, and database router integrations of the Klin Website Runtime, Renderer, and Publishing Pipeline.

---

## Technical Accomplishments & Files Created

### 1. Decoupled Backend Architecture (`src/backend`)
We split modular API concerns from `src/server.ts` into individual routes, controllers, and services:
- **[db.ts](file:///c:/Users/Mujahid%20Islam%20Khan/Downloads/klin-landing-experience-main/klin-landing-experience-main/src/backend/db.ts)**: Shares and caches client connections to the `Klin` MongoDB database.
- **[auth.middleware.ts](file:///c:/Users/Mujahid%20Islam%20Khan/Downloads/klin-landing-experience-main/klin-landing-experience-main/src/backend/middlewares/auth.middleware.ts)**: Standardized Express middleware to enforce JWT-secured routes.
- **[activity.service.ts](file:///c:/Users/Mujahid%20Islam%20Khan/Downloads/klin-landing-experience-main/klin-landing-experience-main/src/backend/services/activity.service.ts)** & **[activity.routes.ts](file:///c:/Users/Mujahid%20Islam%20Khan/Downloads/klin-landing-experience-main/klin-landing-experience-main/src/backend/routes/activity.routes.ts)**: Logs website events timeline database.
- **[deployment.service.ts](file:///c:/Users/Mujahid%20Islam%20Khan/Downloads/klin-landing-experience-main/klin-landing-experience-main/src/backend/services/deployment.service.ts)**, **[deployment.routes.ts](file:///c:/Users/Mujahid%20Islam%20Khan/Downloads/klin-landing-experience-main/klin-landing-experience-main/src/backend/routes/deployment.routes.ts)**, & **[publish.routes.ts](file:///c:/Users/Mujahid%20Islam%20Khan/Downloads/klin-landing-experience-main/klin-landing-experience-main/src/backend/routes/publish.routes.ts)**: Implements publication validation audits, snapshot creation, and rollback target restoration.
- **[website.routes.ts](file:///c:/Users/Mujahid%20Islam%20Khan/Downloads/klin-landing-experience-main/klin-landing-experience-main/src/backend/routes/website.routes.ts)**: Details retrieval, setting section updates, duplication/archiving, and Wizard templates cloning.
- **[renderer.routes.ts](file:///c:/Users/Mujahid%20Islam%20Khan/Downloads/klin-landing-experience-main/klin-landing-experience-main/src/backend/routes/renderer.routes.ts)**: Visitor site resolver and static build package structures exporter.
- **[seo.routes.ts](file:///c:/Users/Mujahid%20Islam%20Khan/Downloads/klin-landing-experience-main/klin-landing-experience-main/src/backend/routes/seo.routes.ts)**: Robots.txt and Sitemap.xml dynamic feeds.

---

### 2. Website Runtime Package (`src/runtime/`)
Structured as a pipeline of independent resolvers transforming raw database values into a rendered layout React tree:

#### Core:
- **[RenderContext.ts](file:///c:/Users/Mujahid%20Islam%20Khan/Downloads/klin-landing-experience-main/klin-landing-experience-main/src/runtime/core/RenderContext.ts)**: Constructs the immutable layout and simulation variables.
- **[WebsiteRuntime.ts](file:///c:/Users/Mujahid%20Islam%20Khan/Downloads/klin-landing-experience-main/klin-landing-experience-main/src/runtime/core/WebsiteRuntime.ts)**: Resolves visitor subdomains to pages arrays.
- **[RuntimeResolver.ts](file:///c:/Users/Mujahid%20Islam%20Khan/Downloads/klin-landing-experience-main/klin-landing-experience-main/src/runtime/core/RuntimeResolver.ts)**: Pipeline coordinator.
- **[WebsiteRenderer.tsx](file:///c:/Users/Mujahid%20Islam%20Khan/Downloads/klin-landing-experience-main/klin-landing-experience-main/src/runtime/core/WebsiteRenderer.tsx)**: Compiles blocks using the Puck component definitions.

#### Resolvers (`src/runtime/resolvers/`):
- **ThemeResolver**: Injects theme custom color variables.
- **VariableResolver**: Handles dynamic string replacements with nested double-curly brace support `{{scope.variable}}`.
- **ComponentResolver**: Hydrates recognition mapping inside components lists.
- **AssetResolver**: Feeds optimized URLs.
- **CMSResolver** & **CommerceResolver**: Bridges bound blog and catalog records.
- **ResponsiveResolver** & **SEOResolver**: Viewport filters and structured schemas.

#### Cache & Events:
- **[RenderCache.ts](file:///c:/Users/Mujahid%20Islam%20Khan/Downloads/klin-landing-experience-main/klin-landing-experience-main/src/runtime/cache/RenderCache.ts)**: Hashing database config to instantly serve static layouts.
- **[RuntimeEvents.ts](file:///c:/Users/Mujahid%20Islam%20Khan/Downloads/klin-landing-experience-main/klin-landing-experience-main/src/runtime/events/RuntimeEvents.ts)**: Emits and listens to pipeline events.

---

### 3. Frontend Dashboard & Wizard Modules
- **[WebsiteWizard.tsx](file:///c:/Users/Mujahid%20Islam%20Khan/Downloads/klin-landing-experience-main/klin-landing-experience-main/src/pages/WebsiteWizard.tsx)**: Hydrates site brand guidelines and settings.
- **[TemplatePreviewModal.tsx](file:///c:/Users/Mujahid%20Islam%20Khan/Downloads/klin-landing-experience-main/klin-landing-experience-main/src/components/klin/TemplatePreviewModal.tsx)**: Displays template grids with responsive frames.
- **[WebsitePreview.tsx](file:///c:/Users/Mujahid%20Islam%20Khan/Downloads/klin-landing-experience-main/klin-landing-experience-main/src/pages/WebsitePreview.tsx)**: Visual preview of pages using customized locales and roles.
- **[WebsiteLiveViewer.tsx](file:///c:/Users/Mujahid%20Islam%20Khan/Downloads/klin-landing-experience-main/klin-landing-experience-main/src/pages/WebsiteLiveViewer.tsx)**: Public visitor live view.

---

## Build Output Verification
The project builds successfully without any errors:
```bash
vite v8.1.3 building client environment for production...
transforming...✓ 2789 modules transformed.
rendering chunks...
dist/index.html                                                       0.78 kB
dist/assets/index-Bcyxsi6U.css                                      117.00 kB
dist/assets/index-JvUwbHGT.js                                     1,321.98 kB
✓ built in 702ms
```
