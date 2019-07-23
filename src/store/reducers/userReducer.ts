import {
  USER_GET_INFO_START,
  USER_GET_INFO_SUCCESS,
  USER_POST_INFO_START,
  USER_POST_INFO_SUCCESS,
  USER_POST_INFO_FAIL,
  USER_GET_VOTES,
  USER_POST_VOTES,
  USER_GET_PLACES_START,
  USER_GET_PLACES_SUCCESS,
  USER_GET_PLACES_FAIL,
} from 'store/actions';
import { UserAction } from 'store/actions/userActions.models';

export interface UserState {
  isGettingUserInfo: boolean;
  isPostingUserInfo: boolean;
  isPostSuccess: boolean;
  isGettingPlaces: boolean;
  firstName: string;
  lastName: string;
  places: [];
  votes: {};
  error: {};
}

const userState: UserState = {
  isGettingUserInfo: false,
  isPostingUserInfo: false,
  isPostSuccess: false,
  isGettingPlaces: false,
  firstName: '',
  lastName: '',
  places: [],
  votes: {},
  error: {},
};

const userReducer = (state = userState, action: UserAction): UserState => {
  switch (action.type) {
    case USER_GET_INFO_START:
    case USER_GET_INFO_SUCCESS:
    case USER_POST_INFO_START:
    case USER_POST_INFO_SUCCESS:
    case USER_POST_INFO_FAIL:
    case USER_GET_VOTES:
    case USER_POST_VOTES:
    case USER_GET_PLACES_START:
    case USER_GET_PLACES_SUCCESS:
    case USER_GET_PLACES_FAIL:
      return { ...state, ...action.payload } as UserState;
    default:
      return state;
  }
};

export default userReducer;
