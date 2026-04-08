import type { HandleProps } from './HandleProps.ts';
import type { Vec2 } from '../../utils/vec2.ts';

interface ArmHandleProps extends HandleProps {
    end: Vec2;
}

export function ArmHandle(props: ArmHandleProps) {
    return (
        <>
            <line
                x1={props.origin.x} y1={props.origin.y}
                x2={props.end.x} y2={props.end.y}
                className={props.className}
            />

            <circle
                cx={props.end.x}
                cy={props.end.y}
                r={8}
                className={props.className}
                onMouseDown={(e) => {
                    e.stopPropagation();
                    props.onMouseDown(e);
                }}
            />
        </>

    )
}