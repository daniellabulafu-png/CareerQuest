import { useState } from 'react';
import { Users, Plus, Flame, Snowflake, X } from 'lucide-react';
import { useBusinessCards } from '@/hooks/useEntities';
import { base44 } from '@/api/base44Client';
import BusinessCardItem from '@/components/BusinessCardItem';
import UnfreezeModal from '@/components/UnfreezeModal';
import { cardTemperature } from '@/hooks/useEntities';

const themes = ['amber', 'blue', 'cyan', 'violet'];

export default function Networking() {
  const { data: cards = [], refetch, isLoading } = useBusinessCards();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [unfreezeCard, setUnfreezeCard] = useState(null);

  function emptyForm() {
    return { contact_name: '', role: '', company: '', met_platform: '', last_contact_date: '', follow_up_date: '', notes: '', email: '', linkedin_url: '', color_theme: 'blue' };
  }

  const hotCount = cards.filter((c) => cardTemperature(c.last_contact_date) === 'hot').length;
  const frozenCount = cards.filter((c) => cardTemperature(c.last_contact_date) === 'frozen').length;

  const openNew = () => { setEditing(null); setForm(emptyForm()); setFormOpen(true); };
  const openEdit = (card) => { setEditing(card); setForm({ ...card, last_contact_date: card.last_contact_date?.slice(0, 10), follow_up_date: card.follow_up_date?.slice(0, 10) }); setFormOpen(true); };

  const save = async () => {
    if (!form.contact_name.trim()) return;
    if (editing) {
      await base44.entities.BusinessCard.update(editing.id, form);
    } else {
      await base44.entities.BusinessCard.create(form);
    }
    setFormOpen(false);
    refetch();
  };

  const remove = async (card) => {
    await base44.entities.BusinessCard.delete(card.id);
    refetch();
  };

  const logInteraction = async (card) => {
    await base44.entities.BusinessCard.update(card.id, { last_contact_date: new Date().toISOString().slice(0, 10) });
    refetch();
  };

  return (
    <div className="space-y-6 pb-16 md:pb-0">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            <h1 className="text-2xl font-black">Networking CRM</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Keep your professional relationships warm</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white font-bold text-sm hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> Add Card
        </button>
      </div>

      {/* Temperature summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card-glass rounded-2xl p-4 border-hot/20 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-hot/15 flex items-center justify-center">
            <Flame className="w-5 h-5 text-hot animate-flicker" />
          </div>
          <div>
            <p className="text-2xl font-black text-hot">{hotCount}</p>
            <p className="text-xs text-muted-foreground">Hot connections</p>
          </div>
        </div>
        <div className="card-glass rounded-2xl p-4 border-frost/20 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-frost/15 flex items-center justify-center">
            <Snowflake className="w-5 h-5 text-frost" />
          </div>
          <div>
            <p className="text-2xl font-black text-frost">{frozenCount}</p>
            <p className="text-xs text-muted-foreground">Frozen — re-engage!</p>
          </div>
        </div>
      </div>

      {/* Cards grid */}
      {isLoading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin" /></div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card) => (
            <BusinessCardItem key={card.id} card={card} onEdit={openEdit} onDelete={remove} onUnfreeze={setUnfreezeCard} />
          ))}
        </div>
      )}

      {cards.length > 0 && (
        <div className="card-glass rounded-xl p-3 text-center">
          <button onClick={() => cards.filter((c) => cardTemperature(c.last_contact_date) === 'frozen').forEach(logInteraction)} className="text-xs font-bold text-frost hover:underline">
            Thaw all frozen cards (log interaction today)
          </button>
        </div>
      )}

      <UnfreezeModal card={unfreezeCard} onClose={() => setUnfreezeCard(null)} onThawed={refetch} />

      {/* Form modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setFormOpen(false)}>
          <div className="card-glass rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto scrollbar-thin animate-float-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-border/60 sticky top-0 bg-card/95 backdrop-blur z-10">
              <h2 className="font-bold text-base">{editing ? 'Edit Card' : 'New Business Card'}</h2>
              <button onClick={() => setFormOpen(false)} className="p-1.5 rounded-lg hover:bg-secondary/60"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-3">
              <FormField label="Contact Name *" value={form.contact_name} onChange={(v) => setForm({ ...form, contact_name: v })} />
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Role" value={form.role} onChange={(v) => setForm({ ...form, role: v })} />
                <FormField label="Company" value={form.company} onChange={(v) => setForm({ ...form, company: v })} />
              </div>
              <FormField label="Met Platform / Event" value={form.met_platform} onChange={(v) => setForm({ ...form, met_platform: v })} />
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Last Contact Date" type="date" value={form.last_contact_date} onChange={(v) => setForm({ ...form, last_contact_date: v })} />
                <FormField label="Follow-Up Date" type="date" value={form.follow_up_date} onChange={(v) => setForm({ ...form, follow_up_date: v })} />
              </div>
              <FormField label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
              <FormField label="LinkedIn URL" value={form.linkedin_url} onChange={(v) => setForm({ ...form, linkedin_url: v })} />
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Card Color</label>
                <div className="flex gap-2">
                  {themes.map((t) => (
                    <button
                      key={t}
                      onClick={() => setForm({ ...form, color_theme: t })}
                      className={`w-8 h-8 rounded-lg bg-gradient-to-br ${
                        t === 'amber' ? 'from-amber-500 to-orange-600' :
                        t === 'blue' ? 'from-blue-500 to-indigo-600' :
                        t === 'cyan' ? 'from-cyan-500 to-teal-600' : 'from-violet-500 to-purple-600'
                      } ${form.color_theme === t ? 'ring-2 ring-white ring-offset-2 ring-offset-card' : ''}`}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Notes</label>
                <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} className="w-full bg-secondary/60 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
              </div>
              <button onClick={save} className="w-full px-4 py-2.5 rounded-lg bg-primary text-white font-bold text-sm hover:opacity-90 transition-opacity">
                {editing ? 'Save Changes' : 'Add Card'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FormField({ label, value, onChange, type = 'text' }) {
  return (
    <div>
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">{label}</label>
      <input type={type} value={value || ''} onChange={(e) => onChange(e.target.value)} className="w-full bg-secondary/60 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
    </div>
  );
}