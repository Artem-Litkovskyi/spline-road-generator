import type { HandleProps } from './HandleProps.ts';

export function PointHandle(props: HandleProps) {
    return (
        <circle
            cx={props.origin.x}
            cy={props.origin.y}
            r={6}
            className={props.className}
            onMouseDown={(e) => {
                e.stopPropagation();
                props.onMouseDown(e);
            }}
        />
    )
}