import type { DragContext, Handle } from './Handle.ts';
import { type CurveNode3, setCollinearTangentPitch3, getTangentPitch3 } from '../geometry/curveNode.ts';

export function createPitchHandle(
    index: number,
    updateNode: (i: number, u: (prev: CurveNode3) => CurveNode3) => void,
    sensitivity: number,
    setHandleRotation: (offset: number) => void,
    rotationAmount: number,
    maxRotation: number,
): Handle {
    return {
        onDrag: (ctx: DragContext) => {
            updateNode(index, prev => (
                setCollinearTangentPitch3(prev, getTangentPitch3(prev) + ctx.delta.x * sensitivity)
            ));
            setHandleRotation(Math.min(Math.max((ctx.startMouse.x - ctx.currentMouse.x) * rotationAmount, -maxRotation), maxRotation));
        },
        onDragEnd: () => {
            setHandleRotation(0);
        }
    };
}