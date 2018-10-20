import axios from 'axios';

import * as actionTypes from './actionTypes';
import { toggleGeoLocPerm } from './appActions';
import {
  createGoogleGeocodeLookupQuery,
  createGoogleNearbySearchQuery,
  NEAR_BY_RADIUS
} from 'utilities/google';

export const restaurantInputChange = (name, value) => {
  return {
    type: actionTypes.RESTAURANT_INPUT_CHANGE,
    name: name,
    value: value
  };
};

export const restaurantSearch = (food, location, radius) => {
  return dispatch => {
    if (radius === NEAR_BY_RADIUS) dispatch(nearBySearchStart());
    else dispatch(restaurantGoogleSearchStart());

    if (location) startAsyncGoogleRequest(dispatch, food, location, radius);
    else {
      if (navigator.permissions) {
        navigator.permissions
          .query({ name: 'geolocation' })
          .then(permission => {
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
                dispatch(
                  nearBySearchFail(
                    'Grant location to Shmack to see nearby restaurants.'
                  )
                );
              } else {
                dispatch(toggleGeoLocPerm(false));
                dispatch(requestLocation(true));
                dispatch(restaurantGoogleSearchFail(-1));
              }
            }
          });
      } else console.log('Browser does not support Permissions API');
    }
  };
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
        dispatch(restaurantGoogleSearchFail(error.data));
      });
  }
};

const getGoogleRestaurants = (dispatch, food, lat, long, radius) => {
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
      else dispatch(restaurantGoogleSearchSuccess(response.data.results));
    })
    .catch(error => {
      if (radius === NEAR_BY_RADIUS) dispatch(nearBySearchFail(error.data));
      else dispatch(restaurantGoogleSearchFail(error.data));
    });
};

const restaurantGoogleSearchStart = () => {
  return {
    type: actionTypes.RESTAURANT_GOOGLE_SEARCH_START,
    isGoogleLoading: true,
    isSearchSuccess: false,
    isShowGrid: false,
    googleRestaurants: null
  };
};

const restaurantGoogleSearchSuccess = restaurants => {
  return {
    type: actionTypes.RESTAURANT_GOOGLE_SEARCH_SUCCESS,
    isGoogleLoading: false,
    isSearchSuccess: true,
    isShowGrid: true,
    googleRestaurants: restaurants,
    googleError: null
  };
};

const restaurantGoogleSearchFail = error => {
  return {
    type: actionTypes.RESTAURANT_GOOGLE_SEARCH_FAIL,
    isGoogleLoading: false,
    isSearchSuccess: false,
    isShowGrid: true,
    googleRestaurants: null,
    googleError: error
  };
};

export const requestLocation = value => {
  return {
    type: actionTypes.RESTAURANT_REQUESTING_LOCATION,
    isGoogleLoading: false,
    isRequestingLocation: value
  };
};

const nearBySearchStart = () => {
  return {
    type: actionTypes.NEAR_BY_SEARCH_START,
    isNearByLoading: true,
    nearByError: null
  };
};

const nearBySearchSuccess = nearByRestaurants => {
  return {
    type: actionTypes.NEAR_BY_SEARCH_SUCCESS,
    isNearByLoading: false,
    nearByRestaurants: nearByRestaurants
  };
};

const nearBySearchFail = nearByError => {
  return {
    type: actionTypes.NEAR_BY_SEARCH_FAIL,
    isNearByLoading: false,
    nearByError: nearByError
  };
};

export const toggleGrid = isShowGrid => {
  return {
    type: actionTypes.TOGGLE_GRID,
    isShowGrid: !isShowGrid
  };
};
