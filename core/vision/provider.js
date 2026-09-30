export class VisionProvider {
  constructor({ name, modality, version = "1" } = {}) {
    if (!name) throw new Error("vision provider name is required");
    if (!modality) throw new Error("vision provider modality is required");
    this.name = String(name);
    this.modality = String(modality);
    this.version = String(version);
  }

  async observe() {
    throw new Error("vision provider observe() must be implemented");
  }

  descriptor() {
    return { provider: this.name, modality: this.modality, version: this.version };
  }
}
