import {
  GET_ITEMS_START,
  GET_ITEMS_SUCCESS,
  GET_ITEMS_FAIL,
  POST_ITEM_SUCCESS,
  POST_ITEM_FAIL,
  POST_VOTE_SUCCESS,
  RESPAGE_CLEAR_ERROR,
} from './';

export interface GetItemsStartAction {
  type: typeof GET_ITEMS_START;
  payload: {
    isGettingItems: boolean;
    items: firebase.firestore.DocumentData;
  };
}

export interface GetItemsSuccessAction {
  type: typeof GET_ITEMS_SUCCESS;
  payload: {
    isGettingItems: boolean;
    items: firebase.firestore.DocumentData | undefined;
  };
}

export interface GetItemsFailAction {
  type: typeof GET_ITEMS_FAIL;
  payload: {
    isGettingItems: boolean;
    error: object;
  };
}

export interface PostItemSuccessAction {
  type: typeof POST_ITEM_SUCCESS;
  payload: {
    item: object;
    error: object;
  };
}

export interface PostItemFailAction {
  type: typeof POST_ITEM_FAIL;
  payload: {
    error: object;
  };
}

export interface PostVoteSuccessAction {
  type: typeof POST_VOTE_SUCCESS;
  payload: {
    item: object;
    error: object;
  };
}

export interface ResPageClearErrorAction {
  type: typeof RESPAGE_CLEAR_ERROR;
  payload: {
    error: object;
  };
}

export type ResPageAction =
  | GetItemsStartAction
  | GetItemsSuccessAction
  | GetItemsFailAction
  | PostItemSuccessAction
  | PostItemFailAction
  | PostVoteSuccessAction
  | ResPageClearErrorAction;
