import { Paper } from '@mui/material';

import { PanelSectionDivider } from '../MuiWrappers.tsx';
import { RoadParamsSection } from './RoadParamsSection.tsx';
import { NodeParamsSection } from './NodeParamsSection.tsx';
import { ExportSection } from './ExportSection.tsx';

export function RightPanel() {
    return (
        <Paper sx={{ width: 350, display: 'flex', flexDirection: 'column' }} elevation={1} square>
            <RoadParamsSection />
            <PanelSectionDivider />
            <NodeParamsSection />
            <PanelSectionDivider />
            <ExportSection />
        </Paper>
    )
}