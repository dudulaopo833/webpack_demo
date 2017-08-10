import common from '../common';
import App from './App';

render(App);
if (module.hot) module.hot.accept('./App', () => render(App));