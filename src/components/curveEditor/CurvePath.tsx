import React from 'react';
import type { CurveNode2 } from '../../geometry/curveNode.ts';
import { curveToPathCommands } from '../../utils/svg.ts';

interface CurvePathProps {
    className?: string;
    curveNodes: CurveNode2[];
    curveWidth: number;
    onMouseDown?: (e: React.MouseEvent<SVGElement>) => void;
}

export function CurvePath({ className, curveNodes, curveWidth, onMouseDown }: CurvePathProps) {
    const d = curveToPathCommands(curveNodes);

    return (
        <path
            d={d}
            className={className}
            style={{ strokeWidth: curveWidth }}
            onMouseDown={(e) => {
                e.stopPropagation();
                onMouseDown?.(e);
            }}
        />
    )
}