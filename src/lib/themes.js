// 5 WCAG-AA compliant accent palettes for CareerQuest @ Lewis & Clark.
// Values are HSL channels (e.g. "21 96% 45%") applied to CSS custom properties.
export const PALETTES = {
  pioneer: {
    name: 'Otter Spirit',
    swatch: '#E35205',
    dark:  { primary: '21 96% 45%', accent: '21 96% 45%', ring: '21 96% 45%', xp: '43 90% 52%' },
    light: { primary: '21 90% 42%', accent: '21 90% 42%', ring: '21 90% 42%', xp: '38 92% 45%' },
  },
  forest: {
    name: 'PNW Forest',
    swatch: '#1B4332',
    dark:  { primary: '146 42% 30%', accent: '149 44% 55%', ring: '146 42% 30%', xp: '149 44% 62%' },
    light: { primary: '146 42% 26%', accent: '146 42% 32%', ring: '146 42% 26%', xp: '149 44% 42%' },
  },
  cyber: {
    name: 'Midnight Cyber',
    swatch: '#06B6D4',
    dark:  { primary: '190 88% 38%', accent: '190 90% 50%', ring: '190 88% 38%', xp: '190 90% 56%' },
    light: { primary: '190 85% 36%', accent: '190 85% 44%', ring: '190 85% 36%', xp: '190 85% 42%' },
  },
  sunset: {
    name: 'Palatine Sunset',
    swatch: '#C85A32',
    dark:  { primary: '16 64% 44%', accent: '16 64% 44%', ring: '16 64% 44%', xp: '43 90% 55%' },
    light: { primary: '16 60% 42%', accent: '16 60% 42%', ring: '16 60% 42%', xp: '38 90% 45%' },
  },
  contrast: {
    name: 'High-Contrast Accessible',
    swatch: '#FFD400',
    dark:  { primary: '217 90% 55%', accent: '48 100% 50%', ring: '217 90% 55%', xp: '48 100% 50%', background: '0 0% 0%', foreground: '0 0% 100%', card: '0 0% 8%', border: '0 0% 35%' },
    light: { primary: '217 90% 45%', accent: '45 100% 40%', ring: '217 90% 45%', xp: '40 100% 35%', background: '0 0% 100%', foreground: '0 0% 0%', card: '0 0% 95%', border: '0 0% 40%' },
  },
};

export const PALETTE_KEYS = ['pioneer', 'forest', 'cyber', 'sunset', 'contrast'];

// Every CSS token a palette may override — used to clear inline styles on switch.
export const PALETTE_TOKENS = ['primary', 'accent', 'ring', 'xp', 'background', 'foreground', 'card', 'border'];