import * as actionTypes from '../actions/actionTypes'
import { FIELDS } from '../../utilities/database'
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

export const postUserInfo = (info) => {
    return dispatch => {
        dispatch(postUserInfoStart())
        usersRef.doc(auth.currentUser.uid).set(info)
            .then(_ => {
                dispatch(postUserInfoSuccess(info))
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

export const closeEditUser = () => {
    return {
        type: actionTypes.USER_CLOSE_EDIT,
        postSuccess: false
    }
}

const getUserInfoStart = () => {
    return {
        type: actionTypes.USER_GET_INFO_START,
        getting: true,
        error: null
    }
}

const getUserInfoSuccess = (data) => {
    return {
        type: actionTypes.USER_GET_INFO_SUCCESS,
        userInfo: {
            [FIELDS.PROFILE_PICTURE]: data[FIELDS.PROFILE_PICTURE],
            [FIELDS.FIRST_NAME]: data[FIELDS.FIRST_NAME],
            [FIELDS.LAST_NAME]: data[FIELDS.LAST_NAME],
            [FIELDS.EMAIL]: auth.currentUser.email,
            [FIELDS.LOCATION]: data[FIELDS.LOCATION]
        },
        getting: false
    }
}

const getUserInfoEmpty = () => {
    return {
        type: actionTypes.USER_GET_INFO_SUCCESS,
        userInfo: {
            [FIELDS.PROFILE_PICTURE]: '',
            [FIELDS.FIRST_NAME]: '',
            [FIELDS.LAST_NAME]: '',
            [FIELDS.EMAIL]: auth.currentUser.email,
            [FIELDS.LOCATION]: ''
        },
        getting: false
    }
}

const getUserInfoFail = (error) => {
    return {
        type: actionTypes.USER_GET_INFO_FAIL,
        getting: false,
        error: error
    }
}

const postUserInfoStart = () => {
    return {
        type: actionTypes.USER_POST_INFO_START,
        posting: true,
        error: null
    }
}

const postUserInfoSuccess = (userInfo) => {
    return {
        type: actionTypes.USER_POST_INFO_SUCCESS,
        userInfo: userInfo,
        posting: false,
        postSuccess: true,
        error: null
    }
}

const postUserInfoFail = (error) => {
    return {
        type: actionTypes.USER_POST_INFO_FAIL,
        posting: false,
        postSuccess: false,
        error: error
    }
}
