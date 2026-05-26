import { expect, test } from 'bun:test';
import { Errors } from '../../src/core/errors';
import { errorResponse } from '../../src/core/response';

test('Errors create correct objects', () => {
  const err = Errors.NotFound('Mensa');
  expect(err.status).toBe(404);
  expect(err.code).toBe('NOT_FOUND');
  expect(err.message).toBe('Mensa not found');

  const badRequest = Errors.BadRequest('invalid input');
  expect(badRequest.status).toBe(400);
  expect(badRequest.code).toBe('VALIDATION_ERROR');
  expect(badRequest.message).toBe('invalid input');
});

test('errorResponse formats AppErrors correctly', () => {
  const err = Errors.Unauthorized();
  const { response, status } = errorResponse(err);

  expect(status).toBe(401);
  expect(response.success).toBe(false);
  expect(response.error.code).toBe('UNAUTHORIZED');
});

test('errorResponse handles fallback for unknown errors', () => {
  const { response, status } = errorResponse(new Error('test'));

  expect(status).toBe(500);
  expect(response.error.code).toBe('INTERNAL_ERROR');
  expect(response.error.message).toBe('test');

  const stringError = errorResponse('test_string');
  expect(stringError.status).toBe(500);
  expect(stringError.response.error.message).toBe('An unexpected error occured');
});
