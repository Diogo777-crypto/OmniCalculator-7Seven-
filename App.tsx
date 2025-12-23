
import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { 
  Settings, 
  History as HistoryIcon, 
  Trash2, 
  X, 
  Moon, 
  Sun, 
  Languages, 
  Sparkles,
  ChevronRight,
  Eraser,
  Delete,
  Info,
  Gamepad2,
  ExternalLink,
  Play,
  Loader2,
  LayoutGrid,
  Lock,
  User,
  LogOut,
  Star,
  Cpu,
  Layers,
  Heart
} from 'lucide-react';
import { THEMES, TRANSLATIONS, GAME_LIST } from './constants';
import { ThemeType, LanguageType, HistoryItem } from './types';
import { askMathAssistant } from './services/geminiService';

// Local Games
import { Game2048 } from './Games/Game2048';
import { SubwaySurfers } from './Games/SubwaySurfers';
import { TempleRun2 } from './Games/TempleRun2';
import { Hextris } from './Games/Hextris';

const App: React.FC = () => {
  // --- State ---
  const [display, setDisplay] = useState<string>('0');
  const [expression, setExpression] = useState<string>('');
  const [theme, setTheme] = useState<ThemeType>('classic');
  const [language, setLanguage] = useState<LanguageType>('pt');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState<'history' | 'settings' | 'ai' | 'games' | 'login' | 'about' | null>(null);
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [activeGame, setActiveGame] = useState<string | null>(null);
  
  // Login / VIP System
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');

  const colors = THEMES[theme];
  const t = TRANSLATIONS[language];

  // --- Persistence ---
  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn.toString());
  }, [isLoggedIn]);

  // --- Calculator Logic ---
  const handleNumber = (num: string) => {
    setDisplay(prev => (prev === '0' ? num : prev + num));
  };

  const handleOperator = (op: string) => {
    const visualOp = op === '*' ? '×' : op === '/' ? '÷' : op;
    setExpression(display + ' ' + visualOp + ' ');
    setDisplay('0');
  };

  const calculate = useCallback(() => {
    try {
      if (!expression) return;
      const fullExpression = (expression + display).replace(/×/g, '*').replace(/÷/g, '/');
      const result = new Function(`return ${fullExpression}`)();
      const resultStr = String(Number.isFinite(result) ? Number(result.toFixed(8)) : 'Error');
      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        expression: expression + display,
        result: resultStr,
        timestamp: Date.now()
      };
      setHistory(prev => [newHistoryItem, ...prev].slice(0, 50));
      setDisplay(resultStr);
      setExpression('');
    } catch (err) {
      setDisplay('Error');
      setExpression('');
    }
  }, [display, expression]);

  const clear = () => {
    setDisplay('0');
    setExpression('');
  };

  const deleteLast = () => {
    setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
  };

  const togglePlusMinus = () => {
    setDisplay(prev => prev.startsWith('-') ? prev.slice(1) : '-' + prev);
  };

  const handleScientific = (func: string) => {
    try {
      const val = parseFloat(display);
      let res: number;
      switch (func) {
        case 'sin': res = Math.sin(val); break;
        case 'cos': res = Math.cos(val); break;
        case 'tan': res = Math.tan(val); break;
        case 'sqrt': res = Math.sqrt(val); break;
        case 'log': res = Math.log10(val); break;
        case 'ln': res = Math.log(val); break;
        default: res = val;
      }
      setDisplay(String(Number(res.toFixed(8))));
    } catch {
      setDisplay('Error');
    }
  };

  const handleAiAsk = async () => {
    if (!aiQuery.trim()) return;
    setIsAiLoading(true);
    setAiResponse('');
    const response = await askMathAssistant(aiQuery, expression + display, language);
    setAiResponse(response);
    setIsAiLoading(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginUser.trim() && loginPass.trim()) {
      setIsLoggedIn(true);
      setIsSidebarOpen('settings');
      setLoginUser('');
      setLoginPass('');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    if (theme === 'vip') setTheme('classic');
  };

  const Button = ({ children, onClick, className = '', variant = 'normal' }: any) => {
    let baseClass = `flex items-center justify-center rounded-2xl h-16 text-xl font-medium transition-all duration-200 active:scale-95 shadow-lg `;
    if (variant === 'op') {
      baseClass += colors.opButton + ' text-white';
    } else if (variant === 'scientific') {
      baseClass += `${colors.button} ${colors.accent} text-sm uppercase tracking-wider`;
    } else {
      baseClass += colors.button + ' ' + colors.text;
    }
    return <button onClick={onClick} className={`${baseClass} ${className}`}>{children}</button>;
  };

  const currentGame = GAME_LIST.find(g => g.id === activeGame);

  const renderGame = () => {
    switch (activeGame) {
      case '2048': return <Game2048 />;
      case 'subway-surfers': return <SubwaySurfers />;
      case 'temple-run-2': return <TempleRun2 />;
      case 'hextris': return <Hextris />;
      default: return null;
    }
  };

  return (
    <div className={`min-h-screen ${colors.bg} ${colors.text} transition-all duration-1000 overflow-hidden flex flex-col md:flex-row`}>
      
      {/* Game Player Overlay */}
      {activeGame && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-in fade-in zoom-in duration-300">
          <div className="p-4 bg-zinc-900 border-b border-white/10 flex justify-between items-center shadow-xl">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <Gamepad2 className="text-emerald-400" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg leading-none">{currentGame?.name}</h3>
                <p className="text-[10px] text-zinc-500 uppercase mt-1 tracking-widest">{currentGame?.category}</p>
              </div>
            </div>
            
            <button 
              onClick={() => setActiveGame(null)}
              className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 rounded-xl flex items-center gap-2 font-bold transition-all transform active:scale-95"
            >
              <X size={18} /> {t.closeGame}
            </button>
          </div>
          
          <div className="flex-1 bg-zinc-950 relative overflow-hidden">
            <Suspense fallback={<div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-emerald-400" size={48}/></div>}>
              {renderGame()}
            </Suspense>
          </div>
        </div>
      )}

      {/* Main Calculator Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-md flex justify-between items-center mb-6">
          <h1 className={`text-2xl font-bold ${colors.accent} tracking-tight`}>{t.title}</h1>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsSidebarOpen('about')}
              className={`p-3 rounded-xl ${colors.button} hover:opacity-80 transition-all text-zinc-400`}
              title={t.about}
            >
              <Info size={20} />
            </button>
            <button 
              onClick={() => setIsSidebarOpen('games')}
              className={`p-3 rounded-xl ${colors.button} hover:opacity-80 transition-all text-emerald-400 border border-emerald-500/20 shadow-emerald-500/10`}
              title={t.games}
            >
              <LayoutGrid size={20} />
            </button>
            <button 
              onClick={() => setIsSidebarOpen('ai')}
              className={`p-3 rounded-xl ${colors.button} hover:opacity-80 transition-all text-blue-400 border border-blue-500/20 shadow-blue-500/10`}
              title={t.aiAssistant}
            >
              <Sparkles size={20} />
            </button>
            <button 
              onClick={() => setIsSidebarOpen('history')}
              className={`p-3 rounded-xl ${colors.button} hover:opacity-80 transition-all`}
              title={t.history}
            >
              <HistoryIcon size={20} />
            </button>
            <button 
              onClick={() => setIsSidebarOpen('settings')}
              className={`p-3 rounded-xl ${colors.button} hover:opacity-80 transition-all`}
              title={t.settings}
            >
              <Settings size={20} />
            </button>
          </div>
        </div>

        <div className={`w-full max-w-md ${colors.card} rounded-[2.5rem] p-6 shadow-2xl overflow-hidden border border-white/10 transition-all duration-700`}>
          <div className={`${colors.displayBg} rounded-3xl p-6 mb-6 flex flex-col items-end justify-end h-32 overflow-hidden transition-all duration-300 border border-white/5`}>
            <div className="text-zinc-500 text-sm font-mono-calc mb-1 h-6">{expression}</div>
            <div className="text-4xl font-bold font-mono-calc break-all text-right">{display}</div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            <Button onClick={() => handleScientific('sin')} variant="scientific">sin</Button>
            <Button onClick={() => handleScientific('cos')} variant="scientific">cos</Button>
            <Button onClick={() => handleScientific('tan')} variant="scientific">tan</Button>
            <Button onClick={() => handleScientific('sqrt')} variant="scientific">√</Button>

            <Button onClick={clear} className="text-rose-400">AC</Button>
            <Button onClick={deleteLast}><Delete size={20}/></Button>
            <Button onClick={togglePlusMinus}>+/-</Button>
            <Button onClick={() => handleOperator('/')} variant="op">÷</Button>

            <Button onClick={() => handleNumber('7')}>7</Button>
            <Button onClick={() => handleNumber('8')}>8</Button>
            <Button onClick={() => handleNumber('9')}>9</Button>
            <Button onClick={() => handleOperator('*')} variant="op">×</Button>

            <Button onClick={() => handleNumber('4')}>4</Button>
            <Button onClick={() => handleNumber('5')}>5</Button>
            <Button onClick={() => handleNumber('6')}>6</Button>
            <Button onClick={() => handleOperator('-')} variant="op">-</Button>

            <Button onClick={() => handleNumber('1')}>1</Button>
            <Button onClick={() => handleNumber('2')}>2</Button>
            <Button onClick={() => handleNumber('3')}>3</Button>
            <Button onClick={() => handleOperator('+')} variant="op">+</Button>

            <Button onClick={() => handleNumber('0')} className="col-span-2">0</Button>
            <Button onClick={() => handleNumber('.')}>.</Button>
            <Button onClick={calculate} variant="op" className="bg-emerald-500 hover:bg-emerald-400">=</Button>
          </div>
        </div>
      </div>

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity" onClick={() => setIsSidebarOpen(null)} />
      )}

      <div className={`fixed right-0 top-0 h-full w-full max-w-sm ${colors.card} z-50 transform transition-transform duration-300 shadow-2xl flex flex-col border-l border-white/10 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2 text-white">
            {isSidebarOpen === 'games' && <><LayoutGrid size={20}/> {t.games}</>}
            {isSidebarOpen === 'history' && <><HistoryIcon size={20}/> {t.history}</>}
            {isSidebarOpen === 'settings' && <><Settings size={20}/> {t.settings}</>}
            {isSidebarOpen === 'ai' && <><Sparkles size={20}/> {t.aiAssistant}</>}
            {isSidebarOpen === 'login' && <><User size={20}/> {t.login}</>}
            {isSidebarOpen === 'about' && <><Info size={20}/> {t.about}</>}
          </h2>
          <button onClick={() => setIsSidebarOpen(null)} className="p-2 hover:bg-white/10 rounded-lg text-white">
            <X size={20}/>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          {isSidebarOpen === 'about' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="text-center py-4">
                <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-emerald-500 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-500/20 border border-white/20">
                  <Star size={40} className="text-white fill-white" />
                </div>
                <h3 className="text-2xl font-black text-white">{t.title}</h3>
                <p className="text-zinc-500 text-xs uppercase tracking-[0.3em] mt-1">{t.version} 2.5.0</p>
              </div>

              <div className="space-y-4">
                <div className="p-5 rounded-3xl bg-white/5 border border-white/10">
                  <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">{t.appType}</h4>
                  <p className="text-sm text-zinc-200 leading-relaxed">{t.appDescription}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-3xl bg-white/5 border border-white/10 flex flex-col items-center text-center">
                    <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl mb-3">
                      <Cpu size={20} />
                    </div>
                    <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">{t.engine}</h4>
                    <p className="text-xs font-bold text-white">Gemini 3 Flash</p>
                  </div>
                  <div className="p-4 rounded-3xl bg-white/5 border border-white/10 flex flex-col items-center text-center">
                    <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl mb-3">
                      <Layers size={20} />
                    </div>
                    <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Stack</h4>
                    <p className="text-xs font-bold text-white">React 19 + TW</p>
                  </div>
                </div>

                <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-rose-500/10 border border-white/10 flex items-center justify-center gap-3">
                   <p className="text-xs font-bold text-zinc-300">{t.developedBy}</p>
                   <div className="flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-full">
                     <Heart size={14} className="text-rose-500 fill-rose-500" />
                     <span className="text-[10px] font-black text-white">AISTUDIO</span>
                   </div>
                </div>
              </div>

              <div className="pt-8 border-t border-white/5 text-center">
                <p className="text-[10px] text-zinc-600 font-medium leading-loose">
                  &copy; 2024 OmniCalc Inc.<br/>
                  Todos os direitos reservados.
                </p>
              </div>
            </div>
          )}

          {isSidebarOpen === 'games' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {GAME_LIST.map(game => (
                  <div key={game.id} className="group relative overflow-hidden rounded-[2rem] bg-zinc-800/40 border border-white/5 hover:border-emerald-500/50 transition-all p-3 flex gap-4 items-center shadow-lg hover:bg-zinc-800/60 active:scale-[0.98]">
                    <div className="w-24 h-24 rounded-3xl overflow-hidden bg-zinc-900 flex-shrink-0 border border-white/10 shadow-xl relative">
                      <img 
                        src={game.image} 
                        alt={game.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${game.name.charAt(0)}&background=101010&color=ffffff&size=128&bold=true`;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-black text-white text-base mb-0.5 truncate">{game.name}</h4>
                      <p className="text-[9px] text-zinc-500 uppercase font-black tracking-[0.15em] mb-3">{game.category}</p>
                      <button 
                        onClick={() => {
                          setActiveGame(game.id);
                        }}
                        className="w-full flex items-center justify-center gap-2 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-emerald-500/20 shadow-lg shadow-emerald-500/5 active:scale-95"
                      >
                        <Play size={10} fill="currentColor" /> {t.playNow}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isSidebarOpen === 'history' && (
            <div className="space-y-4">
              {history.length > 0 ? (
                <>
                  <button onClick={() => setHistory([])} className="w-full flex items-center justify-center gap-2 p-3 mb-4 text-rose-400 hover:bg-rose-500/10 rounded-2xl border border-rose-500/20 transition-all">
                    <Trash2 size={16}/> {t.clearHistory}
                  </button>
                  {history.map(item => (
                    <div key={item.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 group hover:bg-white/10 transition-all cursor-pointer" onClick={() => {
                      setExpression(item.expression.includes(' ') ? item.expression : '');
                      setDisplay(item.result);
                      setIsSidebarOpen(null);
                    }}>
                      <div className="text-zinc-400 text-sm mb-1">{item.expression} =</div>
                      <div className="text-xl font-bold text-white">{item.result}</div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center mt-20 text-zinc-500">
                  <HistoryIcon size={48} className="opacity-20 mb-4" />
                  <p>{t.noHistory}</p>
                </div>
              )}
            </div>
          )}

          {isSidebarOpen === 'settings' && (
            <div className="space-y-10">
              {/* Login Status */}
              <section className="bg-white/5 p-4 rounded-3xl border border-white/10">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${isLoggedIn ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-400'}`}>
                    <User size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white">{isLoggedIn ? 'VIP ACTIVE' : 'FREE USER'}</p>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{isLoggedIn ? 'Access to all themes' : 'Login to unlock VIP'}</p>
                  </div>
                  {!isLoggedIn ? (
                    <button onClick={() => setIsSidebarOpen('login')} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all">
                      {t.login}
                    </button>
                  ) : (
                    <button onClick={handleLogout} className="text-rose-400 hover:bg-rose-500/10 p-2 rounded-xl transition-all">
                      <LogOut size={20} />
                    </button>
                  )}
                </div>
              </section>

              <section>
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 mb-4">{t.theme}</h3>
                <div className="grid grid-cols-2 gap-3">
                  {(Object.keys(THEMES) as ThemeType[]).map(key => {
                    const isVip = key === 'vip';
                    const locked = isVip && !isLoggedIn;
                    
                    return (
                      <button 
                        key={key} 
                        onClick={() => {
                          if (locked) {
                            setIsSidebarOpen('login');
                          } else {
                            setTheme(key);
                          }
                        }} 
                        className={`group relative p-3 rounded-2xl border-2 capitalize transition-all text-sm font-medium flex flex-col items-center gap-2 overflow-hidden
                          ${theme === key ? `border-current bg-white/10 ${colors.accent}` : 'border-transparent bg-white/5 hover:bg-white/10'}
                          ${isVip ? 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30' : ''}
                        `}
                      >
                        {locked && (
                          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-10 group-hover:bg-black/20 transition-all">
                            <Lock size={16} className="text-white/60" />
                          </div>
                        )}
                        <span className={`text-white ${locked ? 'opacity-40' : ''}`}>{key}</span>
                        {isVip && <Star size={12} className="text-yellow-400 fill-yellow-400" />}
                      </button>
                    );
                  })}
                </div>
              </section>

              <section>
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 mb-4">{t.language}</h3>
                <div className="flex gap-3">
                  <button onClick={() => setLanguage('pt')} className={`flex-1 p-3 rounded-2xl border-2 transition-all text-sm font-medium ${language === 'pt' ? `border-current bg-white/10 ${colors.accent}` : 'border-transparent bg-white/5 hover:bg-white/10'}`}>Português</button>
                  <button onClick={() => setLanguage('en')} className={`flex-1 p-3 rounded-2xl border-2 transition-all text-sm font-medium ${language === 'en' ? `border-current bg-white/10 ${colors.accent}` : 'border-transparent bg-white/5 hover:bg-white/10'}`}>English</button>
                </div>
              </section>
            </div>
          )}

          {isSidebarOpen === 'login' && (
            <div className="space-y-8 animate-in slide-in-from-right duration-300">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600/20 text-blue-400 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <Star size={32} className="fill-blue-400" />
                </div>
                <h3 className="text-xl font-black text-white mb-2">{t.unlockVip}</h3>
                <p className="text-sm text-zinc-500">{t.loginToUnlock}</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4 text-white">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-2">Username</label>
                  <input 
                    type="text" 
                    required
                    value={loginUser}
                    onChange={(e) => setLoginUser(e.target.value)}
                    placeholder="Enter any name"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-white placeholder:text-zinc-600"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-2">Password</label>
                  <input 
                    type="password" 
                    required
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-white placeholder:text-zinc-600"
                  />
                </div>
                <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-95">
                  {t.login}
                </button>
              </form>

              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl text-center">
                <p className="text-[10px] text-yellow-500 font-bold uppercase tracking-widest">VIP Benefits</p>
                <p className="text-xs text-zinc-400 mt-2">Unlock the exclusive "VIP Color" theme with glassmorphism and animated gradients.</p>
              </div>
            </div>
          )}

          {isSidebarOpen === 'ai' && (
            <div className="flex flex-col h-full space-y-4">
              <textarea value={aiQuery} onChange={(e) => setAiQuery(e.target.value)} placeholder={t.aiPlaceholder} className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-all placeholder:text-zinc-600 text-white" />
              <button onClick={handleAiAsk} disabled={isAiLoading || !aiQuery.trim()} className="w-full p-4 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 font-bold flex items-center justify-center gap-3 transition-all active:scale-[0.98] text-white">
                {isAiLoading ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white" /> : <><Sparkles size={18}/> {t.askAi}</>}
              </button>
              {aiResponse && (
                <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 overflow-y-auto mt-4 prose prose-invert prose-sm max-w-none">
                  <div className="text-zinc-300 leading-relaxed whitespace-pre-wrap">{aiResponse}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className={`fixed -bottom-24 -left-24 w-96 h-96 rounded-full blur-[120px] opacity-20 pointer-events-none transition-colors duration-1000 ${colors.opButton.split(' ')[0]}`} />
      <div className={`fixed -top-24 -right-24 w-96 h-96 rounded-full blur-[120px] opacity-20 pointer-events-none transition-colors duration-1000 ${colors.opButton.split(' ')[0]}`} />
    </div>
  );
};

export default App;
