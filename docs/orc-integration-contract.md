# ORC Integration Contract

Status: **v0.1 — product integration draft**

This contract defines the boundary between 3L0 Vision and Operational Resolution Core. It intentionally does not duplicate ORC semantics.

## Purpose

3L0 Vision produces observations, assertions, evidence and context from operational inputs. ORC resolves those inputs and returns a traceable resolution.

## Direction

3L0 Vision → Resolution Request → ORC → Resolution Result → 3L0 Vision

## Request

```json
{
  "resolution_id": "res_...",
  "question": {"type": "identify_product", "target": "product"},
  "entities": [], "relations": [], "assertions": [], "evidence": [], "observations": [],
  "context": {}, "ruleset": {"id": "default", "version": "0.1"}
}
```

Requirements: unique resolution ID; traceable observations/evidence; explicit context; explicit rule version; model/provider/version metadata; no silent conversion of model confidence into certainty.

## Result

```json
{
  "resolution_id": "res_...",
  "status": "RESOLVED",
  "entities": [],
  "resolved_attributes": {},
  "conflicts": [],
  "uncertainties": [],
  "requires_verification": [],
  "provenance": [],
  "resolution_metadata": {"engine": "orc", "version": "0.1"}
}
```

Supported product-facing statuses: RESOLVED, CONFLICT, UNCERTAIN, INCOMPLETE, REQUIRES_VERIFICATION, REJECTED_FOR_AUTOMATION.

## Product mapping

| ORC | Product state |
|---|---|
| RESOLVED | Resolved |
| CONFLICT | Conflict |
| UNCERTAIN | Identification uncertain |
| INCOMPLETE | Missing information |
| REQUIRES_VERIFICATION | Confirmation required |
| REJECTED_FOR_AUTOMATION | Automation explicitly rejected; requires a human or alternative workflow |

The UI must never hide a conflict by rendering it as success.

## Observation boundary

Vision providers produce observations. An observation is input/evidence for resolution, not automatically an operational fact.

```json
{
  "observation_id": "obs_...",
  "modality": "vision",
  "observed_at": "...",
  "source": "camera",
  "model": {"provider": "...", "name": "...", "version": "..."},
  "identifiers": [], "text": [], "detections": [], "attributes": {}, "confidence": null
}
```

## Human confirmation

A human confirmation is a distinct assertion/action containing actor, timestamp, target, selected value, context/reason and resulting resolution reference.

## Error handling

Technical failures — TIMEOUT, UNAVAILABLE, INVALID_REQUEST, DEPENDENCY_ERROR — must not be presented as semantic CONFLICT or UNCERTAIN.

## Idempotency

The same resolution ID must be safe to retry without creating duplicate operational entities.

## Versioning

Retain contract version, ORC version, rule version and relevant model versions whenever they influence the result.

## First implementation

Observation → Resolution Request → Deterministic Match → Resolution Result.

Semantic expansion follows the vertical slice.