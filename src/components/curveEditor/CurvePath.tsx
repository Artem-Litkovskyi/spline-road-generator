import React from 'react';
import type { CurveNode2 } from '../../geometry/curveNode.ts';

interface CurvePathProps {
    className?: string;
    curveNodes: CurveNode2[];
    curveWidth: number;
    onMouseDown?: (e: React.MouseEvent<SVGElement>) => void;
}

export function CurvePath({ className, curveNodes, curveWidth, onMouseDown }: CurvePathProps) {
    const commands: string[] = [];

    commands.push(`M ${curveNodes[0].position.x},${curveNodes[0].position.y}`);

    for (let i = 0; i < curveNodes.length - 1; i++) {
        const n0 = curveNodes[i];
        const n1 = curveNodes[i + 1];

        commands.push(
            `C ${n0.tangentEnd2.x},${n0.tangentEnd2.y}
            ${n1.tangentEnd1.x},${n1.tangentEnd1.y}
            ${n1.position.x},${n1.position.y}`
        );
    }

    const d = commands.join(' ');

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