export type Transform = {
    scale: number,
    offsetX: number,
    offsetY: number,
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

export function screenToWorld(x: number, y: number, svg: SVGSVGElement, t: Transform){
    const svgPoint = screenToSvg(x, y, svg);
    const svgHeight = svg.clientHeight;
    return svgToWorld(svgPoint.x, svgPoint.y, t, svgHeight);
}

export function worldToSvg(x: number, y: number, t: Transform, svgHeight: number) {
    return {
        x: (x - t.offsetX) * t.scale,
        y: svgHeight - (y - t.offsetY) * t.scale,
    };
}

export function svgToWorld(x: number, y: number, t: Transform, svgHeight: number) {
    return {
        x: x / t.scale + t.offsetX,
        y: (svgHeight - y) / t.scale + t.offsetY,
    };
}