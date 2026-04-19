import * as z from 'zod';
import type { ValidationTargets } from 'hono';
import { zValidator as zv } from '@hono/zod-validator';
import { HTTPException } from 'hono/http-exception';

export const zValidator = <T extends z.ZodSchema, Target extends keyof ValidationTargets>(
  target: Target,
  schema: T,
) =>
  zv(target, schema, (result, _c) => {
    if (!result.success) {
      const flattenedErrors = z.flattenError(result.error);
      throw new HTTPException(422, {
        message: JSON.stringify({
          success: false,
          errors: flattenedErrors.fieldErrors,
        }),
        cause: result.error,
      });
    }
  });
