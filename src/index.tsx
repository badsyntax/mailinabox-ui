import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { mergeStyles, getTheme, initializeIcons } from '@fluentui/react';
import { App } from './components/App/App';
import { store } from './store';

initializeIcons(/* optional base url */);

mergeStyles({
  selectors: {
    ':global(body)': {
      background: getTheme().palette.neutralLighter,
    },
    ':global(body), :global(html), :global(#app)': {
      margin: 0,
      padding: 0,
      height: '100vh',
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('app')
);
