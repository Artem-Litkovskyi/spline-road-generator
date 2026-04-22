import type { DragContext } from '../hooks/useHandleDrag.ts';

export interface Handle {
    onMouseDown?: () => void;
    onDrag: (ctx: DragContext) => void;
    onDragEnd?: () => void;
}