import { createRoot } from 'react-dom/client';
import { ThemeProvider, StyledEngineProvider, CssBaseline } from '@mui/material';
import "./index.css";
import "./i18n";
import App from './App';
import theme from './assets/Theme';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from "react-router-dom";
import { StrictMode } from 'react';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <StrictMode>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </StyledEngineProvider>
  </StrictMode>
);

reportWebVitals();
