import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../utilities/utilities';

const initialState = {
  items: null,
  isGettingItems: false,
  resPageError: null
};

const getItemsStart = (state, action) => {
  return updateObject(state, {
    items: action.items,
    isGettingItems: action.isGettingItems
  });
};

const getItemsSuccess = (state, action) => {
  return updateObject(state, {
    items: action.items,
    isGettingItems: action.isGettingItems
  });
};

const getItemsFail = (state, action) => {
  return updateObject(state, {
    isGettingItems: action.isGettingItems,
    resPageError: action.resPageError
  });
};

const postItemSuccess = (state, action) => {
  const items = updateObject(state.items, {
    [action.itemName]: { likes: 0, dislikes: 0 }
  });
  return updateObject(state, {
    items: items
  });
};

const postVoteSuccess = (state, action) => {
  const items = updateObject(state.items, {
    [action.itemName]: { likes: action.likes, dislikes: action.dislikes }
  });
  return updateObject(state, {
    items: items
  });
};

const resPageReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_ITEMS_START:
      return getItemsStart(state, action);
    case actionTypes.GET_ITEMS_SUCCESS:
      return getItemsSuccess(state, action);
    case actionTypes.GET_ITEMS_FAIL:
      return getItemsFail(state, action);
    case actionTypes.POST_ITEM_SUCCESS:
      return postItemSuccess(state, action);
    case actionTypes.POST_VOTE_SUCCESS:
      return postVoteSuccess(state, action);
    default:
      return state;
  }
};

export default resPageReducer;
