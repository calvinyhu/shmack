import axios from 'axios'

import * as actionTypes from './actionTypes'
import { getYelpQuery, yelpConfig } from '../../utilities/yelp'
import {
    createGoogleGeocodeLookupQuery,
    createGoogleNearbySearchQuery
} from '../../utilities/google'

// TODO: Make @location be selected from dropdown menu
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

        axios.get(createGoogleGeocodeLookupQuery(location))
            .then(response => {
                const lat = response.data.results[0].geometry.location.lat
                const lng = response.data.results[0].geometry.location.lng
                console.log(lat, lng)
                // TODO: Make @radius (1500) dynamic through user input
                axios.get(createGoogleNearbySearchQuery(food, `${lat},${lng}`, 1500, 'restaurant'))
                    .then(response => {
                        console.log('Logging NearbySearch Response...', response)
                    })
                    .catch(error => {
                        console.log('Logging NearbySearch Error...', error)
                    })
            })
            .catch(error => {
                console.log('Logging Geocode Error...', error)
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
