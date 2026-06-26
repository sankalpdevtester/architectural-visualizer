/**
 * Cache utility module for storing API responses with a time-to-live (TTL).
 * @module cache-utils
 */

const cache = {};

/**
 * Set a value in the cache with a TTL.
 * @param {string} key - The cache key.
 * @param {any} value - The value to store.
 * @param {number} ttl - The time-to-live in milliseconds.
 */
function setCache(key, value, ttl) {
  const expiresAt = Date.now() + ttl;
  cache[key] = { value, expiresAt };
}

/**
 * Get a value from the cache.
 * @param {string} key - The cache key.
 * @returns {any} The cached value or null if not found or expired.
 */
function getCache(key) {
  const cached = cache[key];
  if (!cached) return null;
  if (cached.expiresAt < Date.now()) {
    delete cache[key];
    return null;
  }
  return cached.value;
}

/**
 * Clear the cache.
 */
function clearCache() {
  Object.keys(cache).forEach((key) => delete cache[key]);
}

/**
 * Check if a key is cached.
 * @param {string} key - The cache key.
 * @returns {boolean} True if the key is cached, false otherwise.
 */
function isCached(key) {
  return !!cache[key];
}

/**
 * Get the cache expiration time for a key.
 * @param {string} key - The cache key.
 * @returns {number} The expiration time in milliseconds or -1 if not found.
 */
function getCacheExpiration(key) {
  const cached = cache[key];
  return cached ? cached.expiresAt : -1;
}

// Example usage:
// Set a cache value with a 1-minute TTL
setCache('apiResponse', { data: 'example data' }, 60000);

// Get the cached value
const cachedValue = getCache('apiResponse');
console.log(cachedValue); // { data: 'example data' }

// Clear the cache
clearCache();

// Check if a key is cached
console.log(isCached('apiResponse')); // false

// Get the cache expiration time
console.log(getCacheExpiration('apiResponse')); // -1

// Integrate with existing files
// src/features/model-editing/model-editing.js
import { getCache } from '../utils/cache-utils';
// ...
const cachedModel = getCache('modelData');
if (cachedModel) {
  // Use the cached model data
} else {
  // Fetch the model data from the API
}

// src/features/model-library/model-library.js
import { setCache } from '../utils/cache-utils';
// ...
setCache('modelList', modelList, 30000); // Cache the model list for 30 seconds

// src/features/furniture-library/furniture-library.js
import { clearCache } from '../utils/cache-utils';
// ...
clearCache(); // Clear the cache when the furniture library is updated

// src/features/model-upload/model-upload.js
import { isCached } from '../utils/cache-utils';
// ...
if (isCached('uploadProgress')) {
  // Use the cached upload progress
} else {
  // Fetch the upload progress from the API
}