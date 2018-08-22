import * as actionTypes from '../actions/actionTypes'
import { updateObject } from '../../utilities/utilities'

const initialState = {
    food: '',
    location: '',
    restaurants: null,
    loading: false,
    error: null
}

const foodChange = (state, action) => {
    return updateObject(state, { food: action.food })
}

const locationChange = (state, action) => {
    return updateObject(state, { location: action.location })
}

const searchStart = (state, action) => {
    return updateObject(state, { loading: action.loading })
}

const searchEnd = (state, action) => {
    return updateObject(state, { 
        restaurants: action.restaurants,
        loading: action.loading,
        error: action.error
    })
}

const restaurantsReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.RESTAURANT_FOOD_CHANGE: return foodChange(state, action)
        case actionTypes.RESTAURANT_LOCATION_CHANGE: return locationChange(state, action)
        case actionTypes.RESTAURANT_SEARCH_START: return searchStart(state, action)
        case actionTypes.RESTAURANT_SEARCH_SUCCESS: return searchEnd(state, action)
        case actionTypes.RESTAURANT_SEARCH_FAIL: return searchEnd(state, action)
        default: return state
    }
}

export default restaurantsReducer
