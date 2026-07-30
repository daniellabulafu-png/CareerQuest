import { useState } from 'react';
import { Radar, X, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useSkillNodes } from '@/hooks/useEntities';
import { base44 } from '@/api/base44Client';
import { useSettings } from '@/lib/SettingsContext';

export default function JobAnalysisModal({ open, onClose, onAnalysisComplete }) {
  const { data: skillNodes = [] } = useSkillNodes();
  const { settings } = useSettings();
  const [jobText, setJobText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const analyze = async () => {
    if (!jobText.trim()) return;
    setLoading(true);
    setAnalysis(null);

    const unlockedSkills = skillNodes.filter((n) => n.unlocked).map((n) => n.name);
    const lockedSkills = skillNodes.filter((n) => !n.unlocked).map((n) => n.name);

    if (!settings.aiEnabled) {
      // Direct keyword matching against logged skills (no AI)
      const text = jobText.toLowerCase();
      const found = (name) => text.includes(name.toLowerCase());
      const matched = unlockedSkills.filter(found);
      const gap = lockedSkills.filter(found);
      const total = matched.length + gap.length;
      const matchPct = total ? Math.round((matched.length / total) * 100) : 0;
      const result = {
        job_title: 'Keyword Match (AI off)',
        matched_skills: matched,
        gap_skills: gap,
        match_percentage: matchPct,
        summary: `Keyword scan found ${matched.length} of your unlocked skills and ${gap.length} gap skills in this job description.`,
      };
      setAnalysis(result);
      onAnalysisComplete?.(result);
      setLoading(false);
      return;
    }

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a career skills analyst. Analyze the following job description against a student's skill tree.

Student's UNLOCKED skills: ${unlockedSkills.join(', ')}
Student's LOCKED skills (not yet developed): ${lockedSkills.join(', ')}

Job description:
"""
${jobText.slice(0, 3000)}
"""

Respond as JSON with:
- job_title: inferred job title (string)
- matched_skills: skills from the student's UNLOCKED list that match the job requirements (array of strings, exact names from the unlocked list)
- gap_skills: skills from the student's LOCKED list that the job requires, OR unlocked skills at a low level (array of strings, exact names)
- match_percentage: integer 0-100 of how well the student matches the job
- summary: one sentence summary of the gap (string)`,
        response_json_schema: {
          type: 'object',
          properties: {
            job_title: { type: 'string' },
            matched_skills: { type: 'array', items: { type: 'string' } },
            gap_skills: { type: 'array', items: { type: 'string' } },
            match_percentage: { type: 'integer' },
            summary: { type: 'string' },
          },
          required: ['job_title', 'matched_skills', 'gap_skills', 'match_percentage', 'summary'],
        },
      });
      setAnalysis(response);
      onAnalysisComplete?.(response);
    } catch (e) {
      setAnalysis({ error: 'Analysis failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="card-glass rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto scrollbar-thin animate-float-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-border/60 sticky top-0 bg-card/95 backdrop-blur z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
              <Radar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-base">Skill Gap Radar</h2>
              <p className="text-xs text-muted-foreground">Analyze a target job description</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary/60 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
              Paste target job description
            </label>
            <textarea
              value={jobText}
              onChange={(e) => setJobText(e.target.value)}
              rows={6}
              placeholder="Paste the full job description here..."
              className="w-full bg-secondary/60 border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none"
            />
          </div>

          <button
            onClick={analyze}
            disabled={loading || !jobText.trim()}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Scanning skills...
              </>
            ) : (
              <>
                <Radar className="w-4 h-4" />
                Run Skill Gap Analysis
              </>
            )}
          </button>

          {analysis?.error && (
            <div className="text-sm text-destructive bg-destructive/10 rounded-lg p-3">{analysis.error}</div>
          )}

          {analysis && !analysis.error && (
            <div className="space-y-4 animate-float-up">
              <div className="rounded-xl border border-border/60 bg-secondary/30 p-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-bold">{analysis.job_title || 'Target Role'}</h3>
                  <div className="relative w-12 h-12">
                    <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15" fill="none" stroke="hsl(var(--border))" strokeWidth="3" />
                      <circle
                        cx="18" cy="18" r="15" fill="none" stroke="hsl(var(--success))" strokeWidth="3"
                        strokeDasharray={`${(analysis.match_percentage / 100) * 94.2} 94.2`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-success">
                      {analysis.match_percentage}%
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{analysis.summary}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-success/30 bg-success/5 p-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    <h4 className="text-xs font-bold text-success">Matched Skills</h4>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.matched_skills?.length ? (
                      analysis.matched_skills.map((s) => (
                        <span key={s} className="text-[11px] px-2 py-0.5 rounded-full bg-success/15 text-success">
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-[11px] text-muted-foreground">None matched</span>
                    )}
                  </div>
                </div>
                <div className="rounded-xl border border-warning/30 bg-warning/5 p-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <AlertTriangle className="w-4 h-4 text-warning" />
                    <h4 className="text-xs font-bold text-warning">Skill Gaps</h4>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.gap_skills?.length ? (
                      analysis.gap_skills.map((s) => (
                        <span key={s} className="text-[11px] px-2 py-0.5 rounded-full bg-warning/15 text-warning">
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-[11px] text-muted-foreground">No gaps!</span>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground/70 text-center">
                Skill tree updated — green nodes match the job, red nodes need work.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}