import {
  forgotPasswordApi,
  getUserApi,
  logoutApi,
  registerUserApi,
  resetPasswordApi,
  TAuthResponse,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '../../../utils/burger-api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { loginUserApi } from '@api';
import { setCookie, deleteCookie } from '../../../utils/cookie';

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (data: TLoginData) =>
    await loginUserApi(data).then((data: TAuthResponse) => {
      setCookie('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('email', data.user.email);
      return data;
    })
);

export const checkUserAuth = createAsyncThunk('user/checkUserAuth', getUserApi);

export const registerUser = createAsyncThunk(
  'user/registerData',
  async (registerData: TRegisterData) =>
    await registerUserApi(registerData).then((data: TAuthResponse) => {
      setCookie('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.accessToken);
      return data;
    })
);

export const forgotPassword = createAsyncThunk(
  'user/forgotPassword',
  async (data: { email: string }) =>
    await forgotPasswordApi(data).then((data) => data)
);

export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async (data: { password: string; token: string }) =>
    await resetPasswordApi(data).then((data) => data)
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (user: TRegisterData) => updateUserApi(user)
);

export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  async () =>
    await logoutApi().then((data) => {
      localStorage.removeItem('refreshToken');
      deleteCookie('accessToken');
      return data;
    })
);

export interface UserState {
  isAuthChecked: boolean;
  isAuthenticated: boolean; // Добавлено
  userData: TUser | null;
  errorMessage: string | undefined;
  error: string | undefined;
}

export const initialState: UserState = {
  isAuthChecked: false,
  isAuthenticated: false, // Добавлено
  userData: null,
  errorMessage: '',
  error: undefined
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    init: (state) => {},
    authCheck: (state) => {
      state.isAuthChecked = true;
    },
    checkUser: (state, action: { payload: TUser }) => {
      state.userData = action.payload;
    },
    clearUserData: (state) => {
      state.userData = null;
      state.isAuthenticated = false;
      state.isAuthChecked = true;
    }
  },
  extraReducers: (builder) => {
    builder
      // Проверка
      .addCase(checkUserAuth.rejected, (state) => {
        state.isAuthChecked = true;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.isAuthChecked = true;
        if (action.payload.success) {
          state.userData = action.payload.user;
          state.isAuthenticated = true;
        } else {
          state.userData = null;
          state.isAuthenticated = false;
        }
      })
      // Вход
      .addCase(loginUser.pending, (state) => {
        state.errorMessage = '';
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.errorMessage = action.error.message;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.userData = action.payload.user;
        state.errorMessage = '';
        state.isAuthenticated = true;
      })
      // Регистрация
      .addCase(registerUser.pending, (state) => {
        state.errorMessage = '';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.errorMessage = action.error.message;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.userData = action.payload.user;
        state.errorMessage = '';
        state.isAuthenticated = true;
      })
      // Выход
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.userData = null;
        state.isAuthenticated = false;
      })
      // Отправка почты для смены пароля (проверка на ошибку)
      .addCase(forgotPassword.rejected, (state, action) => {
        state.error = action.error.message;
      })
      // Смена пароля (проверка на ошибку)
      .addCase(resetPassword.rejected, (state, action) => {
        state.error = action.error.message;
      })
      // Изменение пользователем данных
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.userData = action.payload.user;
      });
  },
  selectors: {
    getUser: (state) => state.userData,
    getIsAuthChecked: (state) => state.isAuthChecked
  }
});

export const { init, authCheck, checkUser, clearUserData } = userSlice.actions;

export const { getUser, getIsAuthChecked } = userSlice.selectors;
