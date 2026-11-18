const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const DATE_TIME_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;

function isValidDate(value) {
  if (!DATE_RE.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function isValidDateTime(value) {
  if (!DATE_TIME_RE.test(value)) return false;
  return !Number.isNaN(Date.parse(value));
}

function matchesType(value, type) {
  switch (type) {
    case 'object': return value !== null && typeof value === 'object' && !Array.isArray(value);
    case 'array': return Array.isArray(value);
    case 'string': return typeof value === 'string';
    case 'boolean': return typeof value === 'boolean';
    case 'integer': return Number.isInteger(value);
    case 'number': return typeof value === 'number' && Number.isFinite(value);
    case 'null': return value === null;
    default: return true;
  }
}

function resolveLocalRef(root, ref) {
  if (!ref.startsWith('#/')) throw new Error(`지원하지 않는 JSON Schema 참조: ${ref}`);
  return ref.slice(2).split('/').reduce((value, part) => {
    const key = part.replace(/~1/g, '/').replace(/~0/g, '~');
    return value?.[key];
  }, root);
}

function validateNode(value, schema, root, path, errors) {
  if (schema.$ref) {
    const target = resolveLocalRef(root, schema.$ref);
    if (!target) {
      errors.push(`${path}: schema reference not found: ${schema.$ref}`);
      return;
    }
    validateNode(value, target, root, path, errors);
    return;
  }

  if (schema.oneOf) {
    const matches = schema.oneOf.filter(candidate => {
      const candidateErrors = [];
      validateNode(value, candidate, root, path, candidateErrors);
      return candidateErrors.length === 0;
    }).length;
    if (matches !== 1) errors.push(`${path}: exactly one schema variant must match (matched ${matches})`);
    return;
  }

  if (schema.type && !matchesType(value, schema.type)) {
    errors.push(`${path}: expected ${schema.type}`);
    return;
  }

  if (schema.const !== undefined && value !== schema.const) errors.push(`${path}: must equal ${JSON.stringify(schema.const)}`);
  if (schema.enum && !schema.enum.includes(value)) errors.push(`${path}: value is not in the allowed enum`);

  if (typeof value === 'string') {
    if (schema.minLength !== undefined && value.length < schema.minLength) errors.push(`${path}: shorter than minLength ${schema.minLength}`);
    if (schema.maxLength !== undefined && value.length > schema.maxLength) errors.push(`${path}: longer than maxLength ${schema.maxLength}`);
    if (schema.pattern && !(new RegExp(schema.pattern).test(value))) errors.push(`${path}: does not match required pattern`);
    if (schema.format === 'uri') {
      try {
        const url = new URL(value);
        if (!url.protocol || !url.hostname) throw new Error('invalid');
      } catch { errors.push(`${path}: must be a valid URI`); }
    }
    if (schema.format === 'date' && !isValidDate(value)) errors.push(`${path}: must be a valid calendar date`);
    if (schema.format === 'date-time' && !isValidDateTime(value)) errors.push(`${path}: must be an RFC3339 date-time`);
  }

  if (Array.isArray(value)) {
    if (schema.maxItems !== undefined && value.length > schema.maxItems) errors.push(`${path}: more than maxItems ${schema.maxItems}`);
    if (schema.items) value.forEach((item, index) => validateNode(item, schema.items, root, `${path}[${index}]`, errors));
  }

  if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
    for (const key of schema.required ?? []) {
      if (!Object.hasOwn(value, key)) errors.push(`${path}.${key}: required property is missing`);
    }
    const properties = schema.properties ?? {};
    if (schema.additionalProperties === false) {
      for (const key of Object.keys(value)) {
        if (!Object.hasOwn(properties, key)) errors.push(`${path}.${key}: additional property is not allowed`);
      }
    }
    for (const [key, childSchema] of Object.entries(properties)) {
      if (Object.hasOwn(value, key)) validateNode(value[key], childSchema, root, `${path}.${key}`, errors);
    }
  }
}

export function validateAgainstSchema(value, schema, path = '$') {
  const errors = [];
  validateNode(value, schema, schema, path, errors);
  return errors;
}

export function assertMatchesSchema(value, schema, path = '$') {
  const errors = validateAgainstSchema(value, schema, path);
  if (errors.length) throw new Error(`JSON Schema validation failed:\n- ${errors.join('\n- ')}`);
  return value;
}
