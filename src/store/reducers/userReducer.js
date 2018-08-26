import * as actionTypes from '../actions/actionTypes'
import { updateObject } from "../../utilities/utilities";

const initialState = {
    profilePicture: '',
    name: '',
    location: ''
}

const getInfoStart = (state, action) => {
    return updateObject(state, {

    })
}

const getInfoSuccess = (state, action) => {
    return updateObject(state, {

    })
}

const getInfoFail = (state, action) => {
    return updateObject(state, {

    })
}

const postInfoStart = (state, action) => {
    return updateObject(state, {

    })
}

const postInfoSuccess = (state, action) => {
    return updateObject(state, {

    })
}

const postInfoFail = (state, action) => {
    return updateObject(state, {

    })
}


const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.USER_GET_INFO_START: return getInfoStart()
        case actionTypes.USER_GET_INFO_SUCCESS: return getInfoSuccess()
        case actionTypes.USER_GET_INFO_FAIL: return getInfoFail()
        case actionTypes.USER_POST_INFO_START: return postInfoStart()
        case actionTypes.USER_POST_INFO_SUCCESS: return postInfoSuccess()
        case actionTypes.USER_POST_INFO_FAIL: return postInfoFail()
        default: return state
    }
}

export default userReducer
