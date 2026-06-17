/**
 * Cache utility module to store and retrieve API responses with a time-to-live (TTL)
 * @module cache-utils
 */

const cache = {};
const ttl = 60 * 1000; // 1 minute

/**
 * Set a value in the cache with a TTL
 * @param {string} key - Cache key
 * @param {any} value - Value to store
 */
function setCache(key, value) {
  const currentTime = new Date().getTime();
  cache[key] = { value, expiresAt: currentTime + ttl };
}

/**
 * Get a value from the cache
 * @param {string} key - Cache key
 * @returns {any} Value stored in the cache, or null if not found or expired
 */
function getCache(key) {
  if (!cache[key]) return null;
  const currentTime = new Date().getTime();
  if (cache[key].expiresAt < currentTime) {
    delete cache[key];
    return null;
  }
  return cache[key].value;
}

/**
 * Clear the cache
 */
function clearCache() {
  cache = {};
}

/**
 * Check if a value is cached
 * @param {string} key - Cache key
 * @returns {boolean} True if the value is cached, false otherwise
 */
function isCached(key) {
  return cache[key] !== undefined;
}

/**
 * Get the cache expiration time for a key
 * @param {string} key - Cache key
 * @returns {number} Expiration time in milliseconds, or -1 if not found
 */
function getCacheExpiration(key) {
  if (!cache[key]) return -1;
  return cache[key].expiresAt;
}

// Example usage:
// setCache('apiResponse', { data: 'example data' });
// const cachedValue = getCache('apiResponse');
// console.log(cachedValue); // { data: 'example data' }

// Integrate with existing files:
// In src/features/model-editing/model-editing.js:
// import { getCache, setCache } from '../utils/cache-utils';
// ...
// const cachedModel = getCache('modelData');
// if (cachedModel) {
//   // Use cached model data
// } else {
//   // Fetch model data from API and cache it
//   const modelData = await fetchModelData();
//   setCache('modelData', modelData);
// }

// In src/features/model-library/model-library.js:
// import { getCache, setCache } from '../utils/cache-utils';
// ...
// const cachedModels = getCache('models');
// if (cachedModels) {
//   // Use cached models
// } else {
//   // Fetch models from API and cache them
//   const models = await fetchModels();
//   setCache('models', models);
// }

export { setCache, getCache, clearCache, isCached, getCacheExpiration };