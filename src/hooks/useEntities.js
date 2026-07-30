import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { getCurrentUser } from '@/lib/currentUser';

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
      const user = await getCurrentUser();
      const list = user?.id
        ? await base44.entities.StudentProfile.filter({ created_by_id: user.id })
        : await base44.entities.StudentProfile.list();
      if (list?.[0]) return list[0];
      // Auto-create a profile for new users so the dashboard renders and XP works
      if (user?.id) {
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
      const list = await base44.entities.SkillNode.list();
      return list || [];
    },
  });
}

export function useBusinessCards() {
  return useQuery({
    queryKey: ['businessCards'],
    queryFn: async () => (await myList('BusinessCard', {}, '-last_contact_date', 50)) || [],
  });
}

export function useBadges() {
  return useQuery({
    queryKey: ['badges'],
    queryFn: async () => {
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
    queryFn: async () => (await myList('Application')) || [],
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