import { productRouter } from './product';
import { userRouter } from './user';

import { router } from '../trpc';

export const appRouter = router({
  product: productRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
