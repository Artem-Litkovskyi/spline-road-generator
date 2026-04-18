import React, { type Dispatch, type SetStateAction, useMemo, useState } from 'react';

import { ArmHandle } from './ArmHandle.tsx'
import { ArrowUpHandle } from './ArrowUpHandle.tsx';
import { CurvePath } from './CurvePath.tsx';
import { PointHandle } from './PointHandle.tsx'
import { RotateHorizontalHandle } from './RotateHorizontalHandle.tsx';

import { type CurveNode2, type CurveNode3, createCurveNode3 } from '../../geometry/curveNode.ts';

import { createPosXYHandle } from '../../handles/PosXYHandle.ts';
import { createPosZHandle } from '../../handles/PosZHandle.ts';
import { createTangentHandle } from '../../handles/TangentHandle.ts';
import { useHandleDrag } from '../../hooks/useHandleDrag.ts';

import { createVec3 } from '../../geometry/vec3.ts';
import { type SVGCanvasTransform, screenToWorld, worldToSvg } from '../../utils/svg.ts';
import { createPitchHandle } from '../../handles/PitchHandle.ts';

interface CurveEditorProps {
    curveNodes: CurveNode3[];
    updateNode: (index: number, updater: (prev: CurveNode3) => CurveNode3) => void;
    addNode: (node: CurveNode3, index?: number) => void;
    removeNode: (index: number) => void;
    selectedNode: number | null | undefined;
    setSelectedNode: Dispatch<SetStateAction<number | null | undefined>>;
    closedPath: boolean;
}

export function CurveEditor(
    { curveNodes, updateNode, addNode, removeNode, selectedNode, setSelectedNode, closedPath }: CurveEditorProps
) {
    const [svg, setSvg] = useState<SVGSVGElement | null>(null);

    // Coordinates convertion
    const [svgCanvasTransform, _] = useState<SVGCanvasTransform>({
        scale: 2,
        offsetX: 0,
        offsetY: 0,
    });

    const convertedNodes = useMemo(() => {
        if (!svg) return curveNodes;

        return curveNodes.map((n: CurveNode3): CurveNode2 => ({
            position: worldToSvg(n.position.x, n.position.y, svg.clientHeight, svgCanvasTransform),
            tangentEnd1: worldToSvg(n.tangentEnd1.x, n.tangentEnd1.y, svg.clientHeight, svgCanvasTransform),
            tangentEnd2: worldToSvg(n.tangentEnd2.x, n.tangentEnd2.y, svg.clientHeight, svgCanvasTransform),
        }));
    }, [curveNodes, svg, svgCanvasTransform]);

    // Drag handling
    const { onHandleDragStart, onHandleDrag, onHandleDragEnd } = useHandleDrag(svg, svgCanvasTransform);

    const onCanvasDragStart = (e: React.MouseEvent<SVGSVGElement>) => {
        if (!svg) return;

        const xy = screenToWorld(e.clientX, e.clientY, svg, svgCanvasTransform);
        const z = curveNodes[curveNodes.length - 1].position.z;

        addNode(createCurveNode3(createVec3(xy, z)));
        setSelectedNode(curveNodes.length);
        onHandleDragStart(createTangentHandle(curveNodes.length, updateNode, 'tangentEnd2', true), e);
    }

    const onPathDragStart = (index: number, e: React.MouseEvent<SVGElement>) => {
        if (!svg) return;

        const xy = screenToWorld(e.clientX, e.clientY, svg, svgCanvasTransform);
        const z = curveNodes[index - 1].position.z;

        addNode(createCurveNode3(createVec3(xy, z)), index);
        setSelectedNode(index);
        onHandleDragStart(createTangentHandle(index, updateNode, 'tangentEnd2', true), e);
    }

    // Key press handling
    const handleKeyDown = (e: React.KeyboardEvent<SVGSVGElement>) => {
        if (e.key !== 'Backspace' && e.key !== 'Delete') return;
        if (curveNodes.length <= 2 || selectedNode == null) return;

        e.preventDefault();

        removeNode(selectedNode);
        setSelectedNode(null);
    }

    // Visual feedback
    const [handleOffsetY, setHandleOffsetY] = useState<number>(0);
    const [handleRotation, setHandleRotation] = useState<number>(0);

    return (
        <svg
            ref={setSvg}
            className={'curve-editor'}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onMouseDown={(e) => {
                e.currentTarget.focus();
                onCanvasDragStart(e);
            }}
            onMouseMove={onHandleDrag}
            onMouseUp={onHandleDragEnd}
        >
            {convertedNodes.slice(0, -1).map((n0, i) => (
                <CurvePath
                    key={i}
                    className={'curve-path'}
                    curveNodes={[n0, convertedNodes[i+1]]}
                    onMouseDown={(e) => onPathDragStart(i+1, e)}
                />
            ))}

            {closedPath && (
                <CurvePath
                    key={curveNodes.length - 1}
                    className={'curve-path closed'}
                    curveNodes={[convertedNodes[curveNodes.length - 1], convertedNodes[0]]}
                    onMouseDown={(e) => onPathDragStart(curveNodes.length, e)}
                />
            )}

            {convertedNodes.map((node, index) => (
                <g key={index}>
                    {index === selectedNode && (
                        <>
                            <ArmHandle
                                className={'tangent-handle'}
                                origin={node.position}
                                end={node.tangentEnd1}
                                onMouseDown={(e) => onHandleDragStart(
                                    createTangentHandle(index, updateNode, 'tangentEnd1'), e)}
                            />

                            <ArmHandle
                                className={'tangent-handle'}
                                origin={node.position}
                                end={node.tangentEnd2}
                                onMouseDown={(e) => onHandleDragStart(
                                    createTangentHandle(index, updateNode, 'tangentEnd2'), e)}
                            />

                            <ArrowUpHandle
                                className={'pos-z-handle'}
                                origin={node.position}
                                offsetY={handleOffsetY}
                                onMouseDown={(e) => onHandleDragStart(
                                    createPosZHandle(
                                        index, updateNode, 0.25,
                                        setHandleOffsetY, 0.1, 10
                                    ), e)}
                            />

                            <RotateHorizontalHandle
                                className={'pitch-handle'}
                                origin={node.position}
                                rotation={handleRotation}
                                onMouseDown={(e) => onHandleDragStart(
                                    createPitchHandle(
                                        index, updateNode, 0.5,
                                        setHandleRotation, 0.5, 10
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
    );
}
