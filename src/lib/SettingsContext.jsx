import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { PALETTES, PALETTE_TOKENS } from '@/lib/themes';

const KEY = 'lc_career_settings';

export const DEFAULT_SETTINGS = {
  aiEnabled: true,
  facultyVisibility: false,
  publicPortfolio: false,
  frozenAlerts: true,
  weeklyDigest: true,
  reduceAnimations: false,
  theme: 'dark',
  palette: 'pioneer',
  fullName: '',
  majors: [],
  minors: [],
  gradYear: '',
  careerTrack: '',
};

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : { ...DEFAULT_SETTINGS };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(settings));
    } catch {
      /* ignore */
    }
  }, [settings]);

  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'light') root.classList.add('light');
    else root.classList.remove('light');
    if (settings.reduceAnimations) root.classList.add('reduce-animations');
    else root.classList.remove('reduce-animations');

    // Apply accent palette by overriding CSS custom properties inline.
    const palette = PALETTES[settings.palette] || PALETTES.pioneer;
    const variant = settings.theme === 'light' ? palette.light : palette.dark;
    PALETTE_TOKENS.forEach((k) => root.style.removeProperty(`--${k}`));
    Object.entries(variant).forEach(([k, v]) => root.style.setProperty(`--${k}`, v));
  }, [settings.theme, settings.reduceAnimations, settings.palette]);

  const update = useCallback((patch) => setSettings((s) => ({ ...s, ...patch })), []);

  return <SettingsContext.Provider value={{ settings, update }}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) return { settings: DEFAULT_SETTINGS, update: () => {} };
  return ctx;
}