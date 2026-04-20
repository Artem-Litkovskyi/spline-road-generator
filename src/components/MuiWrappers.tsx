import { Box, DialogContent, Stack, styled } from '@mui/material';

export const PanelSection = styled(Stack)(({ theme }) => ({
    padding: theme.spacing(2),
    gap: theme.spacing(3),
}));

export const HorizontalInputBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(1),
}));

export const DialogContentWithGap = styled(DialogContent)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
    gap: theme.spacing(3),
}));
