/**
 * GENERATOR ORACLE — Local AI public surface.
 *
 * Re-exports for routes/components that consume the local stack.
 *
 * @copyright 2026 EmersonEIMS / Generator Oracle
 */

export * from './schemas';
export * from './env';
export * from './rules';
export * from './verifier';
export * from './sanitize';
export * from './audit';
export * from './prompts';
export {
  ollamaChat,
  ollamaVision,
  ollamaPing,
  OllamaUnavailableError,
  OllamaResponseError,
} from './ollamaClient';
export type {
  OllamaChatMessage,
  OllamaGenerateResult,
} from './ollamaClient';
export {
  paddleOcrExtract,
  paddleOcrPing,
  PaddleOcrUnavailableError,
} from './paddleOcrClient';
export type { PaddleOcrResult } from './paddleOcrClient';
export {
  retrievalQuery,
  retrievalPing,
  hitsToCitations,
  RetrievalUnavailableError,
} from './retrievalClient';
export type { RetrievalHit, RetrievalQuery } from './retrievalClient';
export { getLocalAiHealth } from './health';
export type { LocalAiHealth } from './health';
export {
  isGeminiConfigured,
  geminiChat,
  geminiVision,
  geminiPing,
  getGeminiEnv,
  GeminiUnavailableError,
  GeminiResponseError,
} from './geminiClient';
export {
  isGroqConfigured,
  groqChat,
  groqVision,
  groqPing,
  getGroqEnv,
  GroqUnavailableError,
  GroqResponseError,
} from './groqClient';
