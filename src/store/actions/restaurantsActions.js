import * as actionTypes from './actionTypes'

export const foodChange = (payload) => {
    return {
        type: actionTypes.FOOD_CHANGE,
        food: payload.food,
    }
}

export const locationChange = (payload) => {
    return {
        type: actionTypes.LOCATION_CHANGE,
        location: payload.location,
    }
}

export const searchStart = (payload) => {
    return {
        type: actionTypes.SEARCH_START,
        loading: payload.loading,
    }
}

export const searchEnd = (payload) => {
    return {
        type: actionTypes.SEARCH_END,
        restaurants: payload.restaurants,
        loading: payload.loading,
        error: payload.error
    }
}
