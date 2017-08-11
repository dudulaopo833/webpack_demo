import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

export default Component =>
  ReactDOM.render(
    <Provider>
      <Component />
    </Provider>,
    document.getElementById('app')
  );
