import { combineReducers } from 'redux';
import appReducer, { AppState } from 'store/reducers/appReducer';
import authReducer, { AuthState } from 'store/reducers/authReducer';
import restaurantsReducer, {
  RestaurantsState,
} from 'store/reducers/restaurantsReducer';
import resPageReducer, { ResPageState } from 'store/reducers/resPageReducer';
import userReducer, { UserState } from 'store/reducers/userReducer';

export interface RootState {
  app: AppState;
  auth: AuthState;
  restaurants: RestaurantsState;
  resPage: ResPageState;
  user: UserState;
}

const rootReducer = combineReducers({
  app: appReducer,
  auth: authReducer,
  restaurants: restaurantsReducer,
  resPage: resPageReducer,
  user: userReducer,
});

export default rootReducer;
