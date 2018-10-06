import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../utilities/utilities';

const initialState = {
  hasGeoLocatePermission: false,
  isLocating: false,
  geoLocation: null,
  error: null,
  deferredPrompt: null,
  redirectParent: null
};

const geoStart = (state, action) => {
  return updateObject(state, {
    isLocating: action.isLocating,
    geoLocation: action.geoLocation,
    error: action.error
  });
};

const geoSuccess = (state, action) => {
  return updateObject(state, {
    isLocating: action.isLocating,
    hasGeoLocatePermission: action.hasGeoLocatePermission,
    geoLocation: action.geoLocation
  });
};

const geoFail = (state, action) => {
  return updateObject(state, {
    isLocating: action.isLocating,
    hasGeoLocatePermission: action.hasGeoLocatePermission,
    geoLocation: action.geoLocation,
    error: action.error
  });
};

const geoToggle = (state, action) => {
  return updateObject(state, {
    hasGeoLocatePermission: action.hasGeoLocatePermission
  });
};

const geoClear = (state, action) => {
  return updateObject(state, {
    geoLocation: action.geoLocation,
    error: action.error
  });
};

const beforeInstallPrompt = (state, action) => {
  return updateObject(state, {
    deferredPrompt: action.deferredPrompt
  });
};

const clearDeferredPrompt = (state, action) => {
  return updateObject(state, {
    deferredPrompt: action.deferredPrompt
  });
};

const setRedirectParent = (state, action) => {
  return updateObject(state, {
    redirectParent: action.redirectParent
  });
};

const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GEO_START:
      return geoStart(state, action);
    case actionTypes.GEO_SUCCESS:
      return geoSuccess(state, action);
    case actionTypes.GEO_FAIL:
      return geoFail(state, action);
    case actionTypes.GEO_CLEAR:
      return geoClear(state, action);
    case actionTypes.TOGGLE_GEO_LOC_PERM:
      return geoToggle(state, action);
    case actionTypes.BEFORE_INSTALL_PROMPT:
      return beforeInstallPrompt(state, action);
    case actionTypes.CLEAR_DEFERRED_PROMPT:
      return clearDeferredPrompt(state, action);
    case actionTypes.SET_REDIRECT_PARENT:
      return setRedirectParent(state, action);
    default:
      return state;
  }
};

export default appReducer;
