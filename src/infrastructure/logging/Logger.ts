/**
 * Logger Service - Centralized logging utility
 * Provides consistent logging across the application with log levels and context
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export interface LogEntry {
  timestamp: Date
  level: LogLevel
  message: string
  context?: Record<string, unknown>
  error?: Error
}

export interface LoggerOptions {
  /** Minimum log level to output */
  minLevel: LogLevel
  /** Whether to include timestamp in logs */
  includeTimestamp: boolean
  /** Whether to enable console output */
  consoleOutput: boolean
  /** Whether to store logs in memory */
  storeLogs: boolean
  /** Maximum number of logs to store */
  maxStoredLogs: number
}

const DEFAULT_OPTIONS: LoggerOptions = {
  minLevel: LogLevel.INFO,
  includeTimestamp: true,
  consoleOutput: true,
  storeLogs: false,
  maxStoredLogs: 100,
}

/**
 * Centralized Logger class for application-wide logging
 */
export class Logger {
  private options: LoggerOptions
  private logs: LogEntry[] = []
  private context: Record<string, unknown> = {}

  constructor(options: Partial<LoggerOptions> = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options }
  }

  /**
   * Create a child logger with additional context
   */
  child(additionalContext: Record<string, unknown>): Logger {
    const childLogger = new Logger(this.options)
    childLogger.logs = this.logs
    childLogger.context = { ...this.context, ...additionalContext }
    return childLogger
  }

  /**
   * Set the minimum log level
   */
  setLevel(level: LogLevel): void {
    this.options.minLevel = level
  }

  /**
   * Get all stored logs
   */
  getLogs(): LogEntry[] {
    return [...this.logs]
  }

  /**
   * Clear all stored logs
   */
  clearLogs(): void {
    this.logs = []
  }

  /**
   * Log debug message
   */
  debug(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.DEBUG, message, context)
  }

  /**
   * Log info message
   */
  info(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, message, context)
  }

  /**
   * Log warning message
   */
  warn(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.WARN, message, context)
  }

  /**
   * Log error message
   */
  error(message: string, error?: Error, context?: Record<string, unknown>): void {
    this.log(LogLevel.ERROR, message, context, error)
  }

  /**
   * Core logging method
   */
  private log(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>,
    error?: Error,
  ): void {
    // Skip if below minimum level
    if (level < this.options.minLevel) {
      return
    }

    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      context: { ...this.context, ...context },
      error,
    }

    // Store logs if enabled
    if (this.options.storeLogs) {
      this.logs.push(entry)
      // Trim logs if exceeding max
      if (this.logs.length > this.options.maxStoredLogs) {
        this.logs = this.logs.slice(-this.options.maxStoredLogs)
      }
    }

    // Console output if enabled
    if (this.options.consoleOutput) {
      this.outputToConsole(entry)
    }
  }

  /**
   * Output log entry to console
   */
  private outputToConsole(entry: LogEntry): void {
    const levelPrefix = this.getLevelPrefix(entry.level)
    const timestamp = this.options.includeTimestamp
      ? `[${entry.timestamp.toISOString()}] `
      : ''
    const contextStr = entry.context
      ? ` ${JSON.stringify(entry.context)}`
      : ''
    const errorStr = entry.error ? `\n${entry.error.stack || entry.error.message}` : ''

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(`${timestamp}${levelPrefix} ${entry.message}${contextStr}${errorStr}`)
        break
      case LogLevel.INFO:
        console.info(`${timestamp}${levelPrefix} ${entry.message}${contextStr}${errorStr}`)
        break
      case LogLevel.WARN:
        console.warn(`${timestamp}${levelPrefix} ${entry.message}${contextStr}${errorStr}`)
        break
      case LogLevel.ERROR:
        console.error(`${timestamp}${levelPrefix} ${entry.message}${contextStr}${errorStr}`)
        break
    }
  }

  /**
   * Get prefix string for log level
   */
  private getLevelPrefix(level: LogLevel): string {
    const prefixes: Record<LogLevel, string> = {
      [LogLevel.DEBUG]: 'DEBUG',
      [LogLevel.INFO]: 'INFO',
      [LogLevel.WARN]: 'WARN',
      [LogLevel.ERROR]: 'ERROR',
    }
    return prefixes[level]
  }
}

// Create and export default logger instance
export const logger = new Logger({
  minLevel: import.meta.env.DEV ? LogLevel.DEBUG : LogLevel.INFO,
  storeLogs: import.meta.env.DEV,
})

// Convenience functions using default logger
export const debug = (message: string, context?: Record<string, unknown>) =>
  logger.debug(message, context)
export const info = (message: string, context?: Record<string, unknown>) =>
  logger.info(message, context)
export const warn = (message: string, context?: Record<string, unknown>) =>
  logger.warn(message, context)
export const error = (message: string, error?: Error, context?: Record<string, unknown>) =>
  logger.error(message, error, context)

export default logger

