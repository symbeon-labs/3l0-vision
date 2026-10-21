import { createServer } from "node:http";
import { randomUUID } from "node:crypto";
import { ResolutionPipeline } from "../core/pipeline/resolution-pipeline.js";
import { OrcClient } from "../core/orc/client.js";
import { deterministicResolver } from "../core/orc/deterministic-resolver.js";

const MAX_BODY_BYTES = 16 * 1024;
const seedEntities = [
  {
    entity_id: "product_demo_001",
    type: "product",
    identifiers: [{ scheme: "ean", value: "789000000004" }],
    attributes: { name: "Produto X", unit: "500 ml" }
  }
];

function createMemoryRepository() {
  const entities = structuredClone(seedEntities);
  const resolutions = new Map();
  return {
    async findCandidates({ observation }) {
      const identifiers = observation.identifiers ?? [];
      return entities.filter((entity) =>
        entity.identifiers.some((candidate) =>
          identifiers.some((observed) =>
            candidate.scheme === observed.scheme &&
            String(candidate.value).trim() === String(observed.value).trim()
          )
        )
      );
    },
    async persistResolution(record) {
      // Ephemeral process memory only; no external or durable write.
      resolutions.set(record.result.resolution_id, {
        entityId: record.entityId,
        observationId: record.observation.observation_id
      });
      return { persisted: false, storage: "process-memory" };
    }
  };
}

function sendJson(response, status, payload) {
  response.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "x-content-type-options": "nosniff"
  });
  response.end(JSON.stringify(payload));
}

async function readJson(request) {
  let size = 0;
  const chunks = [];
  for await (const chunk of request) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) {
      const error = new Error("request_body_too_large");
      error.statusCode = 413;
      throw error;
    }
    chunks.push(chunk);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    const error = new Error("invalid_json");
    error.statusCode = 400;
    throw error;
  }
}

export function createApiServer({ repository = createMemoryRepository() } = {}) {
  return createServer(async (request, response) => {
    const url = new URL(request.url ?? "/", "http://localhost");

    if (request.method === "GET" && url.pathname === "/api/v1/health") {
      return sendJson(response, 200, {
        status: "ok",
        service: "3l0-vision-api",
        apiVersion: "v1",
        resolutionMode: "deterministic-local",
        persistence: "ephemeral-process-memory",
        externalOrc: false,
        modelProviders: []
      });
    }

    if (request.method === "POST" && url.pathname === "/api/v1/resolve") {
      let body;
      try {
        body = await readJson(request);
      } catch (error) {
        return sendJson(response, error.statusCode ?? 400, {
          error: error.message ?? "invalid_request"
        });
      }

      const code = typeof body?.code === "string" ? body.code.trim() : "";
      if (!code || code.length > 128) {
        return sendJson(response, 400, {
          error: "invalid_code",
          message: "code must be a non-empty string of at most 128 characters"
        });
      }

      const scheme = typeof body.scheme === "string" && body.scheme.trim()
        ? body.scheme.trim().toLowerCase()
        : (/^\\d{8}$|^\\d{12,14}$/.test(code) ? "ean" : "identifier");

      try {
        const pipeline = new ResolutionPipeline({
          captureAdapter: {
            async capture(input) {
              return {
                source: "api-manual-entry",
                modality: "identifier",
                identifiers: [{ scheme: input.scheme, value: input.code }],
                context: { capture_method: "api" }
              };
            }
          },
          entityRepository: repository,
          orcClient: new OrcClient({ resolver: deterministicResolver })
        });

        const output = await pipeline.run({
          input: { code, scheme, method: "api" },
          context: {
            operation: "identify_product",
            interface: "3l0-vision-api",
            request_id: randomUUID()
          }
        });

        return sendJson(response, 200, {
          apiVersion: "v1",
          resolutionId: output.result.resolution_id,
          status: output.result.status,
          state: output.state,
          observation: output.observation,
          result: output.result,
          limitations: [
            "deterministic local matching only",
            "synthetic in-memory catalog",
            "no external ORC, OCR, model provider, or ERP/WMS integration",
            "no durable persistence"
          ]
        });
      } catch {
        return sendJson(response, 500, { error: "resolution_failed" });
      }
    }

    return sendJson(response, 404, { error: "not_found" });
  });
}

if (process.argv[1] && new URL(import.meta.url).pathname === process.argv[1]) {
  const port = Number(process.env.PORT ?? 8787);
  createApiServer().listen(port, "0.0.0.0", () => {
    console.log(`3L0 Vision API listening on port ${port}`);
  });
}
