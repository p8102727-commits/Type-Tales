export interface Area {
  id: string;
  name: string;
  emoji: string;
  description: string;
  bgColor: string;
  primaryColor: string;
  accentColor: string;
}

export interface Boss {
  id: string;
  name: string;
  emoji: string;
  description: string;
  areaId: string;
  maxHp: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlockedAt?: string;
}

export interface GameSave {
  id: string;
  username: string;
  avatarColor: string;
  createdAt: string;
  currentAreaId: string;
  currentBossId: string | null;
  bossHp: number;
  score: number;
  wordsTyped: number;
  accuracySum: number; // to calculate average accuracy
  keysPressed: number;
  errorsCount: number;
  unlockedAreaIds: string[];
  unlockedAchievements: string[];
}

export interface StoryParagraph {
  text: string;
  words: string[];
}

export interface LeaderboardEntry {
  username: string;
  score: number;
  wordsTyped: number;
  accuracy: number;
  area: string;
  date: string;
}

export interface FeedbackSubmission {
  id: string;
  type: 'feedback' | 'bug';
  username: string;
  email: string;
  title: string;
  description: string;
  createdAt: string;
}
