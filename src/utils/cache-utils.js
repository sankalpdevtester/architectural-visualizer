// src/utils/cache-utils.js
/**
 * In-memory cache utility with TTL (time to live) for API responses.
 * This utility helps reduce the number of API calls and improve performance.
 */

const cache = new Map();

/**
 * Set a value in the cache with a TTL.
 * @param {string} key - The cache key.
 * @param {any} value - The value to cache.
 * @param {number} ttl - The time to live in milliseconds.
 */
function setCache(key, value, ttl) {
  const timeout = setTimeout(() => {
    cache.delete(key);
  }, ttl);
  cache.set(key, { value, timeout });
}

/**
 * Get a value from the cache.
 * @param {string} key - The cache key.
 * @returns {any} The cached value or undefined if not found.
 */
function getCache(key) {
  const cached = cache.get(key);
  if (cached) {
    return cached.value;
  }
  return undefined;
}

/**
 * Clear the cache.
 */
function clearCache() {
  cache.forEach((cached, key) => {
    clearTimeout(cached.timeout);
    cache.delete(key);
  });
}

/**
 * Invalidate a cache entry by key.
 * @param {string} key - The cache key.
 */
function invalidateCache(key) {
  const cached = cache.get(key);
  if (cached) {
    clearTimeout(cached.timeout);
    cache.delete(key);
  }
}

// Example usage:
// Set a cache entry with a TTL of 1 minute
setCache('api-response', { data: 'example data' }, 60000);

// Get the cached value
const cachedValue = getCache('api-response');
console.log(cachedValue); // { data: 'example data' }

// Clear the entire cache
clearCache();

// Invalidate a specific cache entry
invalidateCache('api-response');

// Export the cache utility functions
export { setCache, getCache, clearCache, invalidateCache };

// Integrate with existing files
// In src/features/model-editing/model-editing.js
import { setCache, getCache } from '../utils/cache-utils';
// ...
const apiResponse = await fetch('/api/model-editing');
const cachedResponse = getCache('api-response');
if (cachedResponse) {
  // Use the cached response
} else {
  // Set the cache entry with a TTL
  setCache('api-response', apiResponse, 60000);
}

// In src/features/model-library/model-library.js
import { invalidateCache } from '../utils/cache-utils';
// ...
// Invalidate the cache entry when the model is updated
invalidateCache('api-response');