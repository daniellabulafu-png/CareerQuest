import { useState, useMemo } from 'react';
import { Target, Filter } from 'lucide-react';
import { useStudent, useQuests } from '@/hooks/useEntities';
import { base44 } from '@/api/base44Client';
import { QUEST_LIBRARY, QUEST_GROUPS, QUEST_PILLARS } from '@/lib/questLibrary';
import QuestCard from '@/components/QuestCard';

function toEntity(lib) {
  return {
    title: lib.title,
    description: lib.description,
    category: lib.category,
    quest_group: lib.quest_group,
    xp_reward: lib.xp_reward,
    difficulty: lib.difficulty,
    icon: lib.icon,
    major: lib.major || '',
    steps_total: lib.steps_total || 1,
    steps_done: 0,
    status: 'available',
  };
}

export default function QuestBoard() {
  const { data: student, refetch: refetchStudent } = useStudent();
  const { data: dbQuests = [], refetch: refetchQuests } = useQuests();
  const [group, setGroup] = useState('All');
  const [pillar, setPillar] = useState('All');
  const [sort, setSort] = useState('default');

  const byTitle = useMemo(() => {
    const m = {};
    dbQuests.forEach((q) => { m[q.title] = q; });
    return m;
  }, [dbQuests]);

  const merged = QUEST_LIBRARY.map((lib) => {
    const db = byTitle[lib.title];
    return { ...lib, id: db?.id || lib.id, status: db?.status || 'available', steps_done: db?.steps_done || 0 };
  });

  let filtered = merged;
  if (group !== 'All') filtered = filtered.filter((q) => q.quest_group === group);
  if (pillar !== 'All') filtered = filtered.filter((q) => q.category === pillar);
  if (sort === 'xp') filtered = [...filtered].sort((a, b) => b.xp_reward - a.xp_reward);
  else if (sort === 'xp-asc') filtered = [...filtered].sort((a, b) => a.xp_reward - b.xp_reward);

  const completedCount = merged.filter((q) => q.status === 'completed').length;

  const awardXp = async (amt) => {
    if (student) await base44.entities.StudentProfile.update(student.id, { total_xp: (student.total_xp || 0) + amt });
    refetchStudent();
  };

  const completeQuest = async (quest) => {
    const total = quest.steps_total || 1;
    if (byTitle[quest.title]) {
      await base44.entities.Quest.update(quest.id, { status: 'completed', completed_at: new Date().toISOString(), steps_done: total });
    } else {
      await base44.entities.Quest.create({ ...toEntity(quest), status: 'completed', completed_at: new Date().toISOString(), steps_done: total });
    }
    await awardXp(quest.xp_reward);
    refetchQuests();
  };

  const stepQuest = async (quest) => {
    const total = quest.steps_total || 1;
    const newDone = (quest.steps_done || 0) + 1;
    const isComplete = newDone >= total;
    if (byTitle[quest.title]) {
      await base44.entities.Quest.update(quest.id, { steps_done: newDone, status: isComplete ? 'completed' : 'available', completed_at: isComplete ? new Date().toISOString() : null });
    } else {
      await base44.entities.Quest.create({ ...toEntity(quest), steps_done: newDone, status: isComplete ? 'completed' : 'available', completed_at: isComplete ? new Date().toISOString() : null });
    }
    if (isComplete) await awardXp(quest.xp_reward);
    refetchQuests();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Target className="w-5 h-5 text-primary" />
        <h2 className="font-bold text-lg">Quest Board</h2>
        <span className="text-xs text-muted-foreground">{completedCount}/{merged.length} completed</span>
      </div>

      {/* Group filter tabs */}
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Quest groups">
        {['All', ...QUEST_GROUPS].map((g) => (
          <button
            key={g}
            onClick={() => setGroup(g)}
            role="tab"
            aria-selected={group === g}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              group === g ? 'bg-primary text-white' : 'bg-secondary/60 text-muted-foreground hover:bg-secondary'
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Pillar filter + sort */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-3.5 h-3.5 text-muted-foreground" aria-hidden="true" />
        {['All', ...QUEST_PILLARS].map((p) => (
          <button
            key={p}
            onClick={() => setPillar(p)}
            aria-pressed={pillar === p}
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
              pillar === p ? 'bg-primary/20 text-primary border border-primary/40' : 'bg-secondary/40 text-muted-foreground border border-transparent hover:bg-secondary'
            }`}
          >
            {p}
          </button>
        ))}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="ml-auto bg-secondary/60 border border-border rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-primary/50"
          aria-label="Sort quests by XP"
        >
          <option value="default">Default</option>
          <option value="xp">XP: High → Low</option>
          <option value="xp-asc">XP: Low → High</option>
        </select>
      </div>

      {/* Quest grid */}
      <div className="grid sm:grid-cols-2 gap-3">
        {filtered.map((q) => (
          <QuestCard key={q.id} quest={q} onComplete={completeQuest} onStep={stepQuest} />
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="text-center py-8 text-muted-foreground text-sm">No quests match these filters.</div>
      )}
    </div>
  );
}