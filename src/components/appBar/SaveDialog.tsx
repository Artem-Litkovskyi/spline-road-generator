import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';

import { DialogContentWithGap } from '../MuiWrappers.tsx';
import { CustomInput } from '../inputs/CustomInput.tsx';

type SaveDialogProps = {
    filename: string;
    setFilename: (v: string) => void;
    open: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}

export function SaveDialog(props: SaveDialogProps) {
    return (
        <Dialog
            open={props.open}
            onClose={props.onCancel}
            aria-labelledby='save-dialog-title'
            role='alertdialog'
        >
            <DialogTitle id='save-dialog-title'>
                Save Project
            </DialogTitle>

            <DialogContentWithGap>
                <CustomInput
                    label='Filename'
                    placeholder='untitled'
                    value={props.filename}
                    onChange={(e) => props.setFilename(e.target.value)}
                />
            </DialogContentWithGap>

            <DialogActions>
                <Button onClick={props.onCancel}>Cancel</Button>
                <Button onClick={props.onConfirm}>Download</Button>
            </DialogActions>
        </Dialog>
    );
}