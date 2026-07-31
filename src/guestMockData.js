export const MOCK_STUDENT = {
  id: 'guest-student',
  name: 'Alex Chen',
  level: 4,
  total_xp: 920,
  xp_to_next_level: 1000,
  major: 'Computer Science',
  minor: 'Mathematics',
  grad_year: '2027',
  university: 'Lewis & Clark College',
  avatar_url: '',
  title: 'Career Adventurer',
  bio: 'CS student passionate about tech and sustainability.',
  linkedin_url: 'https://linkedin.com/in/alexchen',
  resume_url: '',
};

export const MOCK_EXPERIENCES = [
  { id: 'exp-1', title: 'Software Engineering Intern', organization: 'TechCorp', type: 'Internship', description: 'Built and maintained web applications using React and Node.js. Collaborated with a team of 5 engineers.', competencies: ['Critical Thinking', 'Teamwork', 'Technology'], start_date: '2025-06-01', end_date: '2025-08-31', current: false },
  { id: 'exp-2', title: 'Research Assistant', organization: 'L&C Biology Dept', type: 'Thesis/Research Project', description: 'Analyzed ecological data using Python and R. Presented findings at the L&C symposium.', competencies: ['Research & Analysis', 'Quantitative Reasoning'], start_date: '2025-01-15', end_date: '', current: true },
  { id: 'exp-3', title: 'Hackathon Winner', organization: 'Portland Tech Hack', type: 'Project', description: 'Led a team of 4 to build a sustainability app in 48 hours. Won 1st place.', competencies: ['Leadership', 'Problem Solving', 'Teamwork'], start_date: '2025-03-01', end_date: '2025-03-03', current: false },
];

export const MOCK_QUESTS = [
  { id: 'q-1', title: 'Update Your Resume', description: 'Refresh your resume with your latest experiences and skills.', category: 'Guidance', quest_group: 'First-Year Milestones', xp_reward: 50, status: 'completed', completed_at: '2025-07-01T10:00:00Z', icon: 'FileText', difficulty: 'Easy', steps_total: 3, steps_done: 3 },
  { id: 'q-2', title: 'Attend a Networking Event', description: 'Go to a career fair or industry meetup and collect 3 business cards.', category: 'Connections', quest_group: 'First-Year Milestones', xp_reward: 100, status: 'available', icon: 'Users', difficulty: 'Medium', steps_total: 1, steps_done: 0 },
  { id: 'q-3', title: 'Complete a Mock Interview', description: 'Beat the Technical Interview Boss to earn the Interview Badge.', category: 'Skills', quest_group: 'Major-Specific Quests', xp_reward: 150, status: 'available', icon: 'Swords', difficulty: 'Hard', steps_total: 1, steps_done: 0 },
  { id: 'q-4', title: 'Log an Internship', description: 'Add your summer internship to your experience portfolio.', category: 'Experience', quest_group: 'First-Year Milestones', xp_reward: 75, status: 'completed', completed_at: '2025-08-15T14:00:00Z', icon: 'Briefcase', difficulty: 'Easy', steps_total: 1, steps_done: 1 },
  { id: 'q-5', title: 'Build Your LinkedIn Profile', description: 'Optimize your LinkedIn with a professional photo and summary.', category: 'Guidance', quest_group: 'Daily Warmups', xp_reward: 30, status: 'available', icon: 'Linkedin', difficulty: 'Easy', steps_total: 2, steps_done: 0 },
];

export const MOCK_SKILL_NODES = [
  { id: 'sn-1', name: 'Critical Thinking', category: 'Problem Solving', level: 2, max_level: 3, unlocked: true, description: 'Analyze problems and evaluate solutions.', position_x: 50, position_y: 20, prerequisite: null, icon: 'Brain' },
  { id: 'sn-2', name: 'Python Programming', category: 'Technical', level: 3, max_level: 3, unlocked: true, description: 'Write clean, efficient Python code.', position_x: 20, position_y: 40, prerequisite: null, icon: 'Code' },
  { id: 'sn-3', name: 'Public Speaking', category: 'Communication', level: 1, max_level: 3, unlocked: true, description: 'Present ideas clearly to an audience.', position_x: 80, position_y: 40, prerequisite: null, icon: 'Mic' },
  { id: 'sn-4', name: 'Team Leadership', category: 'Leadership', level: 1, max_level: 3, unlocked: true, description: 'Guide and motivate a team.', position_x: 50, position_y: 60, prerequisite: 'Critical Thinking', icon: 'Users' },
  { id: 'sn-5', name: 'Data Analysis', category: 'Technical', level: 2, max_level: 3, unlocked: true, description: 'Interpret and visualize data.', position_x: 20, position_y: 80, prerequisite: 'Python Programming', icon: 'BarChart' },
  { id: 'sn-6', name: 'React Development', category: 'Technical', level: 0, max_level: 3, unlocked: false, description: 'Build modern web UIs with React.', position_x: 80, position_y: 80, prerequisite: 'Python Programming', icon: 'Code' },
];

export const MOCK_BUSINESS_CARDS = [
  { id: 'bc-1', contact_name: 'Sarah Mitchell', role: 'Senior Recruiter', company: 'Google', met_platform: 'Career Fair', last_contact_date: '2025-07-20', follow_up_date: '2025-08-20', notes: 'Interested in my Python experience. Send resume.', email: 'sarah.mitchell@google.com', linkedin_url: 'https://linkedin.com/in/sarahmitchell', color_theme: 'blue' },
  { id: 'bc-2', contact_name: 'James Park', role: 'Engineering Manager', company: 'Nike', met_platform: 'LinkedIn', last_contact_date: '2025-06-15', follow_up_date: '', notes: 'Discussed internship opportunities for next summer.', email: 'j.park@nike.com', linkedin_url: 'https://linkedin.com/in/jamespark', color_theme: 'emerald' },
  { id: 'bc-3', contact_name: 'Dr. Emily Torres', role: 'Professor', company: 'L&C Computer Science', met_platform: 'Office Hours', last_contact_date: '2025-05-10', follow_up_date: '', notes: 'Research mentor for data analysis project.', email: 'torres@lclark.edu', linkedin_url: '', color_theme: 'amber' },
  { id: 'bc-4', contact_name: 'Michael Chang', role: 'Startup Founder', company: 'GreenTech PDX', met_platform: 'Hackathon', last_contact_date: '2025-03-02', follow_up_date: '2025-04-02', notes: 'Met at Portland Tech Hack. Cold lead — needs follow-up.', email: 'michael@greentechpdx.com', linkedin_url: 'https://linkedin.com/in/michaelchang', color_theme: 'rose' },
];

export const MOCK_BADGES = [
  { id: 'b-1', name: 'First Steps', description: 'Completed your first quest.', icon: 'Award', color: 'amber', earned: true, earned_at: '2025-07-01T10:00:00Z', rarity: 'Common' },
  { id: 'b-2', name: 'Network Builder', description: 'Collected 5 business cards.', icon: 'Users', color: 'blue', earned: true, earned_at: '2025-07-15T12:00:00Z', rarity: 'Rare' },
  { id: 'b-3', name: 'Interview Champion', description: 'Beat a mock interview boss.', icon: 'Swords', color: 'red', earned: false, earned_at: '', rarity: 'Epic' },
  { id: 'b-4', name: 'Experience Logger', description: 'Logged your first experience.', icon: 'Briefcase', color: 'emerald', earned: true, earned_at: '2025-08-15T14:00:00Z', rarity: 'Common' },
  { id: 'b-5', name: 'Skill Master', description: 'Maxed out a skill node.', icon: 'Star', color: 'purple', earned: true, earned_at: '2025-06-01T09:00:00Z', rarity: 'Epic' },
  { id: 'b-6', name: 'Quest Legend', description: 'Complete all quests in a group.', icon: 'Trophy', color: 'gold', earned: false, earned_at: '', rarity: 'Legendary' },
];

export const MOCK_INTERVIEW_RESULTS = [
  { id: 'ir-1', boss_name: 'The Technical Screener', boss_role: 'Senior Engineer at TechCorp', boss_avatar: '', score: 85, passed: true, xp_earned: 150, feedback: 'Strong problem-solving skills. Practice more system design questions.', questions_count: 5, badge_earned: 'Interview Champion', date: '2025-07-10T15:00:00Z' },
];

export const MOCK_APPLICATIONS = [
  { id: 'app-1', company: 'Google', role: 'Software Engineering Intern', status: 'Interviewing', link: 'https://careers.google.com', deadline: '2025-09-15', notes: 'Recruiter Sarah Mitchell. Technical interview scheduled.', applied_date: '2025-08-01', salary_range: '$8,000/mo' },
  { id: 'app-2', company: 'Nike', role: 'Frontend Developer Intern', status: 'Applied', link: 'https://careers.nike.com', deadline: '2025-09-30', notes: 'Referred by James Park.', applied_date: '2025-08-10', salary_range: '$7,500/mo' },
  { id: 'app-3', company: 'GreenTech PDX', role: 'Full Stack Developer', status: 'Wishlist', link: '', deadline: '', notes: 'Startup from hackathon. Reach out to Michael.', applied_date: '', salary_range: '' },
  { id: 'app-4', company: 'Amazon', role: 'SDE Intern', status: 'Rejected', link: '', deadline: '2025-08-01', notes: 'Did not pass resume screen.', applied_date: '2025-07-15', salary_range: '$9,000/mo' },
];

export const MOCK_DOCUMENTS = [
  { id: 'doc-1', name: 'Alex_Chen_Resume_2025.pdf', type: 'Resume', link: '#', description: 'Latest resume with summer internship experience.', uploaded_at: '2025-08-20T10:00:00Z' },
  { id: 'doc-2', name: 'Cover_Letter_Google.pdf', type: 'Cover Letter', link: '#', description: 'Tailored cover letter for Google SWE internship.', uploaded_at: '2025-08-01T09:00:00Z' },
];

export const MOCK_FACULTY_ALERTS = [
  { id: 'fa-1', student_name: 'Emily Johnson', email: 'emily.johnson@lclark.edu', major: 'Psychology', grad_year: '2026', reason: 'Senior with 0 active applications and low XP', severity: 'High', level: 1, total_xp: 120, applications_count: 0, last_activity: '14 days ago', avatar_url: '' },
  { id: 'fa-2', student_name: 'Marcus Lee', email: 'marcus.lee@lclark.edu', major: 'International Affairs', grad_year: '2026', reason: 'No experiences logged this semester', severity: 'Medium', level: 2, total_xp: 280, applications_count: 1, last_activity: '7 days ago', avatar_url: '' },
  { id: 'fa-3', student_name: 'Maya Patel', email: 'maya.patel@lclark.edu', major: 'Environmental Studies', grad_year: '2027', reason: 'Frozen networking cards (30+ days inactive)', severity: 'Low', level: 1, total_xp: 90, applications_count: 0, last_activity: '35 days ago', avatar_url: '' },
];

export const MOCK_JOB_ANALYSES = [
  { id: 'ja-1', job_text: 'Software Engineering Intern at Google', job_title: 'Software Engineering Intern at Google', matched_skills: ['Python', 'React', 'Data Analysis'], gap_skills: ['System Design', 'Kubernetes'], match_percentage: 72, date: '2025-08-05T14:00:00Z' },
];

export const MOCK_ADVISING_REQUESTS = [
  { id: 'ar-1', name: 'Emily Johnson', major: 'Psychology', level: 1, xp: 120, gaps: ['Data Analysis', 'Public Speaking'], apps: 0, note: 'Requested help with resume' },
  { id: 'ar-2', name: 'Marcus Lee', major: 'International Affairs', level: 2, xp: 280, gaps: ['Quantitative Reasoning'], apps: 1, note: 'Exploring grad school options' },
  { id: 'ar-3', name: 'Maya Patel', major: 'Environmental Studies', level: 1, xp: 90, gaps: ['Leadership', 'Research & Analysis'], apps: 0, note: 'First-gen student, needs guidance' },
];

// Lookup map for myList-based hooks
export const GUEST_MOCK_DATA = {
  Experience: MOCK_EXPERIENCES,
  Quest: MOCK_QUESTS,
  InterviewResult: MOCK_INTERVIEW_RESULTS,
  Document: MOCK_DOCUMENTS,
  JobAnalysis: MOCK_JOB_ANALYSES,
};
