# LitreGre Prediction — Deployment SOP

**Status:** Available  
**Date:** 2026-09-04  
**Related:** monorepo `COOLIFY-APPS.md`, `ROLLBACK-PLAN.md`

## Environments

| Env | Frontend | API | GitHub |
|-----|----------|-----|--------|
| Production | https://www.litregreprediction.site | https://mtn.lenhub.net | `maekandex-collab/litregre-prediction` |
| Staging | https://prediction.viaspark.site | https://mtnstaging.lenhub.net | `randomgituser081/litregre-prediction` |

Never point production Coolify at the staging API.

## Coolify settings (both envs)

- Build: Dockerfile  
- Port: **3000**  
- Health check: `GET /`  
- Branch: `main`

## Production env vars

```
PREDICTION_API_BASE_URL=https://mtn.lenhub.net
NEXTAUTH_URL=https://www.litregreprediction.site
NEXT_PUBLIC_SITE_URL=https://www.litregreprediction.site
NEXTAUTH_SECRET=<openssl rand -base64 32>
```

## Staging env vars

```
PREDICTION_API_BASE_URL=https://mtnstaging.lenhub.net
NEXTAUTH_URL=https://prediction.viaspark.site
NEXT_PUBLIC_SITE_URL=https://prediction.viaspark.site
NEXTAUTH_SECRET=<distinct staging secret>
```

## Standard release (production)

1. Land changes in monorepo `eaglepredict-nextjs/`.  
2. From monorepo root: `.\scripts\push-mtn-to-collab.ps1` (subtree → collab `main`, then mirrors personal).  
3. Confirm Coolify production auto-deploy, or trigger **Redeploy**.  
4. Smoke:
   - Homepage loads on https://www.litregreprediction.site  
   - Login / tips load against **production** API  
   - Optional: run `scripts/smoke-*.ts` against staging first  
5. If unhealthy → follow `ROLLBACK-PLAN.md`.

## Staging / feature release

1. Push or mirror to `randomgituser081/litregre-prediction`.  
2. Redeploy viaspark Coolify app if auto-deploy is off.  
3. Verify https://prediction.viaspark.site against staging API.

## Owners

| Role | Responsibility |
|------|----------------|
| Frontend | Code, BFF, Coolify frontend env |
| Backend | `mtn.lenhub.net` / staging API |
| Infra | Coolify host, DNS, TLS, health checks |
