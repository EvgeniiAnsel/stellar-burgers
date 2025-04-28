import {
  orderSlice,
  orderBurger,
  initialState
} from '../src/services/slices/order/orderSlices';
import { TOrder } from '../src/utils/types';

const { reducer } = orderSlice;

// Мок API
jest.mock('@api', () => ({
  orderBurgerApi: jest.fn()
}));

const mockOrderBurgerApi = require('@api').orderBurgerApi as jest.Mock;

describe('Order Slice', () => {
  describe('Создание заказа', () => {
    it('pending: установка флагов', () => {
      const state = reducer(initialState, {
        type: orderBurger.pending.type
      });

      expect(state.isOrderLoading).toBe(true);
      expect(state.orderRequest).toBe(true);
      expect(state.error).toBe('');
    });

    it('rejected: обработка ошибки', () => {
      const mockError = 'Ошибка оформления заказа';
      const state = reducer(initialState, {
        type: orderBurger.rejected.type,
        error: { message: mockError }
      });

      expect(state.isOrderLoading).toBe(false);
      expect(state.error).toBe(mockError);
    });

    it('fulfilled: успешное создание заказа', () => {
      const mockOrder: TOrder = {
        _id: '1',
        status: 'done',
        name: 'Space Burger',
        createdAt: '2023-10-01T12:00:00Z',
        updatedAt: '2023-10-01T12:05:00Z',
        number: 12345,
        ingredients: ['1', '2']
      };

      const mockPayload = {
        order: mockOrder,
        name: 'Space Burger'
      };

      const state = reducer(initialState, {
        type: orderBurger.fulfilled.type,
        payload: mockPayload
      });

      expect(state.orderModalData).toEqual(mockOrder);
      expect(state.lastOrderName).toBe('Space Burger');
      expect(state.isOrderLoading).toBe(false);
      expect(state.orderRequest).toBe(false);
      expect(state.orderAccept).toBe(true);
    });
  });

  // orderSlices.test.ts
  describe('Закрытие модального окна', () => {
    it('должен сбросить все данные заказа', () => {
      const mockOrder: TOrder = {
        _id: '1',
        status: 'done',
        name: 'Space Burger',
        createdAt: '2023-10-01T12:00:00Z',
        updatedAt: '2023-10-01T12:05:00Z',
        number: 12345,
        ingredients: ['1', '2']
      };

      const stateWithOrder = {
        ...initialState,
        orderModalData: mockOrder,
        lastOrderName: 'Space Burger',
        orderAccept: true
      };

      const action = orderSlice.actions.handleCloseOrderModal();
      const newState = reducer(stateWithOrder, action);

      expect(newState.orderModalData).toBeNull();
      expect(newState.lastOrderName).toBe(''); // Теперь будет пусто
      expect(newState.orderAccept).toBe(false); // Теперь false
    });
  });

  it('неизвестный экшен: возврат исходного состояния', () => {
    const unknownAction = { type: 'unknown' };
    expect(reducer(initialState, unknownAction)).toEqual(initialState);
  });
});
