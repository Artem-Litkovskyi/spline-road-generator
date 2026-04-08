import { useState } from 'react';
import type { Vec2 } from '../utils/vec2.ts';
import type { DragContext, Handle } from '../handles/Handle.ts';

export function useHandleDrag() {
    const [activeHandle, setActiveHandle] = useState<Handle | null>(null);
    const [startMouse, setStartMouse] = useState<Vec2 | null>(null);
    const [prevMouse, setPrevMouse] = useState<Vec2 | null>(null);

    const getSVGPoint = (svg: SVGSVGElement, clientX: number, clientY: number) => {
        const screenPoint = svg.createSVGPoint();

        screenPoint.x = clientX;
        screenPoint.y = clientY;

        const svgPoint = screenPoint.matrixTransform(
            svg.getScreenCTM()?.inverse()
        );

        return { x: svgPoint.x, y: svgPoint.y };
    };

    const onMouseDown = (handle: Handle, e: React.MouseEvent<SVGElement>) => {
        if (!e.currentTarget.ownerSVGElement) return;

        const p = getSVGPoint(e.currentTarget.ownerSVGElement, e.clientX, e.clientY);

        setStartMouse(p);
        setPrevMouse(p);
        setActiveHandle(handle);

        handle.onMouseDown?.();
    };

    const onMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
        if (!activeHandle || !startMouse || !prevMouse) return;

        const p = getSVGPoint(e.currentTarget, e.clientX, e.clientY);

        const ctx: DragContext = {
            startMouse,
            currentMouse: p,
            delta: {
                x: p.x - prevMouse.x,
                y: p.y - prevMouse.y,
            },
        };

        activeHandle.onDrag(ctx);

        setPrevMouse(p);
    };

    const onMouseUp = () => {
        activeHandle?.onDragEnd?.();
        setActiveHandle(null);
        setStartMouse(null);
        setPrevMouse(null);
    };

    return { onMouseDown, onMouseMove, onMouseUp };
}