import { AppContainer } from 'react-hot-loader';
import React from 'react';
import ReactDOM from 'react-dom';

const rootEl = document.getElementById('app');
export default Component =>
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    rootEl
  );


