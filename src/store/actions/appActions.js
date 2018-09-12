import * as actionTypes from '../actions/actionTypes';

export const checkGeoLocatePermission = () => {
  return dispatch => {
    navigator.permissions.query({ name: 'geolocation' }).then(permission => {
      switch (permission.state) {
        case 'prompt':
          dispatch(toggleGeoLocPerm(false));
          break;
        case 'granted':
          dispatch(toggleGeoLocPerm(true));
          break;
        case 'blocked':
          dispatch(toggleGeoLocPerm(false));
          break;
        default:
          dispatch(toggleGeoLocPerm(false));
      }
    });
  };
};

export const geoLocate = () => {
  return dispatch => {
    console.log('[ App Actions ] Locating position........');
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
          dispatch(geoError(geoErrorHandler(error)));
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

export const geoStart = () => {
  return {
    type: actionTypes.GEO_START,
    error: null
  };
};

const geoSuccess = geoLocation => {
  return {
    type: actionTypes.GEO_SUCCESS,
    geoLocation: geoLocation
  };
};

const geoFail = error => {
  return {
    type: actionTypes.GEO_FAIL,
    hasGeoLocatePermission: false,
    error: error
  };
};

const geoErrorHandler = error => {
  switch (error.code) {
    case 1:
      return `Location sharing is blocked or turned off. Please allow 
            location sharing in your browser settings or your device.`;
    case 2:
      return `Your location is temporarily unavailable. Please try again.`;
    case 3:
      return `Obtaining your location took too long. Please try again.`;
    default:
      return `There was an unexpected error. Please try again.`;
  }
};

const geoError = error => {
  return {
    type: actionTypes.GEO_ERROR,
    hasGeoLocatePermission: false,
    error: error
  };
};
