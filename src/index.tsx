import './index.css';
// TODO: import only one theme
import '@/component-library/theme/theme.interlay.css';
import '@/component-library/theme/theme.kintsugi.css';

import { configGlobalBig } from '@interlay/monetary-js';
import { OverlayProvider } from '@react-aria/overlays';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import * as React from 'react';
import ReactDOM from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import { SubstrateLoadingAndErrorHandlingWrapper, SubstrateProvider } from '@/lib/substrate';
import ThemeWrapper from '@/parts/ThemeWrapper';
import { Subscriptions } from '@/utils/hooks/api/tokens/use-balances-subscription';

import App from './App';
import reportWebVitals from './reportWebVitals';
import { store } from './store';

Sentry.init({
  dsn: 'https://4de9e593788d4e12aac0610b4e04aab4@o4504853415329792.ingest.sentry.io/4504853441347584',
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0
});

configGlobalBig();

const DeveloperConsole = React.lazy(
  () => import(/* webpackChunkName: 'developer-console' */ '@/lib/substrate/components/DeveloperConsole')
);

window.isFetchingActive = false;

const queryClient = new QueryClient();

// MEMO: temporarily removed React.StrictMode. We should add back when react-spectrum handles
// it across their library. (Issue: https://github.com/adobe/react-spectrum/issues/779#issuecomment-1353734729)
ReactDOM.render(
  <Router>
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <Provider store={store}>
          <SubstrateProvider>
            <ThemeWrapper>
              <SubstrateLoadingAndErrorHandlingWrapper>
                <Subscriptions>
                  <OverlayProvider>
                    <App />
                  </OverlayProvider>
                </Subscriptions>
              </SubstrateLoadingAndErrorHandlingWrapper>
            </ThemeWrapper>
            <React.Suspense fallback={null}>
              <DeveloperConsole />
            </React.Suspense>
          </SubstrateProvider>
        </Provider>
      </HelmetProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </Router>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
