// Normalizes various input types into an array of string IDs.
// Handles strings, arrays, and objects with common ID fields.

export function normalizeIdArray(input: unknown): string[] {
  if (!input) return []; // handle null/undefined/false
  // If already an array, normalize each element
  if (Array.isArray(input)) {
    return input
      .map((it) => {
        if (typeof it === 'string') return it;
        if (it && typeof it === 'object') {
          // prefer common id fields and avoid timestamps
          // @ts-ignore
          const candidate = it.id ?? it._id ?? it.value ?? it.clientId ?? it.userId ?? null;
          if (candidate) return String(candidate);
          // don't stringify large objects without a clear id field
          return '';
        }
        return String(it); // Stringify as id
      })
      .filter(Boolean); // remove empty strings
  }

  // If single string or object, extract ID
  if (typeof input === 'string') return [input];
  // If single object, extract id-like field
  if (typeof input === 'object' && input !== null) {
    // @ts-ignore
    const candidate =
      input.id ?? input._id ?? input.value ?? input.clientId ?? input.userId ?? null;
    if (candidate) return [String(candidate)];
    // If no id-like field, return empty array
    return [];
  }
  // If single primitive value, stringify it
  return [String(input)];
}

// Converts various input types into a user-friendly string representation
// using the provided ID-to-name mapping.
export function friendlyForValue(val: unknown, idToName: Map<string, string>): string {
  if (val == null) return ''; // handle null/undefined

  if (typeof val === 'string') return idToName.get(val) ?? val; // Single string id

  // If array of values, map each to friendly string and join
  if (Array.isArray(val)) {
    return val
      .map((v) => friendlyForValue(v, idToName))
      .filter(Boolean)
      .join(', ');
  }

  // If object, try to extract id and look up name
  if (typeof val === 'object') {
    // @ts-ignore
    const id = String(val.id ?? val._id ?? val.value ?? '');
    if (id && idToName.has(id)) return idToName.get(id) as string;

    // If no mapped id, prefer explicit name fields and avoid createdAt
    // @ts-ignore
    const name = val.name ?? val.displayName ?? val.company ?? val.email ?? null;
    if (name) return String(name);
    // If object has just createdAt, return empty to avoid showing timestamp
    return '';
  }
  // If single primitive value, stringify it
  return String(val);
}
