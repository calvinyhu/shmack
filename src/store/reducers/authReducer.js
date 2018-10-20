import * as actionTypes from 'store/actions/actionTypes';
import { updateObject } from 'utilities/utilities';

const initialState = {
  isAuth: false,
  loading: false,
  error: null,
  redirectPath: ''
};

const authStart = (state, action) => {
  return updateObject(state, {
    loading: action.loading
  });
};

const authSuccess = (state, action) => {
  return updateObject(state, {
    isAuth: action.isAuth,
    loading: action.loading,
    redirectPath: action.redirectPath
  });
};

const authFail = (state, action) => {
  return updateObject(state, {
    loading: action.loading,
    error: action.error
  });
};

const authLogOutSuccess = (state, action) => {
  return updateObject(state, {
    isAuth: action.isAuth,
    loading: action.loading,
    error: action.error,
    redirectPath: action.redirectPath
  });
};

const authLogOutFail = (state, action) => {
  return updateObject(state, {
    loading: action.loading,
    error: action.error,
    redirectPath: action.redirectPath
  });
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_START:
      return authStart(state, action);
    case actionTypes.AUTH_SUCCESS:
      return authSuccess(state, action);
    case actionTypes.AUTH_FAIL:
      return authFail(state, action);
    case actionTypes.AUTH_LOGOUT_SUCCESS:
      return authLogOutSuccess(state, action);
    case actionTypes.AUTH_LOGOUT_FAIL:
      return authLogOutFail(state, action);
    default:
      return state;
  }
};

export default authReducer;
