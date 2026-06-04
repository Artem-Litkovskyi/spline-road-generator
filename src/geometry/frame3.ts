// geometry/frame3.ts
// Sample 3D frames along cubic Bézier curve segments. Frames are used to
// position and orient cross-sections for mesh sweep generation.
import type { CurveNode3 } from './curveNode';
import { cubicBezier, cubicBezier3, cubicBezierDerivative3 } from './bezier.ts';
import { cross3, normalize3, scale3, type Vec3 } from './vec3';

export type Frame3 = {
    position: Vec3;
    forward: Vec3;
    right: Vec3;
    up: Vec3;
}

/**
 * Sample frames along a 3D Bezier segment.
 * The produced frames contain an orthonormal-like basis (forward, right, up)
 * where `right` is scaled by the interpolated width.
 * @param node1 - first control node
 * @param node2 - second control node
 * @param width1 - width at first node
 * @param width2 - width at second node
 * @param includeLast - whether to include the segment's last sample
 * @param samplingResolution - samples per segment
 * @returns array of Frame3
 */
export function sampleCurveSegmentFrames3(
    node1: CurveNode3, node2: CurveNode3,
    width1: number, width2: number,
    includeLast: boolean, samplingResolution: number
): Frame3[] {
    const axs: Frame3[] = [];

    // Avoid duplicating the last frame between consecutive segments when
    // includeLast is false.
    const steps = includeLast ? samplingResolution : samplingResolution - 1;

    for (let i = 0; i <= steps; i++) {
        const t = i / steps;

        // Evaluate position and forward (normalized derivative)
        const position = cubicBezier3(node1.position, node1.tangentEnd2, node2.tangentEnd1, node2.position, t);
        const forward = normalize3(cubicBezierDerivative3(node1.position, node1.tangentEnd2, node2.tangentEnd1, node2.position, t));

        // Build a stable right/up pair. Using world Z (0,0,1) as a reference
        // reduces twist for mostly-horizontal curves. For vertical-forward
        // vectors this method may produce degenerate right vectors; calling
        // code should be robust to that case.
        const right = cross3({ x: 0, y: 0, z: 1 }, forward);
        const up = cross3(forward, right);

        const width = cubicBezier(width1, width1, width2, width2, t);
        const rightScaled = scale3(right, width);

        axs.push({ position: position, forward: forward, right: rightScaled, up: up });
    }

    return axs;
}

/**
 * Sample frames for an entire curve by stitching segment frames.
 * Handles open vs closed path cases similarly to the 2D sampler.
 * @param curveNodes - array of CurveNode3 defining the curve
 * @param curveWidths - array of widths matching curveNodes
 * @param closedPath - whether the path is closed (loops back to first node)
 * @param samplingResolution - samples per segment
 * @returns concatenated array of Frame3
 */
export function sampleCurveFrames3(
    curveNodes: CurveNode3[], curveWidths: number[],
    closedPath: boolean, samplingResolution: number
): Frame3[] {
    const axs: Frame3[] = [];

    const segmentsNumber = closedPath ? curveNodes.length : curveNodes.length - 1;

    for (let i = 0; i < segmentsNumber; i++) {
        const node1 = curveNodes[i];
        const node2 = curveNodes[(i + 1) % curveNodes.length];

        const width1 = curveWidths[i];
        const width2 = curveWidths[(i + 1) % curveWidths.length];

        const includeLast = i == segmentsNumber - 1 && !closedPath;

        axs.push(...sampleCurveSegmentFrames3(node1, node2, width1, width2, includeLast, samplingResolution));
    }

    return axs;
}