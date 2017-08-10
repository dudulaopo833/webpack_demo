import React from 'react';
import {render} from 'react-dom';

export default function startApp(item) {
    render( <div>{item}</div>, document.getElementById('app'));
}

if (module.hot) module.hot.accept('./App', () => render(App));
