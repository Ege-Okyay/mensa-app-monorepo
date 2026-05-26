import { HTTPException } from 'hono/http-exception';
import type { ContentfulStatusCode } from 'hono/utils/http-status';

export type ErrorCode =
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'DATABASE_ERROR'
  | 'INTERNAL_ERROR'
  | 'RATE_LIMIT_EXCEEDED';

export interface AppError extends HTTPException {
  code: ErrorCode;
}

const createError = (status: ContentfulStatusCode, message: string, code: ErrorCode): AppError => {
  const err = new HTTPException(status, { message }) as AppError;
  err.code = code;

  return err;
};

export const Errors = {
  NotFound: (resource = 'Resource') =>
    createError(404, `${resource} not found`, 'NOT_FOUND'),

  BadRequest: (message: string) =>
    createError(400, message, 'VALIDATION_ERROR'),
  
  Unauthorized: (message = 'Unauthorized') =>
    createError(401, message, 'UNAUTHORIZED'),
  
  Database: (err: any) => {
    console.error('[Database Error]', err);
    return createError(500, 'A database error occured', 'DATABASE_ERROR');
  },
  
  Internal: (message = 'Internal Server Error') =>
    createError(500, message, 'INTERNAL_ERROR')
};
