import React, { useMemo, useState } from 'react';
import { Box, Fab, Tooltip } from '@mui/material';
import CropFreeIcon from '@mui/icons-material/CropFree';

import { ArmHandle } from './handles/ArmHandle.tsx'
import { ArrowUpHandle } from './handles/ArrowUpHandle.tsx';
import { PointHandle } from './handles/PointHandle.tsx'
import { RotateHorizontalHandle } from './handles/RotateHorizontalHandle.tsx';
import { CurvePath } from './CurvePath.tsx';

import { createPitchHandle } from '../../handles/PitchHandle.ts';
import { createPosXYHandle } from '../../handles/PosXYHandle.ts';
import { createPosZHandle } from '../../handles/PosZHandle.ts';
import { createTangentHandle } from '../../handles/TangentHandle.ts';
import { CurveEditorControlHints } from './CurveEditorControlHints.tsx';
import { CurveEditorGrid } from './CurveEditorGrid.tsx';

import { useHandleDrag } from '../../hooks/useHandleDrag.ts';
import { usePanZoom } from '../../hooks/usePanZoom.ts';
import { useProjectContext } from '../../hooks/useProjectContext.ts';

import { createCurveNode3, getCurveBoundingBox3 } from '../../geometry/curveNode.ts';
import { createVec3 } from '../../geometry/vec3.ts';

import { curveWorldToSvg, getFitPanZoom, screenToWorld } from '../../utils/svg.ts';

export function CurveEditor() {
    const {
        project: { closedPath, roadWidth, curveNodes },
        selectedNode,
        setSelectedNode,
        updateNode,
        addNode,
        removeNode,
    } = useProjectContext();

    const [svg, setSvg] = useState<SVGSVGElement | null>(null);

    // Pan and zoom handling
    const { panZoom, setPanZoom, bind: panZoomBind } = usePanZoom(svg);

    const fitToScreen = () => {
        if (!svg) return;
        const { min, max } = getCurveBoundingBox3(curveNodes);
        setPanZoom(getFitPanZoom(min.x, min.y, max.x, max.y, svg.clientWidth, svg.clientHeight, roadWidth));
    }

    // Coordinates convertion
    const convertedNodes = useMemo(() => {
        if (!svg) return curveNodes;
        return curveWorldToSvg(curveNodes, svg.clientHeight, panZoom);
    }, [curveNodes, svg, panZoom]);

    // Drag handling
    const { onHandleDragStart, bind: handleDragBind } = useHandleDrag(svg, panZoom);

    const onCanvasDragStart = (e: React.MouseEvent<SVGSVGElement>) => {
        if (!svg || e.button !== 0) return;

        const xy = screenToWorld(e.clientX, e.clientY, svg, panZoom);
        const z = curveNodes[curveNodes.length - 1].position.z;

        addNode(createCurveNode3(createVec3(xy, z)));
        setSelectedNode(curveNodes.length);
        onHandleDragStart(createTangentHandle(curveNodes.length, updateNode, 'tangentEnd2', true), e);
    }

    const onPathDragStart = (index: number, e: React.MouseEvent<SVGElement>) => {
        if (!svg) return;

        const xy = screenToWorld(e.clientX, e.clientY, svg, panZoom);
        const z = curveNodes[index - 1].position.z;

        addNode(createCurveNode3(createVec3(xy, z)), index);
        setSelectedNode(index);
        onHandleDragStart(createTangentHandle(index, updateNode, 'tangentEnd2', true), e);
    }

    // Key press handling
    const onKeyDown = (e: React.KeyboardEvent<SVGSVGElement>) => {
        if (e.key !== 'Backspace' && e.key !== 'Delete') return;
        if (curveNodes.length <= 2 || selectedNode == null) return;

        e.preventDefault();

        removeNode(selectedNode);
        setSelectedNode(null);
    }

    // Visual feedback
    const [handleOffsetY, setHandleOffsetY] = useState(0);
    const [posZHandleSelected, setPosZHandleSelected] = useState(false);

    const [handleRotation, setHandleRotation] = useState(0);
    const [pitchHandleSelected, setPitchHandleSelected] = useState(false);

    return (
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ position: 'relative', flex: 1 }}>
                <svg
                    ref={setSvg}
                    className={'curve-editor'}
                    tabIndex={0}
                    onKeyDown={onKeyDown}
                    onMouseDown={(e) => {
                        e.currentTarget.focus();
                        panZoomBind.onMouseDown(e);
                        onCanvasDragStart(e);
                    }}
                    onMouseMove={(e) => {
                        panZoomBind.onMouseMove(e);
                        handleDragBind.onMouseMove(e);
                    }}
                    onMouseUp={() => {
                        panZoomBind.onMouseUp();
                        handleDragBind.onMouseUp();
                        setPosZHandleSelected(false);
                        setPitchHandleSelected(false);
                    }}
                    onMouseLeave={() => {
                        panZoomBind.onMouseLeave();
                        handleDragBind.onMouseLeave();
                        setPosZHandleSelected(false);
                        setPitchHandleSelected(false);
                    }}
                    onWheel={panZoomBind.onWheel}
                    onContextMenu={(e) => e.preventDefault()}
                >
                    {svg && (
                        <CurveEditorGrid
                            className={'curve-editor-grid'}
                            canvasWidth={svg.clientWidth}
                            canvasHeight={svg.clientHeight}
                            panZoom={panZoom}
                            spacing={panZoom.zoom > 2 ? 10 : 100}
                        />
                    )}

                    {convertedNodes.slice(0, -1).map((n0, i) => (
                        <>
                            <CurvePath
                                key={`section-${i}`}
                                className={'curve-path'}
                                curveNodes={[n0, convertedNodes[i+1]]}
                                curveWidth={roadWidth * panZoom.zoom}
                                onMouseDown={(e) => onPathDragStart(i+1, e)}
                            />

                            {i !== 0 && (
                                <circle
                                    key={`connector-${i}`}
                                    className={'curve-path-connector'}
                                    cx={n0.position.x}
                                    cy={n0.position.y}
                                    r={roadWidth * panZoom.zoom / 2}
                                />
                            )}
                        </>
                    ))}

                    {closedPath && (
                        <CurvePath
                            key={`section-${curveNodes.length - 1}`}
                            className={'curve-path closed'}
                            curveNodes={[convertedNodes[curveNodes.length - 1], convertedNodes[0]]}
                            curveWidth={roadWidth * panZoom.zoom}
                            onMouseDown={(e) => onPathDragStart(curveNodes.length, e)}
                        />
                    )}

                    {convertedNodes.map((node, index) => (
                        <g key={index}>
                            {panZoom.zoom > 0.5 && (
                                <text
                                    className={'node-label'}
                                    x={node.position.x + 20}
                                    y={node.position.y + 5}
                                >
                                    height: {Math.round(curveNodes[index].position.z)}
                                </text>
                            )}

                            {index === selectedNode && (
                                <>
                                    <ArmHandle
                                        className={'tangent-handle'}
                                        label={'1'}
                                        origin={node.position}
                                        end={node.tangentEnd1}
                                        onMouseDown={(e) => onHandleDragStart(
                                            createTangentHandle(index, updateNode, 'tangentEnd1'), e)}
                                    />

                                    <ArmHandle
                                        className={'tangent-handle'}
                                        label={'2'}
                                        origin={node.position}
                                        end={node.tangentEnd2}
                                        onMouseDown={(e) => onHandleDragStart(
                                            createTangentHandle(index, updateNode, 'tangentEnd2'), e)}
                                    />

                                    <ArrowUpHandle
                                        className={`pos-z-handle ${posZHandleSelected && 'selected'}`}
                                        origin={node.position}
                                        offsetY={handleOffsetY}
                                        onMouseDown={(e) => onHandleDragStart(
                                            createPosZHandle(
                                                index, updateNode, 0.25,
                                                setHandleOffsetY, 0.1, 10,
                                                setPosZHandleSelected,
                                            ), e)}
                                    />

                                    <RotateHorizontalHandle
                                        className={`pitch-handle ${pitchHandleSelected && 'selected'}`}
                                        origin={node.position}
                                        rotation={handleRotation}
                                        onMouseDown={(e) => onHandleDragStart(
                                            createPitchHandle(
                                                index, updateNode, 0.5,
                                                setHandleRotation, 0.5, 10,
                                                setPitchHandleSelected,
                                            ), e)}
                                    />
                                </>
                            )}

                            <PointHandle
                                className={`pos-xy-handle ${index === selectedNode ? 'selected' : ''}`}
                                origin={node.position}
                                onMouseDown={(e) => onHandleDragStart(
                                    createPosXYHandle(index, setSelectedNode, updateNode), e)}
                            />
                        </g>
                    ))}
                </svg>

                <Tooltip title='Fit to Screen'>
                    <Fab
                        color='primary'
                        size='small'
                        sx={{ position: 'absolute', bottom: 16, right: 16 }}
                        onClick={fitToScreen}
                    >
                        <CropFreeIcon />
                    </Fab>
                </Tooltip>
            </Box>

            <CurveEditorControlHints zoom={panZoom.zoom} />
        </Box>
    );
}
