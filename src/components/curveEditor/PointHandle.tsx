import type { HandleProps } from './HandleProps.ts';

export function PointHandle({ className, origin, onMouseDown }: HandleProps) {
    return (
        <circle
            cx={origin.x}
            cy={origin.y}
            r={8}
            className={className}
            onMouseDown={(e) => {
                e.stopPropagation();
                onMouseDown(e);
            }}
        />
    )
}