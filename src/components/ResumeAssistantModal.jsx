import { useState } from 'react';
import { Sparkles, X, FileText, Linkedin, Loader2, Wand2, FileWarning } from 'lucide-react';
import { useExperiences } from '@/hooks/useEntities';
import { base44 } from '@/api/base44Client';
import { useSettings } from '@/lib/SettingsContext';

export default function ResumeAssistantModal({ open, onClose }) {
  const { data: experiences = [] } = useExperiences();
  const { settings } = useSettings();
  const [selectedExp, setSelectedExp] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const generate = async () => {
    const exp = experiences.find((e) => e.id === selectedExp);
    const label = exp ? exp.title : skillInput;
    const org = exp?.organization || '';
    if (!label.trim()) return;

    setLoading(true);
    setResult(null);

    if (!settings.aiEnabled) {
      // Structured STAR fill-in-the-blank templates (no AI)
      setResult({
        template: true,
        resume_bullets: [
          `Led [specific task] as ${label}${org ? ` at ${org}` : ''}, resulting in [measurable outcome — e.g., 20% improvement].`,
          `Applied [skill/method/tool] to [action taken], achieving [result] for [who benefited].`,
          `Collaborated with [team/stakeholders] to deliver [deliverable], improving [metric] by [X%].`,
        ],
        linkedin_post: `Excited to share I ${exp?.type === 'Internship' ? 'completed an internship' : 'worked on'} ${label}${org ? ` @ ${org}` : ''}!\n\nSituation: [context of the project/challenge]\nTask: [what you were responsible for]\nAction: [steps you took]\nResult: [outcome / impact]\n\n#LewisAndClark #CareerReadiness #${label.replace(/\s/g, '')}`,
      });
      setLoading(false);
      return;
    }

    const context = exp
      ? `Experience: ${exp.title} at ${exp.organization} (${exp.type}). Description: ${exp.description}. Competencies: ${exp.competencies?.join(', ')}.`
      : `Skill/Accomplishment: ${skillInput}`;
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an expert career coach and resume writer. Based on the following experience, generate:
1. Three polished resume bullet points using the STAR method (Situation, Task, Action, Result) with quantifiable achievements where possible.
2. An engaging LinkedIn post draft (with emojis and hashtags) celebrating this experience.

Format your response as JSON with keys "resume_bullets" (array of 3 strings) and "linkedin_post" (string).

${context}`,
        response_json_schema: {
          type: 'object',
          properties: {
            resume_bullets: { type: 'array', items: { type: 'string' } },
            linkedin_post: { type: 'string' },
          },
          required: ['resume_bullets', 'linkedin_post'],
        },
      });
      setResult(response);
    } catch (e) {
      setResult({ error: 'Something went wrong. Please try again.' });
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
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <Wand2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-base">{settings.aiEnabled ? 'AI' : 'Template'} Resume Assistant</h2>
              <p className="text-xs text-muted-foreground">{settings.aiEnabled ? 'STAR bullets & LinkedIn posts' : 'STAR fill-in templates (AI off)'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary/60 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
              Select a logged experience
            </label>
            <select
              value={selectedExp}
              onChange={(e) => setSelectedExp(e.target.value)}
              className="w-full bg-secondary/60 border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">Choose an experience...</option>
              {experiences.map((exp) => (
                <option key={exp.id} value={exp.id}>
                  {exp.title} — {exp.organization}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border/60" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border/60" />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
              Describe a skill or accomplishment
            </label>
            <textarea
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              rows={3}
              placeholder="e.g., Led a team of 4 to build a mobile app that served 500 users..."
              className="w-full bg-secondary/60 border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
          </div>

          <button
            onClick={generate}
            disabled={loading || (!selectedExp && !skillInput.trim())}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-primary to-violet-500 text-white font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity glow-primary"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : settings.aiEnabled ? (
              <>
                <Sparkles className="w-4 h-4" />
                Generate STAR Bullets & LinkedIn Post
              </>
            ) : (
              <>
                <FileWarning className="w-4 h-4" />
                Build STAR Template
              </>
            )}
          </button>

          {result?.template && (
            <div className="text-[11px] text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg p-2.5">
              Template mode — replace the [bracketed] placeholders with your own details.
            </div>
          )}

          {result?.error && (
            <div className="text-sm text-destructive bg-destructive/10 rounded-lg p-3">{result.error}</div>
          )}

          {result && !result.error && (
            <div className="space-y-4 animate-float-up">
              <div className="rounded-xl border border-border/60 bg-secondary/30 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-4 h-4 text-blue-400" />
                  <h3 className="text-sm font-bold">Resume Bullet Points</h3>
                </div>
                <ul className="space-y-2">
                  {result.resume_bullets?.map((bullet, i) => (
                    <li key={i} className="text-sm text-muted-foreground leading-relaxed flex gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-border/60 bg-secondary/30 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Linkedin className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-bold">LinkedIn Post Draft</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{result.linkedin_post}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}