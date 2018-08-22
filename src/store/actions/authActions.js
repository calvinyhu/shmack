import axios from 'axios'
import * as actionTypes from '../actions/actionTypes'
import { getFirebaseAuthQuery, createFirebaseAuthData } from '../../utilities/google'

const TOKEN = 'token'
const EXPIRATION_DATE = 'expirationDate'
const USER_ID = 'userId'

export const auth = (email, password, signup) => {
    return dispatch => {
        dispatch(authStart())

        axios.post(getFirebaseAuthQuery(signup), createFirebaseAuthData(email, password))
            .then(response => {
                localStorage.setItem(TOKEN, response.data.idToken)
                const expirationDate = new Date(new Date().getTime() + (response.data.expiresIn * 1000))
                localStorage.setItem(EXPIRATION_DATE, expirationDate)
                localStorage.setItem(USER_ID, response.data.localId)
                dispatch(authSuccess(response.data.idToken, response.data.localId))
                dispatch(authSetTimeOut(response.data.expiresIn))
            })
            .catch(error => {
                dispatch(authFail(error.response))
            })
    }
}

export const authTryAutoLogIn = () => {
    return dispatch => {
        const token = localStorage.getItem(TOKEN)
        if (token) {
            const expirationDate = new Date(localStorage.getItem(EXPIRATION_DATE))
            if (expirationDate <= new Date())
                dispatch(authLogOut())
            else {
                const userId = localStorage.getItem(USER_ID)
                dispatch(authSuccess(token, userId))
                dispatch(authSetTimeOut((expirationDate.getTime() - new Date().getTime()) / 1000))
            }
        }
    }
}

export const authSetTimeOut = (expirationTime) => {
    return dispatch => {
        setTimeout(
            () => { dispatch(authLogOut()) },
            expirationTime * 1000
        )
    }
}

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START,
        loading: true
    }
}

export const authSuccess = (token, userId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        token: token,
        userId: userId,
        loading: false
    }
}

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        loading: false,
        error: error
    }
}

export const authLogOut = () => {
    localStorage.removeItem(TOKEN)
    localStorage.removeItem(EXPIRATION_DATE)
    localStorage.removeItem(USER_ID)
    return {
        type: actionTypes.AUTH_LOGOUT,
        token: '',
        userId: ''
    }
}
