import React, { type Dispatch, type SetStateAction, useEffect } from 'react';
import { createCurveNode2, type CurveNode2 } from '../../utils/curves.ts';
import { CurvePath } from './CurvePath.tsx';
import { useHandleDrag } from '../../hooks/useHandleDrag.ts';
import { PointHandle } from './PointHandle.tsx'
import { ArmHandle } from './ArmHandle.tsx'
import { createNodeHandle } from '../../handles/NodeHandle.ts';
import { createTangentHandle } from '../../handles/TangentHandle.ts';
import { getRootSVG, getSVGPoint } from '../../utils/svg.ts';

interface CurveEditorProps {
    nodes: CurveNode2[];
    updateNode: (index: number, updater: (prev: CurveNode2) => CurveNode2) => void;
    addNode: (node: CurveNode2, index?: number) => void;
    removeNode: (index: number) => void;
    selectedNode: number | null | undefined;
    setSelectedNode: Dispatch<SetStateAction<number | null | undefined>>;
}

export function CurveEditor({ nodes, updateNode, addNode, removeNode, selectedNode, setSelectedNode }: CurveEditorProps ) {
    const { onHandleDragStart, onHandleDrag, onHandleDragEnd } = useHandleDrag();

    const onCanvasDragStart = (e: React.MouseEvent<SVGSVGElement>) => {
        const p = getSVGPoint(e.currentTarget, e.clientX, e.clientY);
        addNode(createCurveNode2(p.x, p.y));
        setSelectedNode(nodes.length);
        onHandleDragStart(createTangentHandle(nodes.length, updateNode, 'tangentEnd2', true), e);
    };

    const onPathDragStart = (index: number, e: React.MouseEvent<SVGElement>) => {
        const svg = getRootSVG(e.currentTarget);

        if (!svg) return;

        const p = getSVGPoint(svg, e.clientX, e.clientY);
        addNode(createCurveNode2(p.x, p.y), index);
        setSelectedNode(index);
        onHandleDragStart(createTangentHandle(index, updateNode, 'tangentEnd2', true), e);
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key !== 'Backspace' && e.key !== 'Delete') return;
            if (nodes.length <= 2 || selectedNode == null) return;

            e.preventDefault();

            removeNode(selectedNode);
            setSelectedNode(null);
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedNode, nodes.length]);

    return (
        <svg
            className={'curve-editor'}
            onMouseDown={onCanvasDragStart}
            onMouseMove={onHandleDrag}
            onMouseUp={onHandleDragEnd}
        >
            {nodes.slice(0, -1).map((n0, i) => (
                <CurvePath
                    className={'curve-path'}
                    nodes={[n0, nodes[i+1]]}
                    onMouseDown={(e) => onPathDragStart(i+1, e)}
                />
            ))}

            {nodes.map((node, index) => (
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