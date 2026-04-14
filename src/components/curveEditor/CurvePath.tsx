import React from 'react';
import type { CurveNode2 } from '../../geometry/curves2.ts';

interface CurvePathProps {
    className?: string;
    nodes: CurveNode2[];
    onMouseDown?: (e: React.MouseEvent<SVGElement>) => void;
}

export function CurvePath({ className, nodes, onMouseDown }: CurvePathProps) {
    const commands: string[] = [];

    commands.push(`M ${nodes[0].position.x},${nodes[0].position.y}`);

    for (let i = 0; i < nodes.length - 1; i++) {
        const n0 = nodes[i];
        const n1 = nodes[i + 1];

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
            onMouseDown={(e) => {
                e.stopPropagation();
                onMouseDown?.(e);
            }}
        />
    )
}