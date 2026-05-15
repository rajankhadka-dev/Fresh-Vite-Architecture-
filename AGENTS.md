# AGENTS.md — Fresh Vite Architecture

## Project structure
- **Real project** is entirely under `my-react-app/`. Root `package-lock.json` carries the name `"Vite React App Fresh Architecture"` but is empty — always work inside `my-react-app/`.
- Single-package Vite 7 + React 19 SPA (no TypeScript, no monorepo tooling).

## Commands (run from `my-react-app/`)
| Command | What |
|---------|------|
| `npm run dev` | Vite dev server |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint (flat config: `eslint.config.js`) |

- No test framework, no typecheck, no formatter configured.

## Routes (client-side, react-router-dom v6)
| Path | File | Notes |
|------|---------|-------|
| `/` | `src/pages/Home.jsx` | Landing page with sections |
| `/demo` | `src/pages/Portfolio.jsx` | Financial dashboard, **password: `rajan123`** |
| `/blog` | `src/pages/Blog.jsx` | Blog posts from `src/data/blogPosts.js` |
| `/earrings` | `src/pages/EarringTryOn.jsx` | AR earring try-on, **password: `jackal#321`** |

- Page transitions via `framer-motion` `AnimatePresence` in `App.jsx`.
- Global `Chatbot` component renders on every page (FAB in corner).

## AI Chatbot
- **Runs 100% in-browser**: Web Worker (`src/worker.js`) loads `@xenova/transformers` with SmolLM-135M-Instruct model (~5s first-load download, cached after).
- Falls back to rule-based responses after 5s if model has not loaded (handled in `src/components/Chatbot.jsx:60-66`).
- Chat is private/local only.

## AR Earring Try-On
- MediaPipe `FaceLandmarker` loaded dynamically from CDN (`@mediapipe/tasks-vision@0.10.3`).
- Earring assets in `public/earrings/`, catalog defined in `src/data/earrings.js`.
- Users can also upload their own earring images (session-only, not persisted).
- 3D head-pose-aware earring placement with EMA temporal smoothing.

## API and Configuration
- Backend: ASP.NET at `https://rajanbio-dotnet.onrender.com`.
- Two config files with overlapping purposes:
  - `src/config/settings.js` — actively used by `src/services/apiService.js` (primary).
  - `src/config/api.js` — not imported anywhere in source; likely dead code.
- Environment variable overrides (prefixed with `VITE_`):
  - `VITE_API_BASE_URL`, `VITE_API_TIMEOUT`, `VITE_API_RETRY_ATTEMPTS`.
- API service (`src/services/apiService.js`) has built-in retry with exponential backoff (3 max retries).

## Code conventions
- **No TypeScript** — plain JSX (`.jsx` / `.js`).
- ESLint 9 flat config: rule set at `eslint.config.js`. Custom: `no-unused-vars` ignores `^[A-Z_]` (for React components).
- CSS: per-component `.css` files or inline `<style>` injection (see `Portfolio.jsx:308-312`).
- No formatter (Prettier etc.) configured.

## Auth note
Hardcoded passphrases in source:
- Demo dashboard: `rajan123` in `src/config/settings.js`
- AR Try-On: `jackal#321` in `src/pages/EarringTryOn.jsx`