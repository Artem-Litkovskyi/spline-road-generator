import type { PanZoom } from '../hooks/usePanZoom.ts';

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
        y: (canvasHeight - y - panZoom.panY) / panZoom.zoom,
    };
}

export function worldToSvg(x: number, y: number, canvasHeight: number, panZoom: PanZoom) {
    return {
        x: x * panZoom.zoom + panZoom.panX,
        y: -y * panZoom.zoom + canvasHeight - panZoom.panY,
    };
}
