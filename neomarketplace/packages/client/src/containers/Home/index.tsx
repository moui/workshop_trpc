import React from 'react';

import ProductList from 'components/ProductList';

import './styles.scss';
import trpc from 'utils/trpc';
import { ClipLoader } from 'react-spinners';

const Home = () => {
  const productsData = trpc.product.getAll.useQuery();

  if (productsData.isError) {
    return <div>No product found.</div>;
  }

  if (productsData.isLoading) {
    return <ClipLoader size={70} loading={productsData.isLoading} color="#2C3A61" />;
  }

  return (
    <div className="App">
      <ProductList products={productsData.data ?? []} />
    </div>
  );
};

export default Home;
