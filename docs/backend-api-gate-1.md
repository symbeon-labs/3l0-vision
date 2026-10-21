# 3L0 Vision API — Gate 1

Status: **experimental integration; not production-ready**.

## Repository boundary

The initial API lives in `symbeon-labs/3l0-vision`, alongside the product interface and the existing resolution pipeline. The private `3l0-core-vault` remains the home for controlled architecture records and audit evidence. ORC is still an integration contract, not a confirmed remote service.

## Endpoints

### `GET /api/v1/health`

Returns service status, API version, active resolution mode, persistence boundary, and whether an external ORC or model provider is connected.

### `POST /api/v1/resolve`

Request:

```json
{ "code": "789000000004", "scheme": "ean" }
```

- `code`: required string, 1–128 characters.
- `scheme`: optional string; numeric EAN-shaped values are inferred as `ean`.
- Uses the existing `ResolutionPipeline`, `OrcClient`, and deterministic resolver.
- Returns the observation, canonical resolution status, product state, and explicit limitations.
- Canonical semantic states are `RESOLVED`, `UNCERTAIN`, and `CONFLICT`.

## Frontend integration and controlled fallback

The interface now calls same-origin `POST /api/v1/resolve` first. It uses the local browser pipeline only when the API is unreachable, returns 404/5xx, or provides an invalid response contract. A 4xx input rejection does **not** silently trigger fallback. The result screen identifies whether the answer came from `API V1` or `FALLBACK LOCAL`.

For local development, Vite proxies `/api/*` to `http://127.0.0.1:8787`. Run the backend and frontend in separate terminals:

Terminal 1:
```bash
npm install
npm run api
```

Terminal 2:
```bash
npm run dev
```

Default API port: `8787`; override with `PORT`. The Vite proxy is for local development only; a deployed environment needs an explicitly configured same-origin reverse proxy or serverless route. A static frontend deployment alone does not host this API.

## Current boundaries

- Backend catalog is synthetic and in process memory; its state is lost on restart.
- Browser fallback uses the local browser catalog and is explicitly labeled.
- No OCR, Jev/TypeSafe, remote ORC, ERP/WMS, authentication, rate limiting, durable database, or deployment is configured.
- Do not expose this API publicly before security, persistence, operational logging, and integration tests are reviewed.
- Exact identifier matching is not proof of physical-object identity or field readiness.

## Gate 1 acceptance checks

- Health endpoint discloses the local experimental mode.
- Synthetic EAN produces deterministic `RESOLVED`.
- Unknown identifiers produce semantic `UNCERTAIN`, not a server error.
- Duplicate matching entities produce `CONFLICT`, without selecting or persisting an arbitrary winner.
- Invalid request input is rejected.
- CI runs API tests and builds the web app.
- Browser/API end-to-end validation and deployment routing remain separate acceptance items.
