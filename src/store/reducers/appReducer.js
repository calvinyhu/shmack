import * as actionTypes from 'store/actions/actionTypes';

const initialState = {
  hasGeoLocatePermission: false,
  isLocating: false,
  geoLocation: {},
  geoError: {},
  deferredPrompt: {},
  redirectParent: ''
};

const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GEO_START:
      return { ...state, ...action.payload };
    case actionTypes.GEO_SUCCESS:
      return { ...state, ...action.payload };
    case actionTypes.GEO_FAIL:
      return { ...state, ...action.payload };
    case actionTypes.GEO_CLEAR:
      return { ...state, ...action.payload };
    case actionTypes.TOGGLE_GEO_LOC_PERM:
      return { ...state, ...action.payload };
    case actionTypes.BEFORE_INSTALL_PROMPT:
      return { ...state, ...action.payload };
    case actionTypes.CLEAR_DEFERRED_PROMPT:
      return { ...state, ...action.payload };
    case actionTypes.SET_REDIRECT_PARENT:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default appReducer;
