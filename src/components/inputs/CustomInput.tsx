import { FormGroup, FormLabel, TextField, type TextFieldProps } from '@mui/material';

export function CustomInput({ label, ...rest }: TextFieldProps) {
    return (
        <FormGroup>
            <FormLabel className='input-label'>{label}</FormLabel>
            <TextField {...rest} />
        </FormGroup>
    )
}