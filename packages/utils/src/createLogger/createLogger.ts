import type { ILogger } from '@aetherisnova/types';

export default function createLogger(): ILogger {
  return {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    debug: (message: any, ...optionalParams: any[]) =>
      console.log(`\x1b[34m[DEBUG]\x1b[0m ${message}`, ...optionalParams),
    error: (message: any, ...optionalParams: any[]) =>
      console.log(`\x1b[31m[ERROR]\x1b[0m ${message}`, ...optionalParams),
    info: (message: any, ...optionalParams: any[]) =>
      console.log(`\x1b[37m[INFO]\x1b[0m ${message}`, ...optionalParams),
    success: (message: any, ...optionalParams: any[]) =>
      console.log(`\x1b[32m[SUCCESS]\x1b[0m ${message}`, ...optionalParams),
    warn: (message: any, ...optionalParams: any[]) =>
      console.log(`\x1b[33m[WARN]\x1b[0m ${message}`, ...optionalParams),
    /* eslint-enable @typescript-eslint/no-explicit-any */
  };
}
