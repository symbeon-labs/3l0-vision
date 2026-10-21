import test from "node:test";
import assert from "node:assert/strict";
import { createApiServer } from "../server/api.js";

async function withServer(run) {
  const server = createApiServer();
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  try {
    await run(`http://127.0.0.1:${address.port}`);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
}

test("health endpoint describes the non-production local mode", async () => {
  await withServer(async (base) => {
    const response = await fetch(`${base}/api/v1/health`);
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.resolutionMode, "deterministic-local");
    assert.equal(body.externalOrc, false);
    assert.equal(body.persistence, "ephemeral-process-memory");
  });
});

test("resolve returns a deterministic match for the synthetic EAN", async () => {
  await withServer(async (base) => {
    const response = await fetch(`${base}/api/v1/resolve`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ code: "789000000004", scheme: "ean" })
    });
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.status, "RESOLVED");
    assert.equal(body.state, "RESOLVED");
    assert.deepEqual(body.result.entities, ["product_demo_001"]);
    assert.ok(body.limitations.includes("no durable persistence"));
  });
});

test("unknown identifier is uncertain, not a technical error", async () => {
  await withServer(async (base) => {
    const response = await fetch(`${base}/api/v1/resolve`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ code: "unknown-123" })
    });
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.status, "UNCERTAIN");
  });
});

test("invalid input is rejected", async () => {
  await withServer(async (base) => {
    const response = await fetch(`${base}/api/v1/resolve`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ code: "   " })
    });
    assert.equal(response.status, 400);
  });
});
