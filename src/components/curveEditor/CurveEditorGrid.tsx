import React from 'react';
import { type PanZoom, svgToWorld, worldToSvg } from '../../utils/svg.ts';

type CurveEditorGridProps = {
    className?: string;
    canvasWidth: number;
    canvasHeight: number;
    panZoom: PanZoom;
    spacing?: number;
};

export function CurveEditorGrid({ className, canvasWidth, canvasHeight, panZoom, spacing = 10 }: CurveEditorGridProps) {
    // World space
    const bottomLeft = svgToWorld(0, canvasHeight, canvasHeight, panZoom);
    const startX = Math.floor(bottomLeft.x / spacing) * spacing;
    const startY = Math.floor(bottomLeft.y / spacing) * spacing;

    // SVG space
    const svgStart = worldToSvg(startX, startY, canvasHeight, panZoom);
    const svgSpacing = spacing * panZoom.zoom;

    const lines: React.ReactNode[] = [];

    // Vertical lines
    for (let x = svgStart.x; x <= canvasWidth; x += svgSpacing) {
        lines.push(
            <line
                className={className}
                key={`v-${x}`}
                x1={x}
                y1={0}
                x2={x}
                y2={canvasHeight}
            />,
        );
    }

    // Horizontal lines
    for (let y = svgStart.y; y >= -canvasHeight; y -= svgSpacing) {
        lines.push(
            <line
                className={className}
                key={`h-${y}`}
                x1={0}
                y1={y}
                x2={canvasWidth}
                y2={y}
            />,
        );
    }

    return <g>{lines}</g>;
}