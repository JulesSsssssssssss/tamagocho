/**
 * Logger centralisé pour l'application
 *
 * Remplace console.log/error/warn avec des logs structurés
 * Peut être étendu avec des services externes (Sentry, LogRocket, etc.)
 *
 * Usage:
 * ```ts
 * logger.info('User logged in', { userId, email })
 * logger.error('Failed to save', { error: err.message, context })
 * logger.debug('Processing data', { data })
 * ```
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogContext {
  [key: string]: unknown
}

class Logger {
  private readonly isDevelopment = process.env.NODE_ENV === 'development'

  /**
   * Log niveau DEBUG (uniquement en dev)
   */
  debug (message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      this.log('debug', message, context)
    }
  }

  /**
   * Log niveau INFO
   */
  info (message: string, context?: LogContext): void {
    this.log('info', message, context)
  }

  /**
   * Log niveau WARN
   */
  warn (message: string, context?: LogContext): void {
    this.log('warn', message, context)
  }

  /**
   * Log niveau ERROR (toujours affiché)
   */
  error (message: string, context?: LogContext): void {
    this.log('error', message, context)
  }

  /**
   * Méthode interne de logging
   */
  private log (level: LogLevel, message: string, context?: LogContext): void {
    const timestamp = new Date().toISOString()
    const logData = {
      timestamp,
      level: level.toUpperCase(),
      message,
      ...(context !== undefined && { context })
    }

    // En développement: logs colorés et lisibles
    if (this.isDevelopment) {
      const emoji = this.getEmoji(level)
      const color = this.getColor(level)

      console.log(
        `${emoji} [${timestamp}] ${color}${level.toUpperCase()}${this.resetColor} ${message}`,
        context !== undefined ? context : ''
      )
    } else {
      // En production: logs JSON structurés
      const logMethod = level === 'error' ? console.error : console.log
      logMethod(JSON.stringify(logData))
    }

    // TODO: Envoyer à un service externe en production (Sentry, DataDog, etc.)
    if (!this.isDevelopment && level === 'error') {
      // Exemple: Sentry.captureException(new Error(message), { extra: context })
    }
  }

  private getEmoji (level: LogLevel): string {
    switch (level) {
      case 'debug': return '🔍'
      case 'info': return 'ℹ️'
      case 'warn': return '⚠️'
      case 'error': return '❌'
      default: return '📝'
    }
  }

  private getColor (level: LogLevel): string {
    switch (level) {
      case 'debug': return '\x1b[36m' // Cyan
      case 'info': return '\x1b[32m' // Green
      case 'warn': return '\x1b[33m' // Yellow
      case 'error': return '\x1b[31m' // Red
      default: return '\x1b[0m'
    }
  }

  private readonly resetColor = '\x1b[0m'
}

// Export singleton
export const logger = new Logger()
