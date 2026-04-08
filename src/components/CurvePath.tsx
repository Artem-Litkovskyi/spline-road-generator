import type { CurveNode2 } from '../utils/curves.ts';

interface CurvePathProps {
    nodes: CurveNode2[];
    className: string;
}

export function CurvePath(props: CurvePathProps) {
    const commands: string[] = [];

    commands.push(`M ${props.nodes[0].position.x},${props.nodes[0].position.y}`);

    for (let i = 0; i < props.nodes.length - 1; i++) {
        const n0 = props.nodes[i];
        const n1 = props.nodes[i + 1];

        commands.push(
            `C ${n0.tangentEnd2.x},${n0.tangentEnd2.y}
            ${n1.tangentEnd1.x},${n1.tangentEnd1.y}
            ${n1.position.x},${n1.position.y}`
        );
    }

    const d = commands.join(' ');

    return <path d={d} className={props.className} />;
}