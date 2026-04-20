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
        MuiTextField: {
            defaultProps: {
                size: 'small',
                variant: 'standard',
                fullWidth: true,
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
        MuiInput: {  // Remove margin between label and dropdown in CustomSelect
            styleOverrides: {
                root: {
                    'label + &': {
                        marginTop: 0,
                    },
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