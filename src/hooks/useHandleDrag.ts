import React, { useRef } from 'react';
import type { DragContext, Handle } from '../handles/Handle.ts';
import type { Vec2 } from '../geometry/vec2.ts';
import { type PanZoom, screenToWorld } from '../utils/svg.ts';

export function useHandleDrag(svg: SVGSVGElement | null, svgCanvasTransform: PanZoom) {
    const activeHandle = useRef<Handle | null>(null);
    const start = useRef<Vec2 | null>(null);
    const prev = useRef<Vec2 | null>(null);

    const isDraggingHandle = !!activeHandle.current;

    const onHandleDragStart = (handle: Handle, e: React.MouseEvent<SVGElement>) => {
        if (!svg) return;

        const p = screenToWorld(e.clientX, e.clientY, svg, svgCanvasTransform);

        start.current = p;
        prev.current = p;
        activeHandle.current = handle;

        handle.onMouseDown?.();
    };

    const onMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
        if (!svg || !activeHandle.current || !start.current || !prev.current) return;

        const pt = screenToWorld(e.clientX, e.clientY, svg, svgCanvasTransform);

        const ctx: DragContext = {
            start: start.current,
            current: pt,
            delta: {
                x: pt.x - prev.current.x,
                y: pt.y - prev.current.y,
            },
        };

        activeHandle.current.onDrag(ctx);

        prev.current = pt;
    };

    const endHandleDrag = () => {
        activeHandle.current?.onDragEnd?.();
        activeHandle.current = null;
        start.current = null;
        prev.current = null;
    };

    return {
        isDraggingHandle,
        onHandleDragStart,
        bind: {
            onMouseMove,
            onMouseUp: endHandleDrag,
            onMouseLeave: endHandleDrag,
        }
    };
}