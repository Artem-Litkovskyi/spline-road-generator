import { useMemo } from 'react';

import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

import { DialogContentWithGap, DialogHeaderWithIcon } from '../MuiWrappers.tsx';
import { ColorPicker } from '../inputs/ColorPicker.tsx';
import { FilenameAndExtensionInput } from '../inputs/FilenameAndExtensionInput.tsx';
import { NumberInput } from '../inputs/NumberInput.tsx';

import { MeshPreview } from '../preview/MeshPreview.tsx';

import { useProjectContext } from '../../hooks/useProjectContext.ts';

import type { ExtensionType } from '../../utils/export.ts';

type ExportDialogProps = {
    filename: string;
    extension: ExtensionType;
    samplingResolution: number;
    roadColor: string;
    setFilename: (v: string) => void;
    setExtension: (v: ExtensionType) => void;
    setSamplingResolution: (v: number) => void;
    setRoadColor: (v: string) => void;
    open: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}

export function ExportDialog(props: ExportDialogProps) {
    const projectContext = useProjectContext();

    // noinspection com.intellij.reactbuddy.ExhaustiveDepsInspection
    const { vertices, indices } = useMemo(() => (
        projectContext.generateRoadMesh(props.samplingResolution)
    ), [props.open, props.samplingResolution])

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
                    id={'export-filename-extension-input'}
                    label='Filename and Extension'
                    filename={props.filename} setFilename={props.setFilename}
                    extension={props.extension} setExtension={props.setExtension}
                />

                <NumberInput
                    id={'export-resolution-input'}
                    label='Sampling Resolution (per Curve Segment)'
                    minValue={5}
                    maxValue={100}
                    decimals={0}
                    value={props.samplingResolution}
                    setValue={props.setSamplingResolution}
                />

                {props.extension === 'svg' && (
                    <ColorPicker
                        id={'export-road-color-input'}
                        label={'Road Color'}
                        value={props.roadColor}
                        onChange={props.setRoadColor}
                    />
                )}

                {props.extension !== 'svg' && (
                    <MeshPreview vertices={vertices} indices={indices} width={348} height={250} />
                )}
            </DialogContentWithGap>

            <DialogActions>
                <Button onClick={props.onCancel}>Cancel</Button>
                <Button onClick={props.onConfirm}>Download</Button>
            </DialogActions>
        </Dialog>
    );
}