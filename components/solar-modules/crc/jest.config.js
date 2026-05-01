/** Jest configuration — only runs files under tests/ to avoid pulling in
 *  TypeScript source modules (no ts-jest configured here on purpose; the
 *  goal is fast smoke tests for the pure-JS engineering modules). */
'use strict';
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: ['server/**/*.js', '!server/research-stubs.js'],
  coverageDirectory: 'coverage',
  verbose: true,
};
