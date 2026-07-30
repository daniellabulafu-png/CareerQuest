import { Compass, GitBranch, Briefcase, Users } from 'lucide-react';
import { useQuests, useSkillNodes, useExperiences, useBusinessCards, cardTemperature } from '@/hooks/useEntities';

function Pillar({ icon: Icon, label, value, sub, percent, color, glow }) {
  return (
    <div className="card-glass rounded-2xl p-4 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center ${glow || ''}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">{label}</p>
          <p className="text-lg font-black leading-tight">{value}</p>
        </div>
      </div>
      <div className="h-1.5 rounded-full bg-secondary/70 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.min(100, percent)}%` }} />
      </div>
      <p className="text-[10px] text-muted-foreground">{sub}</p>
    </div>
  );
}

export default function PillarProgress() {
  const { data: quests = [] } = useQuests();
  const { data: nodes = [] } = useSkillNodes();
  const { data: experiences = [] } = useExperiences();
  const { data: cards = [] } = useBusinessCards();

  const completedQuests = quests.filter((q) => q.status === 'completed').length;
  const guidancePct = quests.length ? Math.round((completedQuests / quests.length) * 100) : 0;

  const unlockedCount = nodes.filter((n) => n.unlocked).length;
  const skillsPct = nodes.length ? Math.round((unlockedCount / nodes.length) * 100) : 0;

  const expCount = experiences.length;
  const expPct = Math.min(100, expCount * 10);

  const hotCount = cards.filter((c) => cardTemperature(c.last_contact_date) === 'hot').length;
  const networkScore = Math.min(100, hotCount * 20);

  return (
    <div className="card-glass rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Compass className="w-4 h-4 text-primary" />
        <h2 className="font-bold text-sm">L&C Career Accelerator</h2>
        <span className="text-[10px] text-muted-foreground ml-auto">Four-Pillar Progress</span>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Pillar icon={Compass} label="Guidance" value={`${guidancePct}%`} sub={`${completedQuests}/${quests.length} quests done`} percent={guidancePct} color="bg-gradient-to-br from-primary to-violet-500" glow="glow-primary" />
        <Pillar icon={GitBranch} label="Skills" value={`${unlockedCount}`} sub={`${skillsPct}% of tree unlocked`} percent={skillsPct} color="bg-gradient-to-br from-violet-500 to-fuchsia-500" />
        <Pillar icon={Briefcase} label="Experience" value={`${expCount}`} sub="logged activities" percent={expPct} color="bg-gradient-to-br from-emerald-500 to-teal-500" glow="glow-success" />
        <Pillar icon={Users} label="Connections" value={`${networkScore}`} sub={`${hotCount} hot contacts`} percent={networkScore} color="bg-gradient-to-br from-orange-500 to-hot" glow="glow-hot" />
      </div>
    </div>
  );
}