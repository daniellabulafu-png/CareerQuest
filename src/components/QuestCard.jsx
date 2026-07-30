import { Check, Star, Target, Users, FileText, Linkedin, Handshake, Flame, Mail, Microscope, Globe, Presentation, Crown, HeartHandshake, Building2, Swords, Trophy, KanbanSquare, Send, PenLine, Search, Briefcase, Coffee, Brain } from 'lucide-react';

const iconMap = { Target, Users, FileText, Linkedin, Handshake, Flame, Mail, Microscope, Globe, Presentation, Crown, HeartHandshake, Building2, Swords, Trophy, KanbanSquare, Send, PenLine, Search, Briefcase, Coffee, Brain };

const pillarColors = {
  Guidance: 'from-violet-500 to-fuchsia-500',
  Skills: 'from-cyan-500 to-blue-500',
  Experience: 'from-amber-500 to-orange-500',
  Connections: 'from-emerald-500 to-teal-500',
};

const difficultyStars = { Easy: 1, Medium: 2, Hard: 3 };

export default function QuestCard({ quest, onComplete, onStep }) {
  const completed = quest.status === 'completed';
  const stepsTotal = quest.steps_total || 1;
  const stepsDone = quest.steps_done || 0;
  const isMulti = stepsTotal > 1;
  const progress = isMulti ? Math.min(100, Math.round((stepsDone / stepsTotal) * 100)) : 0;
  const Icon = iconMap[quest.icon] || Target;
  const gradient = pillarColors[quest.category] || 'from-primary to-xp';

  return (
    <div
      className={`relative rounded-xl border p-4 transition-all ${
        completed ? 'border-success/30 bg-success/5' : 'border-border/60 bg-card/40 hover:border-primary/40 hover:bg-card/60'
      }`}
      role="article"
      aria-label={`Quest: ${quest.title}, ${quest.category} pillar, ${quest.xp_reward} XP${completed ? ', completed' : ''}`}
    >
      <div className="flex items-start gap-3">
        <div className={`shrink-0 w-11 h-11 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center ${completed ? 'opacity-40 grayscale' : ''}`} aria-hidden="true">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <h3 className={`font-bold text-sm ${completed ? 'line-through text-muted-foreground' : ''}`}>{quest.title}</h3>
            {quest.major && (
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground font-semibold">{quest.major}</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed mb-2">{quest.description}</p>

          {isMulti && !completed && (
            <div className="mb-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-muted-foreground">Progress</span>
                <span className="text-[10px] font-bold text-xp">{stepsDone}/{stepsTotal}</span>
              </div>
              <div className="h-1.5 rounded-full bg-secondary/60 overflow-hidden" role="progressbar" aria-valuenow={stepsDone} aria-valuemin={0} aria-valuemax={stepsTotal}>
                <div className="h-full bg-gradient-to-r from-xp to-amber-400 transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}
          {isMulti && completed && (
            <p className="text-[10px] text-success font-bold mb-2">✓ {stepsTotal}/{stepsTotal} steps complete</p>
          )}

          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs font-bold text-xp">+{quest.xp_reward} XP</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">{quest.category}</span>
            <span className="flex items-center gap-0.5" aria-label={`Difficulty: ${quest.difficulty}`}>
              {[1, 2, 3].map((i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${i <= (difficultyStars[quest.difficulty] || 1) ? 'fill-amber-400 text-amber-400' : 'text-border'}`}
                />
              ))}
            </span>
          </div>
        </div>
        <div className="shrink-0">
          {completed ? (
            <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center" aria-label="Completed">
              <Check className="w-4 h-4 text-success" />
            </div>
          ) : isMulti ? (
            <button
              onClick={() => onStep?.(quest)}
              className="px-3 py-1.5 rounded-lg bg-primary/15 text-primary text-xs font-bold hover:bg-primary hover:text-white transition-colors"
              aria-label={`Log one step of progress on ${quest.title}`}
            >
              +1 Step
            </button>
          ) : (
            <button
              onClick={() => onComplete?.(quest)}
              className="px-3 py-1.5 rounded-lg bg-primary/15 text-primary text-xs font-bold hover:bg-primary hover:text-white transition-colors"
              aria-label={`Complete ${quest.title}`}
            >
              Complete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}