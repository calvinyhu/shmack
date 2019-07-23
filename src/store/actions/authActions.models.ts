import {
  AUTH_CLEAR_ERROR,
  AUTH_START,
  AUTH_SUCCESS,
  AUTH_FAIL,
  AUTH_LOGOUT_SUCCESS,
  AUTH_LOGOUT_FAIL,
} from './';

export interface AuthClearErrorAction {
  type: typeof AUTH_CLEAR_ERROR;
  payload: {
    error: object;
  };
}

export interface AuthStartAction {
  type: typeof AUTH_START;
  payload: {
    isLoading: boolean;
  };
}

export interface AuthSuccessAction {
  type: typeof AUTH_SUCCESS;
  payload: {
    isAuth: boolean;
    isLoading: boolean;
    redirectPath: string;
  };
}

export interface AuthFailAction {
  type: typeof AUTH_FAIL;
  payload: {
    isLoading: boolean;
    error: object;
  };
}

export interface AuthLogoutSuccessAction {
  type: typeof AUTH_LOGOUT_SUCCESS;
  payload: {
    isAuth: boolean;
    isLoading: boolean;
    error: object;
    redirectPath: string;
  };
}

export interface AuthLogoutFailAction {
  type: typeof AUTH_LOGOUT_FAIL;
  payload: {
    isLoading: boolean;
    error: object;
    redirectPath: string;
  };
}

export type AuthAction =
  | AuthClearErrorAction
  | AuthStartAction
  | AuthSuccessAction
  | AuthFailAction
  | AuthLogoutSuccessAction
  | AuthLogoutFailAction;
