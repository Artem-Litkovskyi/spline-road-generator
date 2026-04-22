import React, { useEffect, useState } from 'react';
import { screenToSvg } from '../utils/svg.ts';

export type PanZoom = {
    panX: number,
    panY: number,
    zoom: number,
}

export function zoomAtPoint(panZoom: PanZoom, x: number, y: number, zoomFactor: number): PanZoom {
    return {
        zoom: panZoom.zoom * zoomFactor,
        panX: x - (x - panZoom.panX) * zoomFactor,
        panY: y - (y - panZoom.panY) * zoomFactor,
    };
}

export function usePanZoom(svg: SVGSVGElement | null) {
    const [panZoom, setPanZoom] = useState<PanZoom>({
        panX: 0,
        panY: 0,
        zoom: 2,
    });

    // Pan with mouse button
    const [isPanning, setIsPanning] = useState(false);

    const onMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
        if (e.button !== 1) return;
        setIsPanning(true);
    };

    const onMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
        if (!isPanning) return;

        setPanZoom(t => ({
            ...t,
            panX: t.panX + e.movementX,
            panY: t.panY - e.movementY,
        }));
    };

    const endPan = () => setIsPanning(false);

    // Zoom and pan with mouse wheel or trackpad
    const onWheel = (e: React.WheelEvent<SVGSVGElement>) => {
        if (!svg) return;

        const pt = screenToSvg(e.clientX, e.clientY, svg);

        if (e.ctrlKey) {
            const zoomFactor = Math.exp(-e.deltaY * 0.01);

            setPanZoom(pz =>
                zoomAtPoint(pz, pt.x, pt.y, zoomFactor)
            );
        } else {
            setPanZoom(t => ({
                ...t,
                panX: t.panX - e.deltaX,
                panY: t.panY + e.deltaY,
            }));
        }
    };

    // Prevent browser scroll
    useEffect(() => {
        if (!svg) return;

        const handler = (e: WheelEvent) => e.preventDefault();

        svg.addEventListener('wheel', handler, { passive: false });

        return () => svg.removeEventListener('wheel', handler);
    }, [svg]);

    return {
        panZoom,
        setPanZoom,
        bind: {
            onMouseDown,
            onMouseMove,
            onMouseUp: endPan,
            onMouseLeave: endPan,
            onWheel,
        },
    };
}