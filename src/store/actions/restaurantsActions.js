import axios from 'axios'

import * as actionTypes from './actionTypes'
import { getYelpQuery, yelpConfig } from '../../utilities/yelp'

export const restaurantSearch = (food, location) => {
    return dispatch => {
        dispatch(restaurantSearchStart())

        axios.get(getYelpQuery(food, location), yelpConfig)
            .then(response => {
                dispatch(restaurantSearchSuccess(response.data.businesses))
            })
            .catch(error => {
                dispatch(restaurantSearchFail(error.response))
            })
    }
}

const restaurantSearchStart = () => {
    return {
        type: actionTypes.RESTAURANT_SEARCH_START,
        loading: true
    }
}

const restaurantSearchSuccess = (restaurants) => {
    return {
        type: actionTypes.RESTAURANT_SEARCH_SUCCESS,
        restaurants: restaurants,
        loading: false,
        error: null
    }
}

export const restaurantSearchFail = (error) => {
    return {
        type: actionTypes.RESTAURANT_SEARCH_FAIL,
        restaurants: null,
        loading: false,
        error: error
    }
}

export const restaurantFoodChange = (food) => {
    return {
        type: actionTypes.RESTAURANT_FOOD_CHANGE,
        food: food
    }
}

export const restaurantLocationChange = (location) => {
    return {
        type: actionTypes.RESTAURANT_LOCATION_CHANGE,
        location: location
    }
}
