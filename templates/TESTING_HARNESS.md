# Headless Testing Harness

> Instructions for spinning up mocks, seeding fixtures, and executing unit, integration, and E2E suites headlessly in CI.

## 1. Prerequisites & Environment Seeding
```bash
cp .env.example .env
npm ci
```

## 2. Running Test Suites Headlessly
- **Unit tests:** `npm test`
- **Integration tests (with local mocks/fixtures):** `npm run test:integration`
- **End-to-End tests (headless browser):** `npx playwright test`

## 3. Fixture & Mock Data
Document how to seed deterministic test fixtures without relying on live external APIs.

## 4. Teardown
Ensure any background dev servers or mock containers started during verification are terminated before the job exits.
