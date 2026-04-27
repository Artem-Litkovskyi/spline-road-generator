import React from 'react';
import type { Vec2 } from '../../../geometry/vec2.ts';

export interface HandleProps {
    className: string;
    svgKey: string;
    origin: Vec2;
    onMouseDown: (e: React.MouseEvent<SVGElement>) => void;
}