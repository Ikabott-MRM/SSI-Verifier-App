# EAS environment variables (Verifier app)

API keys are **not** stored in `eas.json`. Set them in [Expo](https://expo.dev) for project **verifier-mobile** (`owner: iovf`, project id in `app.json`).

Log in as an **iovf** org member with access to this project:

```bash
eas login
cd IDA-Verificador-App
```

## Required variables

| EAS environment | Variable | Value source |
|-----------------|----------|--------------|
| `development` | `EXPO_PUBLIC_API_KEY` | Staging/non-prod key (Azure API admin) |
| `preview` | `EXPO_PUBLIC_API_KEY` | Same as development |
| `production` | `EXPO_PUBLIC_API_KEY` | New mobile key after prod rotation (`tools/.last-verifier-mobile-key`, gitignored) |

`EXPO_PUBLIC_API_BASE_URL` remains in `eas.json` per profile.

### CLI (run as iovf)

```bash
# Replace NEW_KEY with the value from rotation / your staging admin
eas env:create --name EXPO_PUBLIC_API_KEY --value NEW_KEY --environment development --visibility secret
eas env:create --name EXPO_PUBLIC_API_KEY --value NEW_KEY --environment preview --visibility secret
eas env:create --name EXPO_PUBLIC_API_KEY --value NEW_PROD_MOBILE_KEY --environment production --visibility secret
```

Or use **Expo → Project → Environment variables** in the dashboard.

## Local development

Copy `.env.example` to `.env` and set `EXPO_PUBLIC_API_KEY` locally (never commit `.env`).

## Staging key exposed on GitHub

The non-prod key that was in git (`8a5e66195337b0eccdddbce894579f97`) targets **Azure Container Apps**. Rotate it in that environment’s identity API database; EAS `development` / `preview` must be updated after rotation.

## Also update

- **IDA-Ciudadano-App** uses the same production mobile key — set `EXPO_PUBLIC_API_KEY` in its Expo project after prod rotation.
- **Amplify** `ida-emisor-web-prod` uses a separate **issuer** key (`IDENTITY_API_KEY`), not the mobile key.
