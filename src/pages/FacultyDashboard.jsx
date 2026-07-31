import { useState } from 'react';
import { Shield, AlertTriangle, Users, TrendingUp, Activity, Search, GraduationCap, Flame, Handshake, Mail, Check, Send } from 'lucide-react';
import { useFacultyAlerts, useSkillNodes, useQuests } from '@/hooks/useEntities';
import StudentProfileModal from '@/components/StudentProfileModal';
import { useToast } from '@/components/ui/use-toast';

const severityColors = {
  Critical: 'border-destructive/50 bg-destructive/10 text-destructive',
  High: 'border-orange-500/50 bg-orange-500/10 text-orange-400',
  Medium: 'border-amber-500/50 bg-amber-500/10 text-amber-400',
  Low: 'border-blue-500/50 bg-blue-500/10 text-blue-400',
};

// Mock aggregate analytics data — Lewis & Clark majors
const cohortData = [
  { major: 'Psychology', students: 118, avgLevel: 3.1, engagement: 74, activeApps: 62 },
  { major: 'Biology', students: 96, avgLevel: 3.4, engagement: 81, activeApps: 58 },
  { major: 'International Affairs', students: 134, avgLevel: 3.2, engagement: 79, activeApps: 88 },
  { major: 'Rhetoric & Media Studies', students: 72, avgLevel: 2.8, engagement: 66, activeApps: 41 },
  { major: 'English', students: 64, avgLevel: 2.9, engagement: 63, activeApps: 33 },
  { major: 'Computer Science', students: 88, avgLevel: 3.5, engagement: 85, activeApps: 71 },
  { major: 'Environmental Studies', students: 79, avgLevel: 3.0, engagement: 72, activeApps: 45 },
  { major: 'Economics', students: 102, avgLevel: 3.3, engagement: 77, activeApps: 69 },
];

const LC_ALL_MAJORS = cohortData.map((c) => c.major);

const skillHeatmap = [
  { skill: 'Critical Thinking', coverage: 88, category: 'Core', majors: LC_ALL_MAJORS },
  { skill: 'Written Communication', coverage: 72, category: 'Core', majors: LC_ALL_MAJORS },
  { skill: 'Research & Analysis', coverage: 58, category: 'Core', majors: ['Psychology', 'Biology', 'International Affairs', 'Economics', 'Environmental Studies'] },
  { skill: 'Leadership', coverage: 41, category: 'Core', majors: LC_ALL_MAJORS },
  { skill: 'Global Engagement', coverage: 49, category: 'Core', majors: ['International Affairs', 'Economics', 'Foreign Languages', 'Environmental Studies'] },
  { skill: 'Quantitative Reasoning', coverage: 63, category: 'STEM & Research', majors: ['Computer Science', 'Biology', 'Economics', 'Chemistry', 'Mathematics'] },
  { skill: 'Data Analysis', coverage: 34, category: 'STEM & Research', majors: ['Psychology', 'Biology', 'Economics', 'Computer Science'] },
  { skill: 'Public Speaking', coverage: 29, category: 'Humanities & Media', majors: ['Rhetoric & Media Studies', 'English', 'International Affairs', 'Theatre'] },
  { skill: 'Creative Portfolio', coverage: 22, category: 'Arts & Performance', majors: ['Art', 'Music', 'Theatre', 'Rhetoric & Media Studies'] },
  { skill: 'Equity & Inclusion', coverage: 54, category: 'Core', majors: LC_ALL_MAJORS },
];

const heatmapColor = (coverage) => {
  if (coverage >= 70) return 'bg-success/70 text-success-foreground';
  if (coverage >= 50) return 'bg-amber-500/70 text-amber-100';
  if (coverage >= 30) return 'bg-orange-500/70 text-orange-100';
  return 'bg-destructive/70 text-destructive-foreground';
};

export default function FacultyDashboard() {
  const { data: alerts = [] } = useFacultyAlerts();
  const { data: skillNodes = [] } = useSkillNodes();
  const { data: quests = [] } = useQuests();
  const [cohortFilter, setCohortFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [nudgeSent, setNudgeSent] = useState({});
  const [outreachSent, setOutreachSent] = useState({});
  const [sending, setSending] = useState({});
  const [selectedStudent, setSelectedStudent] = useState(null);
  const { toast } = useToast();

  // Students who explicitly opted into career advising (privacy-gated)
  // NOTE: Mock data for testing phase — swap to useAdvisingRequests() hook when real data exists
  const supportQueue = [
    { id: 'mock-1', name: 'Emily Johnson', major: 'Psychology', level: 1, xp: 120, gaps: ['Data Analysis', 'Public Speaking'], apps: 0, note: 'Requested help with resume' },
    { id: 'mock-2', name: 'Marcus Lee', major: 'International Affairs', level: 2, xp: 280, gaps: ['Quantitative Reasoning'], apps: 1, note: 'Exploring grad school options' },
    { id: 'mock-3', name: 'Maya Patel', major: 'Environmental Studies', level: 1, xp: 90, gaps: ['Leadership', 'Research & Analysis'], apps: 0, note: 'First-gen student, needs guidance' },
  ];

  // Anonymized aggregate alerts — no individual names revealed
  const cohortAlerts = [
    { message: '4 Senior Psychology majors have 0 active job applications', major: 'Psychology' },
    { message: '3 Senior Economics majors have not logged an experience this semester', major: 'Economics' },
    { message: '2 Senior Rhetoric & Media Studies majors have frozen networking cards (30+ days inactive)', major: 'Rhetoric & Media Studies' },
  ];

  const sendNudge = (i, alert) => {
    setSending((s) => ({ ...s, [`nudge-${i}`]: true }));
    setTimeout(() => {
      setSending((s) => ({ ...s, [`nudge-${i}`]: false }));
      setNudgeSent((s) => ({ ...s, [i]: true }));
      toast({ title: 'Cohort nudge sent', description: `Mock emails sent to ${alert.major} students` });
    }, 800);
  };

  const handleReachOut = (alert) => {
    setSending((s) => ({ ...s, [`outreach-${alert.id}`]: true }));
    setTimeout(() => {
      setSending((s) => ({ ...s, [`outreach-${alert.id}`]: false }));
      setOutreachSent((s) => ({ ...s, [alert.id]: true }));
      toast({ title: 'Outreach email sent', description: `Mock email sent to ${alert.student_name}` });
    }, 800);
  };

  const totalStudents = cohortData.reduce((s, c) => s + c.students, 0);
  const avgEngagement = Math.round(cohortData.reduce((s, c) => s + c.engagement, 0) / cohortData.length);
  const avgLevel = (cohortData.reduce((s, c) => s + c.avgLevel, 0) / cohortData.length).toFixed(1);
  const questCompletion = Math.round((quests.filter((q) => q.status === 'completed').length / quests.length) * 100);

  const filteredCohorts = cohortFilter === 'All' ? cohortData : cohortData.filter((c) => c.major === cohortFilter);
  const filteredAlerts = cohortFilter === 'All' ? alerts : alerts.filter((a) => a.major === cohortFilter);
  const filteredHeatmap = cohortFilter === 'All' ? skillHeatmap : skillHeatmap.filter((s) => s.majors?.includes(cohortFilter));

  return (
    <div className="space-y-6 pb-16 md:pb-0">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black">Faculty Analytics Portal</h1>
              <p className="text-sm text-muted-foreground">Career Center · Read-only aggregate insights</p>
            </div>
          </div>
        </div>
        <select
          value={cohortFilter}
          onChange={(e) => setCohortFilter(e.target.value)}
          className="bg-secondary/60 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
        >
          <option>All</option>
          {cohortData.map((c) => <option key={c.major}>{c.major}</option>)}
        </select>
      </div>

      {/* High-level metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard icon={Users} label="Total Students" value={totalStudents} color="text-primary" />
        <MetricCard icon={TrendingUp} label="Avg Engagement" value={`${avgEngagement}%`} color="text-success" />
        <MetricCard icon={Activity} label="Avg Student Level" value={`Lv ${avgLevel}`} color="text-xp" />
        <MetricCard icon={GraduationCap} label="Quest Completion" value={`${questCompletion}%`} color="text-cyan-400" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Skill Gap Heatmap */}
        <div className="card-glass rounded-2xl p-5">
          <h3 className="font-bold text-sm mb-1 flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-400" /> Skill Gap Heatmap
          </h3>
          <p className="text-xs text-muted-foreground mb-4">{cohortFilter === 'All' ? 'Department-wide competency coverage' : `${cohortFilter} competency coverage`}</p>
          <div className="space-y-2">
            {filteredHeatmap.map((skill) => (
              <div key={skill.skill} className="flex items-center gap-3">
                <div className="w-40 shrink-0">
                  <p className="text-xs font-medium truncate">{skill.skill}</p>
                  <p className="text-[9px] text-muted-foreground">{skill.category}</p>
                </div>
                <div className="flex-1 h-6 rounded-md overflow-hidden bg-secondary/40">
                  <div
                    className={`h-full flex items-center justify-end px-2 ${heatmapColor(skill.coverage)}`}
                    style={{ width: `${Math.max(skill.coverage, 8)}%` }}
                  >
                    <span className="text-[10px] font-bold">{skill.coverage}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 mt-4 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-destructive/70" /> Critical gap</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-500/70" /> Developing</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-success/70" /> Strong</span>
          </div>
        </div>

        {/* Cohort breakdown */}
        <div className="card-glass rounded-2xl p-5">
          <h3 className="font-bold text-sm mb-1 flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" /> Cohort Engagement
          </h3>
          <p className="text-xs text-muted-foreground mb-4">By major · filterable above</p>
          <div className="space-y-3">
            {filteredCohorts.map((c) => (
              <div key={c.major} className="p-3 rounded-lg bg-secondary/30">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold">{c.major}</p>
                    <p className="text-[10px] text-muted-foreground">{c.students} students · {c.activeApps} active applications</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-xp">Lv {c.avgLevel}</p>
                    <p className="text-[10px] text-muted-foreground">avg level</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground w-16">Engagement</span>
                  <div className="flex-1 h-2 rounded-full bg-secondary/60 overflow-hidden">
                    <div className={`h-full rounded-full ${c.engagement >= 70 ? 'bg-success' : c.engagement >= 50 ? 'bg-amber-500' : 'bg-destructive'}`} style={{ width: `${c.engagement}%` }} />
                  </div>
                  <span className="text-[10px] font-bold w-8 text-right">{c.engagement}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* At-risk alerts */}
      <div className="card-glass rounded-2xl p-5 border-l-4 border-l-destructive">
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle className="w-5 h-5 text-destructive" />
          <h3 className="font-bold text-base">At-Risk Early Warning System</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Seniors with low XP, no active applications, or inactive networking — reach out proactively
        </p>
        <div className="space-y-3">
          {filteredAlerts.map((alert) => (
            <div key={alert.id} className={`rounded-xl border p-4 ${severityColors[alert.severity]}`}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-muted-foreground/40 to-muted-foreground/60 flex items-center justify-center text-xs font-bold shrink-0">
                  {alert.student_name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-sm">{alert.student_name}</p>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/30 font-bold uppercase">{alert.severity}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{alert.major} · Class of {alert.grad_year}</p>
                  <p className="text-xs mt-1.5">{alert.reason}</p>
                  <div className="flex items-center gap-4 mt-2 text-[11px]">
                    <span className="text-muted-foreground">Level <span className="font-bold text-foreground">{alert.level}</span></span>
                    <span className="text-muted-foreground">XP <span className="font-bold text-foreground">{alert.total_xp}</span></span>
                    <span className="text-muted-foreground">Apps <span className="font-bold text-destructive">{alert.applications_count}</span></span>
                    <span className="text-muted-foreground">Last active <span className="font-bold text-foreground">{alert.last_activity}</span></span>
                  </div>
                </div>
                <button
                  onClick={() => handleReachOut(alert)}
                  disabled={sending[`outreach-${alert.id}`] || outreachSent[alert.id]}
                  className="px-3 py-1.5 rounded-lg bg-primary/15 text-primary text-xs font-bold hover:bg-primary hover:text-white transition-colors shrink-0 disabled:opacity-50"
                >
                  {sending[`outreach-${alert.id}`] ? 'Sending...' : outreachSent[alert.id] ? 'Sent ✓' : 'Reach Out'}
                </button>
              </div>
            </div>
          ))}
          {filteredAlerts.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-4">No at-risk students in this cohort 🎉</p>
          )}
        </div>
      </div>

      {/* Student roster search */}
      <div className="card-glass rounded-2xl p-5">
        <h3 className="font-bold text-sm mb-3 flex items-center gap-2"><Search className="w-4 h-4 text-primary" /> Student Roster Search</h3>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student by name or major..."
            className="w-full bg-secondary/60 border border-border rounded-lg pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div className="space-y-2">
          {[
            { name: 'Alex Chen', major: 'Computer Science', level: 3, xp: 650, status: 'On Track' },
            { name: 'Emily Johnson', major: 'Psychology', level: 1, xp: 120, status: 'At Risk' },
            { name: 'Marcus Lee', major: 'International Affairs', level: 2, xp: 280, status: 'At Risk' },
            { name: 'Sofia Rodriguez', major: 'Biology', level: 4, xp: 920, status: 'On Track' },
            { name: 'Jordan Park', major: 'Rhetoric & Media Studies', level: 2, xp: 340, status: 'On Track' },
            { name: 'Maya Patel', major: 'Environmental Studies', level: 1, xp: 90, status: 'At Risk' },
          ]
            .filter((s) => cohortFilter === 'All' || s.major === cohortFilter)
            .filter((s) => !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.major.toLowerCase().includes(search.toLowerCase()))
            .map((s) => (
              <div
                key={s.name}
                onClick={() => setSelectedStudent(s)}
                className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/60 transition-colors cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-xp flex items-center justify-center text-xs font-bold">
                  {s.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">{s.name}</p>
                  <p className="text-[11px] text-muted-foreground">{s.major}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-xp">Lv {s.level}</p>
                  <p className="text-[10px] text-muted-foreground">{s.xp} XP</p>
                </div>
                <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${s.status === 'At Risk' ? 'bg-destructive/15 text-destructive' : 'bg-success/15 text-success'}`}>
                  {s.status}
                </span>
              </div>
            ))}
        </div>
      </div>
      {/* Student Support Queue — opt-in advising */}
      <div className="card-glass rounded-2xl p-5 border-l-4 border-l-emerald-500">
        <div className="flex items-center gap-2 mb-1">
          <Handshake className="w-5 h-5 text-emerald-400" />
          <h3 className="font-bold text-base">Student Support Queue</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Students who opted into career advising — review their level, skill gaps, and application activity before your 1-on-1
        </p>
        <div className="space-y-3">
          {supportQueue
            .filter((s) => cohortFilter === 'All' || s.major === cohortFilter)
            .map((s) => (
              <div key={s.name} className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4" role="article" aria-label={`Advising request from ${s.name}`}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
                    {s.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-sm">{s.name}</p>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold uppercase">Opted In</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{s.major} · Lv {s.level} · {s.xp} XP</p>
                    <p className="text-xs mt-1.5 italic text-muted-foreground">"{s.note}"</p>
                    <div className="flex items-center gap-3 mt-2 text-[11px] flex-wrap">
                      <span className="text-muted-foreground">Skill gaps: <span className="font-bold text-warning">{s.gaps.join(', ')}</span></span>
                      <span className="text-muted-foreground">Active apps: <span className="font-bold text-destructive">{s.apps}</span></span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedStudent(s)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 text-xs font-bold hover:bg-emerald-500 hover:text-white transition-colors shrink-0"
                  >
                    Open Profile
                  </button>
                </div>
              </div>
            ))}
          {supportQueue.filter((s) => cohortFilter === 'All' || s.major === cohortFilter).length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-4">No opt-in requests in this cohort.</p>
          )}
        </div>
      </div>

      {/* Anonymized Cohort Broadcasts */}
      <div className="card-glass rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-1">
          <Send className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-base">Anonymized Cohort Broadcasts</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Aggregate alerts — no individual student names are revealed until they accept help
        </p>
        <div className="space-y-3">
          {cohortAlerts
            .filter((a) => cohortFilter === 'All' || a.major === cohortFilter)
            .map((alert, i) => (
              <div key={i} className="rounded-xl border border-border/60 bg-secondary/30 p-4 flex items-center justify-between gap-3 flex-wrap" role="alert">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary shrink-0" />
                  <p className="text-sm">{alert.message}</p>
                </div>
                {nudgeSent[i] ? (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-success">
                    <Check className="w-4 h-4" /> Nudge sent
                  </span>
                ) : (
                  <button
                    onClick={() => sendNudge(i, alert)}
                    disabled={sending[`nudge-${i}`]}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/15 text-primary text-xs font-bold hover:bg-primary hover:text-white transition-colors disabled:opacity-50"
                    aria-label={`Send cohort nudge email for: ${alert.message}`}
                  >
                    <Send className="w-3.5 h-3.5" /> {sending[`nudge-${i}`] ? 'Sending...' : 'Send Cohort Nudge Email'}
                  </button>
                )}
              </div>
            ))}
        </div>
      </div>

      <StudentProfileModal student={selectedStudent} onClose={() => setSelectedStudent(null)} />
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, color }) {
  return (
    <div className="card-glass rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${color}`} />
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">{label}</span>
      </div>
      <p className="text-2xl font-black">{value}</p>
    </div>
  );
}
