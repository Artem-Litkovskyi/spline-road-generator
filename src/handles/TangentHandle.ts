import type { DragContext, Handle } from './Handle.ts';
import type { CurveNode2 } from '../utils/curves.ts';
import { add2, scale2, magnitude2, normalize2, diff2 } from '../utils/vec2.ts';

export function createTangentHandle(
    index: number,
    updateNode: (i: number, u: (prev: CurveNode2) => CurveNode2) => void,
    tangentKey: 'tangentEnd1' | 'tangentEnd2',
    symmetric: boolean = false,
): Handle {
    return {
        onDrag: (ctx: DragContext) => {
            updateNode(index, (prev) => {
                const otherKey =
                    tangentKey === 'tangentEnd1'
                        ? 'tangentEnd2'
                        : 'tangentEnd1';

                const newTangentEnd = add2(prev[tangentKey], ctx.delta);

                const dir = normalize2(diff2(newTangentEnd, prev.position));
                const mag = magnitude2(diff2(symmetric ? newTangentEnd : prev[otherKey], prev.position));
                const newOtherTangentEnd = add2(prev.position, scale2(dir, -mag));

                return {
                    ...prev,
                    [tangentKey]: newTangentEnd,
                    [otherKey]: newOtherTangentEnd,
                };
            });
        },
        onDragEnd: () => {
            const minMag = 10;

            updateNode(index, (prev) => {
                const isZero1 = magnitude2(diff2(prev.tangentEnd1, prev.position)) < minMag;
                const isZero2 = magnitude2(diff2(prev.tangentEnd2, prev.position)) < minMag;

                if (isZero1 && isZero2) {
                    return {
                        ...prev,
                        tangentEnd1: add2(prev.position, {x: minMag, y: 0}),
                        tangentEnd2: add2(prev.position, {x: -minMag, y: 0}),
                    }
                }

                if (isZero1) {
                    const dir = normalize2(diff2(prev.tangentEnd2, prev.position));
                    return {
                        ...prev,
                        tangentEnd1: add2(prev.position, scale2(dir, -minMag)),
                    }
                }

                if (isZero2) {
                    const dir = normalize2(diff2(prev.tangentEnd1, prev.position));
                    return {
                        ...prev,
                        tangentEnd2: add2(prev.position, scale2(dir, -minMag)),
                    }
                }

                return prev;
            });
        }
    };
}