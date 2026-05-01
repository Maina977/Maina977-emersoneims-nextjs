// Centralised environment-variable validation.
// Every secret-bearing key the server reads must be declared here. The
// process refuses to boot if a required key is missing or set to a known
// placeholder value (DEMO, demo, changeme, etc.).
//
// Per project DATA POLICY:
//   - No DEMO_KEY fallback that pretends to talk to a real provider.
//   - Missing optional keys disable the corresponding feature explicitly
//     (the consumer asks `requireEnv()` and gets a clear error).

'use strict';

const REQUIRED = [];
const OPTIONAL = [
  'NREL_API_KEY',
  'OPENWEATHER_API_KEY',
  'GOOGLE_MAPS_API_KEY',
  'MPESA_CONSUMER_KEY',
  'MPESA_CONSUMER_SECRET',
  'MPESA_PASSKEY',
  'MPESA_SHORTCODE',
  'MPESA_INITIATOR_NAME',
  'MPESA_INITIATOR_PASSWORD',
  'FLUTTERWAVE_PUBLIC_KEY',
  'FLUTTERWAVE_SECRET_KEY',
  'PAYSTACK_PUBLIC_KEY',
  'PAYSTACK_SECRET_KEY',
  'JWT_SECRET',
  'APP_URL',
];
const PLACEHOLDERS = new Set(['', 'DEMO', 'demo', 'DEMO_KEY', 'changeme', 'CHANGEME', 'TODO', 'YOUR_KEY']);

function isPlaceholder(v) {
  return v === undefined || v === null || PLACEHOLDERS.has(String(v).trim());
}

function validateOnBoot() {
  const missing = REQUIRED.filter((k) => isPlaceholder(process.env[k]));
  if (missing.length > 0) {
    // Refuse to boot rather than start a server that will silently 500.
    // eslint-disable-next-line no-console
    console.error(`[config] FATAL: missing required env vars: ${missing.join(', ')}`);
    process.exit(1);
  }
  // Warn (once) about each optional integration that is disabled.
  const disabled = OPTIONAL.filter((k) => isPlaceholder(process.env[k]));
  if (disabled.length > 0) {
    // eslint-disable-next-line no-console
    console.warn(
      `[config] disabled integrations (env not set): ${disabled.join(', ')}. ` +
        'Endpoints that need these will return HTTP 503 with a clear message ' +
        '(per data policy: no fabricated success).'
    );
  }
}

/**
 * Read an env var that a feature needs. Throws an Error tagged with
 * statusCode=503 so Express middleware can surface a clean message.
 */
function requireEnv(key) {
  const v = process.env[key];
  if (isPlaceholder(v)) {
    const err = new Error(
      `Configuration error: env variable ${key} is not set. ` +
        `Per data policy this feature refuses to use a placeholder/DEMO key.`
    );
    err.statusCode = 503;
    err.code = 'ENV_MISSING';
    err.envKey = key;
    throw err;
  }
  return v;
}

/** Read an env var that is optional. Returns undefined when not set. */
function optionalEnv(key) {
  const v = process.env[key];
  return isPlaceholder(v) ? undefined : v;
}

module.exports = { validateOnBoot, requireEnv, optionalEnv, isPlaceholder };
