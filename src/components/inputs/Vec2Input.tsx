import { FormGroup, FormLabel } from '@mui/material';
import { HorizontalInputBox } from '../MuiWrappers.tsx';
import { CoordinateInput } from './CoordinateInput.tsx';
import type { Vec2 } from '../../geometry/vec2.ts';

interface Vec2InputProps {
    label?: string;
    value: Vec2;
    setValue: (value: Vec2) => void;
}

export function Vec2Input({ label, value, setValue }: Vec2InputProps) {
    return (
        <FormGroup>
            <FormLabel className='inputLabel'>{label}</FormLabel>

            <HorizontalInputBox>
                <CoordinateInput label={'X:'} value={value.x} setValue={x => setValue({...value, x: x})} />
                <CoordinateInput label={'Y:'} value={value.y} setValue={y => setValue({...value, y: y})} />
            </HorizontalInputBox>
        </FormGroup>
    )
}