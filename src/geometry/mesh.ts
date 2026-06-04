// geometry/mesh.ts
// Mesh generation helpers used to sweep a 2D profile along curve frames to
// produce a 3D road surface. The functions are intentionally simple and
// return plain arrays of vertices and triangle indices suitable for OBJ export
// or feeding a WebGL/three.js geometry buffer.
import type { CurveNode3 } from './curveNode.ts';
import { sampleCurveFrames3 } from './frame3';
import { type Vec2 } from './vec2.ts';
import { type Vec3 } from './vec3.ts';

/**
 * Sweep a 2D profile along curve frames to build a triangular mesh.
 * @param curveNodes - control nodes defining the center curve
 * @param curveWidths - widths per node used to scale right vectors
 * @param profile - cross-section profile points (Vec2) in local cross-section space
 * @param samplingResolution - number of samples per curve segment
 * @param closedPath - true for closed curves (wraps final frames to first)
 * @param skipPolygonIdx - optional indices in profile to skip when making quads
 * @returns object with vertices (Vec3[]) and triangle indices (number[])
 */
export function generateSweepSurfaceMesh(
    curveNodes: CurveNode3[],
    curveWidths: number[],
    profile: Vec2[],
    samplingResolution: number,
    closedPath: boolean,
    skipPolygonIdx?: number[]
) {
    const vertices: Vec3[] = [];
    const indices: number[] = [];

    // Sample frames along the whole curve; frames already include scaled right
    // vectors according to width interpolation.
    const axs = sampleCurveFrames3(curveNodes, curveWidths, closedPath, samplingResolution);

    const lastAxesIdx = axs.length - 1;
    const lastCrossSectionVertexIdx = profile.length - 1;

    let vertexIdx = 0;

    // For each frame (row) and each profile point (column) compute vertex
    // coordinates. Then generate two triangles (a quad) connecting each cell
    // to the next row unless indicated to skip.
    for (let i = 0; i < axs.length; i++) {
        const ax = axs[i];
        for (let j = 0; j < profile.length; j++) {
            const pt = profile[j];

            // local cross-section point -> world coordinates
            vertices.push({
                x: ax.position.x + ax.right.x * pt.x + ax.up.x * pt.y,
                y: ax.position.y + ax.right.y * pt.x + ax.up.y * pt.y,
                z: ax.position.z + ax.right.z * pt.x + ax.up.z * pt.y,
            });

            const rightmostVertex = j == lastCrossSectionVertexIdx;
            const currentRowIsLast = i == lastAxesIdx;
            const nextRowIsFirst = currentRowIsLast && closedPath;

            // Build indices for quad -> two triangles (a,c,b) and (b,c,d)
            if (
                !rightmostVertex
                && (skipPolygonIdx == null || !skipPolygonIdx.includes(j))
                && (!currentRowIsLast || closedPath)
            ) {
                const a = vertexIdx;
                const b = a + 1;
                const c = nextRowIsFirst ? j : a + profile.length;
                const d = c + 1;

                indices.push(a, c, b);
                indices.push(b, c, d);
            }

            // Optimization: if we are at rightmost vertex of the last row and the
            // path is closed then the next row wraps to the first; avoid pushing
            // duplicate vertex index in that case.
            if (rightmostVertex && nextRowIsFirst) break;

            vertexIdx++;
        }
    }

    return { vertices, indices };
}

// generateRoadProfile: returns a simple road cross-section profile for the
// given width and height. `skipPolygonIdx` marks indices that should not be
// used when creating face polygons (helps when profile contains duplicated
// points used for UV seams or sharp edges).
/**
 * Generate a simple road cross-section profile for mesh sweeping.
 * @param width - total road width
 * @param height - depth/height of the road cross-section (e.g. curb depth)
 * @returns object containing `profile` (Vec2[]) and `skipPolygonIdx` (number[])
 */
export function generateRoadProfile(width: number, height: number) {
    const halfWidth = width / 2;
    const profile: Vec2[] = [
        { x: -halfWidth, y: -height },
        { x: -halfWidth, y: 0 },
        { x: -halfWidth, y: 0 },
        { x: halfWidth, y: 0 },
        { x: halfWidth, y: 0 },
        { x: halfWidth, y: -height },
    ];
    const skipPolygonIdx: number[] = [1, 3];
    return { profile, skipPolygonIdx };
}