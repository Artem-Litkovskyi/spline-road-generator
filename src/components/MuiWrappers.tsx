import { Box, Stack, styled } from '@mui/material';

export const PanelSection = styled(Stack)(({ theme }) => ({
    padding: theme.spacing(2),
    gap: theme.spacing(3),
}));

export const HorizontalInputBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(1),
}));
