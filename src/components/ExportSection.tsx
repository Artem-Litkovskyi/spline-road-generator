import React, { useState } from 'react';

import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

import { PanelSection } from './MuiWrappers.tsx';
import { FilenameAndExtensionInput } from './inputs/FilenameAndExtensionInput.tsx';

import type { ExtensionType } from '../utils/export.ts';

interface ExportDialogProps {
    onSubmit: (filename: string, extension: ExtensionType) => void
}

export function ExportSection({ onSubmit }: ExportDialogProps) {
    const [filename, setFilename] = useState('road');
    const [extension, setExtension] = useState<ExtensionType>('obj');

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <PanelSection sx={{ mt: 'auto' }}>
            <Button variant='contained' fullWidth onClick={handleClickOpen}>
                Export
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                slotProps={{
                    paper: {
                        component: 'form',
                        onSubmit: (event: React.SubmitEvent<HTMLFormElement>) => {
                            event.preventDefault();
                            onSubmit(filename, extension);
                            handleClose();
                        },
                    },
                }}
            >
                <DialogTitle>Export</DialogTitle>

                <DialogContent>
                    <FilenameAndExtensionInput
                        label='Filename and Format'
                        filename={filename} setFilename={setFilename}
                        extension={extension} setExtension={setExtension}
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type='submit'>Download</Button>
                </DialogActions>
            </Dialog>
        </PanelSection>
    );
}