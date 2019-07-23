import { Dispatch } from 'redux';
import {
  TOGGLE_GEO_LOC_PERM,
  GEO_START,
  GEO_SUCCESS,
  GEO_FAIL,
  GEO_CLEAR,
  BEFORE_INSTALL_PROMPT,
  CLEAR_DEFERRED_PROMPT,
  SET_REDIRECT_PARENT,
} from './';
import {
  GeoStartAction,
  GeoClearAction,
  GeoSuccessAction,
  GeoFailAction,
  BeforeInstallPromptAction,
  ClearDeferredPromptAction,
  SetRedirectParentAction,
  ToggleGeoLocPermAction,
} from './appActions.models';

export const checkGeoLocatePermission = () => (dispatch: Dispatch) => {
  if (navigator.permissions) {
    navigator.permissions.query({ name: 'geolocation' }).then(permission => {
      if (permission.state === 'granted') dispatch(toggleGeoLocPerm(true));
      else dispatch(toggleGeoLocPerm(false));
    });
  } else console.log('This browser does not support Permissions API');
};

export const geoLocate = () => (dispatch: Dispatch) => {
  dispatch(geoStart());
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      response => {
        const position = {
          lat: response.coords.latitude,
          long: response.coords.longitude,
        };
        dispatch(geoSuccess(position));
      },
      error => {
        const message = geoErrorHandler(error);
        dispatch(geoFail({ code: error.code, message }));
      },
    );
  } else {
    const message = 'Sorry, this browser does not support geo location';
    dispatch(geoFail({ message }));
  }
};

export const toggleGeoLocPerm = (
  hasGeoLocatePermission: boolean,
): ToggleGeoLocPermAction => ({
  type: TOGGLE_GEO_LOC_PERM,
  payload: {
    hasGeoLocatePermission,
  },
});

const geoStart = (): GeoStartAction => ({
  type: GEO_START,
  payload: {
    isLocating: true,
    geoLocation: {},
    geoError: {},
    isError: false,
  },
});

const geoSuccess = (geoLocation: object): GeoSuccessAction => ({
  type: GEO_SUCCESS,
  payload: {
    isLocating: false,
    hasGeoLocatePermission: true,
    geoLocation,
  },
});

const geoFail = (geoError: object): GeoFailAction => ({
  type: GEO_FAIL,
  payload: {
    isLocating: false,
    hasGeoLocatePermission: false,
    geoLocation: {},
    geoError,
    isError: true,
  },
});

export const geoClear = (): GeoClearAction => ({
  type: GEO_CLEAR,
  payload: {
    geolocation: {},
    isError: false,
  },
});

const geoErrorHandler = (error: any) => {
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

export const beforeInstallPrompt = (
  event?: Event,
): BeforeInstallPromptAction => ({
  type: BEFORE_INSTALL_PROMPT,
  payload: {
    deferredPrompt: event,
  },
});

export const clearDeferredPrompt = (): ClearDeferredPromptAction => ({
  type: CLEAR_DEFERRED_PROMPT,
  payload: {
    deferredPrompt: null,
  },
});

export const setRedirectParent = (
  redirectParent: string,
): SetRedirectParentAction => ({
  type: SET_REDIRECT_PARENT,
  payload: {
    redirectParent: redirectParent,
  },
});
