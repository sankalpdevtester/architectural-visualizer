/**
 * Cache utility module to store and retrieve API responses with a time-to-live (TTL)
 */

const cache = {};

/**
 * Set a value in the cache with a TTL
 * @param {string} key - The cache key
 * @param {any} value - The value to store
 * @param {number} ttl - The time-to-live in milliseconds
 */
const setCache = (key, value, ttl) => {
  const currentTime = new Date().getTime();
  cache[key] = { value, expiresAt: currentTime + ttl };
};

/**
 * Get a value from the cache
 * @param {string} key - The cache key
 * @returns {any} The cached value or null if not found or expired
 */
const getCache = (key) => {
  if (!cache[key]) return null;
  const currentTime = new Date().getTime();
  if (cache[key].expiresAt < currentTime) {
    delete cache[key];
    return null;
  }
  return cache[key].value;
};

/**
 * Clear the cache
 */
const clearCache = () => {
  cache = {};
};

/**
 * Check if a key exists in the cache
 * @param {string} key - The cache key
 * @returns {boolean} True if the key exists, false otherwise
 */
const hasCache = (key) => {
  return Object.keys(cache).includes(key);
};

/**
 * Get the TTL for a cached value
 * @param {string} key - The cache key
 * @returns {number} The TTL in milliseconds or -1 if not found
 */
const getTTL = (key) => {
  if (!cache[key]) return -1;
  const currentTime = new Date().getTime();
  return cache[key].expiresAt - currentTime;
};

// Example usage:
// Set a value in the cache with a TTL of 1 minute
// setCache('apiResponse', { data: 'example data' }, 60000);

// Get the cached value
// const cachedValue = getCache('apiResponse');

// Clear the cache
// clearCache();

// Check if a key exists in the cache
// const hasKey = hasCache('apiResponse');

// Get the TTL for a cached value
// const ttl = getTTL('apiResponse');

// Export the cache utility functions
export { setCache, getCache, clearCache, hasCache, getTTL };