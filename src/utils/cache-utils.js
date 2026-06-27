// src/utils/cache-utils.js
/**
 * In-memory cache utility with TTL (time to live) for API responses.
 * This utility helps reduce the number of API calls by caching frequently accessed data.
 */

const cache = {};

/**
 * Set a value in the cache with a TTL (time to live) in milliseconds.
 * @param {string} key - The cache key.
 * @param {any} value - The value to cache.
 * @param {number} ttl - The time to live in milliseconds.
 */
function setCache(key, value, ttl) {
  const now = Date.now();
  cache[key] = { value, expires: now + ttl };
}

/**
 * Get a value from the cache.
 * @param {string} key - The cache key.
 * @returns {any} The cached value or null if not found or expired.
 */
function getCache(key) {
  const now = Date.now();
  const cached = cache[key];
  if (!cached || cached.expires < now) {
    delete cache[key];
    return null;
  }
  return cached.value;
}

/**
 * Clear the cache.
 */
function clearCache() {
  cache = {};
}

/**
 * Check if a key is cached.
 * @param {string} key - The cache key.
 * @returns {boolean} True if the key is cached, false otherwise.
 */
function isCached(key) {
  const now = Date.now();
  const cached = cache[key];
  return cached && cached.expires > now;
}

// Example usage:
// Set a cache with a TTL of 1 minute (60000 milliseconds)
// setCache('apiResponse', { data: 'example data' }, 60000);

// Get the cached value
// const cachedValue = getCache('apiResponse');

// Clear the cache
// clearCache();

// Check if a key is cached
// const isCachedValue = isCached('apiResponse');

// Export the cache utility functions
export { setCache, getCache, clearCache, isCached };

// Integrate with existing files
// For example, in src/features/model-editing/model-editing.js
// import { setCache, getCache } from '../utils/cache-utils';

// Before making an API call, check if the response is cached
// const cachedResponse = getCache('modelEditingResponse');
// if (cachedResponse) {
//   // Use the cached response
// } else {
//   // Make the API call and cache the response
//   const response = await fetch('/api/model-editing');
//   const data = await response.json();
//   setCache('modelEditingResponse', data, 60000);
// }