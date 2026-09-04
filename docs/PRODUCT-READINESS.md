# LitreGre Prediction — Product Readiness Handoff

**Product:** LitreGre Prediction  
**Audit date:** 2026-09-04  
**Source:** `eaglepredict-nextjs/` (monorepo) → GitHub `litregre-prediction`  
**Prepared for:** Product / launch checklist

---

## Scoreboard

| # | Item | Status | Owner to close gaps |
|---|------|--------|---------------------|
| 1 | GitHub Repository Organized | **Done** | — |
| 2 | Branch Protection Rules Configured | **Partial** | Org admin on collab |
| 3 | Code Architecture Review Completed | **Done** | See `ARCHITECTURE-REVIEW.md` |
| 4 | Security Review Completed | **Done** | See `SECURITY-REVIEW.md` |
| 5 | Integration Tests Passed | **Partial** | CI + automated suite |
| 6 | Load Testing Completed | **Not done** | QA / infra |
| 7 | Staging Environment Active | **Done** | — |
| 8 | Production Environment Active | **Done** | — |
| 9 | Domain Configured | **Done** | — |
| 10 | SSL Certificate Installed | **Done** | — |
| 11 | Database Backup Configured | **N/A (frontend)** / **Backend TBD** | Backend / infra |
| 12 | Monitoring Tools Installed | **Partial** | Infra (uptime + APM) |
| 13 | Error Logging Enabled | **Partial** | Add Sentry / log drain |
| 14 | Rollback Plan Available | **Done** | See `ROLLBACK-PLAN.md` |
| 15 | Deployment SOP Available | **Done** | See `DEPLOYMENT-SOP.md` + root `COOLIFY-APPS.md` |

---

## Evidence by item

### 1. GitHub Repository Organized — Done

| Detail | Value |
|--------|--------|
| Production repo | https://github.com/maekandex-collab/litregre-prediction |
| Staging / mirror repo | https://github.com/randomgituser081/litregre-prediction |
| Default branch | `main` |
| App homepage | https://www.litregreprediction.site |
| Layout | Next.js App Router: `app/`, `components/`, `hooks/`, `lib/`, `Dockerfile`, `.env.example` |
| Publish | `scripts/push-mtn-to-collab.ps1` (subtree → collab, mirror → personal) |

### 2. Branch Protection Rules Configured — Partial

| Repo | Status |
|------|--------|
| `randomgituser081/litregre-prediction` `main` | **Configured** (no force-push, no branch deletion) |
| `maekandex-collab/litregre-prediction` `main` | **Needs org admin** — enable same rules + require PR reviews for production |

**Ask for collab (org admin):** Settings → Branches → protect `main` → require PR (1 approval), block force push, block deletions.

### 3. Code Architecture Review Completed — Done

See [`ARCHITECTURE-REVIEW.md`](./ARCHITECTURE-REVIEW.md). Summary: Next.js BFF → `PREDICTION_API_BASE_URL`, NextAuth JWT session, Docker standalone on Coolify, no local DB.

### 4. Security Review Completed — Done

See [`SECURITY-REVIEW.md`](./SECURITY-REVIEW.md). Summary: non-root container, secrets via Coolify env, auth-gated API routes, `.env` excluded from image. Residual risks listed for follow-up.

### 5. Integration Tests Passed — Partial

| Asset | Notes |
|-------|--------|
| `scripts/smoke-sporty-e2e.ts` | Manual SportyBet E2E smoke |
| `scripts/smoke-live-tips.ts` | Live tips smoke |
| `scripts/smoke-sporty-booking.js` | Booking smoke |
| CI | **Not present** — no GitHub Actions yet |
| `npm test` | **Not present** |

Recommendation: add Actions `lint` + `build` on PR; run smoke scripts in staging with secrets.

### 6. Load Testing Completed — Not done

No k6/Artillery/JMeter suite for prediction. Product should schedule a load test against staging API + frontend before marketing spikes.

### 7. Staging Environment Active — Done

| Layer | URL |
|-------|-----|
| Staging frontend | https://prediction.viaspark.site |
| Staging API | https://mtnstaging.lenhub.net |
| Git | `randomgituser081/litregre-prediction` |

Policy: viaspark is for feature work against staging API; do not point production at staging.

### 8. Production Environment Active — Done

| Layer | URL |
|-------|-----|
| Production frontend | https://www.litregreprediction.site |
| Production API | https://mtn.lenhub.net |
| Git | `maekandex-collab/litregre-prediction` |
| Host | Coolify, Dockerfile, port 3000, health `GET /` |

### 9. Domain Configured — Done

Production domain: **www.litregreprediction.site** (live HTTP 200).

### 10. SSL Certificate Installed — Done

HTTPS serves successfully on production and staging frontends (TLS terminated at host / Coolify proxy).

### 11. Database Backup Configured — N/A for this app / Backend TBD

Prediction frontend is a **stateless BFF** (no Postgres/Prisma). Persistent data lives on the MTN prediction backend (`mtn.lenhub.net`). Product must confirm backup RPO/RTO with backend/infra owners.

### 12. Monitoring Tools Installed — Partial

| Layer | Status |
|-------|--------|
| Coolify health check `GET /` :3000 | Active |
| External uptime (UptimeRobot / Better Stack / etc.) | **Not documented** |
| APM (Datadog / New Relic) | **Not installed** |

### 13. Error Logging Enabled — Partial

Server routes log via `console.error` → Coolify container logs. No Sentry / centralized error product yet.

### 14. Rollback Plan Available — Done

See [`ROLLBACK-PLAN.md`](./ROLLBACK-PLAN.md).

### 15. Deployment SOP Available — Done

See [`DEPLOYMENT-SOP.md`](./DEPLOYMENT-SOP.md) and monorepo [`COOLIFY-APPS.md`](../../COOLIFY-APPS.md).

---

## Quick links for product

- Prod: https://www.litregreprediction.site  
- Staging: https://prediction.viaspark.site  
- Prod GitHub: https://github.com/maekandex-collab/litregre-prediction  
- Staging GitHub: https://github.com/randomgituser081/litregre-prediction  
- Staging API docs: https://mtnstaging.lenhub.net/
