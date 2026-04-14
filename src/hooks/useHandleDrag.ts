import React, { useState } from 'react';
import type { Vec2 } from '../geometry/vec2.ts';
import type { DragContext, Handle } from '../handles/Handle.ts';
import { getRootSVG, getSVGPoint } from '../utils/svg.ts';

export function useHandleDrag() {
    const [activeHandle, setActiveHandle] = useState<Handle | null>(null);
    const [startMouse, setStartMouse] = useState<Vec2 | null>(null);
    const [prevMouse, setPrevMouse] = useState<Vec2 | null>(null);

    const onHandleDragStart = (handle: Handle, e: React.MouseEvent<SVGElement>) => {
        const svg = getRootSVG(e.currentTarget);

        if (!svg) return;

        const p = getSVGPoint(svg, e.clientX, e.clientY);

        setStartMouse(p);
        setPrevMouse(p);
        setActiveHandle(handle);

        handle.onMouseDown?.();
    };

    const onHandleDrag = (e: React.MouseEvent<SVGSVGElement>) => {
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

    const onHandleDragEnd = () => {
        activeHandle?.onDragEnd?.();
        setActiveHandle(null);
        setStartMouse(null);
        setPrevMouse(null);
    };

    return { onHandleDragStart, onHandleDrag, onHandleDragEnd };
}