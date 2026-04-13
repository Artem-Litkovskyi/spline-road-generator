import { Checkbox, FormControlLabel, Typography } from '@mui/material';
import { PanelSection } from './MuiWrappers.tsx';
import { CustomInput } from './inputs/CustomInput.tsx';

export function RoadParamsSection() {
    return (
        <PanelSection>
            <Typography variant='h6'>Road Parameters</Typography>

            <FormControlLabel
                sx={{ p: 0 }}
                control={<Checkbox />}
                label='Closed Path'
            />

            <CustomInput
                label='Road Width'
                type='number'
                placeholder='0'
                slotProps={{ htmlInput: { min: 1 } }}
            />
        </PanelSection>
    )
}