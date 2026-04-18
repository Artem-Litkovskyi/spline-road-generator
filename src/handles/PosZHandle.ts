import type { DragContext, Handle } from './Handle.ts';
import { type CurveNode3, changeNodePositionByDelta3 } from '../geometry/curveNode.ts';

export function createPosZHandle(
    index: number,
    updateNode: (i: number, u: (prev: CurveNode3) => CurveNode3) => void,
    sensitivity: number,
    setHandleOffsetY: (offset: number) => void,
    offsetAmount: number,
    maxOffset: number,
): Handle {
    return {
        onDrag: (ctx: DragContext) => {
            updateNode(index, prev => (
                changeNodePositionByDelta3(prev, { x: 0, y: 0, z: ctx.delta.y * sensitivity })
            ));
            setHandleOffsetY(Math.min(Math.max((ctx.startMouse.y - ctx.currentMouse.y) * offsetAmount, -maxOffset), maxOffset));
        },
        onDragEnd: () => {
            setHandleOffsetY(0);
        }
    };
}