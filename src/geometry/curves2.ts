import { add2, diff2, magnitude2, normalize2, scale2, type Vec2 } from './vec2.ts';

export type CurveNode2 = {
    position: Vec2;
    tangentEnd1: Vec2;
    tangentEnd2: Vec2;
}

export function createCurveNode2(x: number, y: number): CurveNode2 {
    return {
        position: { x: x, y: y },
        tangentEnd1: { x: x, y: y },
        tangentEnd2: { x: x, y: y },
    };
}

export function setCurveNodePosition2(
    node: CurveNode2,
    positionValue: Vec2,
): CurveNode2 {
    const delta = diff2(positionValue, node.position);

    return {
        position: positionValue,
        tangentEnd1: add2(node.tangentEnd1, delta),
        tangentEnd2: add2(node.tangentEnd2, delta),
    };
}

export function setCurveNodeTangent2(
    node: CurveNode2,
    tangentKey: 'tangentEnd1' | 'tangentEnd2',
    tangentValue: Vec2,
    symmetric: boolean = false,
): CurveNode2 {
    const otherKey =
        tangentKey === 'tangentEnd1'
            ? 'tangentEnd2'
            : 'tangentEnd1';

    const dir = normalize2(diff2(tangentValue, node.position));
    const mag = magnitude2(diff2(symmetric ? tangentValue : node[otherKey], node.position));
    const otherTangentValue = add2(node.position, scale2(dir, -mag));

    return {
        ...node,
        [tangentKey]: tangentValue,
        [otherKey]: otherTangentValue,
    };
}

export function makeCurveNodeValid2(node: CurveNode2, minMag: number = 10): CurveNode2 {
    const isZero1 = magnitude2(diff2(node.tangentEnd1, node.position)) < minMag;
    const isZero2 = magnitude2(diff2(node.tangentEnd2, node.position)) < minMag;

    if (isZero1 && isZero2) {
        return {
            ...node,
            tangentEnd1: add2(node.position, {x: minMag, y: 0}),
            tangentEnd2: add2(node.position, {x: -minMag, y: 0}),
        }
    }

    if (isZero1) {
        const dir = normalize2(diff2(node.tangentEnd2, node.position));
        return {
            ...node,
            tangentEnd1: add2(node.position, scale2(dir, -minMag)),
        }
    }

    if (isZero2) {
        const dir = normalize2(diff2(node.tangentEnd1, node.position));
        return {
            ...node,
            tangentEnd2: add2(node.position, scale2(dir, -minMag)),
        }
    }

    return node;
}
