import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';

import { appReducer } from './model';
import App from './components/app';
import { AppModelState } from './type';

const store = createStore(
  appReducer,
  composeWithDevTools(applyMiddleware(thunk)),
);

// const store = createStore(
//   appReducer, /* preloadedState, */
//   (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__()
// );

// const initialState: AppModelState = {
//   pizzaName: {
//     type: 'Veggie'
//   },
//   pizzaToppings: [],
// };

// const store = createStore(
//   appReducer,
//   initialState,
//   (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
//     (window as any).__REDUX_DEVTOOLS_EXTENSION__()
// );

// const store = createStore(
//   appReducer,
//   composeWithDevTools(applyMiddleware(thunk)),
//   // compose(
//   //  applyMiddleware(thunk),
//   //  (window as any).devToolsExtension ? (window as any).devToolsExtension() : (f: any) => f
//   )
// );

// const store = createStore(
//   appReducer,
//   initialState,
//   compose(
//     applyMiddleware(thunk),
//     (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__()
//   )
// );

// const enhancers = compose(
//   applyMiddleware(thunk),
//   (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__()
// );

// const store = createStore(
//   appReducer,
//   // initialState,
//   enhancers,
//   // (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
//   // (window as any).__REDUX_DEVTOOLS_EXTENSION__()
// );


// const store = createStore(
//   rootReducer,
//   defaultState,
//   enhancers
// );

const divStyle = {
  height: '1080px',
};

ReactDOM.render(
  <Provider store={store}>
    <div style={divStyle}>
      < App />
    </div>
  </Provider>,
  document.getElementById('content') as HTMLElement
);
