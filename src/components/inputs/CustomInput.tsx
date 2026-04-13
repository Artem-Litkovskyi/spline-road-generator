import { FormGroup, FormLabel, TextField, type TextFieldProps } from '@mui/material';

export function CustomInput({ label, ...rest }: TextFieldProps) {
    return (
        <FormGroup>
            <FormLabel className='inputLabel'>{label}</FormLabel>
            <TextField {...rest} />
        </FormGroup>
    )
}