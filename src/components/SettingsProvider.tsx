import { useState } from 'react';
import { createTheme } from '@mui/material/styles';
import MuiThemeProvider from '@mui/material/styles/ThemeProvider';
import { ThemeMode, Settings, SettingsContext } from '../contexts/SettingsContext';

interface Props {
  children?: React.ReactNode;
}

const defaultTheme = {
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        body {
          transition: all 100ms ease;
        }
      `,
    },
  }
};

const themes = {
  [ThemeMode.Light]: createTheme({
    ...defaultTheme,
    palette: {
      mode: 'light',
    },
    transitions: {

    }
  }),
  [ThemeMode.Dark]: createTheme({
    ...defaultTheme,
    palette: {
      mode: 'dark',
    },
  }),
};

const SettingsProvider = ({ children }: Props) => {
  const [settings, setSettings] = useState<Settings>({
    themeMode: ThemeMode.Light,
  });

  return (
    <MuiThemeProvider theme={themes[settings.themeMode]}>
      <SettingsContext.Provider value={{ settings, setSettings }}>
        {children}
      </SettingsContext.Provider>
    </MuiThemeProvider>
  );
};

export default SettingsProvider;