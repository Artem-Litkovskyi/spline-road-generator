import { useState } from 'react';
import { Box, Paper, Divider, Button } from '@mui/material';

import { PanelSection } from './components/MuiWrappers.tsx';

import { CurveEditor } from './components/curveEditor/CurveEditor.tsx';
import { RoadParamsSection } from './components/RoadParamsSection.tsx';
import { NodeParamsSection } from './components/NodeParamsSection.tsx';
import { type CurveNode2 } from './geometry/curves2.ts';

function App() {
    const [nodes, setNodes] = useState<CurveNode2[]>([
        {
            position: { x: 100, y: 300 },
            tangentEnd1: { x: 50, y: 400 },
            tangentEnd2: { x: 150, y: 200 },
        },
        {
            position: { x: 300, y: 300 },
            tangentEnd1: { x: 400, y: 200 },
            tangentEnd2: { x: 200, y: 400 },
        },
        {
            position: { x: 500, y: 300 },
            tangentEnd1: { x: 450, y: 400 },
            tangentEnd2: { x: 550, y: 200 },
        },
    ]);

    const updateNode = (
        index: number,
        updater: (prev: CurveNode2) => CurveNode2
    ) => {
        setNodes((prev) =>
            prev.map((node, i) =>
                i === index ? updater(node) : node
            )
        );
    }

    const addNode = (node: CurveNode2, index?: number) => {
        setNodes(prev => prev.toSpliced(index ?? prev.length, 0, node));
    }

    const removeNode = (index: number) => {
        setNodes(prev => prev.toSpliced(index, 1));
    }

    const [selectedNode, setSelectedNode] = useState<number | null>();

    const [roadWidth, setRoadWidth] = useState<number>(50);
    const [closedPath, setClosedPath] = useState<boolean>(true);

    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
            <Box sx={{ flex: 1 }}>
                <CurveEditor
                    nodes={nodes} updateNode={updateNode} addNode={addNode} removeNode={removeNode}
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
                    node={selectedNode == null ? undefined : nodes[selectedNode]}
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
