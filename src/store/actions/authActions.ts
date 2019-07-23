import * as actionTypes from 'store/actions/actionTypes';
import * as paths from 'utilities/paths';
import { auth, USER_FIELDS } from '../../utilities/firebase';
import { getUserInfo, postUserInfo } from './userActions';
import {
  AuthClearErrorAction,
  AuthStartAction,
  AuthSuccessAction,
  AuthFailAction,
  AuthLogoutSuccessAction,
  AuthLogoutFailAction,
} from './authActions.models';
import { Dispatch } from 'redux';

// @ts-ignore
export const authenticate = (info, signingUp: boolean) => (
  dispatch: Dispatch,
) => {
  dispatch(authStart());
  if (signingUp) {
    auth
      .createUserWithEmailAndPassword(info.email, info.password)
      .then(_ => {
        const userInfo = {};
        USER_FIELDS.forEach(field => {
          // @ts-ignore
          userInfo[field] = info[field] ? info[field] : '';
        });
        // @ts-ignore
        dispatch(postUserInfo(userInfo));
        // @ts-ignore
        dispatch(verifyEmail());
        dispatch(authSuccess());
      })
      .catch(error => {
        dispatch(authFail(error));
      });
  } else {
    auth
      .signInWithEmailAndPassword(info.email, info.password)
      .then(_ => {
        // @ts-ignore
        dispatch(getUserInfo());
        dispatch(authSuccess());
      })
      .catch(error => {
        dispatch(authFail(error));
      });
  }
};

export const verifyEmail = () => (_: Dispatch) => {
  if (!auth.currentUser || auth.currentUser.emailVerified) return;

  auth.currentUser
    .sendEmailVerification()
    .then(() => {
      console.log('Email verification sent');
    })
    .catch(_ => {
      console.log('Email verification error');
    });
};

export const checkForVerificationCode = (search: string) => (
  dispatch: Dispatch,
) => {
  if (!search || !search.includes('mode=verifyEmail')) return;

  const params = search.split('&');
  for (const param of params) {
    if (param.includes('oobCode')) {
      const code = param.split('=');
      // @ts-ignore
      dispatch(applyVerificationCode(code[1]));
      break;
    }
  }
};

const applyVerificationCode = (code: string) => (dispatch: Dispatch) => {
  auth
    .applyActionCode(code)
    .then(_ => console.log('Applied verification code'))
    .catch(error => console.log(error));
};

export const authTryAutoLogIn = () => (dispatch: Dispatch) => {
  auth.onAuthStateChanged(user => {
    if (user) {
      // @ts-ignore
      dispatch(getUserInfo());
      dispatch(authSuccess());
    }
  });
};

export const authLogOut = () => (dispatch: Dispatch) => {
  auth
    .signOut()
    .then(_ => {
      dispatch(authLogOutSuccess());
    })
    .catch(_ => {
      const message = 'Failed to log out user';
      dispatch(authLogOutFail({ message }));
    });
};

export const clearError = (): AuthClearErrorAction => ({
  type: actionTypes.AUTH_CLEAR_ERROR,
  payload: {
    error: {},
  },
});

const authStart = (): AuthStartAction => ({
  type: actionTypes.AUTH_START,
  payload: {
    isLoading: true,
  },
});

const authSuccess = (): AuthSuccessAction => ({
  type: actionTypes.AUTH_SUCCESS,
  payload: {
    isAuth: true,
    isLoading: false,
    redirectPath: paths.HOME,
  },
});

const authFail = (error: object): AuthFailAction => ({
  type: actionTypes.AUTH_FAIL,
  payload: {
    isLoading: false,
    error,
  },
});

const authLogOutSuccess = (): AuthLogoutSuccessAction => ({
  type: actionTypes.AUTH_LOGOUT_SUCCESS,
  payload: {
    isAuth: false,
    isLoading: false,
    error: {},
    redirectPath: '',
  },
});

const authLogOutFail = (error: object): AuthLogoutFailAction => ({
  type: actionTypes.AUTH_LOGOUT_FAIL,
  payload: {
    isLoading: false,
    error,
    redirectPath: '',
  },
});
