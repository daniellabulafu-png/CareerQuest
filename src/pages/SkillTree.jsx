import { useState } from 'react';
import { Radar, GitBranch, Plus, Loader2, Linkedin, Briefcase, X, Check } from 'lucide-react';
import { useSkillNodes, useExperiences } from '@/hooks/useEntities';
import { base44 } from '@/api/base44Client';
import SkillTreeGraph from '@/components/SkillTreeGraph';
import JobAnalysisModal from '@/components/JobAnalysisModal';
import ExperienceFormModal from '@/components/ExperienceFormModal';
import { naceForNode, naceColors, NACE_COMPETENCIES } from '@/lib/nace';

const categoryColors = {
  Technical: 'text-violet-400 bg-violet-500/10',
  Leadership: 'text-amber-400 bg-amber-500/10',
  Communication: 'text-emerald-400 bg-emerald-500/10',
  'Problem Solving': 'text-cyan-400 bg-cyan-500/10',
  Teamwork: 'text-pink-400 bg-pink-500/10',
};

export default function SkillTree() {
  const { data: nodes = [], refetch } = useSkillNodes();
  const { data: experiences = [] } = useExperiences();
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [gapSkills, setGapSkills] = useState([]);
  const [matchedSkills, setMatchedSkills] = useState([]);
  const [levelingUp, setLevelingUp] = useState(null);
  const [expOpen, setExpOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  const unlocked = nodes.filter((n) => n.unlocked);
  const locked = nodes.filter((n) => !n.unlocked);

  const levelUp = async (node) => {
    if (!node.unlocked || node.level >= node.max_level) return;
    setLevelingUp(node.id);
    await base44.entities.SkillNode.update(node.id, { level: node.level + 1 });
    refetch();
    setLevelingUp(null);
  };

  const unlockNode = async (node) => {
    setLevelingUp(node.id);
    await base44.entities.SkillNode.update(node.id, { unlocked: true, level: 1 });
    refetch();
    setLevelingUp(null);
  };

  const onAnalysisComplete = (result) => {
    setMatchedSkills(result.matched_skills || []);
    setGapSkills(result.gap_skills || []);
  };

  return (
    <div className="space-y-6 pb-16 md:pb-0">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-primary" />
            <h1 className="text-2xl font-black">Competency Map</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Core L&C Liberal Arts Competencies · {unlocked.length}/{nodes.length} skills unlocked
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setExpOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-secondary/60 border border-border font-bold text-sm hover:bg-secondary transition-colors"
          >
            <Briefcase className="w-4 h-4" /> Log Experience
          </button>
          <button
            onClick={() => setExportOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-secondary/60 border border-border font-bold text-sm hover:bg-secondary transition-colors"
          >
            <Linkedin className="w-4 h-4 text-cyan-400" /> Export to LinkedIn
          </button>
          <button
            onClick={() => setJobModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-sm hover:opacity-90 transition-opacity"
          >
            <Radar className="w-4 h-4" />
            Skill Gap Radar
          </button>
        </div>
      </div>

      {/* Legend */}
      {(matchedSkills.length > 0 || gapSkills.length > 0) && (
        <div className="card-glass rounded-xl p-3 flex items-center gap-4 flex-wrap text-xs">
          <span className="font-semibold">Job Analysis Overlay:</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-success" /> Matched ({matchedSkills.length})</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-warning" /> Skill Gap ({gapSkills.length})</span>
          <button onClick={() => { setMatchedSkills([]); setGapSkills([]); }} className="text-muted-foreground hover:text-foreground ml-auto">
            Clear overlay
          </button>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Skill Tree Graph */}
        <div className="lg:col-span-2 card-glass rounded-2xl p-6">
          <SkillTreeGraph nodes={nodes} gapSkills={gapSkills} matchedSkills={matchedSkills} />
        </div>

        {/* Skill details */}
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success glow-success" /> Unlocked Skills
            </h3>
            <div className="space-y-2">
              {unlocked.map((node) => (
                <div key={node.id} className="card-glass rounded-xl p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-semibold">{node.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${categoryColors[node.category] || ''}`}>
                      {node.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`flex-1 h-1.5 rounded-full ${i <= node.level ? 'bg-xp' : 'bg-secondary'}`}
                      />
                    ))}
                    <span className="text-[10px] text-muted-foreground ml-1">Lv {node.level}/{node.max_level}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {naceForNode(node).map((n) => (
                      <span key={n} className={`text-[9px] px-1.5 py-0.5 rounded-full border ${naceColors[n]}`}>{n}</span>
                    ))}
                  </div>
                  {node.level < node.max_level ? (
                    <button
                      onClick={() => levelUp(node)}
                      disabled={levelingUp === node.id}
                      className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1 disabled:opacity-50"
                    >
                      {levelingUp === node.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                      Level Up (log experience)
                    </button>
                  ) : (
                    <span className="text-[11px] font-bold text-xp">MAX LEVEL ⭐</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-muted-foreground" /> Locked Skills
            </h3>
            <div className="space-y-2">
              {locked.map((node) => (
                <div key={node.id} className="card-glass rounded-xl p-3 opacity-60">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold">{node.name}</span>
                    <span className="text-[10px] text-muted-foreground">Requires: {node.prerequisite}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mb-2">{node.description}</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {naceForNode(node).map((n) => (
                      <span key={n} className={`text-[9px] px-1.5 py-0.5 rounded-full border ${naceColors[n]}`}>{n}</span>
                    ))}
                  </div>
                  <button
                    onClick={() => unlockNode(node)}
                    disabled={levelingUp === node.id}
                    className="text-[11px] font-bold text-primary hover:underline disabled:opacity-50"
                  >
                    {levelingUp === node.id ? 'Unlocking...' : 'Unlock (log relevant experience)'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent experiences feeding the tree */}
      <div className="card-glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm">Experiences Powering Your Tree</h3>
          <button onClick={() => setExpOpen(true)} className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
            <Plus className="w-3.5 h-3.5" /> Log Experience
          </button>
        </div>
        <div className="space-y-2">
          {experiences.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">No experiences logged yet. Add your first one!</p>}
          {experiences.map((exp) => (
            <div key={exp.id} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30">
              <div className="flex-1">
                <p className="text-sm font-semibold">{exp.title}</p>
                <p className="text-xs text-muted-foreground">{exp.organization} · {exp.type}</p>
                <p className="text-xs text-muted-foreground/80 mt-1 line-clamp-2">{exp.description}</p>
              </div>
              <div className="flex flex-wrap gap-1 justify-end max-w-[45%]">
                {exp.competencies?.map((c) => (
                  <span key={c} className={`text-[9px] px-1.5 py-0.5 rounded-full border ${naceColors[c] || 'bg-secondary text-muted-foreground border-border'}`}>{c}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Export to LinkedIn modal */}
      {exportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setExportOpen(false)}>
          <div className="card-glass rounded-2xl w-full max-w-lg animate-float-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-border/60">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-cyan-500/20 flex items-center justify-center"><Linkedin className="w-5 h-5 text-cyan-400" /></div>
                <h2 className="font-bold text-base">Export to LinkedIn</h2>
              </div>
              <button onClick={() => setExportOpen(false)} className="p-1.5 rounded-lg hover:bg-secondary/60"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-3 text-sm">
              <p className="text-muted-foreground">Your unlocked skills and NACE-tagged experiences are compiled into a LinkedIn-ready summary. Copy it into your LinkedIn Skills & Experience sections.</p>
              <div className="bg-secondary/40 border border-border rounded-lg p-3 max-h-60 overflow-y-auto scrollbar-thin">
                <p className="font-bold mb-1">Skills</p>
                <p className="text-xs text-muted-foreground mb-2">{unlocked.map((n) => n.name).join(' · ')}</p>
                <p className="font-bold mb-1">Experience highlights</p>
                {experiences.map((exp) => (
                  <div key={exp.id} className="mb-1.5">
                    <p className="text-xs font-semibold">{exp.title} — {exp.organization}</p>
                    <p className="text-[11px] text-muted-foreground">{exp.description}</p>
                    {exp.competencies?.length > 0 && <p className="text-[10px] text-primary mt-0.5">NACE: {exp.competencies.join(', ')}</p>}
                  </div>
                ))}
              </div>
              <button
                onClick={() => { navigator.clipboard?.writeText(`${unlocked.map((n) => n.name).join(', ')}\n\n` + experiences.map((e) => `${e.title} at ${e.organization}: ${e.description}`).join('\n')); }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-cyan-600 text-white font-bold text-sm hover:opacity-90"
              >
                <Check className="w-4 h-4" /> Copy to Clipboard
              </button>
              <p className="text-[11px] text-muted-foreground text-center">Direct LinkedIn API sync coming soon — placeholder for now.</p>
            </div>
          </div>
        </div>
      )}

      <ExperienceFormModal open={expOpen} onClose={() => setExpOpen(false)} onSaved={() => {}} />
      <JobAnalysisModal open={jobModalOpen} onClose={() => setJobModalOpen(false)} onAnalysisComplete={onAnalysisComplete} />
    </div>
  );
}