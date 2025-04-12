import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { userSlice } from './slices/user/userSlice';
import { feedSlice } from './slices/feed/feedSlices';
import { ingredientsSlice } from './slices/ingredients/ingredientSlice';
import { ordersSlice } from './slices/orders/ordersSlices';
import { constructorSlices } from './slices/constructor/constructorSlices';
import { orderSlice } from './slices/order/orderSlices';

const rootReducer = combineReducers({
  [userSlice.name]: userSlice.reducer,
  [feedSlice.name]: feedSlice.reducer,
  [ingredientsSlice.name]: ingredientsSlice.reducer,
  [orderSlice.name]: orderSlice.reducer,
  [ordersSlice.name]: ordersSlice.reducer,
  [constructorSlices.name]: constructorSlices.reducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
