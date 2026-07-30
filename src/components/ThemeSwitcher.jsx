import { Check } from 'lucide-react';
import { useSettings } from '@/lib/SettingsContext';
import { PALETTES, PALETTE_KEYS } from '@/lib/themes';

export default function ThemeSwitcher({ compact = false }) {
  const { settings, update } = useSettings();
  return (
    <div className={`flex ${compact ? 'gap-1.5' : 'gap-2'} flex-wrap`} role="radiogroup" aria-label="Accent theme palette">
      {PALETTE_KEYS.map((key) => {
        const p = PALETTES[key];
        const active = settings.palette === key;
        return (
          <button
            key={key}
            onClick={() => update({ palette: key })}
            role="radio"
            aria-checked={active}
            aria-label={p.name}
            title={p.name}
            className={`relative rounded-full border-2 transition-all ${compact ? 'w-6 h-6' : 'w-8 h-8'} ${
              active ? 'border-foreground scale-110' : 'border-border hover:border-muted-foreground'
            }`}
            style={{ backgroundColor: p.swatch }}
          >
            {active && <Check className="absolute inset-0 m-auto w-3.5 h-3.5 text-white mix-blend-difference" />}
          </button>
        );
      })}
    </div>
  );
}