function encodeParams(params: Record<string, any>): string {
  const query = new URLSearchParams();

  for (const key in params) {
    if (params[key] !== undefined && params[key] !== null) {
      if (params[key] instanceof Object) {
        query.append(key, JSON.stringify(params[key]));
      } else {
        query.append(key, String(params[key]));
      }
    }
  }

  return query.toString();
}

function decodeParams(queryString: string): Record<string, string> {
  const params = new URLSearchParams(queryString);
  const result: Record<string, string> = {};

  for (const [key, value] of params.entries()) {
    result[key] = value;
  }

  return result;
}

export function buildEncodedUrl(baseUrl: string, params: Record<string, any>): string {
  const queryString = encodeParams(params);
  return `${baseUrl}?${queryString}`;
}
