import type { Dispatch, SetStateAction } from 'react';
import type { DragContext, Handle } from './Handle.ts';
import type { CurveNode2 } from '../geometry/curves2.ts';
import { add2 } from '../geometry/vec2.ts';

export function createNodeHandle(
    index: number,
    setSelectedNode: Dispatch<SetStateAction<number | null | undefined>>,
    updateNode: (i: number, u: (prev: CurveNode2) => CurveNode2) => void,
): Handle {
    return {
        onMouseDown: () => {
            setSelectedNode(index);
        },
        onDrag: (ctx: DragContext) => {
            updateNode(index, (prev) => ({
                position: add2(prev.position, ctx.delta),
                tangentEnd1: add2(prev.tangentEnd1, ctx.delta),
                tangentEnd2: add2(prev.tangentEnd2, ctx.delta),
            }));
        },
    };
}