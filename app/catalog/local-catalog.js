import { createEntity } from "../../core/entities/entity.js";

const STORAGE_KEY = "3l0.catalog.v1";

const seed = [
  createEntity({
    entityId: "product_demo_001",
    type: "product",
    identifiers: [{ scheme: "ean", value: "789000000004" }],
    attributes: { name: "Produto X", unit: "500 ml" }
  })
];

export class LocalCatalog {
  constructor() {
    this.entities = this.load();
  }

  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return seed;
      return JSON.parse(raw);
    } catch {
      return seed;
    }
  }

  save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.entities));
  }

  async findCandidates({ observation }) {
    const identifiers = observation.identifiers ?? [];
    return this.entities.filter((entity) =>
      entity.identifiers?.some((candidate) =>
        identifiers.some(
          (observed) =>
            observed.scheme === candidate.scheme &&
            String(observed.value).trim() === String(candidate.value).trim()
        )
      )
    );
  }

  async persistResolution({ entityId }) {
    const entity = this.entities.find((item) => item.entity_id === entityId);
    if (!entity) throw new Error("entity_not_found");
    this.save();
    return entity;
  }
}
