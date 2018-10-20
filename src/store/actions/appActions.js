import * as actionTypes from 'store/actions/actionTypes';

export const checkGeoLocatePermission = () => {
  return dispatch => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then(permission => {
        if (permission.state === 'granted') dispatch(toggleGeoLocPerm(true));
        else dispatch(toggleGeoLocPerm(false));
      });
    } else console.log('This browser does not support Permissions API');
  };
};

export const geoLocate = () => {
  return dispatch => {
    dispatch(geoStart());
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        response => {
          const position = {
            lat: response.coords.latitude,
            long: response.coords.longitude
          };
          dispatch(geoSuccess(position));
        },
        error => {
          dispatch(geoFail(geoErrorHandler(error)));
        }
      );
    } else {
      dispatch(geoFail('Sorry, this browser does not support geo location'));
    }
  };
};

export const toggleGeoLocPerm = hasGeoLocatePermission => {
  return {
    type: actionTypes.TOGGLE_GEO_LOC_PERM,
    hasGeoLocatePermission: hasGeoLocatePermission
  };
};

const geoStart = () => {
  return {
    type: actionTypes.GEO_START,
    isLocating: true,
    geoLocation: null,
    error: null
  };
};

const geoSuccess = geoLocation => {
  return {
    type: actionTypes.GEO_SUCCESS,
    isLocating: false,
    hasGeoLocatePermission: true,
    geoLocation: geoLocation
  };
};

const geoFail = error => {
  return {
    type: actionTypes.GEO_FAIL,
    isLocating: false,
    hasGeoLocatePermission: false,
    geoLocation: null,
    error: error
  };
};

export const geoClear = () => {
  return {
    type: actionTypes.GEO_CLEAR,
    geolocation: null,
    error: null
  };
};

const geoErrorHandler = error => {
  switch (error.code) {
    case 1:
      return `Shmack does not have location permission. Turn on or allow location permission in your device settings.`;
    case 2:
      return `Your location is temporarily unavailable. Please try again.`;
    case 3:
      return `Obtaining your location took too long. Please try again.`;
    default:
      return `There was an unexpected error. Please try again.`;
  }
};

export const beforeInstallPrompt = event => {
  return {
    type: actionTypes.BEFORE_INSTALL_PROMPT,
    deferredPrompt: event
  };
};

export const clearDeferredPrompt = () => {
  return {
    type: actionTypes.CLEAR_DEFERRED_PROMPT,
    deferredPrompt: null
  };
};

export const setRedirectParent = redirectParent => {
  return {
    type: actionTypes.SET_REDIRECT_PARENT,
    redirectParent: redirectParent
  };
};
