import { Award, Lock } from 'lucide-react';
import { useBadges } from '@/hooks/useEntities';

const rarityColors = {
  Common: 'border-border/60 from-slate-500 to-slate-600',
  Rare: 'border-cyan-500/40 from-cyan-500 to-blue-600 glow-primary',
  Epic: 'border-violet-500/40 from-violet-500 to-fuchsia-600 glow-primary',
  Legendary: 'border-amber-500/40 from-amber-400 to-orange-500 glow-xp animate-pulse-glow',
};

const iconEmoji = {
  Footprints: '👣',
  Users: '🤝',
  Swords: '⚔️',
  ShieldCheck: '🛡️',
  Sparkles: '✨',
  Flame: '🔥',
  Trophy: '🏆',
  FileText: '📄',
};

export default function Badges() {
  const { data: badges = [], isLoading } = useBadges();
  const earned = badges.filter((b) => b.earned);
  const locked = badges.filter((b) => !b.earned);

  if (isLoading) {
    return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6 pb-16 md:pb-0">
      <div>
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          <h1 className="text-2xl font-black">Badge Collection</h1>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {earned.length} of {badges.length} badges unlocked · {locked.length} to go
        </p>
      </div>

      {earned.length > 0 && (
        <div>
          <h3 className="font-bold text-sm mb-3">Earned Badges</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {earned.map((badge) => (
              <div key={badge.id} className={`card-glass rounded-2xl p-5 text-center border bg-gradient-to-br ${rarityColors[badge.rarity] || rarityColors.Common}`}>
                <div className="text-4xl mb-2">{iconEmoji[badge.icon] || '🏅'}</div>
                <h4 className="font-bold text-sm">{badge.name}</h4>
                <p className="text-[11px] text-muted-foreground mt-1 leading-snug">{badge.description}</p>
                <span className="inline-block mt-2 text-[9px] px-2 py-0.5 rounded-full bg-black/30 font-bold uppercase tracking-wider">
                  {badge.rarity}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {locked.length > 0 && (
        <div>
          <h3 className="font-bold text-sm mb-3">Locked Badges</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {locked.map((badge) => (
              <div key={badge.id} className="card-glass rounded-2xl p-5 text-center border border-border/40 opacity-60">
                <div className="relative inline-block">
                  <div className="text-4xl mb-2 grayscale">{iconEmoji[badge.icon] || '🏅'}</div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Lock className="w-6 h-6 text-muted-foreground" />
                  </div>
                </div>
                <h4 className="font-bold text-sm">{badge.name}</h4>
                <p className="text-[11px] text-muted-foreground mt-1 leading-snug">{badge.description}</p>
                <span className="inline-block mt-2 text-[9px] px-2 py-0.5 rounded-full bg-secondary font-bold uppercase tracking-wider">
                  {badge.rarity}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}