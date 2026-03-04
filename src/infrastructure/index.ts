/**
 * Infrastructure Layer - Barrel exports
 * Re-exports all infrastructure modules for convenient imports
 */

// API
export { httpClient, useApiClient, apiClient, DEFAULT_CONFIG } from './api/ApiClient'
export type { ApiConfig } from './api/ApiClient'

// Logging
export { logger, debug, info, warn, error, LogLevel } from './logging'
export type { LogEntry, LoggerOptions } from './logging'

// Repositories
export { gameRepository, levelRepository, GameRepository, LevelRepository } from './repositories/GameRepository'
export { sessionRepository, SessionRepository } from './repositories/SessionRepository'

// Storage
export { storage, LocalStorageService } from './storage/LocalStorageService'

