import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useDispatch } from '../../services/store';
import {
  handleDeleteIngredient,
  handleMoveUpIngredient,
  handleMoveDownIngredient
} from '../../services/slices/constructor/constructorSlices';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    const handleMoveDown = () => {
      dispatch(handleMoveDownIngredient(ingredient));
    };

    const handleMoveUp = () => {
      dispatch(handleMoveUpIngredient(ingredient));
    };

    const handleClose = () => {
      dispatch(handleDeleteIngredient(ingredient));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
