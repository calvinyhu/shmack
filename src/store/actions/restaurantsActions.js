import axios from 'axios'

import * as actionTypes from './actionTypes'
import { createYelpQuery, yelpConfig } from '../../utilities/yelp'
import {
    createGoogleGeocodeLookupQuery,
    createGoogleNearbySearchQuery
} from '../../utilities/google'

export const restaurantInputChange = (name, value) => {
    return {
        type: actionTypes.RESTAURANT_INPUT_CHANGE,
        name: name,
        value: value,
    }
}

// TODO: Make @location be selected from dropdown menu
export const restaurantSearch = (food, location) => {
    return dispatch => {
        dispatch(restaurantYelpSearchStart())
        dispatch(restaurantGoogleSearchStart())

        axios.all([
            startAsyncYelpRequest(dispatch, food, location),
            startAsyncGoogleRequest(dispatch, food, location)
        ]).then(axios.spread((yelp, google) => {
            console.log('Yelp and Google requests ended')
        }))
        console.log('Yelp and Google requests started')
    }
}

const startAsyncYelpRequest = (dispatch, food, location) => {
    return axios.get(createYelpQuery(food, location), yelpConfig)
        .then(response => {
            dispatch(restaurantYelpSearchSuccess(response.data.businesses))
        })
        .catch(error => {
            dispatch(restaurantYelpSearchFail(error.response))
        })
}

const startAsyncGoogleRequest = (dispatch, food, location) => {
    return axios.get(createGoogleGeocodeLookupQuery(location))
        .then(response => {
            const lat = response.data.results[0].geometry.location.lat
            const lng = response.data.results[0].geometry.location.lng
            // TODO: Make @radius (1500) dynamic through user input
            return axios.get(createGoogleNearbySearchQuery(food, `${lat},${lng}`, 1500, 'restaurant'))
                .then(response => {
                    dispatch(restaurantGoogleSearchSuccess(response.data.results))
                })
                .catch(error => {
                    dispatch(restaurantGoogleSearchFail(error.data))
                })
        })
        .catch(error => {
            dispatch(restaurantGoogleSearchFail(error.data))
        })
}

const restaurantYelpSearchStart = () => {
    return {
        type: actionTypes.RESTAURANT_YELP_SEARCH_START,
        yelpRestaurants: null,
        yelpLoading: true
    }
}

const restaurantYelpSearchSuccess = (restaurants) => {
    return {
        type: actionTypes.RESTAURANT_YELP_SEARCH_SUCCESS,
        yelpRestaurants: restaurants,
        yelpLoading: false,
        yelpError: null
    }
}

const restaurantYelpSearchFail = (error) => {
    return {
        type: actionTypes.RESTAURANT_YELP_SEARCH_FAIL,
        yelpRestaurants: null,
        yelpLoading: false,
        yelpError: error
    }
}

const restaurantGoogleSearchStart = () => {
    return {
        type: actionTypes.RESTAURANT_GOOGLE_SEARCH_START,
        googleRestaurants: null,
        googleLoading: true
    }
}

const restaurantGoogleSearchSuccess = (restaurants) => {
    return {
        type: actionTypes.RESTAURANT_GOOGLE_SEARCH_SUCCESS,
        googleRestaurants: restaurants,
        googleLoading: false,
        googleError: null,
    }
}

const restaurantGoogleSearchFail = (error) => {
    return {
        type: actionTypes.RESTAURANT_GOOGLE_SEARCH_FAIL,
        googleRestaurants: null,
        googleLoading: false,
        googleError: error
    }
}
