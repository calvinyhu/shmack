import { combineReducers } from 'redux';
import appReducer from 'store/reducers/appReducer';
import authReducer from 'store/reducers/authReducer';
import restaurantsReducer from 'store/reducers/restaurantsReducer';
import resPageReducer from 'store/reducers/resPageReducer';

const rootReducer = combineReducers({
  app: appReducer,
  auth: authReducer,
  restaurants: restaurantsReducer,
  resPage: resPageReducer
});

export default rootReducer;
