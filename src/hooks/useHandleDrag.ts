import React, { useRef } from 'react';
import type { Vec2 } from '../geometry/vec2.ts';
import type { DragContext, Handle } from '../handles/Handle.ts';
import { type SVGCanvasTransform, screenToWorld } from '../utils/svg.ts';

export function useHandleDrag(svg: SVGSVGElement | null, svgCanvasTransform: SVGCanvasTransform) {
    const activeHandle = useRef<Handle | null>(null);
    const startMouse = useRef<Vec2 | null>(null);
    const prevMouse = useRef<Vec2 | null>(null);

    const onHandleDragStart = (handle: Handle, e: React.MouseEvent<SVGElement>) => {
        if (!svg) return;

        const p = screenToWorld(e.clientX, e.clientY, svg, svgCanvasTransform);

        startMouse.current = p;
        prevMouse.current = p;
        activeHandle.current = handle;

        handle.onMouseDown?.();
    };

    const onHandleDrag = (e: React.MouseEvent<SVGSVGElement>) => {
        if (!svg || !activeHandle.current || !startMouse.current || !prevMouse.current) return;

        const p = screenToWorld(e.clientX, e.clientY, svg, svgCanvasTransform);

        const ctx: DragContext = {
            startMouse: startMouse.current,
            currentMouse: p,
            delta: {
                x: p.x - prevMouse.current.x,
                y: p.y - prevMouse.current.y,
            },
        };

        activeHandle.current.onDrag(ctx);

        prevMouse.current = p;
    };

    const onHandleDragEnd = () => {
        activeHandle.current?.onDragEnd?.();
        activeHandle.current = null;
        startMouse.current = null;
        prevMouse.current = null;
    };

    return { onHandleDragStart, onHandleDrag, onHandleDragEnd };
}