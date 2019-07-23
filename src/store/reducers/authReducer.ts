import { AuthAction } from 'store/actions/authActions.models';
import {
  AUTH_START,
  AUTH_SUCCESS,
  AUTH_FAIL,
  AUTH_LOGOUT_SUCCESS,
  AUTH_LOGOUT_FAIL,
  AUTH_CLEAR_ERROR,
} from 'store/actions';

export interface AuthState {
  isAuth: boolean;
  isLoading: boolean;
  error: object;
  redirectPath: string;
}

const authState: AuthState = {
  isAuth: false,
  isLoading: false,
  error: {},
  redirectPath: '',
};

const authReducer = (state = authState, action: AuthAction): AuthState => {
  switch (action.type) {
    case AUTH_START:
    case AUTH_SUCCESS:
    case AUTH_FAIL:
    case AUTH_LOGOUT_SUCCESS:
    case AUTH_LOGOUT_FAIL:
    case AUTH_CLEAR_ERROR:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default authReducer;
