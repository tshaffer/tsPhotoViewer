import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import { appReducer } from './model';
import App from './components/app';

const store = createStore(appReducer, composeWithDevTools(applyMiddleware(thunk)));
console.log(store);

ReactDOM.render(
  <App />,
  document.getElementById('content') as HTMLElement,
);
