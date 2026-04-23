import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

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
            <DialogTitle id='confirm-discard-dialog-title'>
                Project has been modified
            </DialogTitle>

            <DialogContent>
                <DialogContentText id='confirm-discard-dialog-description'>
                    Do you want to save the changes you made?
                    <br/>
                    Your changes will be lost if you don't save them.
                </DialogContentText>
            </DialogContent>

            <DialogActions>
                <Button onClick={props.onCancel}>Cancel</Button>
                <Button onClick={props.onDontSave}>Don't Save</Button>
                <Button onClick={props.onSave} autoFocus>Save</Button>
            </DialogActions>
        </Dialog>
    );
}