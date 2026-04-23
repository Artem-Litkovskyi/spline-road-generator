import { Divider, Paper } from '@mui/material';

import { RoadParamsSection } from './RoadParamsSection.tsx';
import { NodeParamsSection } from './NodeParamsSection.tsx';
import { ExportSection } from './ExportSection.tsx';

export function RightPanel() {
    return (
        <Paper sx={{ width: 350, display: 'flex', flexDirection: 'column' }} elevation={1} square>
            <RoadParamsSection />
            <Divider />
            <NodeParamsSection />
            <Divider />
            <ExportSection />
        </Paper>
    )
}