import React from 'react';
import ReactDOM from 'react-dom';
import { mergeStyles, getTheme } from '@fluentui/react';
import { App } from './components/App/App';

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
    <App />
  </React.StrictMode>,
  document.getElementById('app')
);
