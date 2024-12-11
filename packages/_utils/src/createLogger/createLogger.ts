import type { ILogger, TLogLevel } from '_types';

/**
 * Creates a logger that can set whether the logs appear based on the level.
 * @param {TLogLevel} level - The base level of logging.
 * @returns {ILogger} A logger that can be used to create logs based on the level.
 */
export default function createLogger(level: TLogLevel = 'error'): ILogger {
  const canLog: (allowedLevel: TLogLevel) => boolean = (allowedLevel): boolean => {
    switch (level) {
      case 'error':
        return allowedLevel === 'error';
      case 'warn':
        return allowedLevel === 'error' || allowedLevel === 'warn';
      case 'info':
        return allowedLevel === 'error' || allowedLevel === 'warn' || allowedLevel === 'info';
      case 'debug':
        return true;
      default:
        return false;
    }
  };

  return {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    debug: (message: any, ...optionalParams: any[]) =>
      canLog('debug') && console.log(`\x1b[34m[DEBUG]\x1b[0m ${message}`, ...optionalParams),
    error: (message: any, ...optionalParams: any[]) =>
      canLog('error') && console.log(`\x1b[31m[ERROR]\x1b[0m ${message}`, ...optionalParams),
    info: (message: any, ...optionalParams: any[]) =>
      canLog('info') && console.log(`\x1b[37m[INFO]\x1b[0m ${message}`, ...optionalParams),
    success: (message: any, ...optionalParams: any[]) =>
      canLog('info') && console.log(`\x1b[32m[SUCCESS]\x1b[0m ${message}`, ...optionalParams),
    warn: (message: any, ...optionalParams: any[]) =>
      canLog('warn') && console.log(`\x1b[33m[WARN]\x1b[0m ${message}`, ...optionalParams),
    /* eslint-enable @typescript-eslint/no-explicit-any */
  };
}
