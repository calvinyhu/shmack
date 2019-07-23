import {
  USER_GET_INFO_START,
  USER_GET_INFO_SUCCESS,
  USER_POST_INFO_START,
  USER_POST_INFO_SUCCESS,
  USER_POST_INFO_FAIL,
  USER_GET_PLACES_START,
  USER_GET_PLACES_SUCCESS,
  USER_GET_PLACES_FAIL,
  USER_GET_VOTES,
  USER_POST_VOTES,
} from './';

export interface UserGetInfoStartAction {
  type: typeof USER_GET_INFO_START;
  payload: {
    isGettingUserInfo: boolean;
    error: object;
  };
}

export interface UserGetInfoSuccessAction {
  type: typeof USER_GET_INFO_SUCCESS;
  payload: {
    isGettingUserInfo: boolean;
    firstName: string;
    lastName: string;
    error: object;
  };
}

export interface UserPostInfoStartAction {
  type: typeof USER_POST_INFO_START;
  payload: {
    isPostingUserInfo: boolean;
    error: object;
  };
}

export interface UserPostInfoSuccessAction {
  type: typeof USER_POST_INFO_SUCCESS;
  payload: {
    isPostingUserInfo: boolean;
    isPostSuccess: boolean;
    firstName: string;
    lastName: string;
    error: object;
  };
}

export interface UserPostInfoFailAction {
  type: typeof USER_POST_INFO_FAIL;
  payload: {
    isPostingUserInfo: boolean;
    isPostSuccess: boolean;
    error: object;
  };
}

export interface UserGetPlacesStartAction {
  type: typeof USER_GET_PLACES_START;
  payload: {
    isGettingPlaces: boolean;
    error: object;
  };
}

export interface UserGetPlacesSuccessAction {
  type: typeof USER_GET_PLACES_SUCCESS;
  payload: {
    isGettingPlaces: boolean;
    places: [];
  };
}

export interface UserGetPlacesFailAction {
  type: typeof USER_GET_PLACES_FAIL;
  payload: {
    isGettingPlaces: boolean;
    error: object;
  };
}

export interface UserGetVotesAction {
  type: typeof USER_GET_VOTES;
  payload: {
    votes: firebase.firestore.DocumentData | undefined;
  };
}

export interface UserPostVotesAction {
  type: typeof USER_POST_VOTES;
  payload: {
    votes: firebase.firestore.DocumentData | undefined;
  };
}

export type UserAction =
  | UserGetInfoStartAction
  | UserGetInfoSuccessAction
  | UserPostInfoStartAction
  | UserPostInfoSuccessAction
  | UserPostInfoFailAction
  | UserGetPlacesStartAction
  | UserGetPlacesSuccessAction
  | UserGetPlacesFailAction
  | UserGetVotesAction
  | UserPostVotesAction;
