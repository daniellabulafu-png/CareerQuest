import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export function useStudent() {
  return useQuery({
    queryKey: ['studentProfile'],
    queryFn: async () => {
      const list = await base44.entities.StudentProfile.list();
      return list?.[0] || null;
    },
  });
}

export function useExperiences() {
  return useQuery({
    queryKey: ['experiences'],
    queryFn: async () => {
      const list = await base44.entities.Experience.list('-created_date', 50);
      return list || [];
    },
  });
}

export function useQuests() {
  return useQuery({
    queryKey: ['quests'],
    queryFn: async () => {
      const list = await base44.entities.Quest.list();
      return list || [];
    },
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
    queryFn: async () => {
      const list = await base44.entities.BusinessCard.list('-last_contact_date', 50);
      return list || [];
    },
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
    queryFn: async () => {
      const list = await base44.entities.InterviewResult.list('-date', 20);
      return list || [];
    },
  });
}

export function useApplications() {
  return useQuery({
    queryKey: ['applications'],
    queryFn: async () => {
      const list = await base44.entities.Application.list();
      return list || [];
    },
  });
}

export function useDocuments() {
  return useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const list = await base44.entities.Document.list('-uploaded_at', 50);
      return list || [];
    },
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
    queryFn: async () => {
      const list = await base44.entities.JobAnalysis.list('-date', 10);
      return list || [];
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