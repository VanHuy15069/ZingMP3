import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import GlobalStyles from './components/GlobalStyles/GlobalStyle.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Provider from './provider/provider.jsx';
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider>
        <QueryClientProvider client={queryClient}>
          <GlobalStyles>
            <App />
          </GlobalStyles>
        </QueryClientProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
);
