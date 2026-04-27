import { FormControl, FormGroup, FormLabel, MenuItem, Select, TextField } from '@mui/material';
import { HorizontalBoxWithGap } from '../MuiWrappers.tsx';
import type { ExtensionType } from '../../utils/export.ts';

interface FilenameAndExtensionInputProps {
    label?: string;
    filename: string;
    setFilename: (value: string) => void;
    extension: ExtensionType;
    setExtension: (value: ExtensionType) => void;
}

export function FilenameAndExtensionInput(props: FilenameAndExtensionInputProps) {
    return (
        <FormGroup>
            <FormLabel className='inputLabel'>{props.label}</FormLabel>

            <HorizontalBoxWithGap>
                <TextField
                    placeholder='filename'
                    value={props.filename}
                    onChange={(e) => props.setFilename(e.target.value)}
                />

                <FormControl variant='standard' sx={{ transform: 'translateY(-3px)', minWidth: 120 }}>
                    <Select
                        value={props.extension}
                        onChange={(e) => props.setExtension(e.target.value)}
                    >
                        <MenuItem value='obj'>.obj</MenuItem>
                        <MenuItem value='gltf'>.gltf</MenuItem>
                        <MenuItem value='glb'>.glb</MenuItem>
                        <MenuItem value='svg'>.svg</MenuItem>
                    </Select>
                </FormControl>
            </HorizontalBoxWithGap>
        </FormGroup>
    )
}