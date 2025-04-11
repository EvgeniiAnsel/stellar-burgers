import { FC } from 'react';
import { OrderInfo } from '@components';
import { useParams } from 'react-router-dom';
import React from 'react';

export const OrderDetailsPage: FC = () => {
  const { number } = useParams<{ number: string }>();

  return (
    <div className='pt-10 pr-10 pl-10 pb-10'>
      <OrderInfo orderNumber={Number(number)} isStandalone />
    </div>
  );
};
