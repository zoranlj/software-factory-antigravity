# Engineering Conventions

> Explicit coding standards, error handling contracts, and UI/API rules that static linters cannot capture.

## 1. Error Handling & Logging
- Return structured errors with stable error codes; never swallow exceptions silently.
- Never log secrets, PII, or bearer tokens.

## 2. Backend & API Contracts
- Validate all external inputs at the boundary.
- Keep database migrations backwards-compatible and flag any DDL changes for human approval.

## 3. Frontend & Design System Contracts
- Use only approved design-system primitives; do not introduce raw inline styles or ad-hoc component variants.
- Interactive elements MUST include stable `data-testid` attributes and accessible ARIA labels / keyboard support.
- Follow the repository's state management split (server cache vs. local UI state).

## 4. Git & PR Hygiene
- Stage explicit files only (`git add <file>`); never run `git add -A`.
- Keep changes scoped to the issue's declared Single-Responsibility boundary (1–3 files where possible).
