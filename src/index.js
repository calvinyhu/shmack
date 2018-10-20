import React from 'react';
import ReactDOM from 'react-dom';
import './index.module.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { BrowserRouter } from 'react-router-dom';
import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import appReducer from './store/reducers/appReducer';
import authReducer from './store/reducers/authReducer';
import restaurantsReducer from './store/reducers/restaurantsReducer';
import resPageReducer from './store/reducers/resPageReducer';
import userReducer from './store/reducers/userReducer';

const rootReducer = combineReducers({
  app: appReducer,
  auth: authReducer,
  restaurants: restaurantsReducer,
  resPage: resPageReducer,
  user: userReducer
});

const composeEnhancers =
  (process.env.NODE_ENV === 'development'
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : null) || compose;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);

const app = (
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

ReactDOM.render(app, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
