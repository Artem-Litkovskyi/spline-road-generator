import type { Vec3 } from './vec3.ts';

export type CurveNode3 = {
    position: Vec3;
    tangentEnd1: Vec3;
    tangentEnd2: Vec3;
}

export function bezier(p0: number, p1: number, p2: number, p3: number, t:number) {
    const u = 1 - t;

    return u * u * u * p0 +
        3 * u * u * t * p1 +
        3 * u * t * t * p2 +
        t * t * t * p3;
}

export function cubicBezier3(node1: CurveNode3, node2: CurveNode3, t: number): Vec3 {
    const p0 = node1.position;
    const p1 = node1.tangentEnd2;
    const p2 = node2.tangentEnd1;
    const p3 = node2.position;

    const x = bezier(p0.x, p1.x, p2.x, p3.x, t);
    const y = bezier(p0.y, p1.y, p2.y, p3.y, t);
    const z = bezier(p0.z, p1.z, p2.z, p3.z, t);

    return { x, y, z };
}

export function sampleBezier3(node1: CurveNode3, node2: CurveNode3, steps: number = 20): Vec3[] {
    const pts: Vec3[] = [];
    for (let i = 0; i <= steps; i++) {
        pts.push(cubicBezier3(node1, node2, i / steps));
    }
    return pts;
}