import * as actionTypes from '../actions/actionTypes'
import { updateObject } from '../../utilities/utilities';

const initialState = {
    yourPlaces: null,
    yourPlacesDetails: null,
    getting: false,
    posting: false,
    error: null
}

const getYourPlacesStart = (state, action) => {
    return updateObject(state, {
        getting: action.getting,
        error: action.error
    })
}

const getYourPlacesSuccess = (state, action) => {
    return updateObject(state, {
        yourPlaces: action.yourPlaces,
        yourPlacesDetails: action.yourPlacesDetails,
        getting: action.getting
    })
}

const getYourPlacesFail = (state, action) => {
    return updateObject(state, {
        getting: action.getting,
        error: action.error
    })
}

const postYourPlacesStart = (state, action) => {
    return updateObject(state, {
        posting: action.posting,
        error: action.error
    })
}

const postYourPlacesSuccess = (state, action) => {
    return updateObject(state, {
        yourPlaces: action.yourPlaces,
        posting: action.posting
    })
}

const postYourPlacesFail = (state, action) => {
    return updateObject(state, {
        posting: action.posting,
        error: action.error
    })
}

const homeReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.HOME_GET_YOUR_PLACES_START: return getYourPlacesStart(state, action)
        case actionTypes.HOME_GET_YOUR_PLACES_SUCCESS: return getYourPlacesSuccess(state, action)
        case actionTypes.HOME_GET_YOUR_PLACES_FAIL: return getYourPlacesFail(state, action)
        case actionTypes.HOME_POST_YOUR_PLACES_START: return postYourPlacesStart(state, action)
        case actionTypes.HOME_POST_YOUR_PLACES_SUCCESS: return postYourPlacesSuccess(state, action)
        case actionTypes.HOME_POST_YOUR_PLACES_FAIL: return postYourPlacesFail(state, action)
        default: return state
    }
}

export default homeReducer
