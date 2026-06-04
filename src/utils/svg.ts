import type { CurveNode2, CurveNode3 } from '../geometry/curveNode.ts';
import { sampleCurveFrames2 } from '../geometry/frame2.ts';
import { add2, diff2 } from '../geometry/vec2.ts';

export type PanZoom = {
    panX: number,
    panY: number,
    zoom: number,
}

// Coordinates convertion
export function screenToWorld(x: number, y: number, svg: SVGSVGElement, panZoom: PanZoom){
    const svgPoint = screenToSvg(x, y, svg);
    const canvasHeight = svg.clientHeight;
    return svgToWorld(svgPoint.x, svgPoint.y, canvasHeight, panZoom);
}

export function screenToSvg(x: number, y: number, svg: SVGSVGElement){
    const screenPoint = svg.createSVGPoint();

    screenPoint.x = x;
    screenPoint.y = y;

    const svgPoint = screenPoint.matrixTransform(
        svg.getScreenCTM()?.inverse()
    );

    return {
        x: svgPoint.x,
        y: svgPoint.y
    }
}

export function svgToWorld(x: number, y: number, canvasHeight: number, panZoom: PanZoom) {
    return {
        x: (x - panZoom.panX) / panZoom.zoom,
        y: (panZoom.panY + canvasHeight - y) / panZoom.zoom,
    };
}

export function worldToSvg(x: number, y: number, canvasHeight: number, panZoom: PanZoom) {
    return {
        x: x * panZoom.zoom + panZoom.panX,
        y: -y * panZoom.zoom + canvasHeight + panZoom.panY,
    };
}

export function curveWorldToSvg(curveNodes: CurveNode3[], canvasHeight: number, panZoom: PanZoom) {
    return curveNodes.map((n: CurveNode3): CurveNode2 => ({
        position: worldToSvg(n.position.x, n.position.y, canvasHeight, panZoom),
        tangentEnd1: worldToSvg(n.tangentEnd1.x, n.tangentEnd1.y, canvasHeight, panZoom),
        tangentEnd2: worldToSvg(n.tangentEnd2.x, n.tangentEnd2.y, canvasHeight, panZoom),
    }));
}

// Smart Pan and Zoom
export function zoomAtWorldPoint(
    panZoom: PanZoom,
    svgX: number,
    svgY: number,
    zoomFactor: number,
    minZoom: number,
    maxZoom: number,
    canvasHeight: number,
): PanZoom {
    const oldZoom = panZoom.zoom;
    const newZoom = Math.min(Math.max(minZoom, oldZoom * zoomFactor), maxZoom);

    if (newZoom === oldZoom) return panZoom;

    const actualFactor = newZoom / oldZoom;

    return {
        zoom: newZoom,
        panX: svgX - (svgX - panZoom.panX) * actualFactor,
        panY: svgY - canvasHeight + (panZoom.panY + canvasHeight - svgY) * actualFactor,
    };
}

export function getFitPanZoom(
    minWorldX: number,
    minWorldY: number,
    maxWorldX: number,
    maxWorldY: number,
    canvasWidth: number,
    canvasHeight: number,
    padding: number = 0
): PanZoom {
    const worldWidth = maxWorldX - minWorldX;
    const worldHeight = maxWorldY - minWorldY;

    if (worldWidth === 0 || worldHeight === 0) {
        return { panX: 0, panY: 0, zoom: 1 };
    }

    const availableWidth = canvasWidth - padding * 2;
    const availableHeight = canvasHeight - padding * 2;

    const zoomX = availableWidth / worldWidth;
    const zoomY = availableHeight / worldHeight;
    const zoom = Math.min(zoomX, zoomY);

    const worldCenterX = (minWorldX + maxWorldX) / 2;
    const worldCenterY = (minWorldY + maxWorldY) / 2;

    const panX = (canvasWidth / 2) - (worldCenterX * zoom);
    const panY = (worldCenterY * zoom) - (canvasHeight / 2);

    return { panX, panY, zoom };
}

// SVG Commands
export function curveSegmentToPathCommands(
    curveNode1: CurveNode2, curveNode2: CurveNode2,
    curveWidth1: number, curveWidth2: number,
    samplingResolution: number,
) {
    const commands: string[] = [];

    const segmentNodes = [curveNode1, curveNode2];
    const segmentWidths = [curveWidth1 / 2, curveWidth2 / 2];

    const segmentFrames = sampleCurveFrames2(segmentNodes, segmentWidths, samplingResolution, false);

    // Left side
    const firstLeft = diff2(
        segmentFrames[0].position, segmentFrames[0].right);

    commands.push(`M ${firstLeft.x} ${firstLeft.y}`);

    for (let j = 1; j < segmentFrames.length; j++) {
        const p = diff2(segmentFrames[j].position, segmentFrames[j].right);
        commands.push(`L ${p.x} ${p.y}`);
    }

    // Right side
    const lastRight = add2(
        segmentFrames[segmentFrames.length - 1].position, segmentFrames[segmentFrames.length - 1].right);

    commands.push(`L ${lastRight.x} ${lastRight.y}`);

    for (let j = segmentFrames.length - 2; j >= 0; j--) {
        const p = add2(segmentFrames[j].position, segmentFrames[j].right);
        commands.push(`L ${p.x} ${p.y}`);
    }

    commands.push(`Z`)

    return commands.join(' ');
}

export function curveToPathCommands(
    curveNodes: CurveNode2[],
    curveWidths: number[],
    closedPath: boolean,
    samplingResolution: number,
) {
    const commands: string[] = [];

    const segmentCount = closedPath
        ? curveNodes.length
        : curveNodes.length - 1;

    for (let i = 0; i < segmentCount; i++) {
        const next = (i + 1) % curveNodes.length;

        commands.push(curveSegmentToPathCommands(
            curveNodes[i], curveNodes[next],
            curveWidths[i], curveWidths[next],
            samplingResolution,
        ))
    }

    return commands.join(' ');
}