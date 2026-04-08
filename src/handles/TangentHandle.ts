import type { DragContext, Handle } from './Handle.ts';
import type { CurveNode2 } from '../utils/curves.ts';
import { add2, scale2, magnitude2, normalize2 } from '../utils/vec2.ts';

export function createTangentHandle(
    setNode: (updater: (prev: CurveNode2) => CurveNode2) => void,
    tangentKey: 'tangentEnd1' | 'tangentEnd2'
): Handle {
    return {
        onDrag: (ctx: DragContext) => {
            setNode((prev) => {
                const otherKey =
                    tangentKey === 'tangentEnd1'
                        ? 'tangentEnd2'
                        : 'tangentEnd1';

                const newTangentEnd = add2(prev[tangentKey], ctx.delta);

                const dir = normalize2({
                    x: newTangentEnd.x - prev.position.x,
                    y: newTangentEnd.y - prev.position.y,
                });

                const otherLength = magnitude2({
                    x: prev[otherKey].x - prev.position.x,
                    y: prev[otherKey].y - prev.position.y,
                });

                const newOtherTangentEnd = add2(
                    prev.position,
                    scale2(dir, -otherLength)
                );

                return {
                    ...prev,
                    [tangentKey]: newTangentEnd,
                    [otherKey]: newOtherTangentEnd,
                };
            });
        },
    };
}