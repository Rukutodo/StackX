# Admin Portal — Performance / System Lag Diagnosis

**Symptom:** Launching the admin portal makes the whole system lag heavily (not just the browser tab).
**Hardware:** RTX 3050 (6 GB VRAM), 16 GB RAM, 12th-gen i5 HX.

The lag is **not** one runaway animation — it's two things stacking up. You can confirm which one dominates in ~30 seconds (see [Confirm which one it is](#confirm-which-one-it-is-30-sec)).

---

## 1. Multiple Next.js 16 dev servers running at once (most likely the bigger cause)

The repo has three apps:

- `frontend` — Next.js 16, port 3000
- `admin` — Next.js 16, port 3001 (`dev` script: `next dev --port 3001`)
- `backend`

**Next.js 16 uses Turbopack by default**, which is fast but very RAM- and CPU-hungry on first compile and keeps a file watcher + TS checker running continuously.

On a 16 GB machine, running the admin server **on top of** the frontend server + backend + a browser (especially with DevTools open) pushes you into memory pressure / swapping, so the **whole system** lags — not just the page. That matches the symptom ("system starts lagging," not "the page is janky").

> Your RTX 3050 is irrelevant to this cause — this is a RAM/CPU problem, not a GPU one.

**Supporting signs in the repo:**
- A stray `.next` folder and a `bash.exe.stackdump` at the repo root.
- A duplicate nested `admin/admin/` directory.

These suggest dev servers have been launched from multiple places.

---

## 2. Heavy, layered `backdrop-filter: blur()` + a giant `filter: blur(120px)` (GPU / compositing cost)

Even with a single server running, the admin UI is compositing-heavy:

- **`src/app/globals.css:92`** — `.hero-glow` uses `filter: blur(120px)` on **600×600px** elements. The login page renders **three** of these at once (`src/app/login/page.tsx:65-90`). Blurring a huge surface at 120px is one of the most expensive operations a browser can paint.
- A **fixed** `backdrop-blur-xl` sidebar (`src/components/admin/layout/Sidebar.tsx:154`) + a **sticky** `backdrop-blur-2xl` top navbar (`src/components/admin/layout/TopNavbar.tsx:74`) + every glass card using `backdrop-filter: blur(20px)` — all stacked over the same scroll area.

`backdrop-filter` forces the GPU to re-sample everything behind it on each repaint; layering many of them is a classic jank source. On a laptop the browser often composites on the **integrated GPU**, not your discrete 3050.

---

## Confirm which one it is (30 sec)

Open **Task Manager → Performance / Details** while the admin app is running:

| What you see | Likely cause |
|---|---|
| `node.exe` processes eating GBs of RAM + high CPU, Memory near 100% | **Cause #1** — the dev servers |
| RAM is fine, but the **browser's GPU process** spikes; lag is worst on the login screen / while scrolling | **Cause #2** — the blur |

---

## Fixes (by impact)

### For #1 — dev servers (do these first)

- Run **only the app you're working on**. Don't keep `frontend` + `admin` + `backend` dev servers all up at once.
- If you must run admin alongside others, lower Turbopack's memory use by switching to the webpack dev server:
  ```diff
  - "dev": "next dev --port 3001"
  + "dev": "next dev --turbopack=false --port 3001"
  ```
  (Slower compile, but lower peak RAM.) You can also cap Node's heap via `NODE_OPTIONS=--max-old-space-size=...`.
- Close extra VS Code windows / browser tabs — each adds a watcher / renderer process.

### For #2 — blur / compositing (cheap, helps regardless)

- Reduce `.hero-glow` from `blur(120px)` to ~`blur(60–80px)`, and/or render fewer orbs on the login page.
- Lower the `backdrop-blur` radii (the `2xl` / `xl` on the sticky/fixed chrome are the worst offenders), or swap a couple of the always-visible glass surfaces to a solid semi-transparent background (no `backdrop-filter`).

---

## Recommendation

Cause **#1 (dev servers / memory pressure)** is most likely the real pain on a 16 GB machine. Start there. The blur cleanup (#2) is cheap and worth doing regardless.
