import { VisionProvider } from "./provider.js";

export class BarcodeVisionProvider extends VisionProvider {
  constructor({ name = "barcode-provider", version = "1" } = {}) {
    super({ name, modality: "barcode", version });
  }

  async observe() {
    throw new Error("barcode provider observe() must be implemented");
  }
}

export function normalizeBarcodeObservation({
  observationId, observedAt, source = "barcode", provider = "unknown",
  value, format, confidence = null, imageReference = null, context = {}
} = {}) {
  if (!value) throw new Error("barcode value is required");

  return {
    observationId, observedAt, source, modality: "barcode", provider,
    identifiers: [{
      scheme: normalizeBarcodeScheme(format),
      value: String(value).trim(),
      confidence
    }],
    evidence: imageReference ? [{ type: "image", reference: imageReference }] : [],
    context: { ...context, barcode_format: format ?? null }
  };
}

function normalizeBarcodeScheme(format) {
  const value = String(format ?? "").toLowerCase();
  if (value === "ean_13" || value === "ean13" || value === "ean_8" || value === "ean8") return "ean";
  if (value === "qr_code" || value === "qrcode") return "qr";
  if (value === "code_128" || value === "code128") return "code128";
  return "barcode";
}
