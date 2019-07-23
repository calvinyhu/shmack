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

export interface RestaurantInputChangeAction {
  type: typeof RESTAURANT_INPUT_CHANGE;
  payload: {
    [name: string]: string;
  };
}
export interface RestaurantClearErrorAction {
  type: typeof RESTAURANT_CLEAR_ERROR;
  payload: {
    error: object;
  };
}
export interface RestaurantGoogleSearchStartAction {
  type: typeof RESTAURANT_GOOGLE_SEARCH_START;
  payload: {
    isSearchLoading: boolean;
    isSearchSuccess: boolean;
    isShowGrid: boolean;
    searchRestaurants: [];
    error: object;
  };
}
export interface RestaurantGoogleSearchSuccessAction {
  type: typeof RESTAURANT_GOOGLE_SEARCH_SUCCESS;
  payload: {
    isSearchLoading: boolean;
    isSearchSuccess: boolean;
    isShowGrid: boolean;
    searchRestaurants: [];
    error: object;
  };
}
export interface RestaurantGoogleSearchFailAction {
  type: typeof RESTAURANT_GOOGLE_SEARCH_FAIL;
  payload: {
    isSearchLoading: boolean;
    isSearchSuccess: boolean;
    isShowGrid: boolean;
    searchRestaurants: [];
    error: object;
  };
}
export interface RestaurantRequestingLocationAction {
  type: typeof RESTAURANT_REQUESTING_LOCATION;
  payload: {
    isSearchLoading: boolean;
    isRequestingLocation: boolean;
  };
}
export interface RestaurantNearbySearchStartAction {
  type: typeof NEAR_BY_SEARCH_START;
  payload: {
    isNearByLoading: boolean;
    error: object;
  };
}
export interface RestaurantNearbySearchSuccessAction {
  type: typeof NEAR_BY_SEARCH_SUCCESS;
  payload: {
    isNearByLoading: boolean;
    nearByRestaurants: [];
  };
}
export interface RestaurantNearbySearchFailAction {
  type: typeof NEAR_BY_SEARCH_FAIL;
  payload: {
    isNearByLoading: boolean;
    error: object;
  };
}
export interface RestaurantAtSearchStartAction {
  type: typeof AT_SEARCH_START;
  payload: {
    isAtLoading: boolean;
    error: object;
  };
}
export interface RestaurantAtSearchSuccessAction {
  type: typeof AT_SEARCH_SUCCESS;
  payload: {
    isAtLoading: boolean;
    atRestaurants: [];
  };
}
export interface RestaurantAtSearchFailAction {
  type: typeof AT_SEARCH_FAIL;
  payload: {
    isAtLoading: boolean;
    error: object;
  };
}

export type RestaurantAction =
  | RestaurantInputChangeAction
  | RestaurantClearErrorAction
  | RestaurantGoogleSearchStartAction
  | RestaurantGoogleSearchSuccessAction
  | RestaurantGoogleSearchFailAction
  | RestaurantRequestingLocationAction
  | RestaurantNearbySearchStartAction
  | RestaurantNearbySearchSuccessAction
  | RestaurantNearbySearchFailAction
  | RestaurantAtSearchStartAction
  | RestaurantAtSearchSuccessAction
  | RestaurantAtSearchFailAction;
