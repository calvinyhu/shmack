import * as actionTypes from './actionTypes';
import { auth, usersColRef } from 'utilities/firebase';

export const postUserInfo = info => dispatch => {
  dispatch(postUserInfoStart());
  usersColRef
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
  posting: true,
  error: null
});

const postUserInfoSuccess = userInfo => ({
  type: actionTypes.USER_POST_INFO_SUCCESS,
  posting: false,
  postSuccess: true,
  error: null
});

const postUserInfoFail = error => ({
  type: actionTypes.USER_POST_INFO_FAIL,
  posting: false,
  postSuccess: false,
  error: error
});
