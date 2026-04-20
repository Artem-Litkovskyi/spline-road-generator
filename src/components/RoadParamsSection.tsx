import { Checkbox, FormControlLabel, Typography } from '@mui/material';
import { PanelSection } from './MuiWrappers.tsx';
import { CustomInput } from './inputs/CustomInput.tsx';

interface RoadParamsSectionProps {
    closedPath: boolean,
    setClosedPath: (value: boolean) => void,
    roadWidth: number,
    setRoadWidth: (value: number) => void,
    sideHeight: number,
    setSideHeight: (value: number) => void,
}

export function RoadParamsSection(props: RoadParamsSectionProps) {
    return (
        <PanelSection>
            <Typography variant='h6'>Road Parameters</Typography>

            <FormControlLabel
                label='Closed Path'
                sx={{ p: 0 }}
                control={<Checkbox
                    checked={props.closedPath}
                    onChange={(e) => props.setClosedPath(Boolean(e.target.checked))}
                />}
            />

            <CustomInput
                label='Road Width'
                type='number'
                placeholder='0'
                slotProps={{ htmlInput: { min: 1 } }}
                value={props.roadWidth}
                onChange={(e) => props.setRoadWidth(Number(e.target.value))}
            />

            <CustomInput
                label='Side Height'
                type='number'
                placeholder='0'
                slotProps={{ htmlInput: { min: 0.25 } }}
                value={props.sideHeight}
                onChange={(e) => props.setSideHeight(Number(e.target.value))}
            />
        </PanelSection>
    )
}