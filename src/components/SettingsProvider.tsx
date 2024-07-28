import { useState } from 'react';
import { createTheme } from '@mui/material/styles';
import MuiThemeProvider from '@mui/material/styles/ThemeProvider';
import { Settings, SettingsContext } from '../contexts/SettingsContext';
import ThemeMode from '../utils/ThemeMode';
import { saveSettings, loadSettings } from '../utils/Storage';

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
  }),
  [ThemeMode.Dark]: createTheme({
    ...defaultTheme,
    palette: {
      mode: 'dark',
    },
  }),
};

const SettingsProvider = ({ children }: Props) => {
  const [settings, setSettingsState] = useState<Settings>(loadSettings());

  const setSettings = (newSettings: Settings) => {
    saveSettings(newSettings);
    setSettingsState(newSettings);
  };

  return (
    <MuiThemeProvider theme={themes[settings.themeMode]}>
      <SettingsContext.Provider value={{ settings, setSettings }}>
        {children}
      </SettingsContext.Provider>
    </MuiThemeProvider>
  );
};

export default SettingsProvider;