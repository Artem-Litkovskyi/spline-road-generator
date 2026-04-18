import type { CurveNode3 } from './curveNode.ts';
import { cubicBezier3, cubicBezierDerivative3 } from './interpolation.ts';
import type { Vec2 } from './vec2.ts';
import { type Vec3, cross3, normalize3 } from './vec3.ts';

export type Vec3Axes = {
    position: Vec3;
    forward: Vec3;
    right: Vec3;
    up: Vec3;
}

export function sampleCurveSegment(node1: CurveNode3, node2: CurveNode3, resolution: number, includeLast: boolean): Vec3Axes[] {
    const axs: Vec3Axes[] = [];

    const steps = includeLast ? resolution : resolution - 1;

    for (let i = 0; i <= steps; i++) {
        const t = i / steps;

        const position = cubicBezier3(node1.position, node1.tangentEnd2, node2.tangentEnd1, node2.position, t);
        const forward = normalize3(cubicBezierDerivative3(node1.position, node1.tangentEnd2, node2.tangentEnd1, node2.position, t));
        const right = cross3({ x: 0, y: 0, z: 1 }, forward);
        const up = cross3(forward, right);

        axs.push({ position: position, forward: forward, right: right, up: up });
    }

    return axs;
}

export function sampleCurve(curveNodes: CurveNode3[], resolution: number, closedPath: boolean): Vec3Axes[] {
    const axs: Vec3Axes[] = [];

    const segmentsNumber = closedPath ? curveNodes.length : curveNodes.length - 1;

    for (let i = 0; i < segmentsNumber; i++) {
        const node1 = curveNodes[i];
        const node2 = curveNodes[(i + 1) % curveNodes.length];

        const includeLast = i == segmentsNumber - 1 && !closedPath;

        axs.push(...sampleCurveSegment(node1, node2, resolution, includeLast));
    }

    return axs;
}

export function generateSweptSurfaceMesh(
    curveNodes: CurveNode3[],
    crossSection: Vec2[],
    resolution: number,
    closedPath: boolean
) {
    const vertices: number[] = [];
    const indices: number[] = [];

    const axs = sampleCurve(curveNodes, resolution, closedPath);

    const lastAxesIdx = axs.length - 1;
    const lastCrossSectionVertexIdx = crossSection.length - 1;

    let vertexIdx = 0;

    for (let i = 0; i < axs.length; i++) {
        const ax = axs[i];
        for (let j = 0; j < crossSection.length; j++) {
            const pt = crossSection[j];

            vertices.push(
                ax.position.x + ax.right.x * pt.x + ax.up.x * pt.y,
                ax.position.y + ax.right.y * pt.x + ax.up.y * pt.y,
                ax.position.z + ax.right.z * pt.x + ax.up.z * pt.y,
            );

            const rightmostVertex = j == lastCrossSectionVertexIdx;
            const currentRowIsLast = i == lastAxesIdx;
            const nextRowIsFirst = currentRowIsLast && closedPath;

            if (!rightmostVertex && (!currentRowIsLast || closedPath)) {
                const a = vertexIdx;
                const b = a + 1;
                const c = nextRowIsFirst ? j : a + crossSection.length;
                const d = c + 1;

                indices.push(a, c, b);
                indices.push(b, c, d);
            }

            if (rightmostVertex && nextRowIsFirst) break;

            vertexIdx++;
        }
    }

    return { vertices, indices };
}