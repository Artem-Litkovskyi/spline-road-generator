import type { HandleProps } from './HandleProps.ts';

export function PointHandle({ className, svgKey, origin, onMouseDown }: HandleProps) {
    return (
        <circle
            className={className}
            key={svgKey}
            cx={origin.x}
            cy={origin.y}
            r={8}
            onMouseDown={(e) => {
                e.stopPropagation();
                onMouseDown(e);
            }}
        />
    )
}