import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { orderBurger } from '../order/orderSlices';

export interface ConstructorState {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
}

export const initialState: ConstructorState = {
  bun: null,
  ingredients: []
};

export const constructorSlices = createSlice({
  name: 'constructorBurger',
  initialState,
  reducers: {
    handleAddIngredient: {
      reducer: (state, { payload }: PayloadAction<TConstructorIngredient>) => {
        if (payload.type === 'bun') {
          state.bun = payload;
        } else {
          state.ingredients = [...state.ingredients, payload];
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: uuid() }
      })
    },
    handleDeleteIngredient: (
      state,
      { payload }: PayloadAction<TConstructorIngredient>
    ) => {
      if (payload.type === 'bun') {
        state.bun = null;
      } else {
        state.ingredients = state.ingredients.filter(
          (item: TConstructorIngredient) => item.id !== payload.id
        );
      }
    },
    handleMoveUpIngredient: (
      state,
      { payload }: PayloadAction<TConstructorIngredient>
    ) => {
      const index = state.ingredients.findIndex(
        (item) => item.id === payload.id
      );
      if (index > 0) {
        const temp = state.ingredients[index];
        state.ingredients[index] = state.ingredients[index - 1];
        state.ingredients[index - 1] = temp;
      }
    },
    handleMoveDownIngredient: (
      state,
      { payload }: PayloadAction<TConstructorIngredient>
    ) => {
      const index = state.ingredients.findIndex(
        (item) => item.id === payload.id
      );
      if (index >= 0 && index < state.ingredients.length - 1) {
        const temp = state.ingredients[index];
        state.ingredients[index] = state.ingredients[index + 1];
        state.ingredients[index + 1] = temp;
      }
    },
    clearConstructorBurger: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  },
  extraReducers: (builder) => {
    builder.addCase(orderBurger.fulfilled, (state) => {
      state.bun = null;
      state.ingredients = [];
    });
  },
  selectors: {
    getIsBurger: (state) => ({
      bun: state.bun,
      ingredients: state.ingredients
    })
  }
});

export const {
  handleAddIngredient,
  handleDeleteIngredient,
  handleMoveUpIngredient,
  handleMoveDownIngredient,
  clearConstructorBurger
} = constructorSlices.actions;

export const { getIsBurger } = constructorSlices.selectors;
