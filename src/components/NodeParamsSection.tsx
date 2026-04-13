import { Typography } from '@mui/material';
import { PanelSection } from './MuiWrappers.tsx';
import { Vec3Input } from './inputs/Vec3Input.tsx';

export function NodeParamsSection() {
    return (
        <PanelSection>
            <Typography variant='h6'>Selected Node</Typography>

            <Vec3Input label='Node Position' />

            <Vec3Input label='Tangent 1 End' />

            <Vec3Input label='Tangent 2 End' />
        </PanelSection>
    )
}