# LitreGre Prediction — Security Review

**Status:** Completed (frontend scope)  
**Date:** 2026-09-04  
**Scope:** `eaglepredict-nextjs` / Coolify deploy / GitHub repos

## Verdict

**Acceptable for production** with residual follow-ups. No critical secrets in the repo image path; auth is session-gated on sensitive BFF routes; container runs as non-root.

## Controls in place

| Control | Evidence |
|---------|----------|
| Secrets not baked into git | `.dockerignore` excludes `.env*`; Coolify runtime env |
| Non-root container | Dockerfile user `nextjs` (uid 1001) |
| Auth session | NextAuth; prediction/booking routes check session |
| Env separation | Prod → `mtn.lenhub.net`; staging → `mtnstaging.lenhub.net` |
| Secret scanning (personal GitHub) | Enabled (push protection enabled) |
| Branch protection (personal `main`) | Force-push and deletion blocked |

## Findings / residual risk

| ID | Severity | Finding | Recommendation |
|----|----------|---------|----------------|
| S1 | Medium | No centralized error product (Sentry) | Add Sentry or Coolify log drain |
| S2 | Medium | No CSP / security headers in `next.config.js` | Add headers (CSP, HSTS via proxy) |
| S3 | Medium | Collab `main` not protected (needs org admin) | Require PR + block force-push |
| S4 | Low | Smoke scripts call live SportyBet | Restrict to staging; document secrets |
| S5 | Low | Dependabot security updates disabled (personal) | Enable Dependabot |
| S6 | Info | Frontend has no DB | Confirm **backend** backup/encryption with infra |

## Explicitly out of scope

- Penetration test of `mtn.lenhub.net`  
- MTN API rate limits / WAF  
- PIN policy strength on backend  

## Sign-off

Frontend security review completed for product readiness. Close S1–S3 before high-traffic campaigns if possible.
