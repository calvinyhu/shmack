import {
  GEO_START,
  GEO_SUCCESS,
  GEO_FAIL,
  GEO_CLEAR,
  TOGGLE_GEO_LOC_PERM,
  BEFORE_INSTALL_PROMPT,
  CLEAR_DEFERRED_PROMPT,
  SET_REDIRECT_PARENT,
} from 'store/actions';
import { AppAction } from 'store/actions/appActions.models';

export interface AppState {
  hasGeoLocatePermission: boolean;
  isLocating: boolean;
  isError: boolean;
  geoLocation: object;
  geoError: object;
  deferredPrompt: object;
  redirectParent: string;
}

const appState: AppState = {
  hasGeoLocatePermission: false,
  isLocating: false,
  isError: false,
  geoLocation: {},
  geoError: {},
  deferredPrompt: {},
  redirectParent: '',
};

const appReducer = (state = appState, action: AppAction) => {
  switch (action.type) {
    case GEO_START:
    case GEO_SUCCESS:
    case GEO_FAIL:
    case GEO_CLEAR:
    case TOGGLE_GEO_LOC_PERM:
    case BEFORE_INSTALL_PROMPT:
    case CLEAR_DEFERRED_PROMPT:
    case SET_REDIRECT_PARENT:
      return { ...state, ...action.payload } as AppState;
    default:
      return state;
  }
};

export default appReducer;
