import axios from 'axios';

import * as actionTypes from './actionTypes';
// import {
//   createYelpSearchQuery,
//   createGeoLocYelpSearchQuery,
//   yelpConfig
// } from '../../utilities/yelp';
import {
  createGoogleGeocodeLookupQuery,
  createGoogleNearbySearchQuery
} from '../../utilities/google';

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
    // dispatch(restaurantYelpSearchStart());
    dispatch(restaurantGoogleSearchStart());

    if (location) {
      console.log('[ Restaurants Actions ] Using typed location');
      getRestaurants(dispatch, food, location, radius);
    } else {
      console.log('[ Restaurants Actions ] Using current location');
      navigator.geolocation.getCurrentPosition(
        response => {
          const position = {
            lat: response.coords.latitude,
            long: response.coords.longitude
          };
          getRestaurants(dispatch, food, position, radius);
        },
        error => console.log(error)
      );
    }
  };
};

const getRestaurants = (dispatch, food, location, radius) => {
  axios
    .all([
      // startAsyncYelpRequest(dispatch, food, location),
      startAsyncGoogleRequest(dispatch, food, location, radius)
    ])
    .then(
      axios.spread(_ => {
        console.log('[ Restaurants Actions ] Yelp and Google requests ended');
      })
    );
  console.log('[ Restaurants Actions ] Yelp and Google requests started');
};

// const startAsyncYelpRequest = (dispatch, food, location) => {
//   let query = null;
//   if (location && location.lat)
//     query = createGeoLocYelpSearchQuery(food, location.lat, location.long);
//   else query = createYelpSearchQuery(food, location);

//   return axios
//     .get(query, yelpConfig)
//     .then(response => {
//       dispatch(restaurantYelpSearchSuccess(response.data.businesses));
//     })
//     .catch(error => {
//       dispatch(restaurantYelpSearchFail(error.response));
//     });
// };

const startAsyncGoogleRequest = (dispatch, food, location, radius) => {
  if (location && location.lat)
    return getGoogleRestaurants(
      dispatch,
      food,
      location.lat,
      location.long,
      radius
    );
  else {
    return axios
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
  // TODO: Make @radius (1500) dynamic through user input
  const query = createGoogleNearbySearchQuery(
    food,
    `${lat},${long}`,
    radius,
    'restaurant'
  );
  return axios
    .get(query)
    .then(response => {
      dispatch(restaurantGoogleSearchSuccess(response.data.results));
    })
    .catch(error => {
      dispatch(restaurantGoogleSearchFail(error.data));
    });
};

// const restaurantYelpSearchStart = () => {
//   return {
//     type: actionTypes.RESTAURANT_YELP_SEARCH_START,
//     isYelpLoading: true,
//     yelpRestaurants: null
//   };
// };

// const restaurantYelpSearchSuccess = restaurants => {
//   return {
//     type: actionTypes.RESTAURANT_YELP_SEARCH_SUCCESS,
//     isYelpLoading: false,
//     yelpRestaurants: restaurants,
//     yelpError: null
//   };
// };

// const restaurantYelpSearchFail = error => {
//   return {
//     type: actionTypes.RESTAURANT_YELP_SEARCH_FAIL,
//     isYelpLoading: false,
//     yelpRestaurants: null,
//     yelpError: error
//   };
// };

const restaurantGoogleSearchStart = () => {
  return {
    type: actionTypes.RESTAURANT_GOOGLE_SEARCH_START,
    isGoogleLoading: true,
    googleRestaurants: null
  };
};

const restaurantGoogleSearchSuccess = restaurants => {
  return {
    type: actionTypes.RESTAURANT_GOOGLE_SEARCH_SUCCESS,
    isGoogleLoading: false,
    googleRestaurants: restaurants,
    googleError: null
  };
};

const restaurantGoogleSearchFail = error => {
  return {
    type: actionTypes.RESTAURANT_GOOGLE_SEARCH_FAIL,
    isGoogleLoading: false,
    googleRestaurants: null,
    googleError: error
  };
};
