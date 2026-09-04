# LitreGre Prediction — Architecture Review

**Status:** Completed  
**Date:** 2026-09-04  
**Scope:** Frontend BFF (`eaglepredict-nextjs` / `litregre-prediction`)

## Verdict

Architecture is appropriate for a Coolify-hosted Next.js tip/booking client in front of the shared MTN prediction API. No local database; clear BFF boundary; Docker standalone deploy.

## System context

```
Browser → www.litregreprediction.site (Next.js)
            ├─ NextAuth (credentials / JWT session)
            ├─ Route handlers under /api/* (BFF)
            └─ PREDICTION_API_BASE_URL → mtn.lenhub.net (prod)
                                         mtnstaging.lenhub.net (staging)
```

## Key decisions

| Area | Choice | Rationale |
|------|--------|-----------|
| Framework | Next.js App Router 14 | SSR/BFF, Coolify Docker `standalone` |
| API access | Server-side proxy only | Keeps backend URL/token handling off the client where possible |
| Auth | NextAuth credentials + JWT | Maps phone/PIN login to backend token in session |
| Data store | None on frontend | Predictions/users live on MTN API |
| Deploy | Coolify + Dockerfile port 3000 | Matches other Maekandex frontends |

## Module map

| Path | Role |
|------|------|
| `app/(main)`, `app/(auth)` | UI route groups |
| `app/api/auth`, `app/api/predictions`, `app/api/booking` | BFF / NextAuth |
| `lib/predictionApi.ts` | Upstream HTTP client + types |
| `lib/authOptions.ts` | Session / JWT wiring |
| `components/predictions/*` | Tip cards (general / VIP / special) |
| `Dockerfile` | Multi-stage build, non-root `nextjs` user |

## Non-goals (out of this app)

- Prediction model training / odds engine  
- Primary user DB ownership (backend)  
- Websocket realtime (not used here)

## Follow-ups (non-blocking)

1. Add a short README at repo root (clone → env → `npm run dev`).  
2. Document SportyBet booking surface contracts beside smoke scripts.  
3. Formalize staging Coolify env checklist in `DEPLOYMENT-SOP.md` (done).
