import { getTheme, initializeIcons, mergeStyles } from '@fluentui/react';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { App } from './components/ui/App/App';
import { config } from './config';
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
      height: '100%',
    },
    // Even though we can define cell styles as part of column definitions, the default cell styles
    // still take priority. This is a hack to override the default cell styles using a parent selector.
    ':global(.ms-DetailsRow [class^="DetailsRow-actions-cell"])': {
      padding: '0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
});

function renderApp(): void {
  ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>,
    document.getElementById('app')
  );
}

if (config.mockApi) {
  import('./api/mockApi').then(
    () => renderApp(),
    () => {
      console.error('There was an error loading the mock api');
    }
  );
} else {
  renderApp();
}
