import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

import { DialogContentWithGap, DialogHeaderWithIcon } from '../MuiWrappers.tsx';
import { CustomInput } from '../inputs/CustomInput.tsx';
import { FilenameAndExtensionInput } from '../inputs/FilenameAndExtensionInput.tsx';

import type { ExtensionType } from '../../utils/export.ts';
import { ColorPicker } from '../inputs/ColorPicker.tsx';

type ExportDialogProps = {
    filename: string;
    extension: ExtensionType;
    resolution: number;
    roadColor: string;
    setFilename: (v: string) => void;
    setExtension: (v: ExtensionType) => void;
    setResolution: (v: number) => void;
    setRoadColor: (v: string) => void;
    open: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}

export function ExportDialog(props: ExportDialogProps) {
    return (
        <Dialog
            open={props.open}
            onClose={props.onCancel}
            aria-labelledby='export-dialog-title'
            role='alertdialog'
        >
            <DialogHeaderWithIcon>
                <FileDownloadIcon className='dialog-with-icon' />
                <DialogTitle className='dialog-with-icon' id='export-dialog-title'>
                    Export Project
                </DialogTitle>
            </DialogHeaderWithIcon>

            <DialogContentWithGap>
                <FilenameAndExtensionInput
                    label='Filename and Format'
                    filename={props.filename} setFilename={props.setFilename}
                    extension={props.extension} setExtension={props.setExtension}
                />

                {props.extension === 'svg' ? (
                    <ColorPicker
                        label={'Road Color'}
                        value={props.roadColor}
                        onChange={props.setRoadColor}
                    />
                ) : (
                    <CustomInput
                        label='Resolution (Cross-Sections per Segment)'
                        type='number'
                        placeholder='0'
                        value={props.resolution}
                        onChange={(e) => props.setResolution(
                            Math.max(5, Number(e.target.value)))}
                    />
                )}
            </DialogContentWithGap>

            <DialogActions>
                <Button onClick={props.onCancel}>Cancel</Button>
                <Button onClick={props.onConfirm}>Download</Button>
            </DialogActions>
        </Dialog>
    );
}