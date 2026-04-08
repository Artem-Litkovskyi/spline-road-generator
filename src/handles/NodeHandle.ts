import type { DragContext, Handle } from './Handle.ts';
import type { CurveNode2 } from '../utils/curves.ts';
import { add2 } from '../utils/vec2.ts';

export function createNodeHandle(
    updateNode: (i: number, u: (prev: CurveNode2) => CurveNode2) => void,
    index: number
): Handle {
    return {
        onDrag: (ctx: DragContext) => {
            updateNode(index, (prev) => ({
                position: add2(prev.position, ctx.delta),
                tangentEnd1: add2(prev.tangentEnd1, ctx.delta),
                tangentEnd2: add2(prev.tangentEnd2, ctx.delta),
            }));
        },
    };
}