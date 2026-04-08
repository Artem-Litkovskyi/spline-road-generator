export function getSVGPoint(svg: SVGSVGElement, screenX: number, screenY: number){
    const screenPoint = svg.createSVGPoint();

    screenPoint.x = screenX;
    screenPoint.y = screenY;

    const svgPoint = screenPoint.matrixTransform(
        svg.getScreenCTM()?.inverse()
    );

    return { x: svgPoint.x, y: svgPoint.y };
}

export function getRootSVG(el: SVGElement): SVGSVGElement | null {
    if (el instanceof SVGSVGElement) return el;
    return el.ownerSVGElement;
}