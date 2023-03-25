import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createProduct, getAll, getById } from '../dataAccess/product';

import { router, publicProcedure } from '../trpc';

export const productRouter = router({
  getAll: publicProcedure
    .query(async () => {
      try {
        const products = await getAll();
        if (!products.length) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'No products found',
          });
        }
        return products;
      } catch (err) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get products',
        });
      }
    }),
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input: { id } }) => {
      try {
        const product = await getById(id);
        if (!product) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Product not found',
          });
        }
        return product;
      } catch (err) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get product',
        });
      }
    }),
  createProduct: publicProcedure
    .input(z.object({
      product: z.object({
        name: z.string(), price: z.number(), description: z.string(), image: z.string(),
      }),
      owner: z.number(),
    }))
    .mutation(
      async ({ input }) => {
        try {
          const newProduct = await createProduct(input);
          return newProduct;
        } catch (err) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to create product',
          });
        }
      },
    ),
});
