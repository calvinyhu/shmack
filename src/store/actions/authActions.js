import * as actionTypes from 'store/actions/actionTypes';
import * as paths from 'utilities/paths';
import { auth } from 'utilities/firebase';
import { postUserInfo } from './userActions';
import { FIELDS } from 'utilities/database';

export const authenticate = (info, signingUp) => dispatch => {
  dispatch(authStart());
  if (signingUp) {
    auth
      .createUserWithEmailAndPassword(info.email, info.password)
      .then(_ => {
        const userInfo = {};
        Object.values(FIELDS).forEach(val => {
          userInfo[val] = info[val] ? info[val] : '';
        });
        dispatch(postUserInfo(userInfo));
        dispatch(authSuccess(signingUp));
      })
      .catch(error => {
        dispatch(authFail(error));
      });
  } else {
    auth
      .signInWithEmailAndPassword(info.email, info.password)
      .then(_ => {
        dispatch(authSuccess(signingUp));
      })
      .catch(error => {
        dispatch(authFail(error));
      });
  }
};

export const authTryAutoLogIn = () => dispatch => {
  auth.onAuthStateChanged(user => {
    if (user) dispatch(authSuccess(false));
  });
};

export const authLogOut = () => dispatch => {
  auth
    .signOut()
    .then(_ => {
      dispatch(authLogOutSuccess());
    })
    .catch(error => {
      dispatch(authLogOutFail(error));
    });
};

const authStart = () => ({
  type: actionTypes.AUTH_START,
  loading: true
});

const authSuccess = signingUp => ({
  type: actionTypes.AUTH_SUCCESS,
  isAuth: true,
  loading: false,
  redirectPath: signingUp ? paths.MORE : paths.HOME
});

const authFail = error => ({
  type: actionTypes.AUTH_FAIL,
  loading: false,
  error: error
});

const authLogOutSuccess = () => ({
  type: actionTypes.AUTH_LOGOUT_SUCCESS,
  isAuth: false,
  loading: false,
  error: null,
  redirectPath: null
});

const authLogOutFail = error => ({
  type: actionTypes.AUTH_LOGOUT_FAIL,
  loading: false,
  error: error,
  redirectPath: null
});
