export type PanZoom = {
    panX: number,
    panY: number,
    zoom: number,
}

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