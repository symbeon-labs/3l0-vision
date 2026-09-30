export class VisionProviderRegistry {
  constructor() {
    this.providers = new Map();
  }

  register(provider) {
    if (!provider?.name) throw new Error("vision provider is required");
    if (this.providers.has(provider.name)) {
      throw new Error("vision provider already registered: " + provider.name);
    }
    this.providers.set(provider.name, provider);
    return provider;
  }

  get(name) {
    return this.providers.get(name) ?? null;
  }

  list() {
    return [...this.providers.values()].map((provider) => provider.descriptor());
  }
}
