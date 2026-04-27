import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

import { DialogContentWithGap, DialogHeaderWithIcon } from '../MuiWrappers.tsx';
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
            <DialogHeaderWithIcon>
                <FileDownloadIcon className='dialog-with-icon' />
                <DialogTitle className='dialog-with-icon' id='save-dialog-title'>
                    Save Project
                </DialogTitle>
            </DialogHeaderWithIcon>

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