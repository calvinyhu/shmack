import * as actionTypes from '../actions/actionTypes'
import { FIELDS } from '../../utilities/database'
import { updateObject } from "../../utilities/utilities";

const initialState = {
    userInfo: {
        [FIELDS.PROFILE_PICTURE]: '',
        [FIELDS.FIRST_NAME]: '',
        [FIELDS.LAST_NAME]: '',
        [FIELDS.EMAIL]: '',
        [FIELDS.LOCATION]: ''
    },
    posting: false,
    postSuccess: false,
    getting: false,
    error: null
}

const getUserInfoStart = (state, action) => {
    return updateObject(state, {
        getting: action.getting,
        error: action.error
    })
}

const getUserInfoSuccess = (state, action) => {
    return updateObject(state, {
        userInfo: action.userInfo,
        getting: action.getting
    })
}

const getUserInfoFail = (state, action) => {
    return updateObject(state, {
        getting: action.getting,
        error: action.error
    })
}

const postUserInfoStart = (state, action) => {
    return updateObject(state, {
        posting: action.posting,
        error: action.error
    })
}

const postUserInfoSuccess = (state, action) => {
    return updateObject(state, {
        posting: action.posting,
        postSuccess: action.postSuccess,
        error: action.error
    })
}

const postUserInfoFail = (state, action) => {
    return updateObject(state, {
        posting: action.posting,
        postSuccess: action.postSuccess,
        error: action.error
    })
}

const userLogOut = (state, action) => {
    return updateObject(state, {
        userInfo: action.userInfo,
        error: action.error
    })
}

const closeEditUser = (state, action) => {
    return updateObject(state, {
        postSuccess: action.postSuccess
    })
}

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.USER_GET_INFO_START: return getUserInfoStart(state, action)
        case actionTypes.USER_GET_INFO_SUCCESS: return getUserInfoSuccess(state, action)
        case actionTypes.USER_GET_INFO_FAIL: return getUserInfoFail(state, action)
        case actionTypes.USER_POST_INFO_START: return postUserInfoStart(state, action)
        case actionTypes.USER_POST_INFO_SUCCESS: return postUserInfoSuccess(state, action)
        case actionTypes.USER_POST_INFO_FAIL: return postUserInfoFail(state, action)
        case actionTypes.USER_LOGOUT: return userLogOut(state, action)
        case actionTypes.USER_CLOSE_EDIT: return closeEditUser(state, action)
        default: return state
    }
}

export default userReducer
