# 🚀 DREI.qa &mdash; Enterprise QA Engineer Portfolio (React + Tailwind CSS)

An elite, interactive QA Showcase built with **React (JSX/TSX)**, **Tailwind CSS**, and **Lucide React Icons**. Designed specifically for Tech Recruiters, Engineering Managers, and Staff SDETs.

---

## ⚡ Quick Start (Run Locally)

```bash
# 1. Install dependencies
npm install

# 2. Start the local Vite development server
npm run dev
```

Visit `http://localhost:3000` to inspect the live dashboard.

---

## 🛠️ Tech Stack & Architecture

- **Framework:** React 18 + Vite / Next.js compatible
- **Styling:** Tailwind CSS (Dark Cyber Theme: Deep Slate `#070b13` / `#0f172a`, Neon Emerald `#10b981`, Cyber Cyan `#06b6d4`, Crimson `#ef4444`)
- **Icons:** `lucide-react`
- **State Management:** Native React state (`useState`, `useEffect`, `useRef`)
- **Audio:** Browser Web Audio API Synthesizer (Zero external media dependencies)

---

## 🧩 Key Interactive React Components

### 1. 🖥️ Interactive Live Test Terminal (`#test-runner`)
- Switchable suites: `checkout.spec.ts` (Playwright TypeScript), `api-auth.json` (Postman/Newman), and `db-reconcile.sql` (Postgres Ledger Audit).
- Stateful **"▶ RUN"** execution trigger with real-time logs, speed selectors (`1x`, `2x`, `⚡Inst`), gradient progress bar, and green assertions:
  - `✓ HTTP 200 OK — API Gateway Verified`
  - `✓ SQL Record Verified — 0 Discrepancies in DB Ledger`
  - `✓ E2E Checkout Flow Passed — 24 passed (100% success rate)`

### 2. 🐛 "Find the Bug" Easter Egg & Jira Modal (`#bug-hunter`)
- Intentional UI glitch on the promo button (`Save 102%`, `[object Object]` tooltip error).
- Sticky bottom-right trigger: `"🐛 Found a bug? Inspect ticket!"`.
- Opens a pixel-perfect **Jira Bug Report Modal (`PORT-104`)** with reproduction steps, expected vs. actual, console stack trace, and code diff.
- **⚡ Live Hotfix Switch:** Toggling "Apply Hotfix" dynamically repaints the UI in real time to `Save 25%`, updates the status to `🟢 RESOLVED / VERIFIED`, and triggers a celebratory audio chirp!

### 3. 📂 Tabbed Test Artifacts Explorer (`#artifacts`)
- **Project 1 (Playwright E2E Suite):** Subtabs for TypeScript POM code, live trace logs, test coverage matrix, and GitHub Actions matrix CI/CD YAML.
- **Project 2 (Postman REST API Suite):** Subtabs for Ajv JSON Schema (Draft-07), status code assertions, Newman latency benchmarks (p95), and collection JSON.
- **Project 3 (Exploratory Bug Hunt & SQL):** Subtabs for high-severity Jira tickets (`BUG-409`), PostgreSQL balance reconciliation queries, and QA risk strategy.

### 4. 🧩 Categorized Skill Matrix (`#skills`)
- Grouped into Automation, API Testing, DevTools & Data, and Methodologies.

### 5. 📬 Contact & Social Hub (`#contact`)
- One-click copy email button with feedback state.
- Downloadable PDF resume modal with key SDET metrics.
- Validated direct message form with real-time character counting.

---

## 📁 Project Structure

```text
EPORTFOLIO/
├── index.html            # Vite HTML Entry Point
├── package.json          # Dependencies (React, Lucide-React, Tailwind, Vite)
├── vite.config.ts        # Vite Configuration
├── tailwind.config.js    # Custom Cyber QA Theme
├── tsconfig.json         # TypeScript Configuration
├── src/
│   ├── App.tsx           # Master Interactive QA Portfolio React Component
│   ├── main.tsx          # React Root Mount
│   └── index.css         # Tailwind & Cyber Grid Styles
└── README.md             # Documentation
```
