import axios from 'axios';

import {
  RESTAURANT_INPUT_CHANGE,
  RESTAURANT_CLEAR_ERROR,
  RESTAURANT_GOOGLE_SEARCH_START,
  RESTAURANT_GOOGLE_SEARCH_SUCCESS,
  RESTAURANT_GOOGLE_SEARCH_FAIL,
  RESTAURANT_REQUESTING_LOCATION,
  NEAR_BY_SEARCH_START,
  NEAR_BY_SEARCH_SUCCESS,
  NEAR_BY_SEARCH_FAIL,
  AT_SEARCH_START,
  AT_SEARCH_SUCCESS,
  AT_SEARCH_FAIL,
} from './';
import {
  RestaurantInputChangeAction,
  RestaurantClearErrorAction,
  RestaurantGoogleSearchStartAction,
  RestaurantGoogleSearchSuccessAction,
  RestaurantGoogleSearchFailAction,
  RestaurantRequestingLocationAction,
  RestaurantNearbySearchStartAction,
  RestaurantNearbySearchSuccessAction,
  RestaurantNearbySearchFailAction,
  RestaurantAtSearchStartAction,
  RestaurantAtSearchSuccessAction,
  RestaurantAtSearchFailAction,
} from './restaurantActions.models';
import { toggleGeoLocPerm } from './appActions';
import {
  AT_RADIUS,
  createGoogleGeocodeLookupQuery,
  createGoogleNearbySearchQuery,
  NEAR_BY_RADIUS,
} from 'utilities/google';
import { Dispatch } from 'redux';

export const restaurantSearch = (
  food: string,
  location: object,
  radius: number,
) => (dispatch: Dispatch) => {
  if (location) startAsyncGoogleRequest(dispatch, food, location, radius);
  else {
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then(permission => {
        if (permission.state === 'granted') {
          navigator.geolocation.getCurrentPosition(
            response => {
              const position = {
                lat: response.coords.latitude,
                long: response.coords.longitude,
              };
              startAsyncGoogleRequest(dispatch, food, position, radius);
            },
            error => console.log(error),
          );
        } else {
          if (radius === NEAR_BY_RADIUS || radius === AT_RADIUS) {
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

const startAsyncGoogleRequest = (
  dispatch: Dispatch,
  food: string,
  location: object,
  radius: number,
) => {
  // @ts-ignore
  if (location && location.lat)
    // @ts-ignore
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

const getGoogleRestaurants = (
  dispatch: Dispatch,
  food: string,
  lat: string,
  long: string,
  radius: number,
) => {
  if (radius === NEAR_BY_RADIUS) dispatch(nearBySearchStart());
  else if (radius === AT_RADIUS) dispatch(atSearchStart());
  else dispatch(restaurantGoogleSearchStart());

  const query = createGoogleNearbySearchQuery(
    food,
    `${lat},${long}`,
    radius,
    'restaurant',
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

export const restaurantInputChange = (
  name: string,
  value: string,
): RestaurantInputChangeAction => ({
  type: RESTAURANT_INPUT_CHANGE,
  payload: {
    [name]: value,
  },
});

export const clearRestaurantsError = (): RestaurantClearErrorAction => ({
  type: RESTAURANT_CLEAR_ERROR,
  payload: {
    error: {},
  },
});

const restaurantGoogleSearchStart = (): RestaurantGoogleSearchStartAction => ({
  type: RESTAURANT_GOOGLE_SEARCH_START,
  payload: {
    isSearchLoading: true,
    isSearchSuccess: false,
    isShowGrid: false,
    searchRestaurants: [],
    error: {},
  },
});

const restaurantGoogleSearchSuccess = (
  restaurants: [],
): RestaurantGoogleSearchSuccessAction => ({
  type: RESTAURANT_GOOGLE_SEARCH_SUCCESS,
  payload: {
    isSearchLoading: false,
    isSearchSuccess: true,
    isShowGrid: true,
    searchRestaurants: restaurants,
    error: {},
  },
});

const restaurantGoogleSearchFail = (
  error: object,
): RestaurantGoogleSearchFailAction => ({
  type: RESTAURANT_GOOGLE_SEARCH_FAIL,
  payload: {
    isSearchLoading: false,
    isSearchSuccess: false,
    isShowGrid: false,
    searchRestaurants: [],
    error,
  },
});

export const requestLocation = (
  isRequestingLocation: boolean,
): RestaurantRequestingLocationAction => ({
  type: RESTAURANT_REQUESTING_LOCATION,
  payload: {
    isSearchLoading: false,
    isRequestingLocation,
  },
});

const nearBySearchStart = (): RestaurantNearbySearchStartAction => ({
  type: NEAR_BY_SEARCH_START,
  payload: {
    isNearByLoading: true,
    error: {},
  },
});

const nearBySearchSuccess = (
  nearByRestaurants: [],
): RestaurantNearbySearchSuccessAction => ({
  type: NEAR_BY_SEARCH_SUCCESS,
  payload: {
    isNearByLoading: false,
    nearByRestaurants,
  },
});

const nearBySearchFail = (error: object): RestaurantNearbySearchFailAction => ({
  type: NEAR_BY_SEARCH_FAIL,
  payload: {
    isNearByLoading: false,
    error,
  },
});

const atSearchStart = (): RestaurantAtSearchStartAction => ({
  type: AT_SEARCH_START,
  payload: {
    isAtLoading: true,
    error: {},
  },
});

const atSearchSuccess = (
  atRestaurants: [],
): RestaurantAtSearchSuccessAction => ({
  type: AT_SEARCH_SUCCESS,
  payload: {
    isAtLoading: false,
    atRestaurants,
  },
});

const atSearchFail = (error: object): RestaurantAtSearchFailAction => ({
  type: AT_SEARCH_FAIL,
  payload: {
    isAtLoading: false,
    error,
  },
});
