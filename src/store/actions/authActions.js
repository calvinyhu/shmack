import * as actionTypes from 'store/actions/actionTypes';
import * as paths from 'utilities/paths';
import { auth, USER_FIELDS } from '../../utilities/firebase';
import { getUserInfo, postUserInfo } from './userActions';

export const authenticate = (info, signingUp) => dispatch => {
  dispatch(authStart());
  if (signingUp) {
    auth
      .createUserWithEmailAndPassword(info.email, info.password)
      .then(_ => {
        const userInfo = {};
        USER_FIELDS.forEach(field => {
          userInfo[field] = info[field] ? info[field] : '';
        });
        dispatch(postUserInfo(userInfo));
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
        dispatch(getUserInfo());
        dispatch(authSuccess());
      })
      .catch(error => {
        dispatch(authFail(error));
      });
  }
};

export const verifyEmail = () => dispatch => {
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

export const checkForVerificationCode = search => dispatch => {
  if (!search || !search.includes('mode=verifyEmail')) return;

  const params = search.split('&');
  for (const param of params) {
    if (param.includes('oobCode')) {
      const code = param.split('=');
      dispatch(applyVerificationCode(code[1]));
      break;
    }
  }
};

const applyVerificationCode = code => dispatch => {
  auth
    .applyActionCode(code)
    .then(_ => console.log('Applied verification code'))
    .catch(error => console.log(error));
};

export const authTryAutoLogIn = () => dispatch => {
  auth.onAuthStateChanged(user => {
    if (user) {
      dispatch(getUserInfo());
      dispatch(authSuccess());
    }
  });
};

export const authLogOut = () => dispatch => {
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

export const clearError = () => ({
  type: actionTypes.AUTH_CLEAR_ERROR,
  payload: {
    error: {}
  }
});

const authStart = () => ({
  type: actionTypes.AUTH_START,
  payload: {
    isLoading: true
  }
});

const authSuccess = () => ({
  type: actionTypes.AUTH_SUCCESS,
  payload: {
    isAuth: true,
    isLoading: false,
    redirectPath: paths.HOME
  }
});

const authFail = error => ({
  type: actionTypes.AUTH_FAIL,
  payload: {
    isLoading: false,
    error: error
  }
});

const authLogOutSuccess = () => ({
  type: actionTypes.AUTH_LOGOUT_SUCCESS,
  payload: {
    isAuth: false,
    isLoading: false,
    error: {},
    redirectPath: ''
  }
});

const authLogOutFail = error => ({
  type: actionTypes.AUTH_LOGOUT_FAIL,
  payload: {
    isLoading: false,
    error: error,
    redirectPath: ''
  }
});
