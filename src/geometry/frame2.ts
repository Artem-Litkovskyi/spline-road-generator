// geometry/frame2.ts
// Sample 2D frames along cubic Bézier curve segments. Frames include
// position, forward (tangent direction) and right (perpendicular scaled by width).
// These are the basis for 2D path rendering and for generating cross-sections.
import type { CurveNode2 } from './curveNode';
import { cubicBezier, cubicBezier2, cubicBezierDerivative2 } from './bezier.ts';
import { normalize2, perpendicular, scale2, type Vec2 } from './vec2.ts';

export type Frame2 = {
    position: Vec2;
    forward: Vec2;
    right: Vec2;
}

/**
 * Sample frames along a 2D Bezier segment.
 * @param node1 - first control node
 * @param node2 - second control node
 * @param width1 - width at the first node
 * @param width2 - width at the second node
 * @param samplingResolution - number of samples per segment (including/excluding last depending on includeLast)
 * @param includeLast - when false, the last sample is omitted to avoid duplicate vertices between segments
 * @returns array of Frame2 objects representing position, forward and scaled right vector
 */
export function sampleCurveSegmentFrames2(
    node1: CurveNode2, node2: CurveNode2,
    width1: number, width2: number,
    samplingResolution: number, includeLast: boolean
): Frame2[] {
    const axs: Frame2[] = [];

    // If includeLast is false we sample one fewer interior step to avoid
    // duplicating the connecting vertex with the next segment.
    const steps = includeLast ? samplingResolution : samplingResolution - 1;

    for (let i = 0; i <= steps; i++) {
        const t = i / steps;

        // Position on curve and forward tangent (normalized derivative)
        const position = cubicBezier2(node1.position, node1.tangentEnd2, node2.tangentEnd1, node2.position, t);
        const forward = normalize2(cubicBezierDerivative2(node1.position, node1.tangentEnd2, node2.tangentEnd1, node2.position, t));
        const right = perpendicular(forward);

        // Width interpolation using Bezier for smooth width transitions
        const width = cubicBezier(width1, width1, width2, width2, t);
        const rightScaled = scale2(right, width);

        axs.push({ position: position, forward: forward, right: rightScaled });
    }

    return axs;
}

/**
 * Sample frames for an entire curve composed of multiple nodes.
 * @param curveNodes - array of CurveNode2 defining the curve
 * @param curveWidths - array of widths matching curveNodes
 * @param samplingResolution - number of samples per segment
 * @param closedPath - whether the path is closed (loops back to first node)
 * @returns concatenated array of Frame2 for the whole curve
 */
export function sampleCurveFrames2(
    curveNodes: CurveNode2[], curveWidths: number[],
    samplingResolution: number, closedPath: boolean
): Frame2[] {
    const axs: Frame2[] = [];

    const segmentsNumber = closedPath ? curveNodes.length : curveNodes.length - 1;

    for (let i = 0; i < segmentsNumber; i++) {
        const node1 = curveNodes[i];
        const node2 = curveNodes[(i + 1) % curveNodes.length];

        const width1 = curveWidths[i];
        const width2 = curveWidths[(i + 1) % curveWidths.length];

        const includeLast = i == segmentsNumber - 1 && !closedPath;

        axs.push(...sampleCurveSegmentFrames2(node1, node2, width1, width2, samplingResolution, includeLast));
    }

    return axs;
}