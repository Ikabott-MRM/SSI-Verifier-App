# EAS environment variables (Verifier app)

API keys are **not** stored in `eas.json` or `app.config.js`. Set them in [Expo](https://expo.dev) for project **ssi-verifier-app** (`owner: ikabott`, project id in `app.json`).

Log in as **ikabott** (same account as SSI-Citizen-App):

```bash
eas login
cd SSI-Verifier-App
```

**Expo project:** [@ikabott/ssi-verifier-app](https://expo.dev/accounts/ikabott/projects/ssi-verifier-app)

## Required variables

| EAS environment | Variable | Value source |
|-----------------|----------|--------------|
| `development` | `EXPO_PUBLIC_API_KEY` | Staging/non-prod key |
| `preview` | `EXPO_PUBLIC_API_KEY` | Same as development |
| `production` | `EXPO_PUBLIC_API_KEY` | Secrets Manager `ssi/tenant/<slug>/runtime` → `apiKeyMobile` (or Bitwarden BotsManaged) |
| per-tenant envs | `EXPO_PUBLIC_API_KEY` | Same secret for that tenant |

Non-secret URLs (`EXPO_PUBLIC_API_BASE_URL`, IPFS gateway) may remain in `eas.json` profile `env` blocks. Keys must never be committed.

After rotating Identity mobile keys, update **EAS Environment variables** (and Bitwarden) — not git.

### CLI

```bash
eas env:create --name EXPO_PUBLIC_API_KEY --value YOUR_MOBILE_KEY --environment production --visibility secret --type string
# or eas env:update if the variable already exists
eas env:create --name EXPO_PUBLIC_API_KEY --value STAGING_KEY --environment development --visibility secret --type string
eas env:create --name EXPO_PUBLIC_API_KEY --value STAGING_KEY --environment preview --visibility secret --type string
```

Or use **Expo → Project → Environment variables** in the dashboard.

## Local development

Copy `.env.example` to `.env` and set `EXPO_PUBLIC_API_KEY` locally (never commit `.env`).

## Also update

- **SSI-Citizen-App** — set `EXPO_PUBLIC_API_KEY` in its Expo project the same way ([EAS_ENV_SETUP.md](../SSI-Citizen-App/EAS_ENV_SETUP.md)).
- **Amplify** Emisor uses a separate **issuer** key (`IDENTITY_API_KEY`), not the mobile key.
- Tenant handoff: [`docs/tenant-stack-onboarding.md`](../docs/tenant-stack-onboarding.md)
