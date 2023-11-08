import React, { useState } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles';
const ColorModeContext = React.createContext({ toggleColorMode: () => { } });

const MyColorContext = ({ children }) => {
    const getDesignTokens = (mode) => ({
        palette: {
            mode,
            text:{
                primary: '#4d5156'
              },
            ...(mode === 'light' ?
                {
                    primary: {
                        // light: will be calculated from palette.primary.main,
                        main: '#FF4841',
                        // dark: will be calculated from palette.primary.main,
                        // contrastText: will be calculated to contrast with palette.primary.main
                    },
                    secondary: {
                        main: '#7828FF',
                    },
                    contrastThreshold: 3,
                    // Used by the functions below to shift a color's luminance by approximately
                    // two indexes within its tonal palette.
                    // E.g., shift from Red 500 to Red 300 or Red 700.
                    tonalOffset: 0.2,
                }
                :
                {
                    background:
                    {
                        default: '#1B2635',
                        paper: '#233044'
                    },
                    primary: {
                        // light: will be calculated from palette.primary.main,
                        main: '#FF4841',
                        // dark: will be calculated from palette.primary.main,
                        // contrastText: will be calculated to contrast with palette.primary.main
                    },
                    secondary: {
                        main: '#7828FF',
                    },
                    contrastThreshold: 3,
                    // Used by the functions below to shift a color's luminance by approximately
                    // two indexes within its tonal palette.
                    // E.g., shift from Red 500 to Red 300 or Red 700.
                    tonalOffset: 0.2,
                })

        },
    });

    const [mode, setMode] = useState('light');
    const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

    const colorMode = React.useMemo(
        () => ({
            // The dark mode switch would invoke this method
            toggleColorMode: () => {
                setMode((prevMode) =>
                    prevMode === 'light' ? 'dark' : 'light',
                );
            },
        }),
        [],
    );

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </ColorModeContext.Provider>
    )
}

export default MyColorContext