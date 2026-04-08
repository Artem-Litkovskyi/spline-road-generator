export type Vec2 = {
    x: number;
    y: number;
};

export function add2(v1: Vec2, v2: Vec2) {
    return {
        x: v1.x + v2.x,
        y: v1.y + v2.y,
    };
}

export function diff2(v1: Vec2, v2: Vec2) {
    return {
        x: v1.x - v2.x,
        y: v1.y - v2.y,
    };
}

export function magnitude2(v: Vec2) {
    return Math.sqrt(v.x * v.x + v.y * v.y);
}

export function normalize2(v: Vec2): Vec2 {
    const mag = magnitude2(v);
    return mag === 0 ? v : {
        x: v.x / mag,
        y: v.y / mag,
    };
}

export function scale2(v: Vec2, k: number) {
    return {
        x: v.x * k,
        y: v.y * k,
    };
}
