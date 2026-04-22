import type { Handle } from './Handle.ts';
import type { DragContext } from '../hooks/useHandleDrag.ts';
import { type CurveNode3, makeCurveNodeValid3, changeCollinearTangentEndByDeltaXY3 } from '../geometry/curveNode.ts';

export function createTangentHandle(
    index: number,
    updateNode: (i: number, u: (prev: CurveNode3) => CurveNode3) => void,
    tangentKey: 'tangentEnd1' | 'tangentEnd2',
    symmetric: boolean = false,
): Handle {
    return {
        onDrag: (ctx: DragContext) => {
            updateNode(index, (prev) => (
                changeCollinearTangentEndByDeltaXY3(prev, tangentKey, ctx.delta, symmetric)
            ));
        },
        onDragEnd: () => {
            updateNode(index, (prev) => (
                makeCurveNodeValid3(prev)
            ));
        }
    };
}