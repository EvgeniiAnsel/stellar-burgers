import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { AppDispatch, useDispatch, useSelector } from '../../services/store';
import { loadFeeds } from '../../services/slices/feed/feedSlices';

export const Feed: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const orders: TOrder[] = useSelector((store) => store.feed.feedList);
  const handleLoadOrders = () => {
    dispatch(loadFeeds());
  };

  useEffect(() => {
    dispatch(loadFeeds());
  }, []);

  if (!orders.length) {
    return <Preloader />;
  }
  return <FeedUI orders={orders} handleGetFeeds={handleLoadOrders} />;
};
