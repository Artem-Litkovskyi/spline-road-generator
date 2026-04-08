import type { CurveNode2 } from '../utils/curves.ts';

interface CurvePathProps {
    node1: CurveNode2;
    node2: CurveNode2;
    className: string;
}

export function CurvePath(props: CurvePathProps) {
    const d = `
        M ${props.node1.position.x},${props.node1.position.y}
        C ${props.node1.tangentEnd2.x},${props.node1.tangentEnd2.y}
          ${props.node2.tangentEnd1.x},${props.node2.tangentEnd1.y}
          ${props.node2.position.x},${props.node2.position.y}
    `;

    return (
        <path d={d} className={props.className} />
    );
}