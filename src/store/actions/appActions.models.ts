import {
  BEFORE_INSTALL_PROMPT,
  TOGGLE_GEO_LOC_PERM,
  GEO_START,
  GEO_SUCCESS,
  GEO_FAIL,
  GEO_CLEAR,
  CLEAR_DEFERRED_PROMPT,
  SET_REDIRECT_PARENT,
} from './';

export interface ToggleGeoLocPermAction {
  type: typeof TOGGLE_GEO_LOC_PERM;
  payload: {
    hasGeoLocatePermission: boolean;
  };
}

export interface GeoStartAction {
  type: typeof GEO_START;
  payload: {
    isLocating: boolean;
    geoLocation: object;
    geoError: object;
    isError: boolean;
  };
}

export interface GeoSuccessAction {
  type: typeof GEO_SUCCESS;
  payload: {
    isLocating: boolean;
    hasGeoLocatePermission: boolean;
    geoLocation: object;
  };
}

export interface GeoFailAction {
  type: typeof GEO_FAIL;
  payload: {
    isLocating: boolean;
    hasGeoLocatePermission: boolean;
    geoLocation: object;
    geoError: object;
    isError: boolean;
  };
}

export interface GeoClearAction {
  type: typeof GEO_CLEAR;
  payload: {
    geolocation: object;
    isError: boolean;
  };
}

export interface BeforeInstallPromptAction {
  type: typeof BEFORE_INSTALL_PROMPT;
  payload: {
    deferredPrompt: Event | undefined;
  };
}

export interface ClearDeferredPromptAction {
  type: typeof CLEAR_DEFERRED_PROMPT;
  payload: {
    deferredPrompt: null;
  };
}

export interface SetRedirectParentAction {
  type: typeof SET_REDIRECT_PARENT;
  payload: {
    redirectParent: string;
  };
}

export type AppAction =
  | ToggleGeoLocPermAction
  | GeoStartAction
  | GeoSuccessAction
  | GeoFailAction
  | GeoClearAction
  | BeforeInstallPromptAction
  | ClearDeferredPromptAction
  | SetRedirectParentAction;
