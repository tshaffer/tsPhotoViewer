import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
// import { composeWithDevTools } from 'redux-devtools-extension';
import { composeWithDevTools } from 'remote-redux-devtools';

import thunk from 'redux-thunk';
import { Provider } from 'react-redux';

import { photoCollageModelReducer } from './model';
import PhotoCollage from './component/PhotoCollage';

import { readConfig } from './config';
import { init } from './controller';
import isomorphicPath from 'isomorphic-path';

const pathToConfigFile = isomorphicPath.join(process.cwd(), 'config.env');
readConfig(pathToConfigFile);

const composeEnhancers = composeWithDevTools({
  realtime: true,
  name: 'Your Instance Name',
  hostname: 'localhost',
  port: 9223 // the port your remotedev server is running at
});

const store = createStore(
  photoCollageModelReducer,
  composeEnhancers(applyMiddleware(thunk)),
);

store.dispatch(init());

const divStyle = {
  height: '1080px',
};

ReactDOM.render(
  <Provider store={store}>
    <div style={divStyle}>
      <PhotoCollage />
    </div>
  </Provider>,
  document.getElementById('content') as HTMLElement
);
