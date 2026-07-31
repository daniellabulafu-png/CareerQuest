import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { getCurrentUser } from '@/lib/currentUser';
import { isGuest } from '@/lib/guest';
import { MOCK_STUDENT, MOCK_SKILL_NODES, MOCK_BUSINESS_CARDS, MOCK_BADGES, MOCK_APPLICATIONS, MOCK_FACULTY_ALERTS, MOCK_ADVISING_REQUESTS, GUEST_MOCK_DATA } from '@/lib/guestMockData';

const DEFAULT_PROFILE = {
  name: 'New Explorer',
  level: 1,
  total_xp: 0,
  xp_to_next_level: 1000,
  major: '',
  grad_year: '',
  university: 'Lewis & Clark College',
  avatar_url: '',
  title: 'Career Novice',
  bio: '',
  linkedin_url: '',
  resume_url: '',
};

// Filters by the current user when authenticated; falls back to an unfiltered
// list (previous behavior) when there is no user id.
async function myList(entity, query, sort, limit) {
  if (isGuest()) return GUEST_MOCK_DATA[entity] || [];
  const user = await getCurrentUser();
  if (user?.id) {
    return base44.entities[entity].filter({ ...(query || {}), created_by_id: user.id }, sort, limit);
  }
  return base44.entities[entity].list(sort, limit);
}

export function useStudent() {
  return useQuery({
    queryKey: ['studentProfile'],
    queryFn: async () => {
      if (isGuest()) return MOCK_STUDENT;
      const user = await getCurrentUser();
      const list = user?.id
        ? await base44.entities.StudentProfile.filter({ created_by_id: user.id })
        : await base44.entities.StudentProfile.list();
      if (list?.[0]) return list[0];
      // Auto-create a profile for new STUDENT users so the dashboard renders and XP works.
      // Faculty/advisors don't need a student profile.
      if (user?.id && user.account_type !== 'faculty') {
        try {
          return await base44.entities.StudentProfile.create({
            name: user.full_name || user.email || 'New Explorer',
            email: user.email || '',
            level: 1,
            total_xp: 0,
            xp_to_next_level: 1000,
            university: 'Lewis & Clark College',
          });
        } catch (e) {
          // fall through to default
        }
      }
      return { ...DEFAULT_PROFILE };
    },
  });
}

export function useExperiences() {
  return useQuery({
    queryKey: ['experiences'],
    queryFn: async () => (await myList('Experience', {}, '-created_date', 50)) || [],
  });
}

export function useQuests() {
  return useQuery({
    queryKey: ['quests'],
    queryFn: async () => (await myList('Quest')) || [],
  });
}

export function useSkillNodes() {
  return useQuery({
    queryKey: ['skillNodes'],
    queryFn: async () => {
      if (isGuest()) return MOCK_SKILL_NODES;
      const list = await base44.entities.SkillNode.list();
      return list || [];
    },
  });
}

export function useBusinessCards() {
  return useQuery({
    queryKey: ['businessCards'],
    queryFn: async () => {
      if (isGuest()) return MOCK_BUSINESS_CARDS;
      const list = await base44.entities.BusinessCard.list('-last_contact_date', 50);
      return list || [];
    },
  });
}

export function useBadges() {
  return useQuery({
    queryKey: ['badges'],
    queryFn: async () => {
      if (isGuest()) return MOCK_BADGES;
      const list = await base44.entities.Badge.list();
      return list || [];
    },
  });
}

export function useInterviewResults() {
  return useQuery({
    queryKey: ['interviewResults'],
    queryFn: async () => (await myList('InterviewResult', {}, '-date', 20)) || [],
  });
}

export function useApplications() {
  return useQuery({
    queryKey: ['applications'],
    queryFn: async () => {
      if (isGuest()) return MOCK_APPLICATIONS;
      const list = await base44.entities.Application.list();
      return list || [];
    },
  });
}

export function useDocuments() {
  return useQuery({
    queryKey: ['documents'],
    queryFn: async () => (await myList('Document', {}, '-uploaded_at', 50)) || [],
  });
}

export function useFacultyAlerts() {
  return useQuery({
    queryKey: ['facultyAlerts'],
    queryFn: async () => {
      if (isGuest()) return MOCK_FACULTY_ALERTS;
      const list = await base44.entities.FacultyAlert.list();
      return list || [];
    },
  });
}

export function useJobAnalyses() {
  return useQuery({
    queryKey: ['jobAnalyses'],
    queryFn: async () => (await myList('JobAnalysis', {}, '-date', 10)) || [],
  });
}

export function useAdvisingRequests() {
  return useQuery({
    queryKey: ['advisingRequests'],
    queryFn: async () => {
      if (isGuest()) return MOCK_ADVISING_REQUESTS;
      const requests = await base44.entities.AdvisingRequest.filter({ status: 'pending' });
      if (!requests?.length) return [];
      const profiles = await base44.entities.StudentProfile.list('-created_date', 500);
      return requests.map((r) => {
        const profile = profiles.find((p) => p.created_by_id === r.student_id);
        return {
          id: r.id,
          name: profile?.name || 'Unknown Student',
          major: profile?.major || 'Undeclared',
          level: profile?.level || 1,
          xp: profile?.total_xp || 0,
          gaps: [],
          apps: 0,
          note: r.topic || r.notes || '',
          student_id: r.student_id,
        };
      });
    },
  });
}

export function levelFromXp(totalXp) {
  return Math.floor(totalXp / 250) + 1;
}

export function xpProgress(totalXp) {
  const xpInLevel = totalXp % 250;
  return { current: xpInLevel, needed: 250, percent: Math.round((xpInLevel / 250) * 100) };
}

export function cardTemperature(lastContactDate) {
  if (!lastContactDate) return 'frozen';
  const last = new Date(lastContactDate);
  const now = new Date();
  const diffDays = Math.floor((now - last) / (1000 * 60 * 60 * 24));
  return diffDays > 30 ? 'frozen' : 'hot';
}
