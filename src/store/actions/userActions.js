import * as actionTypes from '../actions/actionTypes'
import * as db from '../../utilities/database'
import { auth, usersRef } from '../../utilities/firebase'

export const getUserInfo = () => {
    return dispatch => {
        dispatch(getUserInfoStart())
        usersRef.doc(auth.currentUser.uid).get()
            .then(doc => {
                if (doc.exists)
                    dispatch(getUserInfoSuccess(doc.data()))
                else
                    dispatch(getUserInfoEmpty())
            })
            .catch(error => {
                dispatch(getUserInfoFail(error.response))
            })
    }
}

export const postUserInfo = (data) => {
    return dispatch => {
        dispatch(postUserInfoStart())
        usersRef.doc(auth.currentUser.uid).set(data)
        .then(_ => {
            dispatch(postUserInfoSuccess())
        }).catch(error => {
            dispatch(postUserInfoFail(error.response))
        });
    }
}

export const userLogOut = () => {
    return {
        type: actionTypes.USER_LOGOUT,
        userInfo: null,
        error: null
    }
}

const getUserInfoStart = () => {
    return {
        type: actionTypes.USER_GET_INFO_START,
        error: null
    }
}

const getUserInfoSuccess = (data) => {
    return {
        type: actionTypes.USER_GET_INFO_SUCCESS,
        userInfo: {
            [db.PROFILE_PICTURE]: data[db.PROFILE_PICTURE],
            [db.FIRST_NAME]: data[db.FIRST_NAME],
            [db.LAST_NAME]: data[db.LAST_NAME],
            [db.EMAIL]: data[db.EMAIL],
            [db.LOCATION]: data[db.LOCATION]
        }
    }
}

const getUserInfoEmpty = () => {
    return {
        type: actionTypes.USER_GET_INFO_SUCCESS,
        userInfo: {
            [db.PROFILE_PICTURE]: '',
            [db.FIRST_NAME]: '',
            [db.LAST_NAME]: '',
            [db.EMAIL]: '',
            [db.LOCATION]: ''
        }
    }
}

const getUserInfoFail = (error) => {
    return {
        type: actionTypes.USER_GET_INFO_FAIL,
        error: error
    }
}

const postUserInfoStart = () => {
    return {
        type: actionTypes.USER_POST_INFO_START,
        error: null
    }
}

const postUserInfoSuccess = () => {
    return {
        type: actionTypes.USER_POST_INFO_SUCCESS,
    }
}

const postUserInfoFail = (error) => {
    return {
        type: actionTypes.USER_POST_INFO_FAIL,
        error: error
    }
}
