import { createObservation } from "../observations/observation.js";

export function createVisionObservation(input = {}) {
  const {
    observationId, observedAt, source, modality = "vision", provider,
    imageReference = null, detections = [], text = [], identifiers = [],
    attributes = {}, metadata = {}, evidence = [], context = {}
  } = input;

  if (!provider) throw new Error("vision observation provider is required");

  return createObservation({
    observationId, observedAt, source, modality, identifiers, text, attributes,
    metadata: { ...metadata, vision_provider: provider },
    evidence: [...evidence, ...(imageReference ? [{ type: "image", reference: imageReference }] : [])],
    context: { ...context, detections: [...detections] }
  });
}
