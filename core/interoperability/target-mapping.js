const ALLOWED_TRANSFORMS = new Set(["identity", "trim", "uppercase", "lowercase"]);

/**
 * Maps a resolved canonical record to a target-system representation.
 * This module intentionally does not write to a target system.
 */
export function applyTargetMapping({
  canonicalRecord,
  resolutionStatus,
  mapping,
  sourceProvenance = {}
} = {}) {
  if (resolutionStatus !== "RESOLVED") {
    return {
      status: "BLOCKED_UNRESOLVED",
      output: null,
      errors: [{ code: "resolution_not_resolved", resolution_status: resolutionStatus ?? null }],
      fields: []
    };
  }

  if (!canonicalRecord || typeof canonicalRecord !== "object") {
    throw new Error("canonicalRecord must be an object");
  }
  validateMapping(mapping);

  const output = {};
  const errors = [];
  const fields = [];

  for (const rule of mapping.fields) {
    const rawValue = readPath(canonicalRecord, rule.source);
    const missing = rawValue === undefined || rawValue === null || rawValue === "";

    if (missing) {
      fields.push({
        source: rule.source,
        target: rule.target,
        status: "MISSING",
        required: Boolean(rule.required),
        provenance: sourceProvenance[rule.source] ?? null
      });
      if (rule.required) {
        errors.push({
          code: "required_source_field_missing",
          source: rule.source,
          target: rule.target
        });
      }
      continue;
    }

    const value = transformValue(rawValue, rule.transform ?? "identity");
    writePath(output, rule.target, value);
    fields.push({
      source: rule.source,
      target: rule.target,
      status: "MAPPED",
      required: Boolean(rule.required),
      transform: rule.transform ?? "identity",
      provenance: sourceProvenance[rule.source] ?? null
    });
  }

  return {
    status: errors.length ? "INVALID_MAPPING_INPUT" : "REVIEW_REQUIRED",
    target_system: mapping.targetSystem,
    mapping_id: mapping.id,
    mapping_version: mapping.version,
    output,
    errors,
    fields,
    live_write: false
  };
}

function validateMapping(mapping) {
  if (!mapping || typeof mapping !== "object") throw new Error("mapping is required");
  if (!mapping.id || !mapping.version || !mapping.targetSystem) {
    throw new Error("mapping id, version and targetSystem are required");
  }
  if (!Array.isArray(mapping.fields) || mapping.fields.length === 0) {
    throw new Error("mapping fields must be a non-empty array");
  }

  const targets = new Set();
  for (const rule of mapping.fields) {
    if (!rule?.source || !rule?.target) {
      throw new Error("each mapping field requires source and target paths");
    }
    if (targets.has(rule.target)) throw new Error(`duplicate target path: ${rule.target}`);
    targets.add(rule.target);
    const transform = rule.transform ?? "identity";
    if (!ALLOWED_TRANSFORMS.has(transform)) {
      throw new Error(`unsupported transform: ${transform}`);
    }
  }
}

function readPath(object, path) {
  return path.split(".").reduce((value, key) => {
    if (value === null || value === undefined || !Object.hasOwn(value, key)) return undefined;
    return value[key];
  }, object);
}

function writePath(object, path, value) {
  const parts = path.split(".");
  let cursor = object;
  for (const part of parts.slice(0, -1)) {
    if (cursor[part] === undefined) cursor[part] = {};
    if (typeof cursor[part] !== "object" || cursor[part] === null || Array.isArray(cursor[part])) {
      throw new Error(`target path collision: ${path}`);
    }
    cursor = cursor[part];
  }
  const leaf = parts.at(-1);
  if (Object.hasOwn(cursor, leaf)) throw new Error(`target path collision: ${path}`);
  cursor[leaf] = value;
}

function transformValue(value, transform) {
  if (typeof value !== "string" && transform !== "identity") {
    throw new Error(`transform ${transform} requires a string value`);
  }
  if (transform === "trim") return value.trim();
  if (transform === "uppercase") return value.toUpperCase();
  if (transform === "lowercase") return value.toLowerCase();
  return value;
}
