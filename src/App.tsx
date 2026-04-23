import { Box, Paper, Divider, AppBar, Toolbar } from '@mui/material';

// import { ProjectToolbar } from './components/appBar/ProjectToolbar.tsx';
import { CurveEditor } from './components/curveEditor/CurveEditor.tsx';
import { ExportSection } from './components/rightPanel/ExportSection.tsx';
import { NodeParamsSection } from './components/rightPanel/NodeParamsSection.tsx';
import { RoadParamsSection } from './components/rightPanel/RoadParamsSection.tsx';

import { useProjectState } from './hooks/useProjectState.ts';
import { ProjectContext } from './hooks/useProjectContext.ts';

function App() {
    const projectState = useProjectState();

    return (
        <ProjectContext.Provider value={projectState}>
            <AppBar position='static'>
                <Toolbar variant='dense'>
                    {/*<ProjectToolbar />*/}
                </Toolbar>
            </AppBar>

            <Box sx={{ display: 'flex', height: '100vh' }}>
                <Box sx={{ flex: 1 }}>
                    <CurveEditor />
                </Box>

                <Paper sx={{ width: 350, display: 'flex', flexDirection: 'column' }} elevation={1} square>
                    <RoadParamsSection />
                    <Divider />
                    <NodeParamsSection />
                    <Divider />
                    <ExportSection />
                </Paper>
            </Box>
        </ProjectContext.Provider>
    )
}

export default App
