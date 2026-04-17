import { useState } from 'react';
import { Box, Paper, Divider, Button } from '@mui/material';

import { PanelSection } from './components/MuiWrappers.tsx';

import { CurveEditor } from './components/curveEditor/CurveEditor.tsx';
import { RoadParamsSection } from './components/RoadParamsSection.tsx';
import { NodeParamsSection } from './components/NodeParamsSection.tsx';
import { type CurveNode3 } from './geometry/curveNode.ts';

function App() {
    const [curveNodes, setCurveNodes] = useState<CurveNode3[]>([
        {
            position: { x: 100, y: 200, z: 0 },
            tangentEnd1: { x: 50, y: 300, z: 0 },
            tangentEnd2: { x: 150, y: 100, z: 0 },
        },
        {
            position: { x: 300, y: 200, z: 0 },
            tangentEnd1: { x: 400, y: 100, z: 0 },
            tangentEnd2: { x: 200, y: 300, z: 0 },
        },
        {
            position: { x: 500, y: 200, z: 0 },
            tangentEnd1: { x: 450, y: 300, z: 0 },
            tangentEnd2: { x: 550, y: 100, z: 0 },
        },
    ]);

    const updateNode = (
        index: number,
        updater: (prev: CurveNode3) => CurveNode3
    ) => {
        setCurveNodes((prev) =>
            prev.map((node, i) =>
                i === index ? updater(node) : node
            )
        );
    }

    const addNode = (node: CurveNode3, index?: number) => {
        setCurveNodes(prev => prev.toSpliced(index ?? prev.length, 0, node));
    }

    const removeNode = (index: number) => {
        setCurveNodes(prev => prev.toSpliced(index, 1));
    }

    const [selectedNode, setSelectedNode] = useState<number | null>();

    const [roadWidth, setRoadWidth] = useState<number>(50);
    const [closedPath, setClosedPath] = useState<boolean>(true);

    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
            <Box sx={{ flex: 1 }}>
                <CurveEditor
                    curveNodes={curveNodes} updateNode={updateNode} addNode={addNode} removeNode={removeNode}
                    selectedNode={selectedNode} setSelectedNode={setSelectedNode}
                    closedPath={closedPath}
                />
            </Box>

            <Paper sx={{ width: 350, display: 'flex', flexDirection: 'column' }} elevation={1} square>
                <RoadParamsSection
                    closedPath={closedPath} setClosedPath={setClosedPath}
                    roadWidth={roadWidth} setRoadWidth={setRoadWidth}
                />

                <Divider />

                <NodeParamsSection
                    node={selectedNode == null ? undefined : curveNodes[selectedNode]}
                    setNode={selectedNode == null ? undefined : n => updateNode(selectedNode, _ => n)}
                />

                <Divider />

                <PanelSection sx={{ mt: 'auto' }}>
                    <Button variant='contained' fullWidth>
                        Export
                    </Button>
                </PanelSection>
            </Paper>
        </Box>
    )
}

export default App
