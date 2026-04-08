import React, { useState } from 'react';
import type { CurveNode2 } from '../utils/curves.ts';
import { CurvePath } from './CurvePath';
import { useHandleDrag } from '../hooks/useHandleDrag.ts';
import { PointHandle } from './handles/PointHandle.tsx'
import { ArmHandle } from './handles/ArmHandle.tsx'
import { createNodeHandle } from '../handles/NodeHandle.ts';
import { createTangentHandle } from '../handles/TangentHandle.ts';

export const CurveEditor: React.FC = () => {
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

    const { onMouseDown, onMouseMove, onMouseUp } = useHandleDrag();

    return (
        <svg
            width='800'
            height='600'
            className={'curve-editor'}
            style={{ border: '1px solid #ccc' }}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
        >
            <CurvePath nodes={nodes} className={'curve-path'} />

            {nodes.map((node, index) => (
                <g key={index}>
                    <PointHandle
                        origin={node.position}
                        className={'node-handle'}
                        onMouseDown={(e) => onMouseDown(createNodeHandle(updateNode, index), e)}
                    />

                    <ArmHandle
                        origin={node.position}
                        end={node.tangentEnd1}
                        className={'tangent-handle'}
                        onMouseDown={(e) => onMouseDown(createTangentHandle(updateNode, index, 'tangentEnd1'), e)}
                    />

                    <ArmHandle
                        origin={node.position}
                        end={node.tangentEnd2}
                        className={'tangent-handle'}
                        onMouseDown={(e) => onMouseDown(createTangentHandle(updateNode, index, 'tangentEnd2'), e)}
                    />
                </g>
            ))}
        </svg>
    );
};