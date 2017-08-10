import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';

const rootEl = document.getElementById('app');
const render = Component =>
  ReactDOM.render(
    <Provider>
      <Component />
    </Provider>,
    rootEl
  );

render(App);
