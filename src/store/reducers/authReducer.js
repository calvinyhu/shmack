import * as actionTypes from 'store/actions/actionTypes';

const initialState = {
  isAuth: false,
  isLoading: false,
  error: null,
  redirectPath: ''
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_START:
      return { ...state, ...action.payload };
    case actionTypes.AUTH_SUCCESS:
      return { ...state, ...action.payload };
    case actionTypes.AUTH_FAIL:
      return { ...state, ...action.payload };
    case actionTypes.AUTH_LOGOUT_SUCCESS:
      return { ...state, ...action.payload };
    case actionTypes.AUTH_LOGOUT_FAIL:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default authReducer;
