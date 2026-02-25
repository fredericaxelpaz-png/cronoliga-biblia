export interface UserData {
  id: string;
  email: string;
  userName: string;
  completedGuides: string[];
  passedGuides: string[];
  dailyStreak: number;
  isDarkMode: boolean;
  progressPercentage: number;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number; // 0-3
  explanation: string;
}

export interface GuideContent {
  title: string;
  body: string; // Markdown or HTML string
}

export interface Guide {
  id: string;
  title: string;
  description: string;
  order: number;
  content: GuideContent[];
  questions: Question[];
}

export interface UserProgress {
  completedGuides: string[]; // IDs of guides marked as read
  passedGuides: string[]; // IDs of guides where quiz was passed
  currentGuideId: string;
  userName: string;
  isDarkMode: boolean;
  dailyStreak: number;
  lastLoginDate: string;
}
