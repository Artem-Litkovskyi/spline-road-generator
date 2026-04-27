import { Code } from '../MuiWrappers.tsx';
import { Typography } from '@mui/material';

type ControlHintProps = {
    bindings: string;
    description: string;
};

export function ControlHint({ bindings, description }: ControlHintProps) {
    const parts = bindings.split(/([+/])/g).filter(Boolean);

    return (
        <Typography component='span' variant='body2'>
            {parts.map((part, index) => {
                if (part === '+' || part === '/') return ` ${part} `;

                return (
                    <Code key={index}>
                        {part.trim()}
                    </Code>
                );
            })}

            {' – '}{description}
        </Typography>
    );
}