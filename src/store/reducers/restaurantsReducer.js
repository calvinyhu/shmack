import * as actionTypes from '../actions/actionTypes'
import { updateObject } from '../../utilities/utilities'

const initialState = {
    food: '',
    location: '',
    restaurants: null,
    loading: false,
    error: false
}

const restaurantsReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FOOD_CHANGE: return updateObject(state, { food: action.food })
        case actionTypes.LOCATION_CHANGE: return updateObject(state, { location: action.location })
        case actionTypes.SEARCH_START: return updateObject(state, { loading: action.loading })
        case actionTypes.SEARCH_END: return updateObject(state, { restaurants: action.restaurants, loading: action.loading, error: action.error } )
        default: return state
    }
}

export default restaurantsReducer
