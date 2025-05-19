/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import { logger } from '../startup/logger';

const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof createHttpError.HttpError) {
    res.status(err.statusCode).json({ message: err.message });
  } else {
    logger.error({ message: err })
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export default errorMiddleware;
