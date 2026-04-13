import { createTheme } from '@mui/material';

export const createAppTheme = (mode: 'light' | 'dark') => (
    createTheme({
        palette: {
            mode,
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
                        paddingTop: 0,
                        paddingBottom: 0,
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
)