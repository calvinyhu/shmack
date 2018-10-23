import * as actionTypes from 'store/actions/actionTypes';

const initialState = {
  posting: false,
  postSuccess: false,
  votes: null,
  error: null
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.USER_POST_INFO_START:
      return { ...state, ...action.payload };
    case actionTypes.USER_POST_INFO_SUCCESS:
      return { ...state, ...action.payload };
    case actionTypes.USER_POST_INFO_FAIL:
      return { ...state, ...action.payload };
    case actionTypes.USER_GET_VOTES:
      return { ...state, ...action.payload };
    case actionTypes.USER_POST_VOTES:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default userReducer;
