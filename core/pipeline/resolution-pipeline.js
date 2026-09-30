import { createObservation } from "../observations/observation.js";
import { mapResolutionToProductState } from "../state/product-state.js";

/**
 * Phase 1 vertical-slice orchestrator.
 *
 * The pipeline owns sequencing and lifecycle state.
 * It does not decide semantic truth; ORC remains responsible for resolution.
 *
 * CAPTURE → OBSERVATION → NORMALIZATION → ORC → RESOLUTION → STATE
 *
 * Adapters are injected so camera, barcode, OCR, persistence and the ORC
 * boundary can evolve without changing the pipeline semantics.
 */
export class ResolutionPipeline {
  constructor({
    orcClient,
    captureAdapter,
    entityRepository,
    observationFactory = createObservation,
    onStage = () => {},
    idFactory = defaultId
  } = {}) {
    if (!orcClient) throw new Error("orcClient is required");
    if (!captureAdapter) throw new Error("captureAdapter is required");
    if (!entityRepository) throw new Error("entityRepository is required");

    this.orcClient = orcClient;
    this.entityRepository = entityRepository;
    this.observationFactory = observationFactory;
    this.onStage = onStage;
    this.idFactory = idFactory;
  }

  async run({
    input,
    question = { type: "identify_product", target: "product" },
    context = {},
    ruleset = { id: "default", version: "0.1" }
  } {
    this.stage("CAPTURING", { input });

    const captured = await this.captureAdapter.capture(input);

    this.stage("OBSERVING", { captured });

    const observation = this.observationFactory({
      observationId: this.idFactory("obs"),
      observedAt: new Date().toISOString(),
      source: captured.source ?? "3l0-capture",
      modality: captured.modality ?? "unknown",
      identifiers: captured.identifiers ?? [],
      text: captured.text ?? [],
      attributes: captured.attributes ?? {},
      metadata: captured.metadata ?? {},
      evidence: captured.evidence ?? [],
      context: { ...context, ...(captured.context ?? {}) }
    });

    this.stage("NORMALIZING", { observation });

    const normalized = normalizeObservation(observation);

    this.stage("RESOLVING", { observation: normalized });

    const entities = await this.entityRepository.findCandidates({
      observation: normalized,
      question,
      context
    });

    const result = await this.orcClient.resolve({
      resolutionId: this.idFactory("res"),
      question,
      entities,
      observations: [normalized],
      context,
      ruleset
    });

    const state = mapResolutionToProductState(result.status);

    this.stage("RESOLVED", { result, state });

    if (result.status === "RESOLVED" && result.entities.length === 1) {
      await this.entityRepository.persistResolution({
        entityId: result.entities[0],
        observation: normalized,
        result,
        context
      });
    }

    this.stage("COMPLETED", { result, state });

    return {
      observation: normalized,
      result,
      state
    };
  }

  stage(name, payload) {
    this.onStage({ name, at: new Date().toISOString(), ...payload });
  }
}

function normalizeObservation(observation) {
  return {
    ...observation,
    identifiers: (observation.identifiers ?? []).map((identifier) => ({
      ...identifier,
      value: String(identifier.value).trim()
    })),
    text: [...(observation.text ?? [])],
    attributes: { ...(observation.attributes ?? {}) },
    metadata: { ...(observation.metadata ?? {}) },
    evidence: [...(observation.evidence ?? [])],
    context: { ...(observation.context ?? {}) }
  };
}

function defaultId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
