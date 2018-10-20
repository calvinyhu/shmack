import { combineReducers } from 'redux';
import appReducer from 'store/reducers/appReducer';
import authReducer from 'store/reducers/authReducer';
import restaurantsReducer from 'store/reducers/restaurantsReducer';
import resPageReducer from 'store/reducers/resPageReducer';
import userReducer from 'store/reducers/userReducer';

const rootReducer = combineReducers({
  app: appReducer,
  auth: authReducer,
  restaurants: restaurantsReducer,
  resPage: resPageReducer,
  user: userReducer
});

export default rootReducer;
