interface ILogger {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  debug: (message: any, ...optionalParams: any[]) => void;
  error: (message: any, ...optionalParams: any[]) => void;
  info: (message: any, ...optionalParams: any[]) => void;
  success: (message: any, ...optionalParams: any[]) => void;
  warn: (message: any, ...optionalParams: any[]) => void;
  /* eslint-enable @typescript-eslint/no-explicit-any */
}

export default ILogger;
