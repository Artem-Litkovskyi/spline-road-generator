import React, { useState } from 'react';
import type { Vec2 } from '../geometry/vec2.ts';
import type { DragContext, Handle } from '../handles/Handle.ts';
import { screenToWorld, type Transform } from '../utils/svg.ts';

export function useHandleDrag(svg: SVGSVGElement | null, transform: Transform) {
    const [activeHandle, setActiveHandle] = useState<Handle | null>(null);
    const [startMouse, setStartMouse] = useState<Vec2 | null>(null);
    const [prevMouse, setPrevMouse] = useState<Vec2 | null>(null);

    const onHandleDragStart = (handle: Handle, e: React.MouseEvent<SVGElement>) => {
        if (!svg) return;

        const p = screenToWorld(e.clientX, e.clientY, svg, transform);

        setStartMouse(p);
        setPrevMouse(p);
        setActiveHandle(handle);

        handle.onMouseDown?.();
    };

    const onHandleDrag = (e: React.MouseEvent<SVGSVGElement>) => {
        if (!svg || !activeHandle || !startMouse || !prevMouse) return;

        const p = screenToWorld(e.clientX, e.clientY, svg, transform);

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