import * as actionTypes from '../actions/actionTypes'
import * as paths from '../../utilities/paths'
import { auth } from '../../utilities/firebase'
import { postUserInfo } from './userActions';
import { FIELDS } from '../../utilities/database'

export const authenticate = (info, signingUp) => {
    return dispatch => {
        dispatch(authStart())
        if (signingUp) {
            auth.createUserWithEmailAndPassword(info.email, info.password)
                .then(_ => {
                    const userInfo = {}
                    Object.values(FIELDS).forEach(val => {
                        userInfo[val] = info[val] ? info[val] : ''
                    })
                    dispatch(postUserInfo(userInfo))
                    dispatch(authSuccess(signingUp))
                })
                .catch(error => {
                    dispatch(authFail(error))
                })
        } else {
            auth.signInWithEmailAndPassword(info.email, info.password)
                .then(_ => {
                    dispatch(authSuccess(signingUp))
                })
                .catch(error => {
                    dispatch(authFail(error))
                })
        }
    }
}

export const authTryAutoLogIn = () => {
    return dispatch => {
        auth.onAuthStateChanged(user => {
            if (user)
                dispatch(authSuccess(false))
        })
    }
}

export const authLogOut = () => {
    return dispatch => {
        auth.signOut()
            .then(_ => {
                dispatch(authLogOutSuccess())
            })
            .catch(error => {
                dispatch(authLogOutFail(error))
            })
    }
}

const authStart = () => {
    return {
        type: actionTypes.AUTH_START,
        loading: true
    }
}

const authSuccess = (signingUp) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        isAuth: true,
        loading: false,
        redirectPath: (signingUp) ? paths.USER : paths.HOME
    }
}

const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        loading: false,
        error: error
    }
}

const authLogOutSuccess = () => {
    return {
        type: actionTypes.AUTH_LOGOUT_SUCCESS,
        isAuth: false,
        loading: false,
        error: null,
        redirectPath: null
    }
}

const authLogOutFail = (error) => {
    return {
        type: actionTypes.AUTH_LOGOUT_FAIL,
        loading: false,
        error: error,
        redirectPath: null
    }
}
