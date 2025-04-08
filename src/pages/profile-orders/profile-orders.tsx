import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { AppDispatch, useDispatch, useSelector } from '../../services/store';
import { loadOrders } from '../../services/slices/orders/ordersSlices';

export const ProfileOrders: FC = () => {
  const orders: TOrder[] = useSelector((store) => store.orders.ordersList);
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(loadOrders());
  }, []);

  return <ProfileOrdersUI orders={orders} />;
};
