import { FC, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { getIngredientsList } from '../../services/slices/ingredients/ingredientSlice';
import { useMatch } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { getOrdersList } from '../../services/slices/orders/ordersSlices';
import { getFeedList } from '../../services/slices/feed/feedSlices';

export const OrderInfo: FC = () => {
  const orderNumber = useMatch('/feed/:number')
    ? Number(useMatch('/feed/:number')?.params.number)
    : Number(useMatch('/profile/orders/:number')?.params.number);

  const orderData = [
    ...useSelector(getOrdersList),
    ...useSelector(getFeedList)
  ].find((item: TOrder) => {
    if (item.number === orderNumber) {
      return item;
    }
  });

  const ingredients: TIngredient[] = useSelector(getIngredientsList);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
