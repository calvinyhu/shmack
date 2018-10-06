import axios from 'axios';

import * as actionTypes from './actionTypes';
import {
  createGoogleGeocodeLookupQuery,
  createGoogleNearbySearchQuery
} from '../../utilities/google';
import { toggleGeoLocPerm } from './appActions';

export const restaurantInputChange = (name, value) => {
  return {
    type: actionTypes.RESTAURANT_INPUT_CHANGE,
    name: name,
    value: value
  };
};

// TODO: Make @location be selected from dropdown menu
export const restaurantSearch = (food, location, radius) => {
  return dispatch => {
    dispatch(restaurantGoogleSearchStart());

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
              dispatch(toggleGeoLocPerm(false));
              dispatch(requestLocation(true));
              dispatch(restaurantGoogleSearchFail(-1));
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
      dispatch(restaurantGoogleSearchSuccess(response.data.results));
    })
    .catch(error => {
      dispatch(restaurantGoogleSearchFail(error.data));
    });
};

const restaurantGoogleSearchStart = () => {
  return {
    type: actionTypes.RESTAURANT_GOOGLE_SEARCH_START,
    isGoogleLoading: true,
    isSearchSuccess: false,
    googleRestaurants: null
  };
};

const restaurantGoogleSearchSuccess = restaurants => {
  return {
    type: actionTypes.RESTAURANT_GOOGLE_SEARCH_SUCCESS,
    isGoogleLoading: false,
    isSearchSuccess: true,
    googleRestaurants: restaurants,
    googleError: null
  };
};

const restaurantGoogleSearchFail = error => {
  return {
    type: actionTypes.RESTAURANT_GOOGLE_SEARCH_FAIL,
    isGoogleLoading: false,
    isSearchSuccess: false,
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
