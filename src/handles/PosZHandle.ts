import type { Handle } from './Handle.ts';
import type { DragContext } from '../hooks/useHandleDrag.ts';
import { type CurveNode3, changeNodePositionByDelta3 } from '../geometry/curveNode.ts';

export function createPosZHandle(
    index: number,
    updateNode: (i: number, u: (prev: CurveNode3) => CurveNode3) => void,
    sensitivity: number,
    setHandleOffsetY: (offset: number) => void,
    offsetAmount: number,
    maxOffset: number,
    setHandleSelected: (v: boolean) => void,
): Handle {
    return {
        onMouseDown: () => {
            setHandleSelected(true);
        },
        onDrag: (ctx: DragContext) => {
            updateNode(index, prev => (
                changeNodePositionByDelta3(prev, { x: 0, y: 0, z: ctx.delta.y * sensitivity })
            ));
            setHandleOffsetY(Math.min(Math.max((ctx.start.y - ctx.current.y) * offsetAmount, -maxOffset), maxOffset));
        },
        onDragEnd: () => {
            setHandleOffsetY(0);
        }
    };
}