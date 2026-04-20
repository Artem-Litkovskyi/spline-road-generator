import React, { useState } from 'react';

import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';

import { DialogContentWithGap, PanelSection } from './MuiWrappers.tsx';
import { CustomInput } from './inputs/CustomInput.tsx';
import { FilenameAndExtensionInput } from './inputs/FilenameAndExtensionInput.tsx';

import type { ExtensionType } from '../utils/export.ts';

interface ExportDialogProps {
    onSubmit: (filename: string, extension: ExtensionType, resolution: number) => void
}

export function ExportSection({ onSubmit }: ExportDialogProps) {
    const [filename, setFilename] = useState('road');
    const [extension, setExtension] = useState<ExtensionType>('obj');
    const [resolution, setResolution] = useState(20);

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
                            onSubmit(filename, extension, resolution);
                            handleClose();
                        },
                    },
                }}
            >
                <DialogTitle>Export</DialogTitle>

                <DialogContentWithGap>
                    <FilenameAndExtensionInput
                        label='Filename and Format'
                        filename={filename} setFilename={setFilename}
                        extension={extension} setExtension={setExtension}
                    />

                    <CustomInput
                        label='Resolution (Cross-sections per Segment)'
                        type='number'
                        placeholder='0'
                        value={resolution}
                        onChange={(e) => setResolution(
                            Math.max(5, Number(e.target.value)))}
                    />
                </DialogContentWithGap>

                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type='submit'>Download</Button>
                </DialogActions>
            </Dialog>
        </PanelSection>
    );
}