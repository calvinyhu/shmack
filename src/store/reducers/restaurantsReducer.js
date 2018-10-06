import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../utilities/utilities';

const initialState = {
  food: '',
  location: '',
  isGoogleLoading: null,
  googleRestaurants: null,
  googleError: null,
  isRequestingLocation: false
};

const inputChange = (state, action) => {
  return updateObject(state, { [action.name]: action.value });
};

const googleSearchStart = (state, action) => {
  return updateObject(state, {
    isGoogleLoading: action.isGoogleLoading,
    googleRestaurants: action.googleRestaurants
  });
};

const googleSearchEnd = (state, action) => {
  return updateObject(state, {
    isGoogleLoading: action.isGoogleLoading,
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
    default:
      return state;
  }
};

export default restaurantsReducer;
