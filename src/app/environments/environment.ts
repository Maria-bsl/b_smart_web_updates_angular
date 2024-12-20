import { NgxLoggerLevel } from 'ngx-logger';

export const environment = {
  production: false,
  logging: {
    level: NgxLoggerLevel.DEBUG,
    serverLogLevel: NgxLoggerLevel.ERROR,
    serverLoggingUrl:
      'https://sadly-bsmart-default-rtdb.europe-west1.firebasedatabase.app/ErrorLog.json',
  },
};
