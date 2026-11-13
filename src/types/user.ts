export type ThemeMode = 'light' | 'dark' | 'system';

export interface UserPreferences {
  theme: ThemeMode;
  saveHistoryLocally: boolean;
  reducedMotion: boolean;
  compactCards: boolean;
  showDemoBadges: boolean;
}

export interface UserProfile {
  name: string;
  plan: 'free' | 'premium';
  joinedDate: string;
  analysesCount: number;
}
