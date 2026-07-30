import { useState } from 'react';
import { KanbanSquare, Plus, X, ExternalLink, FolderOpen, FileText, Briefcase, File, Handshake, Check, Loader2 } from 'lucide-react';
import { useApplications, useDocuments } from '@/hooks/useEntities';
import { base44 } from '@/api/base44Client';

const columns = [
  { key: 'Wishlist', color: 'border-muted-foreground/40 bg-muted/10', dot: 'bg-muted-foreground' },
  { key: 'Applied', color: 'border-blue-500/40 bg-blue-500/10', dot: 'bg-blue-500' },
  { key: 'Interviewing', color: 'border-amber-500/40 bg-amber-500/10', dot: 'bg-amber-500' },
  { key: 'Offer', color: 'border-success/40 bg-success/10', dot: 'bg-success' },
  { key: 'Rejected', color: 'border-destructive/40 bg-destructive/10', dot: 'bg-destructive' },
];

const docIcons = { Resume: FileText, Portfolio: Briefcase, 'Cover Letter': File };

export default function Applications() {
  const { data: apps = [], refetch: refetchApps } = useApplications();
  const { data: docs = [], refetch: refetchDocs } = useDocuments();
  const [draggedId, setDraggedId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [docFormOpen, setDocFormOpen] = useState(false);
  const [handshakeOpen, setHandshakeOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [synced, setSynced] = useState(false);
  const [form, setForm] = useState({ company: '', role: '', status: 'Wishlist', link: '', deadline: '', notes: '', salary_range: '' });
  const [docForm, setDocForm] = useState({ name: '', type: 'Resume', link: '', description: '' });

  const onDrop = async (status) => {
    if (!draggedId) return;
    const app = apps.find((a) => a.id === draggedId);
    if (app && app.status !== status) {
      await base44.entities.Application.update(draggedId, { status, applied_date: status === 'Applied' && !app.applied_date ? new Date().toISOString().slice(0, 10) : app.applied_date });
      refetchApps();
    }
    setDraggedId(null);
  };

  const saveApp = async () => {
    if (!form.company.trim() || !form.role.trim()) return;
    await base44.entities.Application.create(form);
    setForm({ company: '', role: '', status: 'Wishlist', link: '', deadline: '', notes: '', salary_range: '' });
    setFormOpen(false);
    refetchApps();
  };

  const saveDoc = async () => {
    if (!form.name.trim() && !docForm.name.trim()) return;
    await base44.entities.Document.create({ ...docForm, uploaded_at: new Date().toISOString() });
    setDocForm({ name: '', type: 'Resume', link: '', description: '' });
    setDocFormOpen(false);
    refetchDocs();
  };

  const deleteApp = async (id) => {
    await base44.entities.Application.delete(id);
    refetchApps();
  };

  return (
    <div className="space-y-6 pb-16 md:pb-0">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2">
            <KanbanSquare className="w-5 h-5 text-primary" />
            <h1 className="text-2xl font-black">Application Tracker</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{apps.length} applications across {columns.length} stages</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setHandshakeOpen(true)} className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-secondary/60 border border-border font-bold text-sm hover:bg-secondary transition-colors">
            <Handshake className="w-4 h-4 text-emerald-400" /> Sync Handshake
          </button>
          <button onClick={() => setDocFormOpen(true)} className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-secondary/60 border border-border font-bold text-sm hover:bg-secondary transition-colors">
            <FolderOpen className="w-4 h-4" /> Vault
          </button>
          <button onClick={() => setFormOpen(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white font-bold text-sm hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" /> Add Application
          </button>
        </div>
      </div>

      {/* Kanban board */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 overflow-x-auto">
        {columns.map((col) => {
          const colApps = apps.filter((a) => a.status === col.key);
          return (
            <div
              key={col.key}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onDrop(col.key)}
              className={`rounded-xl border ${col.color} p-3 min-h-[200px]`}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                <h3 className="text-xs font-bold uppercase tracking-wide">{col.key}</h3>
                <span className="text-[10px] text-muted-foreground ml-auto bg-secondary/60 px-1.5 rounded-full">{colApps.length}</span>
              </div>
              <div className="space-y-2">
                {colApps.map((app) => (
                  <div
                    key={app.id}
                    draggable
                    onDragStart={() => setDraggedId(app.id)}
                    className="bg-card/80 border border-border/60 rounded-lg p-3 cursor-grab active:cursor-grabbing hover:border-primary/40 transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">{app.company}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{app.role}</p>
                      </div>
                      <button onClick={() => deleteApp(app.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {app.salary_range && <p className="text-[10px] text-xp font-semibold mt-1">{app.salary_range}</p>}
                    {app.link && (
                      <a href={app.link} target="_blank" rel="noopener noreferrer" className="text-[10px] text-primary hover:underline flex items-center gap-1 mt-1">
                        <ExternalLink className="w-3 h-3" /> Link
                      </a>
                    )}
                    {app.notes && <p className="text-[10px] text-muted-foreground/70 mt-1 line-clamp-2">{app.notes}</p>}
                  </div>
                ))}
                {colApps.length === 0 && (
                  <p className="text-[10px] text-muted-foreground/40 text-center py-4">Drop here</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Document vault */}
      <div className="card-glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm flex items-center gap-2"><FolderOpen className="w-4 h-4 text-primary" /> Document Vault</h3>
          <button onClick={() => setDocFormOpen(true)} className="text-xs font-bold text-primary hover:underline">+ Add</button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {docs.map((doc) => {
            const Icon = docIcons[doc.type] || File;
            return (
              <a key={doc.id} href={doc.link || '#'} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/60 transition-colors group">
                <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold truncate group-hover:text-primary transition-colors">{doc.name}</p>
                  <p className="text-[10px] text-muted-foreground">{doc.type}</p>
                  {doc.description && <p className="text-[10px] text-muted-foreground/70 line-clamp-1">{doc.description}</p>}
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* App form modal */}
      {formOpen && (
        <Modal title="New Application" onClose={() => setFormOpen(false)}>
          <FormField label="Company *" value={form.company} onChange={(v) => setForm({ ...form, company: v })} />
          <FormField label="Role *" value={form.role} onChange={(v) => setForm({ ...form, role: v })} />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full bg-secondary/60 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                {columns.map((c) => <option key={c.key} value={c.key}>{c.key}</option>)}
              </select>
            </div>
            <FormField label="Salary Range" value={form.salary_range} onChange={(v) => setForm({ ...form, salary_range: v })} />
          </div>
          <FormField label="Application Link" value={form.link} onChange={(v) => setForm({ ...form, link: v })} />
          <FormField label="Deadline" type="date" value={form.deadline} onChange={(v) => setForm({ ...form, deadline: v })} />
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Notes</label>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} className="w-full bg-secondary/60 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
          </div>
          <button onClick={saveApp} className="w-full px-4 py-2.5 rounded-lg bg-primary text-white font-bold text-sm hover:opacity-90">Add Application</button>
        </Modal>
      )}

      {/* Doc form modal */}
      {docFormOpen && (
        <Modal title="Add Document" onClose={() => setDocFormOpen(false)}>
          <FormField label="Name *" value={docForm.name} onChange={(v) => setDocForm({ ...docForm, name: v })} />
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Type</label>
            <select value={docForm.type} onChange={(e) => setDocForm({ ...docForm, type: e.target.value })} className="w-full bg-secondary/60 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
              <option>Resume</option><option>Portfolio</option><option>Cover Letter</option><option>Other</option>
            </select>
          </div>
          <FormField label="Link" value={docForm.link} onChange={(v) => setDocForm({ ...docForm, link: v })} />
          <FormField label="Description" value={docForm.description} onChange={(v) => setDocForm({ ...docForm, description: v })} />
          <button onClick={saveDoc} className="w-full px-4 py-2.5 rounded-lg bg-primary text-white font-bold text-sm hover:opacity-90">Add Document</button>
        </Modal>
      )}

      {/* Handshake sync modal */}
      {handshakeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => { setHandshakeOpen(false); setSynced(false); }}>
          <div className="card-glass rounded-2xl w-full max-w-md animate-float-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-border/60">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/20 flex items-center justify-center"><Handshake className="w-5 h-5 text-emerald-400" /></div>
                <div>
                  <h2 className="font-bold text-base">Sync with Handshake</h2>
                  <p className="text-xs text-muted-foreground">Import Lewis & Clark applications</p>
                </div>
              </div>
              <button onClick={() => { setHandshakeOpen(false); setSynced(false); }} className="p-1.5 rounded-lg hover:bg-secondary/60"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              {!synced ? (
                <>
                  <p className="text-sm text-muted-foreground">Connect your L&C Handshake account to pull in saved jobs and application statuses into your Kanban board automatically.</p>
                  <button
                    onClick={async () => {
                      setSyncing(true);
                      await base44.entities.Application.create({ company: 'Handshake Import', role: 'Synced Role', status: 'Wishlist', notes: 'Imported from Handshake (placeholder)' });
                      setSyncing(false);
                      setSynced(true);
                      refetchApps();
                    }}
                    disabled={syncing}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 text-white font-bold text-sm hover:opacity-90 disabled:opacity-50"
                  >
                    {syncing ? <><Loader2 className="w-4 h-4 animate-spin" /> Connecting…</> : <><Handshake className="w-4 h-4" /> Connect & Import</>}
                  </button>
                  <p className="text-[11px] text-muted-foreground text-center">Direct Handshake API integration coming soon — this is a placeholder.</p>
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="w-14 h-14 rounded-full bg-success/15 flex items-center justify-center mx-auto mb-3"><Check className="w-7 h-7 text-success" /></div>
                  <p className="font-bold text-sm">Synced!</p>
                  <p className="text-xs text-muted-foreground mt-1">A sample application was added to your Wishlist.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="card-glass rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto scrollbar-thin animate-float-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-border/60 sticky top-0 bg-card/95 backdrop-blur z-10">
          <h2 className="font-bold text-base">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary/60"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 space-y-3">{children}</div>
      </div>
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