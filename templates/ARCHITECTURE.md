# System Architecture

> Machine-readable architectural ground truth for headless agents operating on this repository.

## 1. System Topology
Describe the high-level components (Frontend, API, Workers, Database, External Services) and how requests flow between them.

## 2. Module Boundaries & Permitted Dependency Directions
Define which layers may import from which layers. Headless agents MUST respect these boundaries:
- `domain/` → MUST NOT import from `infrastructure/` or `ui/`
- `application/` → may import from `domain/`
- `infrastructure/` → may import from `domain/` and `application/`
- `ui/` → may import from `application/` and shared design-system primitives only

## 3. Core Entities & State Transitions
Document allowed state transitions so agents do not hallucinate invalid states (e.g., `Order: DRAFT -> SUBMITTED -> PAID -> FULFILLED`).

## 4. Data & Authorization Invariants
- **Data invariants:** (e.g., "Tenants can never share ledger rows")
- **RBAC / Authorization:** Link to `PERMISSIONS.json` or auth policy definitions.
