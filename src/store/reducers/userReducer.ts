import * as actionTypes from 'store/actions/actionTypes';
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
    case actionTypes.USER_GET_INFO_START:
    case actionTypes.USER_GET_INFO_SUCCESS:
    case actionTypes.USER_POST_INFO_START:
    case actionTypes.USER_POST_INFO_SUCCESS:
    case actionTypes.USER_POST_INFO_FAIL:
    case actionTypes.USER_GET_VOTES:
    case actionTypes.USER_POST_VOTES:
    case actionTypes.USER_GET_PLACES_START:
    case actionTypes.USER_GET_PLACES_SUCCESS:
    case actionTypes.USER_GET_PLACES_FAIL:
      return { ...state, ...action.payload } as UserState;
    default:
      return state;
  }
};

export default userReducer;
