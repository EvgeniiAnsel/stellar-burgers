import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

export const loadIngredientList = createAsyncThunk(
  'ingredients/fetch',
  getIngredientsApi
);

export interface IngredientsState {
  ingredientList: TIngredient[];
  buns: TIngredient[];
  mains: TIngredient[];
  sauces: TIngredient[];
  isIngredientsLoading: boolean;
  error: string | undefined;
}

export const initialState: IngredientsState = {
  ingredientList: [],
  buns: [],
  mains: [],
  sauces: [],
  isIngredientsLoading: false,
  error: ''
};

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // 1. Pending
    builder.addCase(loadIngredientList.pending, (state) => {
      state.isIngredientsLoading = true;
      state.error = '';
    });

    // 2. Rejected
    builder.addCase(loadIngredientList.rejected, (state, action) => {
      state.isIngredientsLoading = false;
      state.error = action.error.message || 'Неизвестная ошибка';
    });

    // 3. Fulfilled
    builder.addCase(loadIngredientList.fulfilled, (state, action) => {
      state.isIngredientsLoading = false;
      state.ingredientList = action.payload;

      // Корректная фильтрация списков
      state.buns = action.payload.filter((item) => item.type === 'bun');
      state.mains = action.payload.filter((item) => item.type === 'main');
      state.sauces = action.payload.filter((item) => item.type === 'sauce');
    });
  },
  selectors: {
    getIngredientsList: (state) => state.ingredientList,
    getIsIngredientsLoading: (state) => state.isIngredientsLoading
  }
});

export const { getIngredientsList, getIsIngredientsLoading } =
  ingredientsSlice.selectors;
