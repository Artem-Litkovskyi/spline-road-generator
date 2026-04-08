import React, { useState } from 'react';
import type { CurveNode2 } from '../utils/curves.ts';
import { CurvePath } from './CurvePath';
import { useHandleDrag } from '../hooks/useHandleDrag.ts';
import { PointHandle } from './handles/PointHandle.tsx'
import { ArmHandle } from './handles/ArmHandle.tsx'
import { createNodeHandle } from '../handles/NodeHandle.ts';
import { createTangentHandle } from '../handles/TangentHandle.ts';

export const CurveEditor: React.FC = () => {
    const [node1, setNode1] = useState<CurveNode2>({
        position: { x: 100, y: 300 },
        tangentEnd1: { x: 50, y: 400 },
        tangentEnd2: { x: 150, y: 200 },
    });

    const [node2, setNode2] = useState<CurveNode2>({
        position: { x: 300, y: 300 },
        tangentEnd1: { x: 400, y: 200 },
        tangentEnd2: { x: 200, y: 400 },
    });

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
            <CurvePath node1={node1} node2={node2} className={'curve-path'} />

            <PointHandle
                origin={node1.position}
                className={'node-handle'}
                onMouseDown={(e) => onMouseDown(createNodeHandle(setNode1), e)}
            />

            <PointHandle
                origin={node2.position}
                className={'node-handle'}
                onMouseDown={(e) => onMouseDown(createNodeHandle(setNode2), e)}
            />

            <ArmHandle
                origin={node1.position}
                end={node1.tangentEnd1}
                className={'tangent-handle'}
                onMouseDown={(e) => onMouseDown(createTangentHandle(setNode1, 'tangentEnd1'), e)}
            />

            <ArmHandle
                origin={node1.position}
                end={node1.tangentEnd2}
                className={'tangent-handle'}
                onMouseDown={(e) => onMouseDown(createTangentHandle(setNode1, 'tangentEnd2'), e)}
            />

            <ArmHandle
                origin={node2.position}
                end={node2.tangentEnd1}
                className={'tangent-handle'}
                onMouseDown={(e) => onMouseDown(createTangentHandle(setNode2, 'tangentEnd1'), e)}
            />

            <ArmHandle
                origin={node2.position}
                end={node2.tangentEnd2}
                className={'tangent-handle'}
                onMouseDown={(e) => onMouseDown(createTangentHandle(setNode2, 'tangentEnd2'), e)}
            />
        </svg>
    );
};