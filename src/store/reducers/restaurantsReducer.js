import * as actionTypes from 'store/actions/actionTypes';

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

const restaurantsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.RESTAURANT_INPUT_CHANGE:
      return { ...state, ...action.payload };
    case actionTypes.RESTAURANT_GOOGLE_SEARCH_START:
      return { ...state, ...action.payload };
    case actionTypes.RESTAURANT_GOOGLE_SEARCH_SUCCESS:
      return { ...state, ...action.payload };
    case actionTypes.RESTAURANT_GOOGLE_SEARCH_FAIL:
      return { ...state, ...action.payload };
    case actionTypes.RESTAURANT_REQUESTING_LOCATION:
      return { ...state, ...action.payload };
    case actionTypes.NEAR_BY_SEARCH_START:
      return { ...state, ...action.payload };
    case actionTypes.NEAR_BY_SEARCH_SUCCESS:
      return { ...state, ...action.payload };
    case actionTypes.NEAR_BY_SEARCH_FAIL:
      return { ...state, ...action.payload };
    case actionTypes.TOGGLE_GRID:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default restaurantsReducer;
