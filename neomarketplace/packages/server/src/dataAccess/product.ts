import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getById = async (id: number) => {
  const product = await prisma.product.findFirst({
    where: {
      id,
    },
    include: {
      owner: true,
      buyer: true,
    },
  });

  return product;
};

export const getAll = async (filter?: string) => {
  const products = await prisma.product.findMany({
    where: {
      name: {
        contains: filter,
        mode: 'insensitive',
      },
    },
    include: {
      owner: true,
      buyer: true,
    },
  });

  return products;
};

export const createProduct = async ({
  product,
  owner,
}: {
  product: Omit<Prisma.ProductCreateInput, 'owner'>;
  owner: number;
}) => {
  const createdProduct = await prisma.product.create({
    data: { ...product, owner: { connect: { id: owner } } },
  });

  return createdProduct;
};

export const updateProduct = async (
  id: number,
  product: Prisma.ProductUpdateInput,
) => {
  const updatedProduct = await prisma.product.update({
    where: {
      id,
    },
    data: product,
  });

  return updatedProduct;
};

export const getAllMyPurchased = async (buyerId: number) => {
  const products = await prisma.product.findMany({
    where: {
      status: 'Inactive',
      buyerId,
    },
    include: {
      owner: true,
    },
  });

  return products;
};

export const getMyListing = async (userId: number) => {
  const products = await prisma.product.findMany({
    where: {
      userId,
    },
    include: {
      owner: true,
    },
  });

  return products;
};
