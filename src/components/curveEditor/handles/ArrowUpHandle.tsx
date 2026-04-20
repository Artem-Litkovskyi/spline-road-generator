import type { HandleProps } from './HandleProps.ts';

const ARROW_UP_PATH = `
    M -8,-20
    L -16,-40
    L -30,-40
    L 0,-60
    L 30,-40
    L 16,-40
    L 8,-20
    Z
`;

interface ArrowUpHandleProps extends HandleProps {
    offsetY: number;
}

export function ArrowUpHandle({ className, origin, onMouseDown, offsetY }: ArrowUpHandleProps) {
    return (
        <path
            d={ARROW_UP_PATH}
            transform={`translate(${origin.x},${origin.y + offsetY})`}
            className={className}
            onMouseDown={(e) => {
                e.stopPropagation();
                onMouseDown(e);
            }}
        />
    )
}