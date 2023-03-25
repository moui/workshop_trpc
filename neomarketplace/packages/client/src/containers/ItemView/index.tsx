import React, {
  useMemo,
  useContext,
} from 'react';
import {
  useParams,
  generatePath,
  useNavigate,
} from 'react-router-dom';
import { format } from 'date-fns';

import routes from 'constants/routes';
import UserContext from 'context';

import EditIcon from 'assets/EditIcon.svg';
import CartIcon from 'assets/CartIcon.svg';

import CustomButton from 'components/CustomButton';
import StatusTag from 'components/StatusTag';
import EmptyState from 'components/EmptyState';

import './styles.scss';
import trpc from 'utils/trpc';
import { ClipLoader } from 'react-spinners';

const ItemView = () => {
  const { id: itemId } = useParams();
  const navigate = useNavigate();

  const { selectedUser } = useContext(UserContext);

  const item = trpc.product.getById.useQuery({ id: Number(itemId) });

  const isSold = useMemo(() => (typeof item?.data?.buyer?.id === 'number'), [item?.data?.buyer?.id]);
  const isOwner = useMemo(
    () => item?.data?.owner?.id === selectedUser.id,
    [item?.data?.owner, selectedUser.id],
  );

  const creationDate = item?.data?.createdAt ? format(new Date(item.data.createdAt), 'eee dd MMM yyyy') : '';

  if (item.isError) {
    return <div>Error loading item</div>;
  }

  if (item.isLoading) {
    return <ClipLoader size={70} loading={item.isLoading} color="#2C3A61" />;
  }

  if (item.data) {
    return (
      <div className="App">
        {!item ? (
          <EmptyState text="Item not found" />
        ) : (
          <div className="item-box">
            <div className="item-box__title">
              <p className="item-box__title-text">{item?.data?.name}</p>
              {isSold ? (
                <StatusTag text="Sold" />
              ) : (
                <CustomButton
                  text={isOwner ? 'Edit' : 'Purchase Item'}
                  icon={isOwner ? EditIcon : CartIcon}
                  isPrimary={!isOwner}
                  onClick={() => {
                    const itemPath = generatePath(routes.editProduct, { id: itemId });

                    if (isOwner) {
                      navigate(itemPath);
                    } else {
                      window.alert('This feature is not implemented yet!');
                    }
                  }}
                />
              )}
            </div>
            <div className="item-box__content">
              <img src={`data:image/jpeg;base64,${item.data?.image}`} alt="Item" />
              <div className="item-box__content-info">
                <div className="item-box__content-seller">
                  <img
                    src={`data:image/jpeg;base64,${item?.data?.owner?.avatar}`}
                    alt="Seller Avatar"
                  />
                  <p className="item-box__content-seller-name">{item?.data?.owner?.name}</p>
                </div>
                <div className="item-box__content-main">
                  <p className="item-box__content-title">{item.data.name}</p>
                  <div className="item-box__content-description">
                    {item.data.description}
                  </div>
                </div>
                <div className="item-box__content-details">
                  <p className="item-box__content-details-price">
                    {item?.data.price.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    })}
                  </p>
                  <div className="item-box__content-details-date">
                    <p className="item-box__content-details-date-title">published</p>
                    <p className="item-box__content-details-date-info">{creationDate.toString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default ItemView;
