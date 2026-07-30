import { useState } from 'react';
import { Briefcase, X, Check } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { NACE_COMPETENCIES, naceColors } from '@/lib/nace';

const ACTIVITY_TYPES = [
  'Internship', 'Employment', 'Thesis/Research Project', 'Study Abroad',
  'Symposium Presentation', 'Creative Portfolio Item', 'Campus Leadership',
  'Project', 'Coursework', 'Extracurricular', 'Volunteer/Community Service',
];

export default function ExperienceFormModal({ open, onClose, onSaved }) {
  const [form, setForm] = useState({
    title: '', organization: '', type: 'Project', description: '',
    start_date: '', end_date: '', current: false, competencies: [],
  });
  const [saving, setSaving] = useState(false);
  if (!open) return null;

  const toggleNace = (n) =>
    setForm((f) => ({ ...f, competencies: f.competencies.includes(n) ? f.competencies.filter((x) => x !== n) : [...f.competencies, n] }));

  const save = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      await base44.entities.Experience.create(form);
      onSaved?.();
      onClose();
      setForm({ title: '', organization: '', type: 'Project', description: '', start_date: '', end_date: '', current: false, competencies: [] });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="card-glass rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto scrollbar-thin animate-float-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-border/60 sticky top-0 bg-card/95 backdrop-blur z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <h2 className="font-bold text-base">Log an Experience</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary/60"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-5 space-y-3">
          <Field label="Title *">
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g., Senior Thesis on Urban Policy" className="w-full bg-secondary/60 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Organization">
              <input value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} placeholder="e.g., L&C, NGO, Lab" className="w-full bg-secondary/60 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </Field>
            <Field label="Activity Type">
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full bg-secondary/60 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                {ACTIVITY_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Start Date"><input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} className="w-full bg-secondary/60 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" /></Field>
            <Field label="End Date"><input type="date" disabled={form.current} value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} className="w-full bg-secondary/60 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50" /></Field>
          </div>
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <input type="checkbox" checked={form.current} onChange={(e) => setForm({ ...form, current: e.target.checked })} className="accent-primary" /> Currently ongoing
          </label>
          <Field label="Description">
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="What did you do and learn?" className="w-full bg-secondary/60 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
          </Field>

          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Attach NACE Career Readiness Badges</label>
            <div className="flex flex-wrap gap-2">
              {NACE_COMPETENCIES.map((n) => {
                const active = form.competencies.includes(n);
                return (
                  <button key={n} onClick={() => toggleNace(n)} className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors ${active ? naceColors[n] + ' font-semibold' : 'bg-secondary/40 border-border text-muted-foreground hover:text-foreground'}`}>
                    {active && <Check className="w-3 h-3 inline mr-1" />}{n}
                  </button>
                );
              })}
            </div>
          </div>

          <button onClick={save} disabled={saving || !form.title.trim()} className="w-full px-4 py-2.5 rounded-lg bg-primary text-white font-bold text-sm hover:opacity-90 disabled:opacity-50 transition-opacity">
            {saving ? 'Saving…' : 'Log Experience'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">{label}</label>
      {children}
    </div>
  );
}