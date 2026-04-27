import { Button, Dialog, DialogActions, DialogContentText, DialogTitle } from '@mui/material';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import { DialogContentWithGap, DialogHeaderWithIcon } from '../MuiWrappers.tsx';

type ConfirmDiscardDialogProps = {
    open: boolean;
    onCancel: () => void;
    onDontSave: () => void;
    onSave: () => void;
}

export function ConfirmDiscardDialog(props: ConfirmDiscardDialogProps) {
    return (
        <Dialog
            open={props.open}
            onClose={props.onCancel}
            aria-labelledby='confirm-discard-dialog-title'
            aria-describedby='confirm-discard-dialog-description'
            role='alertdialog'
        >
            <DialogHeaderWithIcon>
                <AnnouncementIcon className='dialog-with-icon' />
                <DialogTitle className='dialog-with-icon' id='confirm-discard-dialog-title'>
                    Project Have Been Modified
                </DialogTitle>
            </DialogHeaderWithIcon>

            <DialogContentWithGap>
                <DialogContentText id='confirm-discard-dialog-description'>
                    Do you want to save the changes you made?
                    <br/>
                    Your changes will be lost if you don't save them.
                </DialogContentText>
            </DialogContentWithGap>

            <DialogActions>
                <Button onClick={props.onCancel}>Cancel</Button>
                <Button onClick={props.onDontSave}>Don't Save</Button>
                <Button onClick={props.onSave} autoFocus>Save</Button>
            </DialogActions>
        </Dialog>
    );
}