const cache = new Map();
const pending = new Map();

async function getCached(key, fetchFn, ttlMs) {
  const cached = cache.get(key);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.value;
  }

  if (pending.has(key)) {
    return pending.get(key);
  }

  const request = Promise.resolve()
    .then(fetchFn)
    .then((value) => {
      cache.set(key, { value, expiresAt: Date.now() + ttlMs });
      return value;
    })
    .finally(() => {
      pending.delete(key);
    });

  pending.set(key, request);
  return request;
}

module.exports = { getCached };