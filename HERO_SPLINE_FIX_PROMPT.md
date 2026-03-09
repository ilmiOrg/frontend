# Detailed prompt: Fix hero Spline robot and adjustable text

Give this entire document to another AI (or developer) to fix the logged-out hero section.

---

## Context

- **Project:** React app (Create React App), CSS modules, design variables in `src/styles/variables.css`.
- **Logged-out landing page:** `src/logged-out/pages/PublicHomePage/` (index.js + style.module.css).
- **3D scene:** Spline via `@splinetool/react-spline` and `@splinetool/runtime`. Scene URL: `https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode`.
- **Wrapper component:** `src/components/SplineScene/index.js` – lazy-loads Spline and supports `onLoad`, `nudgeRobotRight`, `robotObjectNames`.

---

## Requirements (what must be done)

### 1. Robot as background

- The 3D robot/agent must act as a **background layer** for the hero: full width and full height of the hero section.
- No “cut” or column: the robot canvas must fill the entire hero (100% width, 100% height). Text and overlay sit on top.

### 2. Mouse interaction: full width and height

- The robot must **react to the mouse/cursor across the entire hero**: left, center, right, top, bottom.
- **Critical:** The Spline canvas (or the wrapper that receives pointer events) must be exactly the size of the hero with no CSS that shrinks or offsets the hit area. Any `transform`, `left` offset, or reduced `width`/`height` on the canvas/wrapper has previously broken pointer events on part of the hero (e.g. left side not reacting). So:
  - Keep `.heroSplineWrap` and `.heroSpline` at `left: 0; right: 0; top: 0; bottom: 0; width: 100%; height: 100%`.
  - Do **not** use `transform: translateX()` or a wider canvas with negative `left` to shift the robot visually if that reduces or shifts the area that receives pointer events.
- The content overlay (text block) uses `pointer-events: none` so the robot receives hover everywhere; only the two CTA buttons use `pointer-events: auto`.

### 3. Move the robot to the right

- The **robot icon/character** should appear more to the **right** in the hero, without breaking full-width/full-height mouse reaction.
- **Current attempt (not working):** In `SplineScene`, on `onLoad(app)` we:
  - Try `app.findObjectByName(name)` for several names (Robot, Character, Agent, etc.).
  - Fallback: `app.getAllObjects()` and nudge objects whose name contains those keywords, or nudge all objects.
  - Do `obj.position.x += nudgeRobotRight` and then `app.requestRender()`.
- **Result:** The robot does not move. Possible causes:
  - Object names in the scene don’t match (need to discover real names from the scene).
  - `position` might be read-only or a getter that returns a copy, so mutations don’t apply.
  - Need to move the **camera** instead of the character, or a parent group.
  - Need a different runtime API (e.g. setPosition if it exists, or another method in `@splinetool/runtime`).
- **Tasks for the fixer:**
  - Option A: Add a way to **log** or **list** all object names (and optionally positions) when the scene loads (e.g. `getAllObjects()` and `console.log` or a small dev panel) so we know the exact name of the robot/character/camera.
  - Option B: In the **Spline editor** (spline.design), open the scene, move the camera or the robot object to the right, re-export, and update the scene URL in the app. Document this in the code or README.
  - Option C: Investigate `@splinetool/runtime` (e.g. `node_modules/@splinetool/runtime/runtime.d.ts` and actual behavior): check if `position` is mutable, if there is a `setPosition` or camera API, and implement moving the robot (or camera) to the right in code without breaking full-width interaction.

### 4. Hero text must be adjustable

- **Already done:** Hero text is driven by a single config object `HERO_COPY` at the top of `PublicHomePage/index.js` with: `badge`, `titleLine1`, `titleLine2`, `description`, `ctaPrimary`, `ctaSecondary`. Edit that object to change all hero copy.
- **Optional:** Move `HERO_COPY` to a separate file (e.g. `src/logged-out/heroCopy.js`) and import it if you prefer copy separate from the page component. Keep existing styling (CSS modules + variables).

---

## Key file locations

| Purpose | Path |
|--------|------|
| Hero JSX + Spline usage | `src/logged-out/pages/PublicHomePage/index.js` (hero section ~lines 100–144) |
| Hero styles | `src/logged-out/pages/PublicHomePage/style.module.css` (.hero, .heroSplineWrap, .heroSpline, .heroContentWrap, .heroContent, overlay) |
| Spline wrapper | `src/components/SplineScene/index.js` |
| Design variables | `src/styles/variables.css` |
| Spline runtime types | `node_modules/@splinetool/runtime/runtime.d.ts` (Application, findObjectByName, getAllObjects, SPEObject.position, requestRender) |

---

## Constraints

- Do **not** change the canvas/wrapper to a smaller or offset area (e.g. “robot on 70%” with a 70%‑wide canvas) if it causes the cursor to stop reacting on part of the hero.
- Use existing stack: React, CSS modules, design variables. No new dependencies unless necessary for the Spline fix.
- Preserve accessibility (e.g. button focus states, aria where relevant) and the current overlay gradient so text stays readable.

---

## Summary checklist for the fixer

- [ ] Robot is a full-width, full-height background; mouse reacts everywhere (full width and height).
- [ ] Robot appears more to the right (via code with Spline runtime and/or Spline editor, without breaking interaction).
- [x] Hero text is adjustable from one place (`HERO_COPY` in PublicHomePage/index.js) – keep or move to a file.
- [ ] No regression: overlay, buttons, and layout still work; cursor stays default (not grab) as per current design.
