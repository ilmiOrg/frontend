# Frontend Architecture

React 18 · Create React App (`react-scripts` 5) · React Router 6 · CSS Modules.
A student-facing SPA that talks only to the backend REST API. Dev port **3002**.

---

## 1. Folder structure (`src/`)

```
src/
├── api/                  Backend client — one module per resource. The ONLY place fetch() lives.
│   ├── config.js         request() wrapper: base URL, auth header, error handling, query building.
│   ├── auth.js           login / register / logout
│   ├── universities.js · programs.js · scholarships.js · jobs.js · courses.js · fields.js   (catalog)
│   ├── favorites.js · academics.js · applications.js · funding.js · interests.js · studentProfile.js  (student data)
│   ├── matches.js        university matching · (scholarship matches live in scholarships.js)
│   ├── countries.js · admin.js · essays.js
│   └── index.js          re-exports
│
├── contexts/
│   └── AuthContext.js    Auth state (isAuthenticated, user, role). Reads/writes localStorage
│                         keys: token, userEmail, userName, authGuest. login/register/logout/guest.
│
├── hooks/                Reusable hooks (e.g. useLanguage).
├── lib/                  Framework-agnostic helpers.
│
├── localization/         i18n. en.js · ru.js · ky.js · kk.js · tg.js (+ index.js, translate.js).
│                         Every user-visible string is a key resolved via t(). 5 locales kept in sync.
│
├── styles/               Global design system.
│   ├── variables.css     Design tokens: --color-*, spacing, radii, fonts.
│   ├── core.css          Base/reset + shared rules.
│   └── animations.css    Keyframes.
│
├── components/           Cross-app components: ErrorBoundary, OnboardingBanner, LanguageSwitcher,
│                         SplineScene (3D hero), Spotlight, IlmiContactHub, ui/.
├── ui-components/        Form/primitive kit: AccentButton, FilterChip, NumberField, SearchField,
│                         SelectField, TextLinkButton.
│
├── logged-out/           Public app (no auth).
│   ├── pages/            PublicHomePage (landing), LoginPage, RegisterPage.
│   └── components/
│
├── logged-in/            Authenticated app.
│   ├── shared/
│   │   └── DashboardLayout/   Sidebar + topbar shell that wraps all /dashboard/* routes.
│   └── pages/                 Feature pages, grouped:
│       ├── MainPages/         Dashboard, SearchUniversities (+ UniversityDetail, FavoriteUniversities),
│       │                      SearchPrograms (+ ProgramDetail, FavoritePrograms), SearchFields,
│       │                      SearchScholarships, Jobs, Courses, MyAcademics, Profile, SendInfo.
│       ├── AIMatchingPages/   MatchUniversities, MatchScholarships, SimilarStudents.
│       ├── ApplicationPages/  MyApplications (+ ChecklistSection).
│       ├── LearningPages/     EssayReview, courses (math/english/…).
│       ├── AdminPages/        AdminReview (staging approve/reject).
│       ├── CareerPages · CommunityPages · ContactPages · PremiumPages · PrivacyPages.
│
├── App.js                Router + route guards (RequireAuth / RequireGuest / RequireAdmin).
└── index.js              Entry: mounts <App/> inside <AuthProvider>.
```

---

## 2. Routing & guards (`App.js`)

- Public: `/` (landing), `/login`, `/register`.
- Authenticated: `/dashboard/*` — all wrapped in `DashboardLayout`. A guard redirects to
  `/login` when not authenticated, and `/dashboard` when an authed user hits a guest-only
  route. Admin-only routes use a `RequireAdmin` guard.
- Routes are **lazy-loaded** (`React.lazy`) for code-splitting.
- Key paths: `/dashboard`, `/dashboard/search/{universities,programs,scholarships,fields}`,
  `/dashboard/search/universities/:slug` (detail), `/dashboard/search/universities/favorites`,
  `/dashboard/opportunities/{jobs,courses}`, `/dashboard/ai/{match-universities,match-scholarships}`,
  `/dashboard/academics`, `/dashboard/applications`, `/dashboard/profile`,
  `/dashboard/learning/essay-review`.

> University detail resolves by **slug** = `slugify(name)-<id[:8]>` (built in
> `searchUniversitiesData.js`); cards link with the slug.

---

## 3. Auth & state

- No Redux. Local component state + `AuthContext` for identity.
- `AuthContext` is the single source of auth truth. On mount it reads `localStorage`
  (`token`+`userEmail`, or `authGuest`) and exposes `{ isAuthenticated, user, isAdmin,
  login, register, logout, loginAsGuest }`. The JWT `role` claim is decoded client-side for
  UI gating only (never trusted for security — the backend enforces).
- **Guest mode:** "Continue as guest" sets `authGuest` and enters the app with no backend
  session (public catalog only).

---

## 4. Data flow (page → API → backend)

```
Page component (useEffect on mount / filter change)
  → api/<resource>.js function
  → config.js request(path, { method, auth, body, query })
       attaches Bearer token when auth:true (from localStorage)
  → fetch → backend /api/v1/...
  ← JSON → React state → render (loading / data / empty / error states)
```

`request()` centralizes: base URL (`REACT_APP_API_URL`, default `:8081`), auth header,
query-string building (skips null/empty), 204 handling, and error extraction. Resource
modules never build URLs or headers themselves.

---

## 5. Styling & localization rules (enforced — see [../rules/AGENTS.md](../rules/AGENTS.md))

- **CSS Modules only** (`*.module.css` + `className`). No inline `style={{}}`. Dynamic
  values (e.g. progress-bar width) go through a CSS custom property, not a style object.
- Reuse tokens from `styles/variables.css` (`--color-*`, spacing, radii, fonts); no
  hardcoded colors where a token exists.
- **Localize all user-visible text** via `t()`; add keys to all five locale files
  (`en/ru/ky/kk/tg`) with identical structure.
- Strict equality (`===`/`!==`), explicit null checks, named constants.

---

## 6. Build, config, deploy

- Env: `REACT_APP_API_URL` (backend base, build-time), `PORT=3002`, `FAST_REFRESH`.
- Scripts: `yarn start` (dev), `yarn build` (prod bundle), `yarn test`, `yarn lint`,
  `yarn format`.
- Deploy: `Dockerfile` builds a static bundle served by nginx (`nginx.conf`);
  `.env.production` for the prod API URL. See [DEPLOYMENT.md](DEPLOYMENT.md).
- Per-service overview: [../rules/FRONTEND.md](../rules/FRONTEND.md).
