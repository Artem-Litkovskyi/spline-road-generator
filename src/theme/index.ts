import { createTheme } from '@mui/material';

export const theme = createTheme({
    colorSchemes: {
        light: true,
        dark: true,
    },
    cssVariables: {
        colorSchemeSelector: 'data'
    },
    components: {
        MuiTextField: {
            defaultProps: {
                size: 'small',
                variant: 'standard',
                fullWidth: true,
            },
        },
        MuiFormLabel: {
            styleOverrides: {
                root: {
                    '&.inputLabel': {
                        transform: 'scale(0.75)',
                        transformOrigin: 'top left',
                        lineHeight: 'normal',
                    },
                },
            },
        },
        MuiCheckbox: {
            styleOverrides: {
                root: {
                    marginTop: -9,
                    marginBottom: -9,
                },
            },
        },
        MuiDivider: {
            styleOverrides: {
                root: ({ theme }) =>
                    theme.unstable_sx({
                        marginTop: 1,
                    }),
            },
        },
    },
})