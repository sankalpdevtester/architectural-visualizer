/**
 * Cache utility module for storing and retrieving API responses with a time-to-live (TTL) value.
 * This module uses a simple in-memory cache implementation using a JavaScript object.
 * It provides methods for setting, getting, and deleting cache entries, as well as a mechanism for automatic cache expiration.
 */

const cache = {};
const ttlMap = {};

/**
 * Set a cache entry with a TTL value.
 * @param {string} key - The cache key.
 * @param {any} value - The cache value.
 * @param {number} ttl - The time-to-live value in milliseconds.
 */
function setCache(key, value, ttl) {
  cache[key] = value;
  ttlMap[key] = Date.now() + ttl;
}

/**
 * Get a cache entry.
 * @param {string} key - The cache key.
 * @returns {any} The cache value, or undefined if the entry has expired or does not exist.
 */
function getCache(key) {
  if (ttlMap[key] && Date.now() > ttlMap[key]) {
    delete cache[key];
    delete ttlMap[key];
    return undefined;
  }
  return cache[key];
}

/**
 * Delete a cache entry.
 * @param {string} key - The cache key.
 */
function deleteCache(key) {
  delete cache[key];
  delete ttlMap[key];
}

/**
 * Clear all cache entries.
 */
function clearCache() {
  cache = {};
  ttlMap = {};
}

/**
 * Check if a cache entry exists and has not expired.
 * @param {string} key - The cache key.
 * @returns {boolean} True if the entry exists and has not expired, false otherwise.
 */
function hasCache(key) {
  return ttlMap[key] && Date.now() < ttlMap[key];
}

/**
 * Get the TTL value for a cache entry.
 * @param {string} key - The cache key.
 * @returns {number} The TTL value in milliseconds, or -1 if the entry does not exist or has expired.
 */
function getTTL(key) {
  if (ttlMap[key] && Date.now() < ttlMap[key]) {
    return ttlMap[key] - Date.now();
  }
  return -1;
}

// Example usage:
// Set a cache entry with a TTL of 1 minute
setCache('apiResponse', { data: 'example data' }, 60000);

// Get the cache entry
const cachedResponse = getCache('apiResponse');
console.log(cachedResponse); // { data: 'example data' }

// Delete the cache entry
deleteCache('apiResponse');

// Clear all cache entries
clearCache();

// Check if a cache entry exists and has not expired
const hasEntry = hasCache('apiResponse');
console.log(hasEntry); // false

// Get the TTL value for a cache entry
const ttl = getTTL('apiResponse');
console.log(ttl); // -1

module.exports = {
  setCache,
  getCache,
  deleteCache,
  clearCache,
  hasCache,
  getTTL,
};