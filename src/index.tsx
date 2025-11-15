import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from '@/provider/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/provider/auth-provider';

const initialToken = await window.electronAPI.getToken();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <AuthProvider initialToken={initialToken}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem>
        <App />
        <Toaster position='top-right' swipeDirections={['left', 'right']} className='select-none' />
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
