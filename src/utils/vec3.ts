export type Vec3 = {
    x: number;
    y: number;
    z: number;
};

export function add3(v1: Vec3, v2: Vec3) {
    return {
        x: v1.x + v2.x,
        y: v1.y + v2.y,
        z: v1.z + v2.z,
    };
}

export function scale3(v: Vec3, k: number) {
    return {
        x: v.x * k,
        y: v.y * k,
        z: v.z * k,
    };
}

export function magnitude3(v: Vec3) {
    return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
}

export function normalize3(v: Vec3): Vec3 {
    const mag = magnitude3(v);
    return {
        x: v.x / mag,
        y: v.y / mag,
        z: v.z / mag,
    };
}