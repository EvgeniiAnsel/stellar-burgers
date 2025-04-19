import {
  ingredientsSlice,
  initialState,
  loadIngredientList // Импортируем сам AsyncThunk
} from '../src/services/slices/ingredients/ingredientSlice';
import { TIngredient } from '../src/utils/types'; // Update the path to the correct location

const { reducer } = ingredientsSlice;

describe('Ingredients Slice', () => {
  describe('Загрузка ингредиентов', () => {
    it('pending: установка флага загрузки', () => {
      const state = reducer(initialState, {
        type: loadIngredientList.pending.type // Используем loadIngredientList.pending
      });

      expect(state.isIngredientsLoading).toBe(true);
      expect(state.error).toBe('');
    });

    it('rejected: обработка ошибки', () => {
      const mockError = 'API error';
      const state = reducer(initialState, {
        type: loadIngredientList.rejected.type, // Используем loadIngredientList.rejected
        error: { message: mockError }
      });

      expect(state.isIngredientsLoading).toBe(false);
      expect(state.error).toBe(mockError);
    });

    it('fulfilled: обновление данных', () => {
      const mockIngredients: TIngredient[] = [
        {
          _id: '1',
          name: 'Краторная булка N-200i',
          type: 'bun',
          proteins: 80,
          fat: 24,
          carbohydrates: 53,
          calories: 420,
          price: 1255,
          image: 'https://code.s3.yandex.net/react/code/bun-02.png',
          image_mobile:
            'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
          image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
        },
        {
          _id: '2',
          name: 'Биокотлета из марсианской Магнолии',
          type: 'main',
          proteins: 420,
          fat: 142,
          carbohydrates: 242,
          calories: 4242,
          price: 424,
          image: 'https://code.s3.yandex.net/react/code/meat-01.png',
          image_mobile:
            'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
          image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
        },
        {
          _id: '3',
          name: 'Соус Spicy-X',
          type: 'sauce',
          proteins: 30,
          fat: 20,
          carbohydrates: 40,
          calories: 30,
          price: 90,
          image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
          image_mobile:
            'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
          image_large:
            'https://code.s3.yandex.net/react/code/sauce-02-large.png'
        }
      ];

      const state = reducer(initialState, {
        type: loadIngredientList.fulfilled.type, // Используем loadIngredientList.fulfilled
        payload: mockIngredients
      });

      expect(state.isIngredientsLoading).toBe(false);
      expect(state.error).toBe('');

      expect(state.ingredientList).toEqual(mockIngredients);
      expect(state.buns).toEqual([mockIngredients[0]]);
      expect(state.mains).toEqual([mockIngredients[1]]);
      expect(state.sauces).toEqual([mockIngredients[2]]);
    });
  });

  it('неизвестный экшен: возврат исходного состояния', () => {
    const unknownAction = { type: 'unknown' };
    expect(reducer(initialState, unknownAction)).toEqual(initialState);
  });
});
