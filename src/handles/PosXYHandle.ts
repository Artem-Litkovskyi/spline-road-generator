import type { Dispatch, SetStateAction } from 'react';
import type { DragContext, Handle } from './Handle.ts';
import { type CurveNode3, changeNodePositionByDelta3 } from '../geometry/curveNode.ts';
import { createVec3 } from '../geometry/vec3.ts';

export function createPosXYHandle(
    index: number,
    setSelectedNode: Dispatch<SetStateAction<number | null | undefined>>,
    updateNode: (i: number, u: (prev: CurveNode3) => CurveNode3) => void,
): Handle {
    return {
        onMouseDown: () => {
            setSelectedNode(index);
        },
        onDrag: (ctx: DragContext) => {
            updateNode(index, prev => changeNodePositionByDelta3(prev, createVec3(ctx.delta, 0)));
        },
    };
}