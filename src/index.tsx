import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';

import { photoCollageModelReducer } from './model';
import PhotoCollage from './component/PhotoCollage';

import {
  getPlatform,
  readConfig
} from './config';
import { init } from './controller';

const platform = getPlatform();

if (platform === 'BrightSign') {
  readConfig('/storage/sd/config.env');
} else {
  readConfig('/Users/tedshaffer/Documents/Projects/tsPhotoViewer/src/config/config.env');
}

const store = createStore(
  photoCollageModelReducer,
  composeWithDevTools(applyMiddleware(thunk)),
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
