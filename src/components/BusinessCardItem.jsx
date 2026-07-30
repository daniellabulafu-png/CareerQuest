import { Flame, Snowflake, Mail, Building2, Calendar, Edit2, Trash2, Flame as FlameIcon } from 'lucide-react';
import { cardTemperature } from '@/hooks/useEntities';

const themeColors = {
  amber: 'from-amber-500 to-orange-600',
  blue: 'from-blue-500 to-indigo-600',
  cyan: 'from-cyan-500 to-teal-600',
  violet: 'from-violet-500 to-purple-600',
};

export default function BusinessCardItem({ card, onEdit, onDelete, onUnfreeze }) {
  const temp = cardTemperature(card.last_contact_date);
  const isHot = temp === 'hot';
  const gradient = themeColors[card.color_theme] || themeColors.blue;

  const formatDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div
      className={`relative rounded-2xl overflow-hidden border transition-all hover:scale-[1.02] ${
        isHot ? 'border-hot/40 glow-hot' : 'border-frost/30 glow-frost'
      }`}
      role="article"
      aria-label={`Contact card for ${card.contact_name}, ${isHot ? 'hot — recently contacted' : 'frozen — inactive 30+ days'}`}
    >
      {/* Card front */}
      <div className={`bg-gradient-to-br ${gradient} p-4 relative`}>
        {isHot ? (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/30 backdrop-blur rounded-full px-2 py-0.5">
            <Flame className="w-3.5 h-3.5 text-orange-200 animate-flicker" />
            <span className="text-[10px] font-bold text-orange-100">HOT</span>
          </div>
        ) : (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/30 backdrop-blur rounded-full px-2 py-0.5">
            <Snowflake className="w-3.5 h-3.5 text-cyan-100" />
            <span className="text-[10px] font-bold text-cyan-100">FROZEN</span>
          </div>
        )}

        <div className="pr-16">
          <p className="text-white font-bold text-base leading-tight">{card.contact_name}</p>
          <p className="text-white/80 text-xs mt-0.5">{card.role}</p>
          <p className="text-white/60 text-[11px] flex items-center gap-1 mt-1">
            <Building2 className="w-3 h-3" />
            {card.company}
          </p>
        </div>

        {/* Frost overlay */}
        {!isHot && (
          <div className="absolute inset-0 bg-cyan-400/10 pointer-events-none" style={{
            backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.15), transparent 40%), radial-gradient(circle at 70% 60%, rgba(255,255,255,0.1), transparent 40%)',
          }} />
        )}
      </div>

      {/* Card back / details */}
      <div className="bg-card/80 backdrop-blur p-4 space-y-2">
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>Last: {formatDate(card.last_contact_date)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>Follow-up: {formatDate(card.follow_up_date)}</span>
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground">
          <span className="text-foreground/70 font-medium">Met via:</span> {card.met_platform}
        </p>
        {card.notes && (
          <p className="text-[11px] text-muted-foreground line-clamp-2 italic">"{card.notes}"</p>
        )}
        <div className="flex items-center gap-2 pt-1">
          {!isHot && (
            <button onClick={() => onUnfreeze?.(card)} aria-label={`Unfreeze ${card.contact_name} — send a follow-up message`} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-frost/15 text-frost text-[11px] font-bold hover:bg-frost/25 transition-colors">
              <Snowflake className="w-3.5 h-3.5" /> Unfreeze
            </button>
          )}
          {card.email && (
            <a href={`mailto:${card.email}`} aria-label={`Email ${card.contact_name}`} className="p-1.5 rounded-lg bg-secondary/60 hover:bg-secondary transition-colors">
              <Mail className="w-3.5 h-3.5" />
            </a>
          )}
          <button onClick={() => onEdit?.(card)} aria-label={`Edit ${card.contact_name}`} className="p-1.5 rounded-lg bg-secondary/60 hover:bg-secondary transition-colors">
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => onDelete?.(card)} aria-label={`Delete ${card.contact_name}`} className="p-1.5 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive transition-colors ml-auto">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}