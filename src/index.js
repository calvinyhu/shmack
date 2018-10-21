import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import * as serviceWorker from 'serviceWorker';
import 'index.module.scss';
import App from 'App';
import Root from 'Root';

const app = (
  <Root>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Root>
);

ReactDOM.render(app, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();
