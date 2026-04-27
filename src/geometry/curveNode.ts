import { magnitude2, type Vec2 } from './vec2.ts';
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

// Position
export function setNodePosition3(node: CurveNode3, position: Vec3): CurveNode3 {
    const d = diff3(position, node.position);

    return {
        position: position,
        tangentEnd1: add3(node.tangentEnd1, d),
        tangentEnd2: add3(node.tangentEnd2, d),
    };
}

export function changeNodePositionByDelta3(node: CurveNode3, delta: Vec3): CurveNode3 {
    return {
        position: add3(node.position, delta),
        tangentEnd1: add3(node.tangentEnd1, delta),
        tangentEnd2: add3(node.tangentEnd2, delta),
    };
}

// Tangent
export function setCollinearTangentEnd3(
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

export function changeCollinearTangentEndByDeltaXY3(
    node: CurveNode3,
    tangentKey: 'tangentEnd1' | 'tangentEnd2',
    tangentDeltaXY: Vec2,
    symmetric: boolean = false,
): CurveNode3 {
    const otherKey =
        tangentKey === 'tangentEnd1'
            ? 'tangentEnd2'
            : 'tangentEnd1';

    const tangent = diff3(node[tangentKey], node.position);
    const tangentXY = { x: tangent.x, y: tangent.y }
    const magXY = magnitude2(tangentXY);

    const newTangentXY = { x: tangentXY.x + tangentDeltaXY.x, y: tangentXY.y + tangentDeltaXY.y }
    const newMagXY = magnitude2(newTangentXY);
    const newTangent = {
        x: newTangentXY.x,
        y: newTangentXY.y,
        z: magXY === 0 ? tangent.z : newMagXY / magXY * tangent.z,
    }

    const otherTangent = diff3(node[otherKey], node.position);
    const newDir = normalize3(newTangent);
    const otherNewMag = magnitude3(symmetric ? newTangent : otherTangent);
    const otherNewTangent = scale3(newDir, -otherNewMag);

    return {
        ...node,
        [tangentKey]: add3(node.position, newTangent),
        [otherKey]: add3(node.position, otherNewTangent),
    };
}

// Pitch
export function getTangentPitch3(node: CurveNode3): number {
    const tangent2 = diff3(node.tangentEnd2, node.position);
    const mag2XY = magnitude3({ x: tangent2.x, y: tangent2.y, z: 0 });
    return Math.atan2(tangent2.z, mag2XY) / Math.PI * 180;
}

export function setCollinearTangentPitch3(node: CurveNode3, pitch: number): CurveNode3 {
    const tangent2 = diff3(node.tangentEnd2, node.position);
    const mag2 = magnitude3(tangent2);

    const dir2XY = normalize3({ x: tangent2.x, y: tangent2.y, z: 0 });

    const pitchRad = pitch / 180 * Math.PI;
    const cosPitch = Math.cos(pitchRad);
    const sinPitch = Math.sin(pitchRad);

    const newTangent2 = {
        x: dir2XY.x * mag2 * cosPitch,
        y: dir2XY.y * mag2 * cosPitch,
        z: mag2 * sinPitch,
    }

    const tangent1 = diff3(node.tangentEnd1, node.position);
    const mag1 = magnitude3(tangent1);

    const newTangent1 = scale3(normalize3(newTangent2), -mag1);

    return {
        ...node,
        tangentEnd1: add3(node.position, newTangent1),
        tangentEnd2: add3(node.position, newTangent2),
    };
}

// Other
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

export function getCurveBoundingBox3(nodes: CurveNode3[]): { min: Vec3, max: Vec3 } {
    let min = { x: Infinity, y: Infinity, z: Infinity };
    let max = { x: -Infinity, y: -Infinity, z: -Infinity };

    for (const node of nodes) {
        min = {
            x: Math.min(min.x, node.position.x, node.tangentEnd1.x, node.tangentEnd2.x),
            y: Math.min(min.y, node.position.y, node.tangentEnd1.y, node.tangentEnd2.y),
            z: Math.min(min.z, node.position.z, node.tangentEnd1.z, node.tangentEnd2.z),
        };

        max = {
            x: Math.max(max.x, node.position.x, node.tangentEnd1.x, node.tangentEnd2.x),
            y: Math.max(max.y, node.position.y, node.tangentEnd1.y, node.tangentEnd2.y),
            z: Math.max(max.z, node.position.z, node.tangentEnd1.z, node.tangentEnd2.z),
        };
    }

    return { min, max }
}