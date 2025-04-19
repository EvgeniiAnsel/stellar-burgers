import {
  userSlice,
  loginUser,
  checkUserAuth,
  registerUser,
  forgotPassword,
  resetPassword,
  updateUser,
  logoutUser,
  initialState
} from '../src/services/slices/user/userSlice';
import { TUser } from '../src/utils/types';

import {
  TAuthResponse,
  TLoginData,
  TRegisterData
} from '../src/utils/burger-api';

const { reducer } = userSlice;

// Мок API
jest.mock('../src/utils/burger-api', () => ({
  loginUserApi: jest.fn(),
  getUserApi: jest.fn(),
  logoutApi: jest.fn(),
  registerUserApi: jest.fn(),
  forgotPasswordApi: jest.fn(),
  resetPasswordApi: jest.fn(),
  updateUserApi: jest.fn()
}));

const mockLoginUserApi = require('../src/utils/burger-api')
  .loginUserApi as jest.Mock;
const mockGetUserApi = require('../src/utils/burger-api')
  .getUserApi as jest.Mock;
const mockLogoutApi = require('../src/utils/burger-api').logoutApi as jest.Mock;
const mockRegisterUserApi = require('../src/utils/burger-api')
  .registerUserApi as jest.Mock;
const mockForgotPasswordApi = require('../src/utils/burger-api')
  .forgotPasswordApi as jest.Mock;
const mockResetPasswordApi = require('../src/utils/burger-api')
  .resetPasswordApi as jest.Mock;
const mockUpdateUserApi = require('../src/utils/burger-api')
  .updateUserApi as jest.Mock;

describe('Тестирование userReducer', () => {
  it('получить исходное состояние', () => {
    const state = reducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });

  describe('Синхронные экшены', () => {
    it('проверка обновления данных пользователя', () => {
      const user: TUser = { name: 'Tester', email: 'test@yandex.ru' };
      const action = userSlice.actions.checkUser(user);
      const state = reducer(initialState, action);
      expect(state.userData).toEqual(user);
    });

    it('проверка сброса данных пользователя', () => {
      const stateWithUser = {
        ...initialState,
        userData: { name: 'Tester', email: 'test@yandex.ru' },
        isAuthenticated: true,
        isAuthChecked: false
      };
      const state = reducer(stateWithUser, userSlice.actions.clearUserData());
      expect(state.userData).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isAuthChecked).toBe(true);
    });

    it('проверка завершения аутентификации', () => {
      const state = reducer(initialState, userSlice.actions.authCheck());
      expect(state.isAuthChecked).toBe(true);
    });
  });

  describe('Асинхронные экшены', () => {
    describe('loginUser', () => {
      it('отработка loginUser.pending', () => {
        const state = reducer(
          initialState,
          loginUser.pending('testRequestId', { email: '', password: '' })
        );
        expect(state.errorMessage).toBe('');
      });

      it('отработка loginUser.fulfilled', () => {
        const user: TUser = { name: 'Tester', email: 'test@yandex.ru' };
        const mockResponse: TAuthResponse = {
          success: true,
          accessToken: 'testAccessToken',
          refreshToken: 'testRefreshToken',
          user: user
        };

        mockLoginUserApi.mockResolvedValue(mockResponse);

        const state = reducer(
          initialState,
          loginUser.fulfilled(mockResponse, 'testRequestId', {
            email: '',
            password: ''
          })
        );

        expect(state.userData).toEqual(user);
        expect(state.errorMessage).toBe('');
        expect(state.isAuthenticated).toBe(true);
      });

      it('отработка loginUser.rejected', () => {
        const mockError = { message: 'Login failed' };
        const state = reducer(
          initialState,
          loginUser.rejected(new Error('Login failed'), 'testRequestId', {
            email: '',
            password: ''
          })
        );

        expect(state.errorMessage).toBe('Login failed');
        expect(state.isAuthenticated).toBe(false);
      });
    });

    describe('checkUserAuth', () => {
      it('отработка checkUserAuth.pending', () => {
        const state = reducer(
          initialState,
          checkUserAuth.pending('testRequestId')
        );

        expect(state.isAuthChecked).toBe(false);
      });

      it('отработка checkUserAuth.fulfilled (аутентифицирован)', () => {
        const user: TUser = { name: 'Tester', email: 'test@yandex.ru' };
        const mockResponse: TAuthResponse = {
          success: true,
          accessToken: 'testAccessToken',
          refreshToken: 'testRefreshToken',
          user: user
        };

        mockGetUserApi.mockResolvedValue(mockResponse);

        const state = reducer(
          initialState,
          checkUserAuth.fulfilled(mockResponse, 'testRequestId')
        );

        expect(state.isAuthChecked).toBe(true);
        expect(state.userData).toEqual(user);
        expect(state.isAuthenticated).toBe(true);
      });

      it('отработка checkUserAuth.fulfilled (неаутентифицирован)', () => {
        const mockResponse: TAuthResponse = {
          success: false,
          accessToken: '',
          refreshToken: '',
          user: { name: '', email: '' }
        };

        mockGetUserApi.mockResolvedValue(mockResponse);

        const state = reducer(
          initialState,
          checkUserAuth.fulfilled(mockResponse, 'testRequestId')
        );

        expect(state.isAuthChecked).toBe(true);
        expect(state.userData).toBeNull();
        expect(state.isAuthenticated).toBe(false);
      });

      it('отработка checkUserAuth.rejected', () => {
        const mockError = { message: 'Error' };
        const state = reducer(
          initialState,
          checkUserAuth.rejected(new Error('Error'), 'testRequestId')
        );

        expect(state.isAuthChecked).toBe(true);
        expect(state.userData).toBeNull();
        expect(state.isAuthenticated).toBe(false);
      });
    });

    describe('registerUser', () => {
      it('отработка registerUser.fulfilled', () => {
        const user: TUser = { name: 'Tester', email: 'test@yandex.ru' };
        const mockResponse: TAuthResponse = {
          success: true,
          accessToken: 'testAccessToken',
          refreshToken: 'testRefreshToken',
          user: user
        };

        mockRegisterUserApi.mockResolvedValue(mockResponse);

        const state = reducer(
          initialState,
          registerUser.fulfilled(mockResponse, 'testRequestId', {
            email: '',
            name: '',
            password: ''
          })
        );

        expect(state.userData).toEqual(user);
        expect(state.errorMessage).toBe('');
        expect(state.isAuthenticated).toBe(true);
      });

      it('отработка registerUser.rejected', () => {
        const mockError = { message: 'Registration failed' };
        const state = reducer(
          initialState,
          registerUser.rejected(
            new Error('Registration failed'),
            'testRequestId',
            { email: '', name: '', password: '' }
          )
        );

        expect(state.errorMessage).toBe('Registration failed');
        expect(state.isAuthenticated).toBe(false);
      });
    });

    describe('forgotPassword', () => {
      it('отработка forgotPassword.fulfilled', () => {
        const mockResponse = { success: true };
        mockForgotPasswordApi.mockResolvedValue(mockResponse);

        const state = reducer(
          initialState,
          forgotPassword.fulfilled(mockResponse, 'testRequestId', {
            email: 'test@yandex.ru'
          })
        );

        expect(state.error).toBeUndefined();
      });

      it('отработка forgotPassword.rejected', () => {
        const mockError = { message: 'Forgot password failed' };
        const state = reducer(
          initialState,
          forgotPassword.rejected(
            new Error('Forgot password failed'),
            'testRequestId',
            { email: 'test@yandex.ru' }
          )
        );

        expect(state.error).toBe('Forgot password failed');
      });
    });

    describe('resetPassword', () => {
      it('отработка resetPassword.fulfilled', () => {
        const mockResponse = { success: true };
        mockResetPasswordApi.mockResolvedValue(mockResponse);

        const state = reducer(
          initialState,
          resetPassword.fulfilled(mockResponse, 'testRequestId', {
            password: 'newPassword',
            token: 'testToken'
          })
        );

        expect(state.error).toBeUndefined();
      });

      it('отработка resetPassword.rejected', () => {
        const mockError = { message: 'Reset password failed' };
        const state = reducer(
          initialState,
          resetPassword.rejected(
            new Error('Reset password failed'),
            'testRequestId',
            { password: 'newPassword', token: 'testToken' }
          )
        );

        expect(state.error).toBe('Reset password failed');
      });
    });

    describe('updateUser', () => {
      it('отработка updateUser.fulfilled', () => {
        const updatedUser: TUser = {
          name: 'Updated',
          email: 'updated@yandex.ru'
        };
        const mockResponse: TAuthResponse = {
          success: true,
          accessToken: 'testAccessToken',
          refreshToken: 'testRefreshToken',
          user: updatedUser
        };

        mockUpdateUserApi.mockResolvedValue(mockResponse);

        const state = reducer(
          initialState,
          updateUser.fulfilled(mockResponse, 'testRequestId', {
            email: 'updated@yandex.ru',
            name: 'Updated',
            password: '123456'
          })
        );

        expect(state.userData).toEqual(updatedUser);
        expect(state.error).toBeUndefined();
      });

      it('отработка updateUser.rejected', () => {
        const mockError = { message: 'Update user failed' };
        const state = reducer(
          initialState,
          updateUser.rejected(
            new Error('Update user failed'),
            'testRequestId',
            { email: 'updated@yandex.ru', name: 'Updated', password: '123456' }
          )
        );

        expect(state.error).toBe('Update user failed');
      });
    });

    describe('logoutUser', () => {
      it('отработка logoutUser.fulfilled', () => {
        const mockResponse = { success: true };
        mockLogoutApi.mockResolvedValue(mockResponse);

        const stateWithUser = {
          ...initialState,
          userData: { name: 'Tester', email: 'test@yandex.ru' },
          isAuthenticated: true
        };

        const state = reducer(
          stateWithUser,
          logoutUser.fulfilled(mockResponse, 'testRequestId')
        );

        expect(state.userData).toBeNull();
        expect(state.isAuthenticated).toBe(false);
        expect(state.error).toBeUndefined();
      });

      it('отработка logoutUser.rejected', () => {
        const mockError = { message: 'Logout failed' };
        const stateWithUser = {
          ...initialState,
          userData: { name: 'Tester', email: 'test@yandex.ru' },
          isAuthenticated: true
        };

        const state = reducer(
          stateWithUser,
          logoutUser.rejected(new Error('Logout failed'), 'testRequestId')
        );

        expect(state.userData).toEqual(stateWithUser.userData);
        expect(state.isAuthenticated).toBe(stateWithUser.isAuthenticated);
        expect(state.error).toBe('Logout failed');
      });
    });
  });

  describe('Selectors', () => {
    it('getUser возвращает данные пользователя', () => {
      const user: TUser = { name: 'Tester', email: 'test@yandex.ru' };
      const state = {
        user: {
          ...initialState,
          userData: user
        }
      };

      expect(userSlice.selectors.getUser(state)).toEqual(user);
    });

    it('getIsAuthChecked возвращает статус аутентификации', () => {
      const state = {
        user: {
          ...initialState,
          isAuthChecked: true
        }
      };

      expect(userSlice.selectors.getIsAuthChecked(state)).toBe(true);
    });
  });
});
