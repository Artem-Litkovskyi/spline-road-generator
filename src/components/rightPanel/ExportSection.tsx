import { useState } from 'react';
import { Button } from '@mui/material';

import { PanelSection } from '../MuiWrappers.tsx';
import { ExportDialog } from './ExportDialog.tsx';

import { useProjectContext } from '../../hooks/useProjectContext.ts';

import type { ExtensionType } from '../../utils/export.ts';

export function ExportSection() {
    const projectContext = useProjectContext();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [filename, setFilename] = useState(projectContext.filename);
    const [extension, setExtension] = useState<ExtensionType>('obj');
    const [resolution, setResolution] = useState(20);
    const [roadColor, setRoadColor] = useState('#3c3c3c');

    const handleOpen = () => {
        setFilename(projectContext.filename);
        setDialogOpen(true);
    };

    const handleCancel = () => {
        setDialogOpen(false);
    };

    const handleConfirm = () => {
        if (extension === 'svg') {
            projectContext.exportProject2D(filename, extension, roadColor);
        } else {
            projectContext.exportProject3D(filename, extension, resolution);
        }
        
        setDialogOpen(false);
    };

    return (
        <PanelSection sx={{ mt: 'auto' }}>
            <Button variant='contained' fullWidth onClick={handleOpen}>
                Export
            </Button>
            <ExportDialog
                filename={filename}
                extension={extension}
                resolution={resolution}
                roadColor={roadColor}
                setFilename={setFilename}
                setExtension={setExtension}
                setResolution={setResolution}
                setRoadColor={setRoadColor}
                open={dialogOpen}
                onCancel={handleCancel}
                onConfirm={handleConfirm}
            />
        </PanelSection>
    );
}