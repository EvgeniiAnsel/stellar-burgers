import { getOrdersApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export const loadOrders = createAsyncThunk('ordersList/fetch', getOrdersApi);

export interface OrdersState {
  ordersList: TOrder[];
  isOrdersListsLoading: boolean;
  error: string | undefined;
}

export const initialState: OrdersState = {
  ordersList: [],
  isOrdersListsLoading: false,
  error: ''
};

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadOrders.pending, (state) => {
        state.isOrdersListsLoading = true;
        state.error = '';
      })
      .addCase(loadOrders.rejected, (state, action) => {
        state.isOrdersListsLoading = false;
        state.error = action.error.message;
      })
      .addCase(loadOrders.fulfilled, (state, action) => {
        state.isOrdersListsLoading = false;
        if (action.payload) {
          state.ordersList = action.payload;
        }
      });
  },
  selectors: {
    getOrdersList: (state) => state.ordersList
  }
});

export const { getOrdersList } = ordersSlice.selectors;
