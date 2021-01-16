import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';

import { photoCollageModelReducer } from './model';
import PhotoCollage from './component/PhotoCollage';

import { readConfig } from './config';
import { init } from './controller';

let platform: any;
let irReceiver: BSIRReceiver;

try {
  // const gpio = new BSControlPort('BrightSign');
  // console.log('create controlPort: ');
  // console.log(gpio);
  irReceiver = new BSIRReceiver('IR-in', 'NEC');
  console.log('create irReceiver: ');
  console.log(irReceiver);
  irReceiver.onremotedown = (e: any) => {
    console.log('############ onremotedown: ' + e.irType + ' - ' + e.code);
  };
  platform = 'BrightSign';
}
catch (e) {
  platform = 'Desktop';
  console.log('failed to create controlPort: ');
}
console.log('Set platform to: ' + platform);

readConfig('/storage/sd/config.env');
// readConfig('/Users/tedshaffer/Documents/Projects/photoCollage/src/config/config.env');

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
