'use strict';
/**
 * The accounts backup / migration library lives in lib/accounts/backup-core.cjs,
 * because the app (lib/accounts/drill.ts) uses it too and scripts/ is not part of
 * deployments (.vercelignore). This file keeps the scripts' and tests' import path.
 */
module.exports = require('../../lib/accounts/backup-core.cjs');
