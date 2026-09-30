# Vision and OCR

## Role

Vision is an observation provider, not a truth engine.

The first implementation should support:

- barcode/EAN detection
- QR detection
- OCR
- object/product detection
- visible attributes
- image references
- model metadata
- confidence
- observation context

## Pipeline

camera
→ preprocessing
→ barcode / OCR
→ normalization
→ deterministic matching
→ semantic vision only when ambiguity remains
→ ORC resolution

## Contract

A vision observation should be representable independently of the provider:

```js
createVisionObservation({
  observationId,
  observedAt,
  source,
  imageReference,
  model,
  detections,
  text,
  identifiers,
  attributes,
  context
})
```

## Principle

Model confidence is not operational certainty.

A high-confidence visual prediction can still conflict with:
- an EAN
- a fiscal XML
- ERP data
- another observation
- operator confirmation

Those conflicts are inputs to resolution.

## Markerless first

3L0 Vision must work without QR labels.

QR/NFC/printed identifiers may later accelerate repeated identification.

The first encounter can be intelligence-heavy.

Subsequent encounters should become identity-heavy.
