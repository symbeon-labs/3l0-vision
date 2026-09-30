# 3L0 Vision — Perception Provider Architecture

## Purpose

3L0 does not need one monolithic vision AI. It needs a replaceable perception layer that turns physical media into observations.

IMAGE / VIDEO / DOCUMENT
→ PERCEPTION PROVIDER
→ OBSERVATION
→ NORMALIZATION
→ ORC RESOLUTION

Providers may handle barcode, OCR, detection, segmentation, document parsing or bounded visual inference. They never own final operational identity.

## Provider matrix

| Capability | Initial adapter | Candidate technology | Output |
|---|---|---|---|
| Barcode / EAN / QR | Browser BarcodeDetector | ZXing-C++ / WebAssembly | identifier observation |
| OCR | planned | PaddleOCR | text + candidate identifiers |
| Image preprocessing | planned | OpenCV | normalized image evidence |
| Object/product detection | planned | pluggable detector | detection observation |
| Semantic visual inference | later | bounded VLM/provider | candidate attributes/assertions |

ZXing-C++ is a multi-format barcode library supporting EAN/UPC, Code 128, Data Matrix and QR, with WebAssembly and Python bindings among others. It is tracked as a candidate backend for a future provider rather than a current Phase 1 dependency. citeturn0search0turn0search9

PaddleOCR provides OCR/document parsing with structured outputs and an official browser inference SDK, making it a candidate for the secondary OCR path. It remains an adapter choice, not an ORC dependency. citeturn0search8

## Rules

1. Provider output is observation, never resolved identity.
2. Confidence is preserved; it is not converted into operational certainty.
3. Every observation carries source/provider provenance.
4. Image references are evidence references, not entity identity.
5. Multiple providers may observe the same physical input.
6. ORC receives normalized observations and resolves their relationship.
7. Provider replacement must not require changes to ORC semantics.
8. Technical provider failure is distinct from semantic uncertainty or conflict.

## Current implementation

The repository now exposes:

- VisionProvider: provider lifecycle and descriptor contract.
- createVisionObservation: provider-independent observation factory.
- BarcodeVisionProvider: barcode-specific adapter boundary.
- normalizeBarcodeObservation: barcode to identifier normalization.
- VisionProviderRegistry: replaceable provider registry.

The existing browser BarcodeDetector remains the Phase 1 capture implementation. ZXing-C++ and PaddleOCR are tracked as future provider backends.

## Intended evolution

3L0
├── capture
│   ├── browser camera
│   └── future device adapters
├── vision
│   ├── provider
│   ├── observation
│   ├── barcode-provider
│   ├── registry
│   ├── barcode
│   ├── ocr
│   ├── detection
│   └── preprocessing
└── ORC boundary
    └── resolution

The architectural property is replaceability: 3L0 can change how it sees without changing what resolved, conflict or uncertain mean.
