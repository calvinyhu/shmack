import * as actionTypes from './actionTypes';
import { auth, users } from 'utilities/firebase';

export const postUserInfo = info => dispatch => {
  dispatch(postUserInfoStart());
  users
    .doc(auth.currentUser.uid)
    .set(info)
    .then(_ => {
      dispatch(postUserInfoSuccess(info));
    })
    .catch(error => {
      dispatch(postUserInfoFail(error.response));
    });
};

const postUserInfoStart = () => ({
  type: actionTypes.USER_POST_INFO_START,
  payload: {
    posting: true,
    error: null
  }
});

const postUserInfoSuccess = userInfo => ({
  type: actionTypes.USER_POST_INFO_SUCCESS,
  payload: {
    posting: false,
    postSuccess: true,
    error: null
  }
});

const postUserInfoFail = error => ({
  type: actionTypes.USER_POST_INFO_FAIL,
  payload: {
    posting: false,
    postSuccess: false,
    error: error
  }
});
