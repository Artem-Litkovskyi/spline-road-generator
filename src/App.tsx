import { useState } from 'react';
import { Box, Paper, Divider } from '@mui/material';

import { CurveEditor } from './components/curveEditor/CurveEditor.tsx';
import { ExportSection } from './components/ExportSection.tsx';
import { NodeParamsSection } from './components/NodeParamsSection.tsx';
import { RoadParamsSection } from './components/RoadParamsSection.tsx';

import { type CurveNode3 } from './geometry/curveNode.ts';
import { generateRoadCrossSection, generateSweptSurfaceMesh } from './geometry/mesh.ts';

import { exportToGLTF, exportToOBJ, type ExtensionType } from './utils/export.ts';

function App() {
    const [closedPath, setClosedPath] = useState<boolean>(true);
    const [roadWidth, setRoadWidth] = useState<number>(12);
    const [sideHeight, setSideHeight] = useState<number>(2);

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

    const exportRoad = (filename: string, extension: ExtensionType) => {
        const { crossSection, skipPoligonIdx } = generateRoadCrossSection(roadWidth, sideHeight);
        const mesh = generateSweptSurfaceMesh(curveNodes, crossSection, 20, closedPath, skipPoligonIdx);
        switch (extension) {
            case 'obj':
                exportToOBJ(mesh.vertices, mesh.indices, filename);
                break;
            case 'gltf':
                exportToGLTF(mesh.vertices, mesh.indices, filename, false);
                break;
            case 'glb':
                exportToGLTF(mesh.vertices, mesh.indices, filename, true);
                break;
        }
    }

    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
            <Box sx={{ flex: 1 }}>
                <CurveEditor
                    curveNodes={curveNodes} updateNode={updateNode} addNode={addNode} removeNode={removeNode}
                    selectedNode={selectedNode} setSelectedNode={setSelectedNode}
                    closedPath={closedPath} roadWidth={roadWidth}
                />
            </Box>

            <Paper sx={{ width: 350, display: 'flex', flexDirection: 'column' }} elevation={1} square>
                <RoadParamsSection
                    closedPath={closedPath} setClosedPath={setClosedPath}
                    roadWidth={roadWidth} setRoadWidth={setRoadWidth}
                    sideHeight={sideHeight} setSideHeight={setSideHeight}
                />

                <Divider />

                <NodeParamsSection
                    node={selectedNode == null ? undefined : curveNodes[selectedNode]}
                    setNode={selectedNode == null ? undefined : n => updateNode(selectedNode, _ => n)}
                />

                <Divider />

                <ExportSection onSubmit={exportRoad} />
            </Paper>
        </Box>
    )
}

export default App
