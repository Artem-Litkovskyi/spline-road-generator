import React, { useEffect, useState } from 'react';
import { createCurveNode2, type CurveNode2 } from '../utils/curves.ts';
import { CurvePath } from './CurvePath';
import { useHandleDrag } from '../hooks/useHandleDrag.ts';
import { PointHandle } from './handles/PointHandle.tsx'
import { ArmHandle } from './handles/ArmHandle.tsx'
import { createNodeHandle } from '../handles/NodeHandle.ts';
import { createTangentHandle } from '../handles/TangentHandle.ts';
import { getRootSVG, getSVGPoint } from '../utils/svg.ts';

export const CurveEditor: React.FC = () => {
    // NODES ARRAY
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

    // NODES INTERACTION
    const [selectedNode, setSelectedNode] = useState<number | null>();

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
            width='800'
            height='600'
            className={'curve-editor'}
            style={{ border: '1px solid #ccc' }}
            onMouseDown={onCanvasDragStart}
            onMouseMove={onHandleDrag}
            onMouseUp={onHandleDragEnd}
        >
            {nodes.slice(0, -1).map((n0, i) => (
                <CurvePath
                    nodes={[n0, nodes[i+1]]}
                    className={'curve-path'}
                    onMouseDown={(e) => onPathDragStart(i+1, e)}
                />
            ))}

            {nodes.map((node, index) => (
                <g key={index}>
                    {index === selectedNode && (
                        <>
                            <ArmHandle
                                origin={node.position}
                                end={node.tangentEnd1}
                                className={'tangent-handle'}
                                onMouseDown={(e) => onHandleDragStart(
                                    createTangentHandle(index, updateNode, 'tangentEnd1'), e)}
                            />

                            <ArmHandle
                                origin={node.position}
                                end={node.tangentEnd2}
                                className={'tangent-handle'}
                                onMouseDown={(e) => onHandleDragStart(
                                    createTangentHandle(index, updateNode, 'tangentEnd2'), e)}
                            />
                        </>
                    )}

                    <PointHandle
                        origin={node.position}
                        className={`node-handle ${index === selectedNode ? 'selected' : ''}`}
                        onMouseDown={(e) => onHandleDragStart(
                            createNodeHandle(index, setSelectedNode, updateNode), e)}
                    />
                </g>
            ))}
        </svg>
    );
};