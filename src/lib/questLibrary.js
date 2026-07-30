// L&C Career Accelerator Quest Library — 26 multi-disciplinary quests
// `category` maps to the 4 pillars (Guidance, Skills, Experience, Connections).
// `quest_group` is the timeline track. `steps_total` > 1 marks a multi-step quest.

export const QUEST_LIBRARY = [
  // --- Daily Warmups ---
  { id: 'd1', title: 'Daily Reflection', description: 'Log one career thought, goal, or insight for the day.', category: 'Guidance', quest_group: 'Daily Warmups', xp_reward: 20, difficulty: 'Easy', icon: 'Coffee' },
  { id: 'd2', title: 'Skill Check-In', description: 'Review one Skill Tree node and reflect on your proficiency.', category: 'Skills', quest_group: 'Daily Warmups', xp_reward: 30, difficulty: 'Easy', icon: 'Brain' },
  { id: 'd3', title: 'Network Ping', description: 'Reach out to one contact in your Networking CRM.', category: 'Connections', quest_group: 'Daily Warmups', xp_reward: 40, difficulty: 'Easy', icon: 'Send' },
  { id: 'd4', title: 'Job Scan', description: 'Save one new job or internship posting to your Kanban board.', category: 'Guidance', quest_group: 'Daily Warmups', xp_reward: 30, difficulty: 'Easy', icon: 'Search' },
  { id: 'd5', title: 'Resume Tweak', description: 'Update or refine one bullet point on your resume.', category: 'Skills', quest_group: 'Daily Warmups', xp_reward: 40, difficulty: 'Easy', icon: 'PenLine' },

  // --- First-Year Milestones: Career Exploration & Guidance ---
  { id: 'f1', title: 'First Step', description: 'Complete account setup and select your target career track.', category: 'Guidance', quest_group: 'First-Year Milestones', xp_reward: 50, difficulty: 'Easy', icon: 'Target' },
  { id: 'f2', title: 'Advising Odyssey', description: 'Book and attend your first L&C Career Center or Faculty Advisor meeting.', category: 'Guidance', quest_group: 'First-Year Milestones', xp_reward: 100, difficulty: 'Medium', icon: 'Users' },
  { id: 'f3', title: 'Resume Catalyst', description: 'Upload your first resume draft or update bullet points using the STAR tool.', category: 'Skills', quest_group: 'First-Year Milestones', xp_reward: 150, difficulty: 'Medium', icon: 'FileText' },
  { id: 'f4', title: 'LinkedIn Polish', description: 'Sync 3 unlocked skills and export an optimized LinkedIn summary.', category: 'Skills', quest_group: 'First-Year Milestones', xp_reward: 100, difficulty: 'Medium', icon: 'Linkedin' },
  { id: 'f5', title: 'Handshake Pioneer', description: 'Connect your account with Handshake and save 3 target job postings.', category: 'Guidance', quest_group: 'First-Year Milestones', xp_reward: 75, difficulty: 'Easy', icon: 'Handshake' },

  // --- First-Year Milestones: Networking & Community ---
  { id: 'n1', title: 'Icebreaker', description: 'Log your first professional contact in the Networking CRM.', category: 'Connections', quest_group: 'First-Year Milestones', xp_reward: 75, difficulty: 'Easy', icon: 'Users' },
  { id: 'n2', title: 'Alumni Connect', description: 'Reach out to an L&C alumnus on LinkedIn or at an alumni panel.', category: 'Connections', quest_group: 'First-Year Milestones', xp_reward: 150, difficulty: 'Medium', icon: 'HeartHandshake' },
  { id: 'n3', title: 'Relationship Caretaker', description: 'Unfreeze 2 inactive networking cards by sending follow-up messages.', category: 'Connections', quest_group: 'First-Year Milestones', xp_reward: 100, difficulty: 'Medium', icon: 'Flame', steps_total: 2 },
  { id: 'n4', title: 'Informational Interviewer', description: 'Complete a 15-minute informational interview and log key takeaways.', category: 'Connections', quest_group: 'First-Year Milestones', xp_reward: 200, difficulty: 'Hard', icon: 'Mail' },
  { id: 'n5', title: 'Fair Explorer', description: 'Attend a campus Career Fair or Graduate School Expo.', category: 'Connections', quest_group: 'First-Year Milestones', xp_reward: 150, difficulty: 'Medium', icon: 'Building2' },

  // --- First-Year Milestones: Liberal Arts & Experiences ---
  { id: 'e1', title: 'Campus Leader', description: 'Log leadership in an L&C student organization, sport team, or campus job.', category: 'Experience', quest_group: 'First-Year Milestones', xp_reward: 150, difficulty: 'Medium', icon: 'Crown' },
  { id: 'e2', title: 'Community Impact', description: 'Log 10+ hours of volunteer work or community-engaged learning.', category: 'Experience', quest_group: 'First-Year Milestones', xp_reward: 150, difficulty: 'Medium', icon: 'HeartHandshake', steps_total: 10 },

  // --- Major-Specific Quests ---
  { id: 'm1', title: 'Research Pioneer', description: 'Log a lab project, thesis chapter, or independent research work.', category: 'Experience', quest_group: 'Major-Specific Quests', xp_reward: 200, difficulty: 'Hard', icon: 'Microscope', major: 'STEM & Research' },
  { id: 'm2', title: 'Global Citizen', description: 'Log a Study Abroad experience or language proficiency skill.', category: 'Experience', quest_group: 'Major-Specific Quests', xp_reward: 200, difficulty: 'Medium', icon: 'Globe', major: 'All' },
  { id: 'm3', title: 'Creative Portfolio', description: 'Upload a writing sample, art piece, policy memo, or code repository.', category: 'Experience', quest_group: 'Major-Specific Quests', xp_reward: 200, difficulty: 'Medium', icon: 'PenLine', major: 'Arts & Performance' },

  // --- Senior Boss Quests ---
  { id: 's1', title: 'Symposium Presenter', description: 'Log a presentation at the L&C Festival of Scholars or department symposium.', category: 'Experience', quest_group: 'Senior Boss Quests', xp_reward: 250, difficulty: 'Hard', icon: 'Presentation' },
  { id: 's2', title: 'Battle Bot Rookie', description: 'Complete 1 Interview Battle Bot challenge in your major.', category: 'Guidance', quest_group: 'Senior Boss Quests', xp_reward: 200, difficulty: 'Medium', icon: 'Swords' },
  { id: 's3', title: 'Boss Slayer', description: 'Defeat 3 Interview Battle Bots across different difficulty levels. Earns the "Interview Ready" Badge.', category: 'Guidance', quest_group: 'Senior Boss Quests', xp_reward: 500, difficulty: 'Hard', icon: 'Trophy', steps_total: 3 },
  { id: 's4', title: 'Application Blitz', description: 'Save 5 active job or internship applications on your Kanban Board.', category: 'Guidance', quest_group: 'Senior Boss Quests', xp_reward: 100, difficulty: 'Medium', icon: 'KanbanSquare', steps_total: 5 },
  { id: 's5', title: 'First Submission', description: 'Move an application to "Applied" status on your Kanban Board.', category: 'Guidance', quest_group: 'Senior Boss Quests', xp_reward: 150, difficulty: 'Medium', icon: 'Send' },
  { id: 's6', title: 'Interview Bound', description: 'Land an interview and update your application stage.', category: 'Guidance', quest_group: 'Senior Boss Quests', xp_reward: 250, difficulty: 'Hard', icon: 'Briefcase' },
];

export const QUEST_GROUPS = ['Daily Warmups', 'First-Year Milestones', 'Major-Specific Quests', 'Senior Boss Quests'];
export const QUEST_PILLARS = ['Guidance', 'Skills', 'Experience', 'Connections'];