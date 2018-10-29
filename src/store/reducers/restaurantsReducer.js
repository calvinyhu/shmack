import * as actionTypes from 'store/actions/actionTypes';

const initialState = {
  isRequestingLocation: false,
  isSearchLoading: false,
  isAtLoading: false,
  isNearByLoading: false,
  isSearchSuccess: false,
  food: '',
  location: '',
  searchRestaurants: [],
  atRestaurants: [],
  nearByRestaurants: [],
  error: {}
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
    case actionTypes.AT_SEARCH_START:
      return { ...state, ...action.payload };
    case actionTypes.AT_SEARCH_SUCCESS:
      return { ...state, ...action.payload };
    case actionTypes.AT_SEARCH_FAIL:
      return { ...state, ...action.payload };
    case actionTypes.RESTAURANT_CLEAR_ERROR:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default restaurantsReducer;
