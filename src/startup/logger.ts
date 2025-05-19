import 'winston-mongodb';
import { createLogger, format, transports, Logger } from 'winston';

const logger: Logger = createLogger({
  level: 'debug',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.errors({ stack: true }),
    format.json(),
    format.metadata()
  ),
  transports: [
    new transports.Console(),
    new transports.MongoDB({
      db: process.env.DB_URL as string, 
      level: 'error',
    }),
  ],
});

export { logger };
