
import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { TErrorSources } from '../interface/error';
import config from '../config';
import handleValidationError from '../errors/handleValidationError';
import handleZodError from '../errors/handleZodError';
import handleCastError from '../errors/handleCastError';
import handleDuplicateError from '../errors/handleDuplicateError';
import AppError from '../errors/AppError';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const isDevelopment = config.NODE_ENV === 'development';
  const errorResponse = (statusCode: number, message: string, errorSources: TErrorSources) => 
     res.status(statusCode).json({
      success: false,
      errorMessage: message,
      errorSource: errorSources,
      stack: isDevelopment ? err?.stack : null,
    });

  if (err instanceof ZodError) {
    const { message, statusCode, errorSources } = handleZodError(err);
      errorResponse(statusCode, message, errorSources);
  }

  if (err?.name === 'ValidationError') {
    const { message, statusCode, errorSources } = handleValidationError(err);
      errorResponse(statusCode, message, errorSources);
  }

  if (err?.name === 'CastError') {
    const { message, statusCode, errorSources } = handleCastError(err);
      errorResponse(statusCode, message, errorSources);
  }

  if (err?.code === 11000) {
    const { message, statusCode, errorSources } = handleDuplicateError(err);
      errorResponse(statusCode, message, errorSources);
  }

  if (err instanceof AppError || err instanceof Error) {
    const statusCode = err instanceof AppError ? err.statusCode : 500;
    const message = err.message || 'Something went wrong';
    const errorSources: TErrorSources = [
      { path: '', message },
    ];
      errorResponse(statusCode, message, errorSources);
  }

    errorResponse(500, 'Something went wrong', [
    { path: '', message: 'something went wrong' },
  ]);
};

export default globalErrorHandler;
