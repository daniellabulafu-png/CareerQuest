import { X, GraduationCap, Briefcase, Award, Users, KanbanSquare, GitBranch, TrendingUp, Mail, Linkedin, FileText } from 'lucide-react';

const FAKE_EXPERIENCES = [
  { title: 'Summer Research Assistant', org: 'L&C Psychology Lab', type: 'Research', dates: 'Jun 2025 – Aug 2025', competencies: ['Critical Thinking', 'Research & Analysis'] },
  { title: 'Peer Mentor', org: 'New Student Orientation', type: 'Campus Leadership', dates: 'Aug 2024 – Present', competencies: ['Leadership', 'Teamwork'] },
  { title: 'Volunteer Tutor', org: 'Portland Public Schools', type: 'Volunteer', dates: 'Jan 2024 – May 2025', competencies: ['Communication', 'Equity & Inclusion'] },
];

const FAKE_SKILLS = [
  { name: 'Critical Thinking', level: 2, max: 3 },
  { name: 'Written Communication', level: 2, max: 3 },
  { name: 'Research & Analysis', level: 1, max: 3 },
  { name: 'Public Speaking', level: 0, max: 3 },
  { name: 'Leadership', level: 1, max: 3 },
  { name: 'Data Analysis', level: 0, max: 3 },
];

const FAKE_APPLICATIONS = [
  { company: 'Nike', role: 'UX Research Intern', status: 'Interviewing' },
  { company: 'Oregon Health Authority', role: 'Data Analyst', status: 'Applied' },
  { company: 'Teach for America', role: 'Corps Member', status: 'Wishlist' },
];

const FAKE_BADGES = [
  { name: 'First Quest', icon: 'Award', earned: true },
  { name: 'Network Builder', icon: 'Users', earned: true },
  { name: 'Interview Novice', icon: 'TrendingUp', earned: false },
  { name: 'Application Master', icon: 'KanbanSquare', earned: false },
];

const FAKE_CONNECTIONS = [
  { name: 'Dr. Sarah Mitchell', role: 'Professor of Psychology', company: 'Lewis & Clark', temp: 'hot' },
  { name: 'James Carter', role: 'Recruiter', company: 'Nike', temp: 'hot' },
  { name: 'Lisa Wong', role: 'Alumni Mentor', company: 'Kaiser Permanente', temp: 'frozen' },
];

const statusColors = {
  Interviewing: 'bg-blue-500/15 text-blue-400',
  Applied: 'bg-amber-500/15 text-amber-400',
  Wishlist: 'bg-secondary/60 text-muted-foreground',
  Offer: 'bg-success/15 text-success',
  Rejected: 'bg-destructive/15 text-destructive',
};

export default function StudentProfileModal({ student, onClose }) {
  if (!student) return null;
  const initials = student.name?.split(' ').map((n) => n[0]).join('') || '?';
  const xpInLevel = (student.xp || 0) % 250;
  const xpPct = Math.round((xpInLevel / 250) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="card-glass rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto scrollbar-thin"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-xl border-b border-border/60 p-5 flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary via-violet-500 to-xp flex items-center justify-center text-2xl font-black text-white shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-black">{student.name}</h2>
            <p className="text-sm text-muted-foreground">{student.major} · Class of {student.grad_year || '2027'}</p>
            <div className="flex items-center gap-3 mt-1.5 text-xs">
              <span className="font-bold text-xp">Lv {student.level || 1}</span>
              <span className="text-muted-foreground">{student.xp || 0} XP</span>
              {student.gaps?.length > 0 && (
                <span className="text-warning">Gaps: {student.gaps.join(', ')}</span>
              )}
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-secondary/60 transition-colors shrink-0" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* XP Progress */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Progress to Level {(student.level || 1) + 1}</span>
              <span className="text-xs font-bold text-xp">{xpInLevel} / 250 XP</span>
            </div>
            <div className="h-2.5 rounded-full bg-secondary/80 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-xp" style={{ width: `${xpPct}%` }} />
            </div>
          </div>

          {/* Experiences */}
          <Section icon={Briefcase} title="Experiences">
            <div className="space-y-2.5">
              {FAKE_EXPERIENCES.map((exp, i) => (
                <div key={i} className="p-3 rounded-lg bg-secondary/30">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">{exp.title}</p>
                    <span className="text-[10px] text-muted-foreground">{exp.dates}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{exp.org} · {exp.type}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {exp.competencies.map((c) => (
                      <span key={c} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/15 text-primary">{c}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Skills */}
          <Section icon={GitBranch} title="Skill Tree">
            <div className="space-y-2">
              {FAKE_SKILLS.map((skill) => (
                <div key={skill.name} className="flex items-center gap-3">
                  <span className="text-xs font-medium w-36 shrink-0">{skill.name}</span>
                  <div className="flex-1 flex gap-1">
                    {Array.from({ length: skill.max }).map((_, i) => (
                      <div
                        key={i}
                        className={`flex-1 h-2.5 rounded-full ${i < skill.level ? 'bg-gradient-to-r from-primary to-violet-500' : 'bg-secondary/60'}`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-muted-foreground w-8 text-right">{skill.level}/{skill.max}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* Applications */}
          <Section icon={KanbanSquare} title="Job Applications">
            <div className="space-y-2">
              {FAKE_APPLICATIONS.map((app, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/30">
                  <div>
                    <p className="text-sm font-semibold">{app.role}</p>
                    <p className="text-xs text-muted-foreground">{app.company}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${statusColors[app.status] || statusColors.Wishlist}`}>
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          </Section>

          {/* Connections */}
          <Section icon={Users} title="Networking CRM">
            <div className="space-y-2">
              {FAKE_CONNECTIONS.map((c, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/30">
                  <div>
                    <p className="text-sm font-semibold">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.role} · {c.company}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${c.temp === 'hot' ? 'bg-hot/15 text-hot' : 'bg-frost/15 text-frost'}`}>
                    {c.temp === 'hot' ? '🔥 Hot' : '❄️ Frozen'}
                  </span>
                </div>
              ))}
            </div>
          </Section>

          {/* Badges */}
          <Section icon={Award} title="Badges">
            <div className="grid grid-cols-2 gap-2">
              {FAKE_BADGES.map((b) => (
                <div key={b.name} className={`flex items-center gap-2 p-2.5 rounded-lg ${b.earned ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-secondary/30 opacity-50'}`}>
                  <Award className={`w-4 h-4 ${b.earned ? 'text-amber-400' : 'text-muted-foreground'}`} />
                  <span className="text-xs font-medium">{b.name}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* Quick actions */}
          <div className="flex gap-2 pt-2">
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary/15 text-primary text-sm font-bold hover:bg-primary hover:text-white transition-colors">
              <Mail className="w-4 h-4" /> Email Student
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-secondary/60 text-foreground text-sm font-bold hover:bg-secondary transition-colors">
              <FileText className="w-4 h-4" /> View Resume
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ icon: Icon, title, children }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-bold">{title}</h3>
      </div>
      {children}
    </div>
  );
}
