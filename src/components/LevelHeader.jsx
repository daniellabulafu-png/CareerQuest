import { Star, Zap, TrendingUp } from 'lucide-react';
import { useBadges, useApplications } from '@/hooks/useEntities';

export default function LevelHeader({ student }) {
  const { data: badges = [] } = useBadges();
  const { data: applications = [] } = useApplications();
  const earnedBadges = badges.filter((b) => b.earned).length;
  const activeApps = applications.filter((a) => a.status !== 'Rejected' && a.status !== 'Wishlist').length;

  const xpInLevel = student.total_xp % 250;
  const percent = Math.round((xpInLevel / 250) * 100);

  const stats = [
    { label: 'XP Earned', value: student.total_xp, icon: Zap, color: 'text-xp' },
    { label: 'Badges', value: `${earnedBadges}/${badges.length}`, icon: Star, color: 'text-amber-400' },
    { label: 'Active Apps', value: activeApps, icon: TrendingUp, color: 'text-success' },
  ];

  return (
    <div className="card-glass rounded-2xl p-5 md:p-6 animate-float-up">
      <div className="flex flex-col md:flex-row md:items-center gap-5">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-primary via-violet-500 to-xp flex items-center justify-center text-2xl md:text-3xl font-black text-white animate-pulse-glow">
              {student.name?.split(' ').map((n) => n[0]).join('')}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-xp text-black text-xs font-black px-2 py-0.5 rounded-full border-2 border-card glow-xp">
              Lv {student.level}
            </div>
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight">{student.name}</h1>
            <p className="text-sm text-muted-foreground">
              Level {student.level} {student.title}
            </p>
            <p className="text-xs text-muted-foreground/80 mt-0.5">
              {student.major} · Class of {student.grad_year}
            </p>
          </div>
        </div>

        <div className="flex-1 md:px-6 md:border-l border-border/60">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Progress to Level {student.level + 1}
            </span>
            <span className="text-xs font-bold text-xp">
              {xpInLevel} / 250 XP
            </span>
          </div>
          <div className="h-3 rounded-full bg-secondary/80 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-xp transition-all duration-700 glow-xp"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="text-[11px] text-muted-foreground/70 mt-1">
            {250 - xpInLevel} XP until next level
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 md:gap-4 md:w-auto">
          {stats.map((s) => (
            <div key={s.label} className="text-center md:text-left">
              <div className="flex items-center gap-1.5 md:justify-start">
                <s.icon className={`w-4 h-4 ${s.color}`} />
                <span className="text-lg font-black">{s.value}</span>
              </div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}