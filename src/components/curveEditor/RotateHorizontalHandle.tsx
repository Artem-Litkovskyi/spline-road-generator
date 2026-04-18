import type { HandleProps } from './HandleProps.ts';

const ROTATE_HORIZONTAL_PATH = `
    M -30,30
    L -30,10
    L -10,10
    L -15,15
    A 21,21 0 0 0 15 15
    L 10,10
    L 30,10
    L 30,30
    L 25,25
    A 35,35 0 0 1 -25 25
    Z
`;

interface RotateHorizontalHandleProps extends HandleProps {
    rotation: number;
}

export function RotateHorizontalHandle({ className, origin, onMouseDown, rotation }: RotateHorizontalHandleProps) {
    return (
        <path
            d={ROTATE_HORIZONTAL_PATH}
            transform={`translate(${origin.x},${origin.y}) rotate(${rotation})`}
            className={className}
            onMouseDown={(e) => {
                e.stopPropagation();
                onMouseDown(e);
            }}
        />
    )
}