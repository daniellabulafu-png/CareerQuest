import { Settings as SettingsIcon, Bot, Shield, Bell, GraduationCap, Palette, Sun, Moon, Sparkles, Check } from 'lucide-react';
import { useSettings } from '@/lib/SettingsContext';
import { Switch } from '@/components/ui/switch';
import { LC_MAJORS, CAREER_TRACKS, NACE_COMPETENCIES, naceColors } from '@/lib/nace';
import { base44 } from '@/api/base44Client';
import { PALETTES, PALETTE_KEYS } from '@/lib/themes';

function Section({ icon: Icon, title, desc, children }) {
  return (
    <div className="card-glass rounded-2xl p-5">
      <div className="flex items-center gap-2.5 mb-1">
        <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h2 className="font-bold text-sm">{title}</h2>
          {desc && <p className="text-[11px] text-muted-foreground">{desc}</p>}
        </div>
      </div>
      <div className="mt-4 space-y-4">{children}</div>
    </div>
  );
}

function Toggle({ label, desc, checked, onChange }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="text-sm font-semibold">{label}</p>
        {desc && <p className="text-[11px] text-muted-foreground mt-0.5">{desc}</p>}
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

function ChipPicker({ options, selected, onToggle }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = selected.includes(opt);
        return (
          <button
            key={opt}
            onClick={() => onToggle(opt)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              active
                ? 'bg-primary/20 border-primary text-primary font-semibold'
                : 'bg-secondary/40 border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            {active && <Check className="w-3 h-3 inline mr-1" />}
            {opt}
          </button>
        );
      })}
    </div>
  );
}

export default function Settings() {
  const { settings, update } = useSettings();
  const gradYears = Array.from({ length: 6 }, (_, i) => String(2026 + i));

  const toggleIn = (key, value) => {
    const arr = settings[key] || [];
    update({ [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value] });
  };

  return (
    <div className="space-y-6 pb-16 md:pb-0 max-w-3xl mx-auto">
      <div className="flex items-center gap-2">
        <SettingsIcon className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-black">Settings</h1>
      </div>

      <Section icon={Bot} title="AI Features" desc="Control AI-generated content across the app">
        <Toggle
          label="Enable AI Features"
          desc="When off, the app uses structured templates, keyword matching, and manual rubrics instead of AI generation."
          checked={settings.aiEnabled}
          onChange={(v) => update({ aiEnabled: v })}
        />
        {!settings.aiEnabled && (
          <div className="text-[11px] text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
            AI is off. Resume Assistant uses STAR templates · Skill Gap Radar uses keyword matching · Interview Boss Battle shows a self-assessment checklist.
          </div>
        )}
      </Section>

      <Section icon={Shield} title="Privacy & Sharing" desc="Control who sees your data">
        <Toggle
          label="Allow L&C Faculty/Advisors to view my Skill Tree & Application Progress"
          desc="Opt in to 1-on-1 career support. Faculty see your level, skill gaps, and applications only when you enable this."
          checked={settings.facultyVisibility}
          onChange={(v) => { update({ facultyVisibility: v }); base44.auth.updateMe({ opt_in_advising: v }).catch(() => {}); }}
        />
        <Toggle
          label="Enable Public Portfolio Link"
          desc="Generates a view-only shareable URL of your skill tree and experiences."
          checked={settings.publicPortfolio}
          onChange={(v) => update({ publicPortfolio: v })}
        />
        {settings.publicPortfolio && (
          <div className="text-[11px] text-muted-foreground bg-secondary/40 rounded-lg p-3 break-all">
            https://careerquest.lclark.edu/p/{Math.random().toString(36).slice(2, 10)}
          </div>
        )}
      </Section>

      <Section icon={Bell} title="Notifications & CRM Alerts">
        <Toggle
          label="Alert me when networking cards become Frozen (30+ days inactive)"
          checked={settings.frozenAlerts}
          onChange={(v) => update({ frozenAlerts: v })}
        />
        <Toggle
          label="Weekly Quest & Follow-Up Digest"
          checked={settings.weeklyDigest}
          onChange={(v) => update({ weeklyDigest: v })}
        />
      </Section>

      <Section icon={GraduationCap} title="Academic Profile" desc="Update your Lewis & Clark academic info">
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Major(s)</label>
          <ChipPicker options={LC_MAJORS} selected={settings.majors} onToggle={(v) => toggleIn('majors', v)} />
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Minor(s)</label>
          <ChipPicker options={LC_MAJORS} selected={settings.minors} onToggle={(v) => toggleIn('minors', v)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Graduation Year</label>
            <select
              value={settings.gradYear}
              onChange={(e) => update({ gradYear: e.target.value })}
              className="w-full bg-secondary/60 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">Select…</option>
              {gradYears.map((y) => <option key={y}>{y}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Target Career Track</label>
            <select
              value={settings.careerTrack}
              onChange={(e) => update({ careerTrack: e.target.value })}
              className="w-full bg-secondary/60 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">Select…</option>
              {CAREER_TRACKS.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
      </Section>

      <Section icon={Palette} title="Appearance & Accessibility">
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Accent Palette</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PALETTE_KEYS.map((key) => {
              const p = PALETTES[key];
              const active = settings.palette === key;
              return (
                <button
                  key={key}
                  onClick={() => update({ palette: key })}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border text-left transition-colors ${active ? 'border-primary bg-primary/10' : 'border-border hover:border-muted-foreground'}`}
                  aria-pressed={active}
                >
                  <span className="w-6 h-6 rounded-full border-2 border-foreground/20 shrink-0" style={{ backgroundColor: p.swatch }} />
                  <p className="text-sm font-semibold">{p.name}</p>
                  {active && <Check className="w-4 h-4 text-primary ml-auto" />}
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Mode</label>
          <div className="flex gap-2">
            <button
              onClick={() => update({ theme: 'dark' })}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold transition-colors ${
                settings.theme === 'dark' ? 'border-primary bg-primary/15 text-primary' : 'border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              <Moon className="w-4 h-4" /> Dark
            </button>
            <button
              onClick={() => update({ theme: 'light' })}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold transition-colors ${
                settings.theme === 'light' ? 'border-primary bg-primary/15 text-primary' : 'border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              <Sun className="w-4 h-4" /> Light
            </button>
          </div>
        </div>
        <Toggle
          label="Reduce Animations"
          desc="Disables glow flicker and float-up effects for low-spec screens."
          checked={settings.reduceAnimations}
          onChange={(v) => update({ reduceAnimations: v })}
        />
      </Section>

      <div className="card-glass rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-xp" />
          <h2 className="font-bold text-sm">NACE Career Readiness Competencies</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {NACE_COMPETENCIES.map((n) => (
            <span key={n} className={`text-[11px] px-2.5 py-1 rounded-full border ${naceColors[n]}`}>{n}</span>
          ))}
        </div>
      </div>
    </div>
  );
}