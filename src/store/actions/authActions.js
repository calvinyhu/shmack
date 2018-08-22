import axios from 'axios'
import * as actionTypes from '../actions/actionTypes'
import { firebaseApiKey } from '../../secrets'

export const auth = (email, password, signup) => {
    return dispatch => {
        dispatch(authStart())

        const authMethod = (signup) ? 'signupNewUser' : 'verifyPassword'
        const authEndpoint = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/${authMethod}?key=${firebaseApiKey}`
        const authData = {
            email: email,
            password: password,
            returnSecureToken: true
        }

        axios.post(authEndpoint, authData)
            .then(response => {
                localStorage.setItem('token', response.data.idToken)
                const expirationDate = new Date(new Date().getTime() + (response.data.expiresIn * 1000))
                localStorage.setItem('expirationDate', expirationDate)
                localStorage.setItem('userId', response.data.localId)
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
        const token = localStorage.getItem('token')
        if (token) {
            const expirationDate = new Date(localStorage.getItem('expirationDate'))
            if (expirationDate <= new Date())
                dispatch(authLogOut())
            else {
                const userId = localStorage.getItem('userId')
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
    localStorage.removeItem('token')
    localStorage.removeItem('expirationDate')
    localStorage.removeItem('userId')
    return {
        type: actionTypes.AUTH_LOGOUT,
        token: '',
        userId: ''
    }
}
