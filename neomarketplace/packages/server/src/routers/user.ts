import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { router, publicProcedure } from '../trpc';
import { getAll } from '../dataAccess/user';

export const userRouter = router({
  getAll: publicProcedure
    .query(async () => {
      try {
        const users = await getAll();
        if (!users.length) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'No users found',
          });
        }
        return users;
      } catch (err) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get users',
        });
      }
    }),
});
