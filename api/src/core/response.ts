import { HTTPException } from 'hono/http-exception';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import type { AppError } from './errors';

/**
 * Standard success response structure.
 */
export const successResponse = <T>(data: T, message?: string) => ({
  success: true,
  data,
  ...(message && { message })
});

/**
 * Standard error response structure.
 */
export const errorResponse = (err: unknown) => {
  let message = 'An unexpected error occured';
  let status: ContentfulStatusCode = 500;
  let code = 'INTERNAL_ERROR';

  if (err && typeof err === 'object' && 'code' in err) {
    const appErr = err as AppError;

    message = appErr.message;
    status = appErr.status;
    code = appErr.code;
  } else if (err instanceof Error) {
    message = err.message;
  }

  return {
    response: {
      success: false,
      error: { message, code },
    },
    status
  };
};
