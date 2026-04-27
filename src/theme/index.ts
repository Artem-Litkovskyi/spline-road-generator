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
        MuiAppBar: {
            styleOverrides: {
                root: {
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                },
            },
        },
        MuiFormLabel: {
            styleOverrides: {
                root: {
                    '&.input-label': {
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
        MuiDialogTitle: {
            styleOverrides: {
                root: {
                    '&.dialog-with-icon': {
                        paddingLeft: 0,
                    },
                },
            },
        }
    },
})