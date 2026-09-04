# LitreGre Prediction — Rollback Plan

**Status:** Available  
**Date:** 2026-09-04

## When to rollback

- Homepage / login / tips fail after deploy  
- Elevated 5xx in Coolify logs  
- Accidental staging API pointed at production  

## Preferred path (Coolify)

1. Open Coolify → app **`litregre-prediction`** (production).  
2. Deployments → select last **known-good** deployment.  
3. Redeploy / rollback to that image.  
4. Confirm https://www.litregreprediction.site returns 200 and login works.  
5. Note incident time + bad commit SHA for postmortem.

## Alternate path (Git pin)

1. Identify last good commit on `maekandex-collab/litregre-prediction` `main`.  
2. Re-deploy that SHA from Coolify (or re-subtree that monorepo commit and push).  
3. Avoid force-push to collab `main` unless org policy allows and protection is temporarily adjusted by an admin.

## Config rollback

If only env vars are wrong:

1. Restore production vars from `DEPLOYMENT-SOP.md`.  
2. Especially ensure `PREDICTION_API_BASE_URL=https://mtn.lenhub.net`.  
3. Restart / redeploy container.

## Staging

Same steps on viaspark Coolify app / `prediction.viaspark.site`.

## Communication

Notify product + backend if user-facing outage > 15 minutes; record bad + good SHAs in the incident note.
