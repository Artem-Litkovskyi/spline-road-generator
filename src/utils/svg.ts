import type { CurveNode2, CurveNode3 } from '../geometry/curveNode.ts';

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

// Smart Zoom
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

// SVG Commands
export function curveSectionToPathCommand(n0: CurveNode2, n1: CurveNode2) {
    return `C ${n0.tangentEnd2.x},${n0.tangentEnd2.y}
            ${n1.tangentEnd1.x},${n1.tangentEnd1.y}
            ${n1.position.x},${n1.position.y}`;
}

export function curveToPathCommands(curveNodes: CurveNode2[], closedPath: boolean = false) {
    const commands: string[] = [];

    commands.push(`M ${curveNodes[0].position.x},${curveNodes[0].position.y}`);

    for (let i = 0; i < curveNodes.length - 1; i++) {
        const n0 = curveNodes[i];
        const n1 = curveNodes[i + 1];
        commands.push(curveSectionToPathCommand(n0, n1));
    }

    if (closedPath) {
        const n0 = curveNodes[curveNodes.length - 1];
        const n1 = curveNodes[0];
        commands.push(curveSectionToPathCommand(n0, n1));
        commands.push('Z');
    }

    return commands.join(' ');
}