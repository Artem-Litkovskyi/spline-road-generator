import type { DragContext, Handle } from './Handle.ts';
import { type CurveNode3, moveCollinearTangent3, makeCurveNodeValid3 } from '../geometry/curveNode.ts';
import { add3, createVec3 } from '../geometry/vec3.ts';

export function createTangentHandle(
    index: number,
    updateNode: (i: number, u: (prev: CurveNode3) => CurveNode3) => void,
    tangentKey: 'tangentEnd1' | 'tangentEnd2',
    symmetric: boolean = false,
): Handle {
    return {
        onDrag: (ctx: DragContext) => {
            const d3 = createVec3(ctx.delta, 0);

            updateNode(index, (prev) => (
                moveCollinearTangent3(prev, tangentKey, add3(prev[tangentKey], d3), symmetric)
            ));
        },
        onDragEnd: () => {
            updateNode(index, (prev) => (
                makeCurveNodeValid3(prev)
            ));
        }
    };
}