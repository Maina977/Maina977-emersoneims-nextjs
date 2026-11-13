/**
 * Reproducible pseudo-random numbers for the stochastic engines (Monte Carlo,
 * genetic optimiser). Seeded from the request's own inputs, so the same inputs
 * always give the same result (Engineering Apps directive §7: reproducible
 * calculations). P0 audit 2026-11-13: both engines used Math.random(), so the
 * same design request returned a different battery size or design each time.
 *
 * mulberry32 PRNG seeded with a 32-bit FNV-1a hash of the seed string.
 */
function hashString(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function seededRandom(seed) {
  let a = hashString(typeof seed === 'string' ? seed : JSON.stringify(seed)) || 1;
  return function next() {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

module.exports = { seededRandom, hashString };
