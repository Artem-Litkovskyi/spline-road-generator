import type { DragContext, Handle } from './Handle.ts';
import { type CurveNode2, makeCurveNodeValid2, setCurveNodeTangent2 } from '../geometry/curves2.ts';
import { add2 } from '../geometry/vec2.ts';

export function createTangentHandle(
    index: number,
    updateNode: (i: number, u: (prev: CurveNode2) => CurveNode2) => void,
    tangentKey: 'tangentEnd1' | 'tangentEnd2',
    symmetric: boolean = false,
): Handle {
    return {
        onDrag: (ctx: DragContext) => {
            updateNode(index, (prev) => (
                setCurveNodeTangent2(prev, tangentKey, add2(prev[tangentKey], ctx.delta), symmetric)
            ));
        },
        onDragEnd: () => {
            updateNode(index, (prev) => (
                makeCurveNodeValid2(prev)
            ));
        }
    };
}