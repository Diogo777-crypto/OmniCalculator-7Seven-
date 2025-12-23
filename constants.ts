
import { ThemeColors, ThemeType, Translations, LanguageType } from './types';

export const THEMES: Record<ThemeType, ThemeColors> = {
  classic: {
    bg: 'bg-zinc-950',
    card: 'bg-zinc-900',
    button: 'bg-zinc-800 hover:bg-zinc-700',
    opButton: 'bg-blue-600 hover:bg-blue-500',
    accent: 'text-blue-400',
    text: 'text-zinc-100',
    displayBg: 'bg-zinc-950/50'
  },
  emerald: {
    bg: 'bg-emerald-950',
    card: 'bg-emerald-900',
    button: 'bg-emerald-800 hover:bg-emerald-700',
    opButton: 'bg-emerald-500 hover:bg-emerald-400',
    accent: 'text-emerald-300',
    text: 'text-emerald-50',
    displayBg: 'bg-emerald-950/50'
  },
  sunset: {
    bg: 'bg-orange-950',
    card: 'bg-orange-900',
    button: 'bg-orange-800 hover:bg-orange-700',
    opButton: 'bg-orange-500 hover:bg-orange-400',
    accent: 'text-orange-300',
    text: 'text-orange-50',
    displayBg: 'bg-orange-950/50'
  },
  midnight: {
    bg: 'bg-slate-950',
    card: 'bg-slate-900',
    button: 'bg-slate-800 hover:bg-slate-700',
    opButton: 'bg-indigo-600 hover:bg-indigo-500',
    accent: 'text-indigo-400',
    text: 'text-slate-100',
    displayBg: 'bg-slate-950/50'
  },
  cyberpunk: {
    bg: 'bg-black',
    card: 'bg-zinc-900 border border-fuchsia-500',
    button: 'bg-zinc-800 hover:bg-fuchsia-900/40 text-cyan-400',
    opButton: 'bg-fuchsia-600 hover:bg-fuchsia-500 text-white',
    accent: 'text-yellow-400',
    text: 'text-zinc-100',
    displayBg: 'bg-zinc-950/80 border-b border-fuchsia-500'
  },
  rose: {
    bg: 'bg-rose-950',
    card: 'bg-rose-900',
    button: 'bg-rose-800 hover:bg-rose-700',
    opButton: 'bg-rose-500 hover:bg-rose-400',
    accent: 'text-rose-300',
    text: 'text-rose-50',
    displayBg: 'bg-rose-950/50'
  },
  vip: {
    bg: 'bg-gradient-to-br from-indigo-900 via-purple-900 to-rose-900',
    card: 'bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_0_40px_rgba(192,38,211,0.3)]',
    button: 'bg-white/5 hover:bg-white/20 text-white border border-white/10',
    opButton: 'bg-gradient-to-r from-fuchsia-500 to-orange-500 hover:scale-105 shadow-fuchsia-500/20 text-white font-black',
    accent: 'text-yellow-400',
    text: 'text-white',
    displayBg: 'bg-black/40 backdrop-blur-md rounded-3xl border border-white/10'
  }
};

export const TRANSLATIONS: Record<LanguageType, Translations> = {
  pt: {
    title: 'OmniCalc Advanced',
    history: 'Histórico',
    settings: 'Configurações',
    theme: 'Tema',
    language: 'Idioma',
    aiAssistant: 'Assistente de IA',
    clearHistory: 'Limpar Histórico',
    noHistory: 'Nenhum cálculo recente.',
    aiPlaceholder: 'Pergunte algo sobre matemática...',
    askAi: 'Perguntar',
    about: 'Sobre o App',
    version: 'Versão',
    appType: 'Tipo',
    engine: 'Motor de IA',
    developedBy: 'Desenvolvido com',
    appDescription: 'Uma calculadora avançada que une matemática tradicional com o poder da Inteligência Artificial.',
    games: 'Minha Pasta Games',
    playNow: 'Jogar Agora',
    closeGame: 'Sair do Jogo',
    login: 'Fazer Login',
    unlockVip: 'Desbloquear VIP',
    vipOnly: 'Tema Colorido (VIP)',
    loginToUnlock: 'Faça login para usar o Tema Colorido!',
    logout: 'Sair da Conta'
  },
  en: {
    title: 'OmniCalc Advanced',
    history: 'History',
    settings: 'Settings',
    theme: 'Theme',
    language: 'Language',
    aiAssistant: 'AI Assistant',
    clearHistory: 'Clear History',
    noHistory: 'No recent calculations.',
    aiPlaceholder: 'Ask something about math...',
    askAi: 'Ask',
    about: 'About the App',
    version: 'Version',
    appType: 'Type',
    engine: 'AI Engine',
    developedBy: 'Built with',
    appDescription: 'An advanced calculator bridging traditional math with the power of Artificial Intelligence.',
    games: 'My Games Folder',
    playNow: 'Play Now',
    closeGame: 'Exit Game',
    login: 'Login',
    unlockVip: 'Unlock VIP',
    vipOnly: 'Colored Theme (VIP)',
    loginToUnlock: 'Login to unlock the Colored Theme!',
    logout: 'Logout'
  }
};

export const GAME_LIST = [
  {
    id: 'subway-surfers',
    name: 'Subway Surfers',
    type: 'local',
    image: 'https://img.poki.com/cdn-cgi/image/quality=78,width=314,height=314,fit=cover,f=auto/b2bd30a8-d9dc-4648-a006-258079f3813e.png',
    category: 'Ação / Runner'
  },
  {
    id: '2048',
    name: '2048',
    type: 'local',
    image: 'https://img.poki.com/cdn-cgi/image/quality=78,width=314,height=314,fit=cover,f=auto/8e29a96b-801b-426c-9418-4e3d3683f126.png',
    category: 'Puzzle / Math'
  },
  {
    id: 'temple-run-2',
    name: 'Temple Run 2',
    type: 'local',
    image: 'https://img.poki.com/cdn-cgi/image/quality=78,width=314,height=314,fit=cover,f=auto/029c6239-f018-4220-804d-e99120612185.png',
    category: 'Aventura / Runner'
  },
  {
    id: 'hextris',
    name: 'Hextris',
    type: 'local',
    image: 'https://hextris.io/images/logo.png',
    category: 'Estratégia / Cores'
  }
];
