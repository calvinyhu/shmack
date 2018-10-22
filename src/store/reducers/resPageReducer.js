import * as actionTypes from 'store/actions/actionTypes';

const initialState = {
  isGettingItems: false,
  items: null,
  error: null
};

const resPageReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_ITEMS_START:
      return { ...state, ...action.payload };
    case actionTypes.GET_ITEMS_SUCCESS:
      return { ...state, ...action.payload };
    case actionTypes.GET_ITEMS_FAIL:
      return { ...state, ...action.payload };
    case actionTypes.POST_ITEM_SUCCESS:
      return { ...state, ...action.payload };
    case actionTypes.POST_ITEM_FAIL:
      return { ...state, ...action.payload };
    case actionTypes.POST_VOTE_SUCCESS:
      return { ...state, ...action.payload };
    case actionTypes.POST_VOTE_FAIL:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default resPageReducer;
