import React, { useState, useRef } from 'react';
import {
    Box,
    Popover,
    TextField,
    InputAdornment,
    IconButton,
    Paper, FormLabel,
    FormGroup,
} from '@mui/material';
import { HexColorPicker } from 'react-colorful';

interface ColorPickerProps {
    label?: string;
    value: string;
    onChange: (color: string) => void;
    disabled?: boolean;
}

export function ColorPicker({ label = 'Color', value, onChange, disabled = false }: ColorPickerProps) {
    const [open, setOpen] = useState(false);
    const anchorRef = useRef<HTMLButtonElement | null>(null);

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let next = e.target.value.trim();

        if (!next.startsWith('#')) {
            next = `#${next}`;
        }

        if (/^#[0-9A-Fa-f]{0,6}$/.test(next)) {
            onChange(next);
        }
    };

    const handleBlur = () => {
        if (!/^#[0-9A-Fa-f]{6}$/.test(value)) {
            onChange('#000000');
        }
    };

    return (
        <FormGroup>
            <FormLabel className='input-label'>{label}</FormLabel>
            <TextField
                value={value}
                disabled={disabled}
                onChange={handleTextChange}
                onBlur={handleBlur}
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position='start'>
                                <IconButton
                                    ref={anchorRef}
                                    size='small'
                                    onClick={() => setOpen(true)}
                                    disabled={disabled}
                                    sx={{ transform: 'translateY(-3px)' }}
                                >
                                    <Box
                                        sx={{
                                            width: 24,
                                            height: 24,
                                            borderRadius: 1,
                                            background: value,
                                            border: '1px solid',
                                            borderColor: 'divider',
                                        }}
                                    />
                                </IconButton>
                            </InputAdornment>
                        ),
                    },
                }}
            />

            <Popover
                open={open}
                anchorEl={anchorRef.current}
                onClose={() => setOpen(false)}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <Paper sx={{ p: 2 }}>
                    <HexColorPicker color={value} onChange={onChange} />

                    <Box
                        sx={{
                            mt: 2,
                            width: '100%',
                            height: 36,
                            borderRadius: 1,
                            color: value,
                            border: '1px solid',
                            borderColor: 'divider',
                        }}
                    />
                </Paper>
            </Popover>
        </FormGroup>
    );
}