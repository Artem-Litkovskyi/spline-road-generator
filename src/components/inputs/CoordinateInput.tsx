import { InputAdornment, TextField, Typography } from '@mui/material';

interface CoordinateInputProps {
    label?: string;
}

export function CoordinateInput({ label }: CoordinateInputProps) {
    return (
        <TextField
            type='number'
            placeholder='0'
            slotProps={{
                input: {
                    startAdornment: (
                        <InputAdornment
                            position='start'
                            sx={{ transform: 'translateY(-3px)' }}
                        >
                            <Typography variant={'body2'}>
                                {label}
                            </Typography>
                        </InputAdornment>
                    ),
                },
            }}
        />
    )
}