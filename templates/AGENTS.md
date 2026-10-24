# Repository Ground Truth & Instructions for Agents

This document is the authoritative ground truth for all AI agents, subagents, and the Software Factory operating on this repository.

---

## 1. Project Overview

Provide a concise description of your application, architecture, and tech stack:
- **Frontend:** (e.g. React 19, TypeScript, Tailwind CSS, Vite)
- **Backend:** (e.g. Node.js, Express / NestJS, PostgreSQL / SQLite)
- **Testing:** (e.g. Vitest, Jest, Playwright)

---

## 2. Fresh Checkout Setup

Command to install dependencies in an isolated worktree or fresh clone:

```bash
npm install
```

Ensure environment files (`.env`) are copied or seeded from `.env.example` if required.

---

## 3. Dev Server Commands

Command for starting the development server on a dynamic port assigned by the factory builder/reviewers:

```bash
npm run dev -- --port <port>
```

---

## 4. Validation Commands

Commands that must pass before any build or review round is marked complete:

- **Type Checking / Linting:**
  ```bash
  npm run lint
  ```

- **Automated Tests:**
  ```bash
  npm test
  ```

- **Production Build:**
  ```bash
  npm run build
  ```

---

## 5. Directory Structure & Conventions

```
<project-root>/
├── src/                # Application source code
├── tests/              # Test suites
├── factory/            # Factory dashboard, backlog, and runtime jobs
└── public/             # Static web assets
```

### Coding Guidelines:
- **Imports:** Use explicit ESM imports with clean module paths.
- **Styling:** Follow project design patterns and shared CSS utilities.
- **Git Hygiene:** Do not use `git add -A`; stage only files deliberately modified for the feature.
- **Cleanliness:** Ensure working tree is clean and builds cleanly without warnings.
