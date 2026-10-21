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

test("duplicate matching entities produce CONFLICT rather than an arbitrary winner", async () => {
  const duplicateRepository = {
    async findCandidates() {
      return [
        { entity_id: "product_a", identifiers: [{ scheme: "ean", value: "789000000004" }], attributes: { name: "Produto A" } },
        { entity_id: "product_b", identifiers: [{ scheme: "ean", value: "789000000004" }], attributes: { name: "Produto B" } }
      ];
    },
    async persistResolution() {
      throw new Error("conflict must not persist a resolved entity");
    }
  };
  const server = createApiServer({ repository: duplicateRepository });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  try {
    const response = await fetch(`http://127.0.0.1:${address.port}/api/v1/resolve`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ code: "789000000004", scheme: "ean" })
    });
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.status, "CONFLICT");
    assert.equal(body.state, "CONFLICT");
    assert.deepEqual(body.result.conflicts[0].candidates, ["product_a", "product_b"]);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
});

test("EAN format is inferred when scheme is omitted", async () => {
  await withServer(async (base) => {
    const response = await fetch(`${base}/api/v1/resolve`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ code: "789000000004" })
    });
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.status, "RESOLVED");
    assert.equal(body.observation.identifiers[0].scheme, "ean");
  });
});
