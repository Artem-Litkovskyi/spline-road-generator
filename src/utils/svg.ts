export type SVGCanvasTransform = {
    scale: number,
    offsetX: number,
    offsetY: number,
}

export function screenToWorld(x: number, y: number, svg: SVGSVGElement, canvasTransform: SVGCanvasTransform){
    const svgPoint = screenToSvg(x, y, svg);
    const canvasHeight = svg.clientHeight;
    return svgToWorld(svgPoint.x, svgPoint.y, canvasTransform, canvasHeight);
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

export function svgToWorld(x: number, y: number, canvasTransform: SVGCanvasTransform, canvasHeight: number) {
    return {
        x: x / canvasTransform.scale + canvasTransform.offsetX,
        y: (canvasHeight - y) / canvasTransform.scale + canvasTransform.offsetY,
    };
}

export function worldToSvg(x: number, y: number, canvasHeight: number, canvasTransform: SVGCanvasTransform) {
    return {
        x: (x - canvasTransform.offsetX) * canvasTransform.scale,
        y: canvasHeight - (y - canvasTransform.offsetY) * canvasTransform.scale,
    };
}
