import { Box, AppBar, Typography } from '@mui/material';

import { ProjectToolbar } from './components/appBar/ProjectToolbar.tsx';
import { ThemeSwitch } from './components/appBar/ThemeSwitch.tsx';
import { CurveEditor } from './components/curveEditor/CurveEditor.tsx';
import { RightPanel } from './components/rightPanel/RightPanel.tsx';

import { useProjectState } from './hooks/useProjectState.ts';
import { ProjectContext } from './hooks/useProjectContext.ts';

function App() {
    const projectState = useProjectState();

    return (
        <ProjectContext.Provider value={projectState}>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
                <AppBar position='static'>
                    <ProjectToolbar />
                    <Typography>{projectState.filename}</Typography>
                    <ThemeSwitch />
                </AppBar>

                <Box sx={{ display: 'flex', flex: 1, minHeight: 0 }}>
                    <Box sx={{ flex: 1 }}>
                        <CurveEditor />
                    </Box>

                    <RightPanel />
                </Box>
            </Box>
        </ProjectContext.Provider>
    )
}

export default App
