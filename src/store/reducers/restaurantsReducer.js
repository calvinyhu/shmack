import * as actionTypes from '../actions/actionTypes'
import { updateObject } from '../../utilities/utilities'

const initialState = {
    food: '',
    location: '',
    yelpRestaurants: null,
    yelpLoading: false,
    yelpError: null,
    googleRestaurants: null,
    googleLoading: false,
    googleError: null
}

const inputChange = (state, action) => {
    return updateObject(state, { [action.name]: action.value })
}

const yelpSearchStart = (state, action) => {
    return updateObject(state, {
        yelpRestaurants: action.yelpRestaurants,
        yelpLoading: action.yelpLoading
    })
}

const yelpSearchEnd = (state, action) => {
    return updateObject(state, {
        yelpRestaurants: action.yelpRestaurants,
        yelpLoading: action.yelpLoading,
        yelpError: action.yelpError
    })
}

const googleSearchStart = (state, action) => {
    return updateObject(state, {
        googleRestaurants: action.googleRestaurants,
        googleLoading: action.googleLoading
    })
}

const googleSearchEnd = (state, action) => {
    return updateObject(state, {
        googleRestaurants: action.googleRestaurants,
        googleLoading: action.googleLoading,
        googleError: action.googleError
    })
}

const restaurantsReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.RESTAURANT_INPUT_CHANGE: return inputChange(state, action)
        case actionTypes.RESTAURANT_YELP_SEARCH_START: return yelpSearchStart(state, action)
        case actionTypes.RESTAURANT_YELP_SEARCH_SUCCESS: return yelpSearchEnd(state, action)
        case actionTypes.RESTAURANT_YELP_SEARCH_FAIL: return yelpSearchEnd(state, action)
        case actionTypes.RESTAURANT_GOOGLE_SEARCH_START: return googleSearchStart(state, action)
        case actionTypes.RESTAURANT_GOOGLE_SEARCH_SUCCESS: return googleSearchEnd(state, action)
        case actionTypes.RESTAURANT_GOOGLE_SEARCH_FAIL: return googleSearchEnd(state, action)
        default: return state
    }
}

export default restaurantsReducer
