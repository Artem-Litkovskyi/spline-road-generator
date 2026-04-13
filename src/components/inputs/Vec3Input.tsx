import { FormGroup, FormLabel } from '@mui/material';
import { HorizontalInputBox } from '../MuiWrappers.tsx';
import { CoordinateInput } from './CoordinateInput.tsx';

interface Vec3InputProps {
    label?: string;
}

export function Vec3Input({ label }: Vec3InputProps) {
    return (
        <FormGroup>
            <FormLabel className='inputLabel'>{label}</FormLabel>

            <HorizontalInputBox>
                <CoordinateInput label={'X:'} />
                <CoordinateInput label={'Y:'} />
                <CoordinateInput label={'Z:'} />
            </HorizontalInputBox>
        </FormGroup>
    )
}