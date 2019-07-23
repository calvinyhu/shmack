import {
  GET_ITEMS_START,
  GET_ITEMS_SUCCESS,
  GET_ITEMS_FAIL,
  POST_ITEM_SUCCESS,
  POST_ITEM_FAIL,
  POST_VOTE_SUCCESS,
  RESPAGE_CLEAR_ERROR,
} from 'store/actions';
import { ResPageAction } from 'store/actions/resPageActions.models';

export interface ResPageState {
  isGettingItems: boolean;
  items: object;
  error: object;
}

const resPageState: ResPageState = {
  isGettingItems: false,
  items: {},
  error: {},
};

const resPageReducer = (
  state = resPageState,
  action: ResPageAction,
): ResPageState => {
  switch (action.type) {
    case GET_ITEMS_START:
    case GET_ITEMS_SUCCESS:
    case GET_ITEMS_FAIL:
    case POST_ITEM_SUCCESS: {
      // @ts-ignore
      const items = { ...state.items, ...action.payload.item };
      // @ts-ignore
      const newState = { ...state, items, error: action.payload.error };
      return newState;
    }
    case POST_ITEM_FAIL:
    case POST_VOTE_SUCCESS: {
      // @ts-ignore
      const items = { ...state.items, ...action.payload.item };
      const newState = { ...state, items, error: action.payload.error };
      return newState;
    }
    // case POST_VOTE_FAIL:
    case RESPAGE_CLEAR_ERROR:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default resPageReducer;
