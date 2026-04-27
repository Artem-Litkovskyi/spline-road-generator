import { Divider, Typography } from '@mui/material';

import { HorizontalBoxWithGap } from '../MuiWrappers.tsx';
import { ControlHint } from './ControlHint.tsx';

type CurveEditorControlHintsProps = {
    zoom: number;
}

export function CurveEditorControlHints({ zoom }: CurveEditorControlHintsProps) {
    return (
        <HorizontalBoxWithGap sx={{ justifyContent: 'space-between', padding: 1 }}>
            <HorizontalBoxWithGap>
                <ControlHint bindings='Left Click' description='Add / Insert / Select node' />
                <Divider orientation='vertical' />
                <ControlHint bindings='Backspace' description='Remove node' />
                <Divider orientation='vertical' />
                <ControlHint bindings='Ctrl + Wheel' description='Zoom' />
                <Divider orientation='vertical' />
                <ControlHint bindings='Right Click / Wheel Click' description='Pan' />
                <Divider orientation='vertical' />
            </HorizontalBoxWithGap>

            <Typography component='span' variant='body2'>
                Zoom: {Math.floor(zoom * 100)}%
            </Typography>
        </HorizontalBoxWithGap>
    )
}