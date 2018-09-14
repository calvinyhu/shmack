import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../utilities/utilities';

const initialState = {
  yourPlaces: null,
  yourCuisineCategories: null,
  yourCuisines: null,
  getting: false,
  gettingCuisines: false,
  posting: false,
  error: null,
  cuisinesError: null
};

const getYourPlacesStart = (state, action) => {
  return updateObject(state, {
    getting: action.getting,
    error: action.error
  });
};

const getYourCuisinesStart = (state, action) => {
  return updateObject(state, {
    gettingCuisines: action.gettingCuisines,
    cuisinesError: action.cuisinesError
  });
};

const getYourPlacesSuccess = (state, action) => {
  return updateObject(state, {
    yourPlaces: action.yourPlaces,
    getting: action.getting
  });
};

const getYourCuisinesSuccess = (state, action) => {
  return updateObject(state, {
    yourCuisineCategories: action.yourCuisineCategories,
    yourCuisines: action.yourCuisines,
    gettingCuisines: action.gettingCuisines
  });
};

const getYourPlacesFail = (state, action) => {
  return updateObject(state, {
    getting: action.getting,
    error: action.error
  });
};

const getYourCuisinesFail = (state, action) => {
  return updateObject(state, {
    gettingCuisines: action.gettingCuisines,
    cuisinesError: action.cuisinesError
  });
};

const postYourPlacesStart = (state, action) => {
  return updateObject(state, {
    posting: action.posting,
    error: action.error
  });
};

const postYourPlacesSuccess = (state, action) => {
  return updateObject(state, {
    yourPlaces: action.yourPlaces,
    posting: action.posting
  });
};

const postYourPlacesFail = (state, action) => {
  return updateObject(state, {
    posting: action.posting,
    error: action.error
  });
};

const homeLogOut = (state, action) => {
  return updateObject(state, {
    yourPlaces: action.yourPlaces,
    yourCuisineCategories: action.yourCuisineCategories,
    yourCuisines: action.yourCuisines,
    getting: action.getting,
    gettingCuisines: action.gettingCuisines,
    posting: action.posting,
    error: action.error,
    cuisinesError: action.cuisinesError
  });
};

const homeReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.HOME_GET_YOUR_CUISINES_START:
      return getYourCuisinesStart(state, action);
    case actionTypes.HOME_GET_YOUR_PLACES_START:
      return getYourPlacesStart(state, action);
    case actionTypes.HOME_GET_YOUR_CUISINES_SUCCESS:
      return getYourCuisinesSuccess(state, action);
    case actionTypes.HOME_GET_YOUR_PLACES_SUCCESS:
      return getYourPlacesSuccess(state, action);
    case actionTypes.HOME_GET_YOUR_CUISINES_FAIL:
      return getYourCuisinesFail(state, action);
    case actionTypes.HOME_GET_YOUR_PLACES_FAIL:
      return getYourPlacesFail(state, action);
    case actionTypes.HOME_POST_YOUR_PLACES_START:
      return postYourPlacesStart(state, action);
    case actionTypes.HOME_POST_YOUR_PLACES_SUCCESS:
      return postYourPlacesSuccess(state, action);
    case actionTypes.HOME_POST_YOUR_PLACES_FAIL:
      return postYourPlacesFail(state, action);
    case actionTypes.HOME_LOGOUT:
      return homeLogOut(state, action);
    default:
      return state;
  }
};

export default homeReducer;
