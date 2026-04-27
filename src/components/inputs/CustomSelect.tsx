import { FormControl, FormLabel, type SelectProps, Select } from '@mui/material';

export function CustomSelect({ label, ...rest }: SelectProps) {
    return (
        <FormControl variant='standard'>
            <FormLabel className='input-label'>{label}</FormLabel>
            <Select {...rest} />
        </FormControl>
    )
}