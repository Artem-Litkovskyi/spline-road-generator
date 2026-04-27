import { FormGroup, FormLabel } from '@mui/material';
import { HorizontalBoxWithGap } from '../MuiWrappers.tsx';
import { CoordinateInput } from './CoordinateInput.tsx';
import type { Vec3 } from '../../geometry/vec3.ts';

interface Vec3InputProps {
    label?: string;
    value: Vec3;
    setValue: (value: Vec3) => void;
}

export function Vec3Input({ label, value, setValue }: Vec3InputProps) {
    return (
        <FormGroup>
            <FormLabel className='input-label'>{label}</FormLabel>

            <HorizontalBoxWithGap>
                <CoordinateInput label={'X:'} value={value.x} setValue={x => setValue({...value, x: x})} />
                <CoordinateInput label={'Y:'} value={value.y} setValue={y => setValue({...value, y: y})} />
                <CoordinateInput label={'Z:'} value={value.z} setValue={z => setValue({...value, z: z})} />
            </HorizontalBoxWithGap>
        </FormGroup>
    )
}