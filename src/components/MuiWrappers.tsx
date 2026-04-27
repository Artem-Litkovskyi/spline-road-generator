import { Box, Button, DialogContent, Divider, Stack, styled } from '@mui/material';

// App Bar
export const AppBarButton = styled(Button)(() => ({
    color: 'white'
}));

// Panel Section
export const PanelSection = styled(Stack)(({ theme }) => ({
    padding: theme.spacing(2),
    gap: theme.spacing(3),
}));

export const PanelSectionDivider = styled(Divider)(({ theme }) => ({
    marginTop: theme.spacing(1),
}));

// Dialog
export const DialogHeaderWithIcon = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    gap: theme.spacing(1),
}));

export const DialogContentWithGap = styled(DialogContent)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
    paddingTop: 0,
    gap: theme.spacing(3),
}));

// Common
export const HorizontalBoxWithGap = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(1),
}));

export const Code = styled('code')(({ theme }) => ({
    fontFamily: '"Roboto Mono", "Consolas", "Monaco", monospace',
    fontSize: '0.875em',
    padding: theme.spacing(0.25, 0.75),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.vars
        ? theme.vars.palette.action.hover
        : theme.palette.action.hover,
    border: `1px solid ${
        theme.vars
            ? theme.vars.palette.divider
            : theme.palette.divider
    }`,
    whiteSpace: 'nowrap',
}));
