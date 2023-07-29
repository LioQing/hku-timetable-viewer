import { createContext } from 'react';
import ThemeMode from '../utils/ThemeMode';

export interface Settings {
  themeMode: ThemeMode;
}

export const SettingsContext = createContext({
  settings: {
    themeMode: ThemeMode.Light,
  } as Settings,
  setSettings: (settings: Settings) => { },
});