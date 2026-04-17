import type { Vec3 } from './vec3.ts';

export function cubicBezier(p0: number, p1: number, p2: number, p3: number, t: number): number {
    const u = 1 - t;

    return u * u * u * p0 +
        3 * u * u * t * p1 +
        3 * u * t * t * p2 +
        t * t * t * p3;
}

export function cubicBezierDerivative(p0: number, p1: number, p2: number, p3: number, t: number): number {
    const u = 1 - t;

    return 3 * u * u * (p1 - p0) +
        6 * u * t * (p2 - p1) +
        3 * t * t * (p3 - p2);
}

export function cubicBezier3(p0: Vec3, p1: Vec3, p2: Vec3, p3: Vec3, t: number): Vec3 {
    return {
        x: cubicBezier(p0.x, p1.x, p2.x, p3.x, t),
        y: cubicBezier(p0.y, p1.y, p2.y, p3.y, t),
        z: cubicBezier(p0.z, p1.z, p2.z, p3.z, t),
    };
}

export function cubicBezierDerivative3(p0: Vec3, p1: Vec3, p2: Vec3, p3: Vec3, t: number): Vec3 {
    return {
        x: cubicBezierDerivative(p0.x, p1.x, p2.x, p3.x, t),
        y: cubicBezierDerivative(p0.y, p1.y, p2.y, p3.y, t),
        z: cubicBezierDerivative(p0.z, p1.z, p2.z, p3.z, t),
    };
}