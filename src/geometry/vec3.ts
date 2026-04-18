import type { Vec2 } from './vec2.ts';

export type Vec3 = {
    x: number;
    y: number;
    z: number;
};

export function createVec3(vec2: Vec2, z: number): Vec3 {
    return {
        ...vec2,
        z: z,
    };
}

export function add3(v1: Vec3, v2: Vec3): Vec3 {
    return {
        x: v1.x + v2.x,
        y: v1.y + v2.y,
        z: v1.z + v2.z,
    };
}

export function diff3(v1: Vec3, v2: Vec3): Vec3 {
    return {
        x: v1.x - v2.x,
        y: v1.y - v2.y,
        z: v1.z - v2.z,
    };
}

export function magnitude3(v: Vec3): number {
    return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
}

export function normalize3(v: Vec3): Vec3 {
    const mag = magnitude3(v);
    return mag === 0 ? v : {
        x: v.x / mag,
        y: v.y / mag,
        z: v.z / mag,
    };
}

export function scale3(v: Vec3, k: number): Vec3 {
    return {
        x: v.x * k,
        y: v.y * k,
        z: v.z * k,
    };
}

export function cross3(v1: Vec3, v2: Vec3): Vec3 {
    return {
        x: v1.y * v2.z - v1.z * v2.y,
        y: v1.z * v2.x - v1.x * v2.z,
        z: v1.x * v2.y - v1.y * v2.x,
    };
}