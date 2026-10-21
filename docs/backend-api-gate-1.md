# 3L0 Vision API — Gate 1

Status: **initial API scaffold; experimental, not production-ready**.

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
- `scheme`: optional string; inferred conservatively when omitted.
- Uses the existing `ResolutionPipeline`, `OrcClient`, and deterministic resolver.
- Returns the observation, canonical resolution status, product state, and explicit limitations.

## Current boundaries

- Synthetic catalog only; the sample EAN resolves to `product_demo_001`.
- Catalog/resolution storage is process memory and is lost on restart.
- No OCR, Jev/TypeSafe, remote ORC, ERP/WMS, authentication, rate limiting, durable database, or deployment is configured.
- Do not expose this API publicly before security, persistence, operational logging, and integration tests are reviewed.
- The API is an internal vertical slice. It does not claim field validation or production readiness.

## Local run

```bash
npm install
npm run api
```

Default port: `8787`; override with `PORT`.

## Gate 1 acceptance checks

- Health endpoint discloses the local experimental mode.
- Synthetic EAN produces deterministic `RESOLVED`.
- Unknown identifiers produce semantic `UNCERTAIN`, not a server error.
- Invalid request input is rejected.
- CI runs the API tests alongside the existing tests and web build.
