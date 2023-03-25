import React, {
  useState,
  useContext,
} from 'react';
import { useNavigate } from 'react-router-dom';

import ProductForm from 'components/ProductForm';

import UserContext from 'context';

import './styles.scss';
import trpc from 'utils/trpc';

const NewProduct = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const createProduct = trpc.product.createProduct.useMutation({
    onMutate: () => setIsLoading(true),
    onSuccess: () => navigate('/'),
    onError: () => setError('Error'),
  });

  const { selectedUser } = useContext(UserContext);

  return (
    <ProductForm
      error={error}
      isLoading={isLoading}
      handleSave={(product) => createProduct.mutate({ product, owner: selectedUser?.id || 1 })}
    />
  );
};
export default NewProduct;
