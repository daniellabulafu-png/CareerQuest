import { useState } from 'react';
import { Swords, Shield, Heart, Zap, Trophy, RotateCcw, Loader2, ChevronRight, ClipboardCheck, Check } from 'lucide-react';
import { useInterviewResults } from '@/hooks/useEntities';
import { base44 } from '@/api/base44Client';
import { useSettings } from '@/lib/SettingsContext';
import { FALLBACK_QUESTIONS } from '@/lib/nace';

const RUBRIC = [
  'I structured my response using the STAR method (Situation, Task, Action, Result).',
  'I described a specific, real example rather than a hypothetical.',
  'I quantified a result or impact (number, percentage, scale).',
  'I highlighted my individual contribution within a team effort.',
  'I connected the experience to the target role competencies.',
  'I kept my answer concise (under ~2 minutes).',
];

function trackFor(majors) {
  const m = (majors[0] || '').toLowerCase();
  if (['computer science', 'biology', 'chemistry', 'physics', 'mathematics', 'environmental'].some((k) => m.includes(k))) return 'STEM & Research';
  if (['english', 'rhetoric', 'media', 'foreign languages'].some((k) => m.includes(k))) return 'Humanities & Media';
  if (['international affairs', 'political', 'economic', 'sociology', 'anthropology', 'psychology', 'history'].some((k) => m.includes(k))) return 'Social Sciences & Policy';
  if (['art', 'music', 'theatre'].some((k) => m.includes(k))) return 'Arts & Performance';
  return 'General';
}

// Discipline-specific Battle Bots — one per L&C major track
const bosses = [
  { name: 'Lab Investigator', role: 'STEM Technical Interviewer', avatar: '🔬', difficulty: 'Hard', xpReward: 250, track: 'STEM & Research', focus: 'research methodology, data handling, and technical problem-solving' },
  { name: 'Portfolio Critic', role: 'Humanities & Arts Reviewer', avatar: '🎨', difficulty: 'Hard', xpReward: 250, track: 'Humanities & Media', focus: 'writing samples, creative process, and thesis defense' },
  { name: 'Policy Panelist', role: 'Social Sciences Interviewer', avatar: '⚖️', difficulty: 'Hard', xpReward: 250, track: 'Social Sciences & Policy', focus: 'behavioral scenarios, qualitative research, and public advocacy' },
  { name: 'Market Analyst', role: 'Business & Econ Case Interviewer', avatar: '📈', difficulty: 'Hard', xpReward: 250, track: 'Business/Econ', focus: 'market entry, quantitative reasoning, and strategy' },
];

export default function Interview() {
  const { data: results = [], refetch } = useInterviewResults();
  const { settings } = useSettings();
  const [selectedBoss, setSelectedBoss] = useState(null);
  const [phase, setPhase] = useState('select'); // select | battle | result | checklist
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQ, setCurrentQ] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [bossHealth, setBossHealth] = useState(100);
  const [playerHealth, setPlayerHealth] = useState(100);
  const [rubric, setRubric] = useState({});

  const startBattle = async (boss) => {
    setSelectedBoss(boss);
    setAnswers({});
    setCurrentQ(0);
    setBossHealth(100);
    setPlayerHealth(100);
    setRubric({});

    if (!settings.aiEnabled) {
      setQuestions(FALLBACK_QUESTIONS[selectedBoss.track] || FALLBACK_QUESTIONS[trackFor(settings.majors)] || FALLBACK_QUESTIONS.General);
      setPhase('checklist');
      return;
    }

    setPhase('battle');
    setLoading(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a "${boss.name}" — an AI interview Battle Bot specialized for the ${boss.track} track at a liberal arts university. Your focus is ${boss.focus}.

Generate exactly 3 interview questions tailored to this discipline for a university student. Each question should test a different competency (e.g., technical/analytical skill, communication, leadership, problem-solving) and be realistic and challenging for this field.

Respond as JSON: { "questions": ["question 1", "question 2", "question 3"] }`,
        response_json_schema: {
          type: 'object',
          properties: { questions: { type: 'array', items: { type: 'string' } } },
          required: ['questions'],
        },
      });
      setQuestions(response.questions?.slice(0, 3) || []);
    } catch (e) {
      setQuestions(FALLBACK_QUESTIONS.General);
    } finally {
      setLoading(false);
    }
  };

  const submitChecklist = async () => {
    const checked = Object.values(rubric).filter(Boolean).length;
    const score = Math.round((checked / RUBRIC.length) * 100);
    const passed = score >= 70;
    if (!passed) setPlayerHealth(50);
    const feedback = `Self-assessment: you checked ${checked}/${RUBRIC.length} rubric items.\n\nStrengths:\n${RUBRIC.filter((_, i) => rubric[i]).map((r) => '• ' + r).join('\n') || '• (none checked)'}\n\nAreas to improve:\n${RUBRIC.filter((_, i) => !rubric[i]).map((r) => '• ' + r).join('\n') || '• (all complete!)'}`;
    setResult({ score, passed, feedback, category_scores: { communication: score, problem_solving: score, leadership: score } });
    await base44.entities.InterviewResult.create({
      boss_name: selectedBoss.name,
      boss_role: selectedBoss.role,
      boss_avatar: selectedBoss.avatar,
      score,
      passed,
      xp_earned: passed ? selectedBoss.xpReward : Math.floor(selectedBoss.xpReward / 4),
      feedback,
      questions_count: questions.length,
      badge_earned: passed ? 'Interview Ready' : null,
      date: new Date().toISOString(),
    });
    refetch();
    setPhase('result');
  };

  const submitAnswer = async () => {
    const newAnswers = { ...answers, [currentQ]: answers[currentQ] || '' };
    setAnswers(newAnswers);
    // Damage boss
    setBossHealth((h) => Math.max(0, h - 33));

    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      // Evaluate
      setLoading(true);
      try {
        const qaText = questions.map((q, i) => `Q${i + 1}: ${q}\nA: ${newAnswers[i] || '(no answer)'}`).join('\n\n');
        const evalResult = await base44.integrations.Core.InvokeLLM({
          prompt: `You are evaluating a mock interview for a ${selectedBoss.role} position. Score the student's responses out of 100.

Questions and Answers:
${qaText}

Respond as JSON:
{
  "score": integer 0-100,
  "passed": boolean (true if score >= 70),
  "feedback": detailed feedback string (2-3 paragraphs covering strengths and areas to improve),
  "category_scores": { "communication": 0-100, "problem_solving": 0-100, "leadership": 0-100 }
}`,
          response_json_schema: {
            type: 'object',
            properties: {
              score: { type: 'integer' },
              passed: { type: 'boolean' },
              feedback: { type: 'string' },
              category_scores: {
                type: 'object',
                properties: {
                  communication: { type: 'integer' },
                  problem_solving: { type: 'integer' },
                  leadership: { type: 'integer' },
                },
              },
            },
            required: ['score', 'passed', 'feedback'],
          },
        });
        if (!evalResult.passed) setPlayerHealth((h) => Math.max(0, h - 50));
        setResult(evalResult);

        // Save result
        await base44.entities.InterviewResult.create({
          boss_name: selectedBoss.name,
          boss_role: selectedBoss.role,
          boss_avatar: selectedBoss.avatar,
          score: evalResult.score,
          passed: evalResult.passed,
          xp_earned: evalResult.passed ? selectedBoss.xpReward : Math.floor(selectedBoss.xpReward / 4),
          feedback: evalResult.feedback,
          questions_count: questions.length,
          badge_earned: evalResult.passed ? 'Interview Ready' : null,
          date: new Date().toISOString(),
        });
        refetch();
        setPhase('result');
      } catch (e) {
        setResult({ score: 0, passed: false, feedback: 'Evaluation failed. Please try again.' });
        setPhase('result');
      } finally {
        setLoading(false);
      }
    }
  };

  const reset = () => {
    setPhase('select');
    setSelectedBoss(null);
    setQuestions([]);
    setAnswers({});
    setResult(null);
  };

  if (phase === 'select') {
    return (
      <div className="space-y-6 pb-16 md:pb-0">
        <div>
          <div className="flex items-center gap-2">
            <Swords className="w-6 h-6 text-red-400" />
            <h1 className="text-2xl font-black">Interview Boss Battle</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Defeat AI interview bosses to earn XP, badges, and feedback</p>
        </div>

        {/* Past results */}
        {results.length > 0 && (
          <div className="card-glass rounded-2xl p-5">
            <h3 className="font-bold text-sm mb-3">Battle History</h3>
            <div className="space-y-2">
              {results.map((r) => (
                <div key={r.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                  <span className="text-2xl">{r.boss_avatar}</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{r.boss_name}</p>
                    <p className="text-[11px] text-muted-foreground">{r.boss_role}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-black ${r.passed ? 'text-success' : 'text-destructive'}`}>{r.score}</span>
                    <p className="text-[10px] text-muted-foreground">{r.passed ? 'VICTORY' : 'RETREAT'}</p>
                  </div>
                  {r.badge_earned && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 font-bold">
                      🏅 {r.badge_earned}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="font-bold text-sm mb-3">Choose Your Opponent</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {bosses.map((boss) => (
              <button
                key={boss.name}
                onClick={() => startBattle(boss)}
                className="card-glass rounded-2xl p-5 text-left hover:border-red-500/40 hover:scale-[1.02] transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-4xl">{boss.avatar}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    boss.difficulty === 'Hard' ? 'bg-destructive/15 text-destructive' : 'bg-warning/15 text-warning'
                  }`}>
                    {boss.difficulty}
                  </span>
                </div>
                <h4 className="font-bold text-sm">{boss.name}</h4>
                <p className="text-xs text-muted-foreground mb-3">{boss.role}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-xp">+{boss.xpReward} XP</span>
                  <span className="text-xs font-bold text-red-400 flex items-center gap-1 group-hover:gap-2 transition-all">
                    Fight <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'battle') {
    return (
      <div className="space-y-6 pb-16 md:pb-0 max-w-3xl mx-auto">
        {/* Battle HUD */}
        <div className="card-glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{selectedBoss.avatar}</span>
              <div>
                <p className="font-bold text-sm">{selectedBoss.name}</p>
                <p className="text-[11px] text-muted-foreground">{selectedBoss.role}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-muted-foreground">Question</p>
              <p className="font-black text-lg">{currentQ + 1}/{questions.length}</p>
            </div>
          </div>

          {/* Health bars */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-400" />
              <div className="flex-1 h-3 rounded-full bg-secondary/80 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-red-500 to-rose-400 transition-all duration-500" style={{ width: `${bossHealth}%` }} />
              </div>
              <span className="text-xs font-bold text-red-400 w-10 text-right">{bossHealth}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-400" />
              <div className="flex-1 h-3 rounded-full bg-secondary/80 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 transition-all duration-500" style={{ width: `${playerHealth}%` }} />
              </div>
              <span className="text-xs font-bold text-cyan-400 w-10 text-right">{playerHealth}%</span>
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="card-glass rounded-2xl p-6">
          {loading ? (
            <div className="flex flex-col items-center py-12 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Boss is preparing...</p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold text-primary uppercase tracking-wider">Boss asks</span>
              </div>
              <p className="text-base font-semibold leading-relaxed mb-4">{questions[currentQ]}</p>
              <textarea
                value={answers[currentQ] || ''}
                onChange={(e) => setAnswers({ ...answers, [currentQ]: e.target.value })}
                rows={6}
                placeholder="Type your answer here... Use the STAR method (Situation, Task, Action, Result) for best results."
                className="w-full bg-secondary/60 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                autoFocus
              />
              <div className="flex items-center justify-between mt-4">
                <span className="text-xs text-muted-foreground">{(answers[currentQ] || '').length} characters</span>
                <button
                  onClick={submitAnswer}
                  disabled={loading || !(answers[currentQ] || '').trim()}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                >
                  <Zap className="w-4 h-4" />
                  {currentQ < questions.length - 1 ? 'Strike!' : 'Final Blow!'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  if (phase === 'checklist') {
    return (
      <div className="space-y-6 pb-16 md:pb-0 max-w-3xl mx-auto">
        <div className="card-glass rounded-2xl p-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{selectedBoss.avatar}</span>
              <div>
                <p className="font-bold text-sm">{selectedBoss.name}</p>
                <p className="text-[11px] text-muted-foreground">{selectedBoss.role}</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-amber-400 bg-amber-500/15 px-2 py-1 rounded-full uppercase">Self-Assessment · AI Off</span>
          </div>
        </div>

        <div className="card-glass rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <ClipboardCheck className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-sm">Sample Behavioral Questions</h3>
          </div>
          <p className="text-[11px] text-muted-foreground mb-3">Practice aloud using the STAR method, then self-assess below.</p>
          <div className="space-y-2 mb-6">
            {questions.map((q, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-lg bg-secondary/30">
                <span className="text-xs font-black text-primary shrink-0">Q{i + 1}</span>
                <p className="text-sm">{q}</p>
              </div>
            ))}
          </div>

          <h3 className="font-bold text-sm mb-2">Self-Assessment Rubric</h3>
          <p className="text-[11px] text-muted-foreground mb-3">Check the items you confidently demonstrated in your practice answer.</p>
          <div className="space-y-2 mb-6">
            {RUBRIC.map((item, i) => (
              <button
                key={i}
                onClick={() => setRubric((r) => ({ ...r, [i]: !r[i] }))}
                className={`w-full flex items-start gap-3 p-3 rounded-lg border text-left transition-colors ${
                  rubric[i] ? 'border-success/40 bg-success/10' : 'border-border bg-secondary/30 hover:bg-secondary/60'
                }`}
              >
                <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${rubric[i] ? 'bg-success border-success' : 'border-border'}`}>
                  {rubric[i] && <Check className="w-3.5 h-3.5 text-white" />}
                </div>
                <span className="text-sm">{item}</span>
              </button>
            ))}
          </div>

          <button
            onClick={submitChecklist}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-gradient-to-r from-primary to-violet-500 text-white font-bold text-sm hover:opacity-90 transition-opacity glow-primary"
          >
            <Trophy className="w-4 h-4" /> Submit Self-Assessment
          </button>
        </div>
      </div>
    );
  }

  // Result phase
  return (
    <div className="space-y-6 pb-16 md:pb-0 max-w-2xl mx-auto">
      <div className="card-glass rounded-2xl p-8 text-center animate-float-up">
        <div className="text-6xl mb-4">
          {result.passed ? '🏆' : '💀'}
        </div>
        <h1 className={`text-2xl font-black mb-1 ${result.passed ? 'text-gradient-xp' : 'text-destructive'}`}>
          {result.passed ? 'BOSS DEFEATED!' : 'BATTLE LOST'}
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          {result.passed ? `You earned the ${selectedBoss.xpReward} XP and the Interview Ready badge!` : 'The boss overpowered you. Train and try again!'}
        </p>

        <div className="inline-flex items-center gap-3 bg-secondary/40 rounded-xl px-6 py-3 mb-6">
          <Trophy className="w-5 h-5 text-xp" />
          <span className="text-3xl font-black text-xp">{result.score}</span>
          <span className="text-sm text-muted-foreground">/ 100</span>
        </div>

        {result.category_scores && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            {Object.entries(result.category_scores).map(([cat, score]) => (
              <div key={cat} className="bg-secondary/30 rounded-lg p-3">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide capitalize">{cat.replace('_', ' ')}</p>
                <p className="text-lg font-black">{score}</p>
              </div>
            ))}
          </div>
        )}

        <div className="text-left bg-secondary/30 rounded-xl p-4 mb-6">
          <h3 className="font-bold text-sm mb-2">Performance Feedback</h3>
          <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">{result.feedback}</p>
        </div>

        <button
          onClick={reset}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white font-bold text-sm mx-auto hover:opacity-90 transition-opacity"
        >
          <RotateCcw className="w-4 h-4" />
          Battle Again
        </button>
      </div>
    </div>
  );
}