// NACE Career Readiness Competencies
export const NACE_COMPETENCIES = [
  'Critical Thinking',
  'Communication',
  'Leadership',
  'Teamwork',
  'Equity & Inclusion',
  'Professionalism',
  'Technology',
  'Career & Self-Development',
];

export const naceColors = {
  'Critical Thinking': 'text-violet-400 bg-violet-500/15 border-violet-500/30',
  Communication: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30',
  Leadership: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
  Teamwork: 'text-pink-400 bg-pink-500/15 border-pink-500/30',
  'Equity & Inclusion': 'text-rose-400 bg-rose-500/15 border-rose-500/30',
  Professionalism: 'text-cyan-400 bg-cyan-500/15 border-cyan-500/30',
  Technology: 'text-blue-400 bg-blue-500/15 border-blue-500/30',
  'Career & Self-Development': 'text-xp bg-amber-500/15 border-amber-500/30',
};

// Map existing skill-node categories -> NACE competencies (used to tag nodes)
export const categoryToNace = {
  Technical: ['Technology', 'Critical Thinking'],
  Leadership: ['Leadership', 'Career & Self-Development'],
  Communication: ['Communication', 'Professionalism'],
  'Problem Solving': ['Critical Thinking', 'Career & Self-Development'],
  Teamwork: ['Teamwork', 'Equity & Inclusion'],
};

export function naceForNode(node) {
  return categoryToNace[node.category] || [];
}

// Lewis & Clark disciplines
export const LC_MAJORS = [
  'Psychology',
  'Biology',
  'International Affairs',
  'Rhetoric & Media Studies',
  'English',
  'Art',
  'Computer Science',
  'Environmental Studies',
  'Economics',
  'Sociology/Anthropology',
  'History',
  'Political Science',
  'Chemistry',
  'Physics',
  'Mathematics',
  'Philosophy',
  'Religious Studies',
  'Music',
  'Theatre',
  'Foreign Languages',
  'Undeclared',
];

export const CAREER_TRACKS = ['Grad School', 'Industry', 'Non-Profit/Gov', 'Creative'];

// Major-track branches for the skill tree
export const MAJOR_TRACKS = [
  { name: 'STEM & Research', categories: ['Technical', 'Problem Solving'], side: 'right' },
  { name: 'Humanities & Media', categories: ['Communication'], side: 'right' },
  { name: 'Social Sciences & Policy', categories: ['Leadership'], side: 'left' },
  { name: 'Arts & Performance', categories: ['Teamwork'], side: 'left' },
];

// Sample behavioral interview questions per major track (No-AI fallback)
export const FALLBACK_QUESTIONS = {
  'STEM & Research': [
    'Describe a research problem or technical challenge you investigated and how you approached it.',
    'Tell me about a time you had to learn a new tool or concept quickly to complete a project.',
    'Walk me through a project where your analysis led to a concrete recommendation or result.',
  ],
  'Humanities & Media': [
    'Describe a piece of writing or media you produced and the argument or message you crafted.',
    'Tell me about a time you had to adapt your communication style for a specific audience.',
    'Walk me through how you researched and synthesized multiple sources into a final work.',
  ],
  'Social Sciences & Policy': [
    'Describe a situation where you led a group toward a shared goal or policy recommendation.',
    'Tell me about a time you navigated competing stakeholder interests to reach consensus.',
    'Walk me through how you analyzed a social issue and proposed an evidence-based solution.',
  ],
  'Arts & Performance': [
    'Describe a creative project you led from concept to presentation and your artistic choices.',
    'Tell me about a time you collaborated with others to mount a performance or exhibition.',
    'Walk me through how you incorporated feedback to refine a creative work.',
  ],
  General: [
    'Tell me about a time you faced a significant challenge and how you overcame it.',
    'Describe a situation where you had a conflict with a teammate and how you resolved it.',
    'Walk me through a project you led from start to finish. What was the outcome?',
  ],
};