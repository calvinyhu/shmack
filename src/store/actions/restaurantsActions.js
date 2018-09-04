import axios from 'axios'

import * as actionTypes from './actionTypes'
import {
    createYelpQuery,
    createGeoLocYelpQuery,
    yelpConfig
} from '../../utilities/yelp'
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

        if (location === '') {
            navigator.geolocation.getCurrentPosition(
                (response) => {
                    const position = {
                        lat: response.coords.latitude,
                        long: response.coords.longitude
                    }
                    getRestaurants(dispatch, food, position)
                },
                (error) => {

                }
            )
        } else
            getRestaurants(dispatch, food, location)
    }
}

const getRestaurants = (dispatch, food, location) => {
    axios.all([
        startAsyncYelpRequest(dispatch, food, location),
        startAsyncGoogleRequest(dispatch, food, location)
    ]).then(axios.spread((yelp, google) => {
        console.log('[ Restaurants Actions ] Yelp and Google requests ended')
    }))
    console.log('[ Restaurants Actions ] Yelp and Google requests started')
}

const startAsyncYelpRequest = (dispatch, food, location) => {
    let query = null
    if (location && location.lat)
        query = createGeoLocYelpQuery(food, location.lat, location.long)
    else
        query = createYelpQuery(food, location)

    return axios.get(query, yelpConfig)
        .then(response => {
            dispatch(restaurantYelpSearchSuccess(response.data.businesses))
        })
        .catch(error => {
            dispatch(restaurantYelpSearchFail(error.response))
        })
}

const startAsyncGoogleRequest = (dispatch, food, location) => {
    if (location && location.lat)
        return getGoogleRestaurants(dispatch, food, location.lat, location.long)
    else {
        return axios.get(createGoogleGeocodeLookupQuery(location))
            .then(response => {
                const lat = response.data.results[0].geometry.location.lat
                const long = response.data.results[0].geometry.location.lng
                return getGoogleRestaurants(dispatch, food, lat, long)
            })
            .catch(error => {
                dispatch(restaurantGoogleSearchFail(error.data))
            })
    }
}

const getGoogleRestaurants = (dispatch, food, lat, long) => {
    // TODO: Make @radius (1500) dynamic through user input
    const query = createGoogleNearbySearchQuery(
        food,
        `${lat},${long}`,
        5000,
        'restaurant'
    )
    return axios.get(query)
        .then(response => {
            dispatch(restaurantGoogleSearchSuccess(response.data.results))
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
