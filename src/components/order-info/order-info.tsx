import { FC, useMemo, useEffect, useState } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { getIngredientsList } from '../../services/slices/ingredients/ingredientSlice';
import { useSelector } from '../../services/store';
import { getOrderByNumberApi } from '@api';
import { useParams } from 'react-router-dom';

interface OrderInfoProps {
  orderNumber?: number;
  isStandalone?: boolean;
}

export const OrderInfo: FC<OrderInfoProps> = ({
  orderNumber,
  isStandalone
}) => {
  const [orderData, setOrderData] = useState<TOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const ingredients = useSelector(getIngredientsList);
  const params = useParams();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const number = orderNumber || Number(params.number);
        if (!number) return;

        const response = await getOrderByNumberApi(number);
        if (response.success) {
          setOrderData(response.orders[0]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderNumber, params.number]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    const ingredientsInfo = orderData.ingredients.reduce<{
      [key: string]: TIngredient & { count: number };
    }>((acc, item) => {
      const ingredient = ingredients.find((ing) => ing._id === item);
      if (!ingredient) return acc;

      acc[ingredient._id] = {
        ...ingredient,
        count: (acc[ingredient._id]?.count || 0) + 1
      };
      return acc;
    }, {});

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

  if (loading) return <Preloader />;
  if (!orderInfo) return <div>Заказ не найден</div>;

  return <OrderInfoUI orderInfo={orderInfo} fullPage={isStandalone} />;
};
