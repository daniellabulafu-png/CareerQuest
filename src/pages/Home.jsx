import { useState } from 'react';
import { Wand2, TrendingUp, Briefcase, Sparkles, Award, ChevronRight, CalendarCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStudent, useExperiences, useBadges, useInterviewResults } from '@/hooks/useEntities';
import LevelHeader from '@/components/LevelHeader';
import QuestBoard from '@/components/QuestBoard';
import ResumeAssistantModal from '@/components/ResumeAssistantModal';
import PillarProgress from '@/components/PillarProgress';

export default function Home() {
  const { data: student, isLoading } = useStudent();
  const { data: experiences = [] } = useExperiences();
  const { data: badges = [] } = useBadges();
  const { data: interviews = [] } = useInterviewResults();
  const [resumeOpen, setResumeOpen] = useState(false);

  if (isLoading || !student) {
    return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin" /></div>;
  }

  const earnedBadges = badges.filter((b) => b.earned);

  return (
    <div className="space-y-6 pb-16 md:pb-0">
      <LevelHeader student={student} />

      <PillarProgress />

      {/* Book Career Center Appointment CTA */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600/20 via-teal-600/15 to-success/20 border border-emerald-500/30 p-5">
        <div className="relative z-10 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center glow-success">
              <CalendarCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-base">Book Career Center Appointment</h2>
              <p className="text-xs text-muted-foreground">Meet 1-on-1 with an L&C career advisor for guidance, reviews, and more</p>
            </div>
          </div>
          <a
            href="https://careerdevelopmentappt.youcanbook.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-sm flex items-center gap-2 hover:opacity-90 transition-opacity glow-success"
          >
            <CalendarCheck className="w-4 h-4" />
            Book Appointment
          </a>
        </div>
      </div>

      {/* AI Assistant CTA */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600/20 via-fuchsia-600/15 to-primary/20 border border-violet-500/30 p-5">
        <div className="relative z-10 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center glow-primary">
              <Wand2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-base">AI Resume & LinkedIn Assistant</h2>
              <p className="text-xs text-muted-foreground">Turn your experiences into STAR bullets & polished posts</p>
            </div>
          </div>
          <button
            onClick={() => setResumeOpen(true)}
            className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-bold text-sm flex items-center gap-2 hover:opacity-90 transition-opacity glow-primary"
          >
            <Sparkles className="w-4 h-4" />
            Launch Assistant
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quest Board */}
        <div className="lg:col-span-2">
          <QuestBoard />
        </div>

        {/* Side stats */}
        <div className="space-y-4">
          <div className="card-glass rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-xp" />
              <h3 className="font-bold text-sm">Career Progress</h3>
            </div>
            <div className="space-y-3">
              <StatRow label="Experiences" value={`${experiences.length}`} icon={Briefcase} />
              <StatRow label="Badges" value={`${earnedBadges.length}/${badges.length}`} icon={Award} />
              <StatRow label="Total XP" value={`${student.total_xp || 0}`} icon={Sparkles} />
            </div>
          </div>

          {interviews[0] && (
            <Link to="/interview" className="block card-glass rounded-2xl p-5 hover:border-primary/40 transition-colors group">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{interviews[0].boss_avatar}</span>
                <div>
                  <p className="font-bold text-sm">{interviews[0].boss_name}</p>
                  <p className="text-[11px] text-muted-foreground">Last Boss Battle</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${interviews[0].passed ? 'bg-success/15 text-success' : 'bg-destructive/15 text-destructive'}`}>
                  {interviews[0].passed ? 'DEFEATED' : 'RETREAT'}
                </span>
                <span className="text-xs text-xp font-bold">{interviews[0].score}/100</span>
                <ChevronRight className="w-4 h-4 ml-auto text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </Link>
          )}
        </div>
      </div>

      <ResumeAssistantModal open={resumeOpen} onClose={() => setResumeOpen(false)} />
    </div>
  );
}

function StatRow({ label, value, icon: Icon }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-muted-foreground flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </span>
      <span className="text-sm font-bold">{value}</span>
    </div>
  );
}
