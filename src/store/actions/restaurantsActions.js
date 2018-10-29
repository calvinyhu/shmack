import axios from 'axios';

import * as actionTypes from './actionTypes';
import { toggleGeoLocPerm } from './appActions';
import {
  AT_RADIUS,
  createGoogleGeocodeLookupQuery,
  createGoogleNearbySearchQuery,
  NEAR_BY_RADIUS
} from 'utilities/google';

export const restaurantSearch = (food, location, radius) => dispatch => {
  if (location) startAsyncGoogleRequest(dispatch, food, location, radius);
  else {
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then(permission => {
        if (permission.state === 'granted') {
          navigator.geolocation.getCurrentPosition(
            response => {
              const position = {
                lat: response.coords.latitude,
                long: response.coords.longitude
              };
              startAsyncGoogleRequest(dispatch, food, position, radius);
            },
            error => console.log(error)
          );
        } else {
          if (radius === NEAR_BY_RADIUS) {
            const code = 'locationOff';
            const message = 'Location is off.';
            dispatch(nearBySearchFail({ code, message }));
          } else {
            dispatch(toggleGeoLocPerm(false));
            dispatch(requestLocation(true));
          }
        }
      });
    } else console.log('Browser does not support Permissions API');
  }
};

const startAsyncGoogleRequest = (dispatch, food, location, radius) => {
  if (location && location.lat)
    getGoogleRestaurants(dispatch, food, location.lat, location.long, radius);
  else {
    axios
      .get(createGoogleGeocodeLookupQuery(location))
      .then(response => {
        const lat = response.data.results[0].geometry.location.lat;
        const long = response.data.results[0].geometry.location.lng;
        return getGoogleRestaurants(dispatch, food, lat, long, radius);
      })
      .catch(error => {
        const message =
          "We can't get your location right now. Try again later.";
        dispatch(restaurantGoogleSearchFail({ message }));
      });
  }
};

const getGoogleRestaurants = (dispatch, food, lat, long, radius) => {
  if (radius === NEAR_BY_RADIUS) dispatch(nearBySearchStart());
  else if (radius === AT_RADIUS) dispatch(atSearchStart());
  else dispatch(restaurantGoogleSearchStart());

  const query = createGoogleNearbySearchQuery(
    food,
    `${lat},${long}`,
    radius,
    'restaurant'
  );
  axios
    .get(query)
    .then(response => {
      if (radius === NEAR_BY_RADIUS)
        dispatch(nearBySearchSuccess(response.data.results));
      else if (radius === AT_RADIUS)
        dispatch(atSearchSuccess(response.data.results));
      else dispatch(restaurantGoogleSearchSuccess(response.data.results));
    })
    .catch(error => {
      const message =
        "We can't reach Google services right now. Try again later.";
      if (radius === NEAR_BY_RADIUS) dispatch(nearBySearchFail({ message }));
      else if (radius === AT_RADIUS) dispatch(atSearchFail({ message }));
      else dispatch(restaurantGoogleSearchFail({ message }));
    });
};

export const restaurantInputChange = (name, value) => ({
  type: actionTypes.RESTAURANT_INPUT_CHANGE,
  payload: {
    [name]: value
  }
});

export const clearError = () => ({
  type: actionTypes.RESTAURANT_CLEAR_ERROR,
  payload: {
    error: {}
  }
});

const restaurantGoogleSearchStart = () => ({
  type: actionTypes.RESTAURANT_GOOGLE_SEARCH_START,
  payload: {
    isGoogleLoading: true,
    isSearchSuccess: false,
    isShowGrid: false,
    googleRestaurants: [],
    error: {}
  }
});

const restaurantGoogleSearchSuccess = restaurants => ({
  type: actionTypes.RESTAURANT_GOOGLE_SEARCH_SUCCESS,
  payload: {
    isGoogleLoading: false,
    isSearchSuccess: true,
    isShowGrid: true,
    googleRestaurants: restaurants,
    error: {}
  }
});

const restaurantGoogleSearchFail = error => ({
  type: actionTypes.RESTAURANT_GOOGLE_SEARCH_FAIL,
  payload: {
    isGoogleLoading: false,
    isSearchSuccess: false,
    isShowGrid: false,
    googleRestaurants: [],
    error
  }
});

export const requestLocation = value => ({
  type: actionTypes.RESTAURANT_REQUESTING_LOCATION,
  payload: {
    isGoogleLoading: false,
    isRequestingLocation: value
  }
});

const nearBySearchStart = () => ({
  type: actionTypes.NEAR_BY_SEARCH_START,
  payload: {
    isNearByLoading: true,
    error: {}
  }
});

const nearBySearchSuccess = nearByRestaurants => ({
  type: actionTypes.NEAR_BY_SEARCH_SUCCESS,
  payload: {
    isNearByLoading: false,
    nearByRestaurants: nearByRestaurants
  }
});

const nearBySearchFail = error => ({
  type: actionTypes.NEAR_BY_SEARCH_FAIL,
  payload: {
    isNearByLoading: false,
    error
  }
});

const atSearchStart = () => ({
  type: actionTypes.AT_SEARCH_START,
  payload: {
    isAtLoading: true,
    error: {}
  }
});

const atSearchSuccess = atRestaurants => ({
  type: actionTypes.AT_SEARCH_SUCCESS,
  payload: {
    isAtLoading: false,
    atRestaurants: atRestaurants
  }
});

const atSearchFail = error => ({
  type: actionTypes.AT_SEARCH_FAIL,
  payload: {
    isAtLoading: false,
    error
  }
});
