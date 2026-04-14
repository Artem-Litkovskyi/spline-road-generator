import React, { type Dispatch, type SetStateAction, useMemo, useState } from 'react';
import { ArmHandle } from './ArmHandle.tsx'
import { CurvePath } from './CurvePath.tsx';
import { PointHandle } from './PointHandle.tsx'
import { createCurveNode2, type CurveNode2 } from '../../geometry/curves2.ts';
import { createNodeHandle } from '../../handles/NodeHandle.ts';
import { createTangentHandle } from '../../handles/TangentHandle.ts';
import { useHandleDrag } from '../../hooks/useHandleDrag.ts';
import { type Transform, screenToWorld, worldToSvg } from '../../utils/svg.ts';

interface CurveEditorProps {
    nodes: CurveNode2[];
    updateNode: (index: number, updater: (prev: CurveNode2) => CurveNode2) => void;
    addNode: (node: CurveNode2, index?: number) => void;
    removeNode: (index: number) => void;
    selectedNode: number | null | undefined;
    setSelectedNode: Dispatch<SetStateAction<number | null | undefined>>;
    closedPath: boolean;
}

export function CurveEditor(
    { nodes, updateNode, addNode, removeNode, selectedNode, setSelectedNode, closedPath }: CurveEditorProps
) {
    const [svg, setSvg] = useState<SVGSVGElement | null>(null);

    // Coordinates convertion
    const [transform, _] = useState<Transform>({
        scale: 2,
        offsetX: 0,
        offsetY: 0,
    });

    const convertedNodes = useMemo(() => {
        if (!svg) return nodes;

        return nodes.map(node => ({
            position: worldToSvg(node.position.x, node.position.y, transform, svg.clientHeight),
            tangentEnd1: worldToSvg(node.tangentEnd1.x, node.tangentEnd1.y, transform, svg.clientHeight),
            tangentEnd2: worldToSvg(node.tangentEnd2.x, node.tangentEnd2.y, transform, svg.clientHeight),
        }));
    }, [nodes, svg, transform]);

    // Drag handling
    const { onHandleDragStart, onHandleDrag, onHandleDragEnd } = useHandleDrag(svg, transform);

    const onCanvasDragStart = (e: React.MouseEvent<SVGSVGElement>) => {
        if (!svg) return;

        const p = screenToWorld(e.clientX, e.clientY, svg, transform);

        addNode(createCurveNode2(p.x, p.y));
        setSelectedNode(nodes.length);
        onHandleDragStart(createTangentHandle(nodes.length, updateNode, 'tangentEnd2', true), e);
    }

    const onPathDragStart = (index: number, e: React.MouseEvent<SVGElement>) => {
        if (!svg) return;

        const p = screenToWorld(e.clientX, e.clientY, svg, transform);

        addNode(createCurveNode2(p.x, p.y), index);
        setSelectedNode(index);
        onHandleDragStart(createTangentHandle(index, updateNode, 'tangentEnd2', true), e);
    }

    // Key press handling
    const handleKeyDown = (e: React.KeyboardEvent<SVGSVGElement>) => {
        if (e.key !== 'Backspace' && e.key !== 'Delete') return;
        if (nodes.length <= 2 || selectedNode == null) return;

        e.preventDefault();

        removeNode(selectedNode);
        setSelectedNode(null);
    }

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
                    nodes={[n0, convertedNodes[i+1]]}
                    onMouseDown={(e) => onPathDragStart(i+1, e)}
                />
            ))}

            {closedPath && (
                <CurvePath
                    key={nodes.length - 1}
                    className={'curve-path closed'}
                    nodes={[convertedNodes[nodes.length - 1], convertedNodes[0]]}
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
                        </>
                    )}

                    <PointHandle
                        className={`node-handle ${index === selectedNode ? 'selected' : ''}`}
                        origin={node.position}
                        onMouseDown={(e) => onHandleDragStart(
                            createNodeHandle(index, setSelectedNode, updateNode), e)}
                    />
                </g>
            ))}
        </svg>
    );
}
