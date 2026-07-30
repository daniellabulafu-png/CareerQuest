import { useState } from 'react';
import { Snowflake, X, Copy, Check, Send } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function UnfreezeModal({ card, onClose, onThawed }) {
  const [topic, setTopic] = useState('');
  const [copied, setCopied] = useState(false);
  if (!card) return null;

  const name = card.contact_name?.split(' ')[0] || 'there';
  const message = `Hi ${name}, I was reflecting on our conversation about ${topic || '[Topic]'} and wanted to follow up. I'd love to reconnect and hear how things have been going on your end — would you be open to a quick chat in the next couple weeks?`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  const thaw = async () => {
    await base44.entities.BusinessCard.update(card.id, { last_contact_date: new Date().toISOString().slice(0, 10) });
    onThawed?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="card-glass rounded-2xl w-full max-w-lg animate-float-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-border/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-frost/20 flex items-center justify-center">
              <Snowflake className="w-5 h-5 text-frost" />
            </div>
            <div>
              <h2 className="font-bold text-base">Unfreeze Connection</h2>
              <p className="text-xs text-muted-foreground">{card.contact_name} · {card.role}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary/60"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Conversation topic</label>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={card.notes || 'e.g., summer internships, data analytics'}
              className="w-full bg-secondary/60 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-frost/50"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Follow-up message</label>
            <textarea
              value={message}
              readOnly
              rows={4}
              className="w-full bg-secondary/40 border border-border rounded-lg px-3 py-2.5 text-sm leading-relaxed resize-none"
            />
          </div>

          <div className="flex gap-2">
            <button onClick={copy} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-secondary/60 border border-border font-bold text-sm hover:bg-secondary transition-colors">
              {copied ? <><Check className="w-4 h-4 text-success" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy message</>}
            </button>
            <button onClick={thaw} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-frost text-white font-bold text-sm hover:opacity-90 transition-opacity glow-frost">
              <Send className="w-4 h-4" /> Log & Thaw
            </button>
          </div>
          {card.email && (
            <a href={`mailto:${card.email}?subject=Reconnecting&body=${encodeURIComponent(message)}`} className="block text-center text-xs text-primary hover:underline">
              Or open in email to {card.email}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}