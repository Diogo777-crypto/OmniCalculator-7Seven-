
export type ThemeType = 'classic' | 'emerald' | 'sunset' | 'midnight' | 'cyberpunk' | 'rose' | 'vip';

export type LanguageType = 'pt' | 'en';

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

export interface ThemeColors {
  bg: string;
  card: string;
  button: string;
  opButton: string;
  accent: string;
  text: string;
  displayBg: string;
}

export interface Translations {
  title: string;
  history: string;
  settings: string;
  theme: string;
  language: string;
  aiAssistant: string;
  clearHistory: string;
  noHistory: string;
  aiPlaceholder: string;
  askAi: string;
  about: string;
  version: string;
  appType: string;
  engine: string;
  developedBy: string;
  appDescription: string;
  games: string;
  playNow: string;
  closeGame: string;
  login: string;
  unlockVip: string;
  vipOnly: string;
  loginToUnlock: string;
  logout: string;
}
