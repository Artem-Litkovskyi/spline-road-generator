import type { Vec2 } from './vec2.ts';
import { add3, diff3, magnitude3, normalize3, scale3, type Vec3 } from './vec3.ts';

export type CurveNode2 = {
    position: Vec2;
    tangentEnd1: Vec2;
    tangentEnd2: Vec2;
}

export type CurveNode3 = {
    position: Vec3;
    tangentEnd1: Vec3;
    tangentEnd2: Vec3;
}

export function createCurveNode3(position: Vec3): CurveNode3 {
    return {
        position: position,
        tangentEnd1: position,
        tangentEnd2: position,
    };
}

export function moveCurveNode3(node: CurveNode3, position: Vec3): CurveNode3 {
    const d = diff3(position, node.position);

    return {
        position: position,
        tangentEnd1: add3(node.tangentEnd1, d),
        tangentEnd2: add3(node.tangentEnd2, d),
    };
}

export function moveCurveNodeByDelta3(node: CurveNode3, delta: Vec3): CurveNode3 {
    return {
        position: add3(node.position, delta),
        tangentEnd1: add3(node.tangentEnd1, delta),
        tangentEnd2: add3(node.tangentEnd2, delta),
    };
}

export function moveCollinearTangent3(
    node: CurveNode3,
    tangentKey: 'tangentEnd1' | 'tangentEnd2',
    tangentValue: Vec3,
    symmetric: boolean = false,
): CurveNode3 {
    const otherKey =
        tangentKey === 'tangentEnd1'
            ? 'tangentEnd2'
            : 'tangentEnd1';

    const dir = normalize3(diff3(tangentValue, node.position));
    const mag = magnitude3(diff3(symmetric ? tangentValue : node[otherKey], node.position));
    const otherTangentValue = add3(node.position, scale3(dir, -mag));

    return {
        ...node,
        [tangentKey]: tangentValue,
        [otherKey]: otherTangentValue,
    };
}

export function makeCurveNodeValid3(node: CurveNode3, minMag: number = 10): CurveNode3 {
    const isZero1 = magnitude3(diff3(node.tangentEnd1, node.position)) < minMag;
    const isZero2 = magnitude3(diff3(node.tangentEnd2, node.position)) < minMag;

    if (isZero1 && isZero2) {
        return {
            ...node,
            tangentEnd1: add3(node.position, { x: minMag, y: 0, z: 0 }),
            tangentEnd2: add3(node.position, { x: -minMag, y: 0, z: 0 }),
        }
    }

    if (isZero1) {
        const dir = normalize3(diff3(node.tangentEnd2, node.position));
        return {
            ...node,
            tangentEnd1: add3(node.position, scale3(dir, -minMag)),
        }
    }

    if (isZero2) {
        const dir = normalize3(diff3(node.tangentEnd1, node.position));
        return {
            ...node,
            tangentEnd2: add3(node.position, scale3(dir, -minMag)),
        }
    }

    return node;
}