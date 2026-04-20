import React from 'react';
import type { Vec2 } from '../../../geometry/vec2.ts';

export interface HandleProps {
    origin: Vec2;
    className: string;
    onMouseDown: (e: React.MouseEvent<SVGElement>) => void;
}