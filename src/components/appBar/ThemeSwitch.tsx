import { Switch, Toolbar, useColorScheme } from '@mui/material';

import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

export function ThemeSwitch() {
    const { mode, setMode } = useColorScheme();

    if (!mode) return null;

    return (
        <Toolbar variant='dense'>
            <LightModeIcon />
            <Switch
                checked={mode === 'dark'}
                onChange={(_, checked) =>
                    setMode(checked ?  'dark' : 'light')
                }
            />
            <DarkModeIcon />
        </Toolbar>
    )
}