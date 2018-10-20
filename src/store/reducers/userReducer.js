import * as actionTypes from 'store/actions/actionTypes';
import { updateObject } from 'utilities/utilities';

const initialState = {
  posting: false,
  postSuccess: false,
  error: null
};

const postUserInfoStart = (state, action) => {
  return updateObject(state, {
    posting: action.posting,
    error: action.error
  });
};

const postUserInfoSuccess = (state, action) => {
  return updateObject(state, {
    posting: action.posting,
    postSuccess: action.postSuccess,
    error: action.error
  });
};

const postUserInfoFail = (state, action) => {
  return updateObject(state, {
    posting: action.posting,
    postSuccess: action.postSuccess,
    error: action.error
  });
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.USER_POST_INFO_START:
      return postUserInfoStart(state, action);
    case actionTypes.USER_POST_INFO_SUCCESS:
      return postUserInfoSuccess(state, action);
    case actionTypes.USER_POST_INFO_FAIL:
      return postUserInfoFail(state, action);
    default:
      return state;
  }
};

export default userReducer;
