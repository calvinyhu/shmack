import * as actionTypes from 'store/actions/actionTypes';
import { RestaurantAction } from 'store/actions/restaurantActions.models';

export interface RestaurantsState {
  isRequestingLocation: boolean;
  isSearchLoading: boolean;
  isAtLoading: boolean;
  isNearByLoading: boolean;
  isSearchSuccess: boolean;
  food: string;
  location: string;
  searchRestaurants: [];
  atRestaurants: [];
  nearByRestaurants: [];
  error: {};
}

const restaurantState: RestaurantsState = {
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
  error: {},
};

const restaurantsReducer = (
  state = restaurantState,
  action: RestaurantAction,
): RestaurantsState => {
  switch (action.type) {
    case actionTypes.RESTAURANT_INPUT_CHANGE:
    case actionTypes.RESTAURANT_GOOGLE_SEARCH_START:
    case actionTypes.RESTAURANT_GOOGLE_SEARCH_SUCCESS:
    case actionTypes.RESTAURANT_GOOGLE_SEARCH_FAIL:
    case actionTypes.RESTAURANT_REQUESTING_LOCATION:
    case actionTypes.NEAR_BY_SEARCH_START:
    case actionTypes.NEAR_BY_SEARCH_SUCCESS:
    case actionTypes.NEAR_BY_SEARCH_FAIL:
    case actionTypes.AT_SEARCH_START:
    case actionTypes.AT_SEARCH_SUCCESS:
    case actionTypes.AT_SEARCH_FAIL:
    case actionTypes.RESTAURANT_CLEAR_ERROR:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default restaurantsReducer;
