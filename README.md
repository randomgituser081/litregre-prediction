# LitreGre Prediction

Next.js frontend for LitreGre sports tips (BFF over the MTN prediction API).

- **Production:** https://www.litregreprediction.site  
- **Staging:** https://prediction.viaspark.site  
- **Prod GitHub:** https://github.com/maekandex-collab/litregre-prediction  

## Local

```bash
cp .env.example .env.local
npm ci
npm run dev
```

Set `PREDICTION_API_BASE_URL` to staging or prod as needed. Never commit secrets.

## Docs (product / ops)

| Doc | Purpose |
|-----|---------|
| [docs/PRODUCT-READINESS.md](./docs/PRODUCT-READINESS.md) | Launch checklist for product |
| [docs/ARCHITECTURE-REVIEW.md](./docs/ARCHITECTURE-REVIEW.md) | Architecture review |
| [docs/SECURITY-REVIEW.md](./docs/SECURITY-REVIEW.md) | Security review |
| [docs/DEPLOYMENT-SOP.md](./docs/DEPLOYMENT-SOP.md) | Deploy procedure |
| [docs/ROLLBACK-PLAN.md](./docs/ROLLBACK-PLAN.md) | Rollback procedure |

Monorepo Coolify matrix: `../COOLIFY-APPS.md` (when working inside the MTN monorepo).
