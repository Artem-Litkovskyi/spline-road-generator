import type { HandleProps } from './HandleProps.ts';
import type { Vec2 } from '../../../geometry/vec2.ts';

interface ArmHandleProps extends HandleProps {
    label?: string;
    end: Vec2;
}

export function ArmHandle({ className, label, origin, end, onMouseDown }: ArmHandleProps) {
    return (
        <>
            <line
                className={className}
                x1={origin.x} y1={origin.y}
                x2={end.x} y2={end.y}
            />

            <circle
                className={className}
                cx={end.x}
                cy={end.y}
                r={8}
                onMouseDown={(e) => {
                    e.stopPropagation();
                    onMouseDown(e);
                }}
            />

            <text
                className={className}
                x={end.x - 3.5}
                y={end.y + 4.5}
                fontSize={14}
            >
                {label}
            </text>
        </>

    )
}