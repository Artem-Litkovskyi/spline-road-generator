import './index.css'

import React, { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'

import { ThemeProvider } from '@mui/material/styles'
import { useMediaQuery } from '@mui/material';

import { createAppTheme } from './theme'
import App from './App.tsx'

function Root() {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    const theme = React.useMemo(
        () => createAppTheme(prefersDarkMode ? 'dark' : 'light'),
        [prefersDarkMode]
    );

    useEffect(() => {
        const root = document.documentElement;
        root.setAttribute('data-theme', theme.palette.mode);
    }, [theme]);

    return (
        <StrictMode>
            <ThemeProvider theme={theme}>
                <App />
            </ThemeProvider>
        </StrictMode>

    );
}

createRoot(document.getElementById('root')!).render(<Root />);
