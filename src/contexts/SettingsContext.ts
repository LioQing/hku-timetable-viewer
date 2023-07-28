import { createContext } from 'react';

export enum ThemeMode {
  Light = 'light',
  Dark = 'dark',
}

export interface Settings {
  themeMode: ThemeMode;
}

export const SettingsContext = createContext({
  settings: {
    themeMode: ThemeMode.Light,
  } as Settings,
  setSettings: (settings: Settings) => { },
});