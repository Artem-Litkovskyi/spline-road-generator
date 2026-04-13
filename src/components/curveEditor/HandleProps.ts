import React from 'react';
import type { Vec2 } from '../../utils/vec2.ts';

export interface HandleProps {
    origin: Vec2;
    className: string;
    onMouseDown: (e: React.MouseEvent<SVGElement>) => void;
}