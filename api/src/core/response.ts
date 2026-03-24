import { HTTPException } from 'hono/http-exception';
import type { StatusCode } from 'hono/utils/http-status';

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
  let message = 'Internal Server Error';
  let status: StatusCode = 500;

  if (err instanceof HTTPException) {
    message = err.message;
    status = err.status;
  } else if (err instanceof Error) {
    message = err.message;
  }

  return {
    response: {
      success: false,
      error: message,
      code: status,
    },
    status
  };
};
