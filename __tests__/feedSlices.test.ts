import {
  loadFeeds,
  feedSlice,
  initialState
} from '../src/services/slices/feed/feedSlices';
import { TOrder, TOrdersData } from '../src/utils/types';
import { AsyncThunkAction, configureStore } from '@reduxjs/toolkit';
import type { RootState } from '../src/services/store';

jest.mock('@api', () => ({
  getFeedsApi: jest.fn()
}));

const mockGetFeedsApi = require('@api').getFeedsApi as jest.MockedFunction<
  () => Promise<TOrdersData>
>;

describe('Feed Slice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        feed: feedSlice.reducer
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('должен вернуть исходное состояние', () => {
    expect(feedSlice.reducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  describe('Загрузка заказов (loadFeeds)', () => {
    it('должен установить флаг загрузки при начале запроса (pending)', () => {
      const requestId = 'requestId';
      const action = loadFeeds.pending(requestId, undefined);

      store.dispatch(action);

      expect((store.getState() as RootState).feed).toEqual({
        ...initialState,
        isFeedListsLoading: true,
        error: ''
      });
    });

    it('должен установить ошибку при неудачном запросе (rejected)', () => {
      const requestId = 'requestId';
      const errorMessage = 'Network Error';
      const action = loadFeeds.rejected(
        new Error(errorMessage),
        requestId,
        undefined
      );

      store.dispatch(action);

      expect((store.getState() as RootState).feed).toEqual({
        ...initialState,
        isFeedListsLoading: false,
        error: errorMessage
      });
    });

    it('должен обновить состояние при успешном запросе (fulfilled)', async () => {
      const mockOrdersData: TOrdersData = {
        orders: [
          {
            _id: '643d69a5c3f7b9001cfa0941',
            ingredients: ['643d69a5c3f7b9001cfa093c'],
            status: 'done',
            name: 'Space Burger',
            createdAt: '2023-10-01T12:00:00Z',
            updatedAt: '2023-10-01T12:05:00Z',
            number: 12345
          }
        ],
        total: 100,
        totalToday: 10
      };

      mockGetFeedsApi.mockResolvedValue(mockOrdersData);

      await store.dispatch(loadFeeds() as any);

      expect((store.getState() as RootState).feed).toEqual({
        ...initialState,
        isFeedListsLoading: false,
        feedList: mockOrdersData.orders,
        feedListInfo: {
          total: mockOrdersData.total,
          totalToday: mockOrdersData.totalToday
        }
      });
    });
  });

  describe('Selectors', () => {
    it('должен вернуть правильные данные из селектора getFeedData', () => {
      const mockFeedData: TOrdersData = {
        orders: [
          {
            _id: '643d69a5c3f7b9001cfa0941',
            ingredients: ['643d69a5c3f7b9001cfa093c'],
            status: 'done',
            name: 'Space Burger',
            createdAt: '2023-10-01T12:00:00Z',
            updatedAt: '2023-10-01T12:05:00Z',
            number: 12345
          }
        ],
        total: 100,
        totalToday: 10
      };

      const state = {
        feed: {
          ...initialState,
          feedData: mockFeedData
        }
      };

      expect(feedSlice.selectors.getFeedData(state)).toEqual(mockFeedData);
    });

    it('должен вернуть правильные данные из селектора getFeedList', () => {
      const mockOrders: TOrder[] = [
        {
          _id: '643d69a5c3f7b9001cfa0941',
          ingredients: ['643d69a5c3f7b9001cfa093c'],
          status: 'done',
          name: 'Space Burger',
          createdAt: '2023-10-01T12:00:00Z',
          updatedAt: '2023-10-01T12:05:00Z',
          number: 12345
        }
      ];

      const state = {
        feed: {
          ...initialState,
          feedList: mockOrders
        }
      };

      expect(feedSlice.selectors.getFeedList(state)).toEqual(mockOrders);
    });
  });
});
