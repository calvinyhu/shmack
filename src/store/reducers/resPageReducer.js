import * as actionTypes from 'store/actions/actionTypes';
import { updateObject } from 'utilities/utilities';

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
  return updateObject(state, {
    items: action.items,
    resPageError: action.resPageError
  });
};

const postItemFail = (state, action) => {
  return updateObject(state, {
    resPageError: action.resPageError
  });
};

const postVoteSuccess = (state, action) => {
  return updateObject(state, {
    items: action.items
  });
};

const postVoteFail = (state, action) => {
  return updateObject(state, {
    resPageError: action.resPageError
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
    case actionTypes.POST_ITEM_FAIL:
      return postItemFail(state, action);
    case actionTypes.POST_VOTE_SUCCESS:
      return postVoteSuccess(state, action);
    case actionTypes.POST_VOTE_FAIL:
      return postVoteFail(state, action);
    default:
      return state;
  }
};

export default resPageReducer;
