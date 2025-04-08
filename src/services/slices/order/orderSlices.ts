import { orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export const orderBurger = createAsyncThunk(
  'order/post',
  async (data: string[]) => orderBurgerApi(data)
);

export interface OrderState {
  orderModalData: TOrder | null;
  lastOrderName: string;
  isOrderLoading: boolean;
  orderRequest: boolean;
  orderAccept: boolean;
  error: string | undefined;
}

export const initialState: OrderState = {
  orderModalData: null,
  lastOrderName: '',
  isOrderLoading: false,
  orderRequest: false,
  orderAccept: false,
  error: ''
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    handleCloseOrderModal: (state) => {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderBurger.pending, (state) => {
        state.isOrderLoading = true;
        state.orderRequest = true;
        state.error = '';
      })
      .addCase(orderBurger.rejected, (state, action) => {
        state.isOrderLoading = false;
        state.error = action.error.message;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.isOrderLoading = false;
        state.orderRequest = false;
        state.orderAccept = true;
        state.orderModalData = action.payload.order;
        state.lastOrderName = action.payload.name;
      });
  },
  selectors: {}
});

export const { handleCloseOrderModal } = orderSlice.actions;
