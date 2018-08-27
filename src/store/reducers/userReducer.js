import * as actionTypes from '../actions/actionTypes'
import * as db from '../../utilities/database'
import { updateObject } from "../../utilities/utilities";

const initialState = {
    userInfo: {
        [db.PROFILE_PICTURE]: '',
        [db.FIRST_NAME]: '',
        [db.LAST_NAME]: '',
        [db.EMAIL]: '',
        [db.LOCATION]: ''
    },
    error: null
}

const getUserInfoStart = (state, action) => {
    return updateObject(state, {
        error: action.error
    })
}

const getUserInfoSuccess = (state, action) => {
    return updateObject(state, {
        userInfo: action.userInfo
    })
}

const getUserInfoFail = (state, action) => {
    return updateObject(state, {
        error: action.error
    })
}

const postUserInfoStart = (state, action) => {
    return updateObject(state, {
        error: action.error
    })
}

const postUserInfoSuccess = (state, action) => {
    return updateObject(state, {
        
    })
}

const postUserInfoFail = (state, action) => {
    return updateObject(state, {
        error: action.error
    })
}

const userLogOut = (state, action) => {
    return updateObject(state, {
        userInfo: action.userInfo,
        error: action.error
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
        default: return state
    }
}

export default userReducer
