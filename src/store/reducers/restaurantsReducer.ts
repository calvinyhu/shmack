import {
  RESTAURANT_INPUT_CHANGE,
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
  RESTAURANT_CLEAR_ERROR,
} from 'store/actions';
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
    case RESTAURANT_INPUT_CHANGE:
    case RESTAURANT_GOOGLE_SEARCH_START:
    case RESTAURANT_GOOGLE_SEARCH_SUCCESS:
    case RESTAURANT_GOOGLE_SEARCH_FAIL:
    case RESTAURANT_REQUESTING_LOCATION:
    case NEAR_BY_SEARCH_START:
    case NEAR_BY_SEARCH_SUCCESS:
    case NEAR_BY_SEARCH_FAIL:
    case AT_SEARCH_START:
    case AT_SEARCH_SUCCESS:
    case AT_SEARCH_FAIL:
    case RESTAURANT_CLEAR_ERROR:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default restaurantsReducer;
