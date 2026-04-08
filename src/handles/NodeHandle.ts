import type { DragContext, Handle } from './Handle.ts';
import type { CurveNode2 } from '../utils/curves.ts';
import { add2 } from '../utils/vec2.ts';

export function createNodeHandle(
    setNode: (updater: (prev: CurveNode2) => CurveNode2) => void
): Handle {
    return {
        onDrag: (ctx: DragContext) => {
            setNode((prev) => ({
                position: add2(prev.position, ctx.delta),
                tangentEnd1: add2(prev.tangentEnd1, ctx.delta),
                tangentEnd2: add2(prev.tangentEnd2, ctx.delta),
            }));
        },
    };
}