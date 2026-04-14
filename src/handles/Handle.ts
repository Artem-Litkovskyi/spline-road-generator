import type { Vec2 } from '../geometry/vec2.ts';

export type DragContext = {
    startMouse: Vec2;
    currentMouse: Vec2;
    delta: Vec2;
};

export interface Handle {
    onMouseDown?: () => void;
    onDrag: (ctx: DragContext) => void;
    onDragEnd?: () => void;
}