import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../utilities/utilities';

const initialState = {
  food: '',
  location: '',
  isGoogleLoading: null,
  googleRestaurants: null,
  googleError: null,
  isRequestingLocation: false,
  isShowGrid: false,
  isNearByLoading: false,
  nearByRestaurants: null,
  nearByError: null
};

const inputChange = (state, action) => {
  return updateObject(state, { [action.name]: action.value });
};

const googleSearchStart = (state, action) => {
  return updateObject(state, {
    isSearchSuccess: action.isSearchSuccess,
    isGoogleLoading: action.isGoogleLoading,
    isShowGrid: action.isShowGrid,
    googleRestaurants: action.googleRestaurants
  });
};

const googleSearchEnd = (state, action) => {
  return updateObject(state, {
    isSearchSuccess: action.isSearchSuccess,
    isGoogleLoading: action.isGoogleLoading,
    isShowGrid: action.isShowGrid,
    googleRestaurants: action.googleRestaurants,
    googleError: action.googleError
  });
};

const requestLocation = (state, action) => {
  return updateObject(state, {
    isGoogleLoading: action.isGoogleLoading,
    isRequestingLocation: action.isRequestingLocation
  });
};

const nearBySearchStart = (state, action) => {
  return updateObject(state, {
    isNearByLoading: action.isNearByLoading,
    nearByError: action.nearByError
  });
};

const nearBySearchSuccess = (state, action) => {
  return updateObject(state, {
    isNearByLoading: action.isNearByLoading,
    nearByRestaurants: action.nearByRestaurants
  });
};

const nearBySearchFail = (state, action) => {
  return updateObject(state, {
    isNearByLoading: action.isNearByLoading,
    nearByError: action.nearByError
  });
};

const toggleGrid = (state, action) => {
  return updateObject(state, {
    isShowGrid: action.isShowGrid
  });
};

const restaurantsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.RESTAURANT_INPUT_CHANGE:
      return inputChange(state, action);
    case actionTypes.RESTAURANT_GOOGLE_SEARCH_START:
      return googleSearchStart(state, action);
    case actionTypes.RESTAURANT_GOOGLE_SEARCH_SUCCESS:
      return googleSearchEnd(state, action);
    case actionTypes.RESTAURANT_GOOGLE_SEARCH_FAIL:
      return googleSearchEnd(state, action);
    case actionTypes.RESTAURANT_REQUESTING_LOCATION:
      return requestLocation(state, action);
    case actionTypes.NEAR_BY_SEARCH_START:
      return nearBySearchStart(state, action);
    case actionTypes.NEAR_BY_SEARCH_SUCCESS:
      return nearBySearchSuccess(state, action);
    case actionTypes.NEAR_BY_SEARCH_FAIL:
      return nearBySearchFail(state, action);
    case actionTypes.TOGGLE_GRID:
      return toggleGrid(state, action);
    default:
      return state;
  }
};

export default restaurantsReducer;
