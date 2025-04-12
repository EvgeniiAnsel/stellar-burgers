import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { getIngredientsList } from '../../services/slices/ingredients/ingredientSlice';
import { useMatch } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { TIngredient } from '@utils-types';

export const IngredientDetails: FC = () => {
  const ingredientId = useMatch('/ingredients/:id')?.params.id;

  const ingredientData = useSelector(getIngredientsList).find(
    (item: TIngredient) => {
      if (item._id === ingredientId) {
        return item;
      }
    }
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
