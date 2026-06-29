import React, { useState, useEffect } from 'react';
import { 
  Compass, Info, Mail, HelpCircle, Shield, FileText, 
  Settings, Trash2, Download, AlertTriangle, MessageSquare, 
  Trophy, Award, User, RefreshCw, Book, Eye, Volume2, 
  Sparkles, CheckCircle, Clock, VolumeX, Music, Sun, Moon,
  CloudRain, CloudSnow, Monitor
} from 'lucide-react';
import { LeaderboardEntry, FeedbackSubmission, Achievement } from '../types';
import { ACHIEVEMENTS } from '../constants';
import { SOUNDSCAPES } from '../lib/audioManager';

interface StaticPagesProps {
  activeTab: string;
  onClose: () => void;
  username: string;
  onUsernameChange: (name: string) => void;
  avatarColor: string;
  onAvatarColorChange: (color: string) => void;
  onResetSave: () => void;
  stats: {
    wordsTyped: number;
    accuracy: number;
    score: number;
    keysPressed: number;
    errorsCount: number;
    completedStories: number;
  };
  saveDataJson: string;
  onImportSave: (json: string) => void;
  unlockedAchievements: string[];

  // Game & Environmental Settings
  soundEnabled: boolean;
  onSoundEnabledChange: (val: boolean) => void;
  musicEnabled: boolean;
  onMusicEnabledChange: (val: boolean) => void;
  musicVolume: number;
  onMusicVolumeChange: (val: number) => void;
  activeSoundscapeId: string;
  onActiveSoundscapeIdChange: (val: string) => void;
  aiStorytellerEnabled: boolean;
  onAiStorytellerEnabledChange: (val: boolean) => void;
  timeOfDay: 'day' | 'sunset' | 'night';
  onTimeOfDayChange: (val: 'day' | 'sunset' | 'night') => void;
  weather: 'sunny' | 'rain' | 'snow' | 'aurora';
  onWeatherChange: (val: 'sunny' | 'rain' | 'snow' | 'aurora') => void;
  graphicsQuality: 'low' | 'medium' | 'high' | 'ultra';
  onGraphicsQualityChange: (val: 'low' | 'medium' | 'high' | 'ultra') => void;
  autoAtmosphere: boolean;
  onAutoAtmosphereChange: (val: boolean) => void;
}

export default function StaticPages({
  activeTab,
  onClose,
  username,
  onUsernameChange,
  avatarColor,
  onAvatarColorChange,
  onResetSave,
  stats,
  saveDataJson,
  onImportSave,
  unlockedAchievements,

  // Game & Environmental Settings
  soundEnabled,
  onSoundEnabledChange,
  musicEnabled,
  onMusicEnabledChange,
  musicVolume,
  onMusicVolumeChange,
  activeSoundscapeId,
  onActiveSoundscapeIdChange,
  aiStorytellerEnabled,
  onAiStorytellerEnabledChange,
  timeOfDay,
  onTimeOfDayChange,
  weather,
  onWeatherChange,
  graphicsQuality,
  onGraphicsQualityChange,
  autoAtmosphere,
  onAutoAtmosphereChange
}: StaticPagesProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState(false);

  // Feedback Form State
  const [fbType, setFbType] = useState<'feedback' | 'bug'>('feedback');
  const [fbTitle, setFbTitle] = useState('');
  const [fbDescription, setFbDescription] = useState('');
  const [fbEmail, setFbEmail] = useState('');
  const [fbStatus, setFbStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  useEffect(() => {
    if (activeTab === 'leaderboard') {
      fetchLeaderboard();
    }
  }, [activeTab]);

  const fetchLeaderboard = async () => {
    setLoadingLeaderboard(true);
    try {
      const res = await fetch('/api/leaderboard');
      if (res.ok) {
        const data = await res.json();
        setLeaderboard(data);
      }
    } catch (err) {
      console.error('Failed to load leaderboard', err);
    } finally {
      setLoadingLeaderboard(false);
    }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fbTitle || !fbDescription) {
      setFbStatus({ type: 'error', message: 'Please fill in all required fields.' });
      return;
    }
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: fbType,
          username,
          email: fbEmail,
          title: fbTitle,
          description: fbDescription
        })
      });
      if (res.ok) {
        setFbStatus({ type: 'success', message: `Thank you! Your ${fbType} report has been saved permanently on the server.` });
        setFbTitle('');
        setFbDescription('');
        setFbEmail('');
      } else {
        setFbStatus({ type: 'error', message: 'Failed to submit. Please try again.' });
      }
    } catch (err) {
      setFbStatus({ type: 'error', message: 'Server connection error.' });
    }
  };

  const handleExport = () => {
    const blob = new Blob([saveDataJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `typetales_save_${username || 'adventurer'}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setImportError('');
    setImportSuccess(false);
    try {
      const parsed = JSON.parse(importText);
      if (!parsed.username) {
        throw new Error('Invalid save file structure (missing username)');
      }
      onImportSave(importText);
      setImportSuccess(true);
      setImportText('');
    } catch (err: any) {
      setImportError(err.message || 'Invalid JSON format.');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6" id="profile-section">
            {/* Title */}
            <h2 className="text-2xl font-serif text-amber-900 flex items-center gap-2 border-b border-amber-100 pb-2">
              <Settings className="w-6 h-6 text-amber-700" /> Settings & Adventurer Profile
            </h2>

            {/* 1. Profile & Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-amber-50/50 p-6 rounded-2xl border border-amber-100">
              <div className="space-y-4">
                <h3 className="font-serif font-medium text-lg text-amber-800 flex items-center gap-2">
                  <User className="w-5 h-5" /> Adventurer Identity
                </h3>
                <div>
                  <label className="block text-sm font-medium text-amber-800 mb-1">Adventurer Name</label>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => onUsernameChange(e.target.value)}
                    className="w-full bg-white border border-amber-200 rounded-xl px-4 py-2 text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-sans"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-amber-800 mb-2">Aura Color Accent</label>
                  <div className="flex gap-2">
                    {['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6', '#ef4444'].map((color) => (
                      <button
                        key={color}
                        onClick={() => onAvatarColorChange(color)}
                        style={{ backgroundColor: color }}
                        className={`w-10 h-10 rounded-full border-2 transition-all cursor-pointer ${
                          avatarColor === color ? 'border-amber-900 scale-110 shadow-md' : 'border-transparent hover:scale-105'
                        }`}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-amber-900">
                <h3 className="font-serif font-medium text-lg text-amber-800">Adventure Statistics</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-white/80 p-3 rounded-xl border border-amber-50">
                    <span className="block text-xs text-amber-600">Total Score</span>
                    <span className="font-serif text-xl font-bold">{stats.score}</span>
                  </div>
                  <div className="bg-white/80 p-3 rounded-xl border border-amber-50">
                    <span className="block text-xs text-amber-600">Words Typed</span>
                    <span className="font-serif text-xl font-bold">{stats.wordsTyped}</span>
                  </div>
                  <div className="bg-white/80 p-3 rounded-xl border border-amber-50">
                    <span className="block text-xs text-amber-600">Average Accuracy</span>
                    <span className="font-serif text-xl font-bold">{stats.accuracy.toFixed(1)}%</span>
                  </div>
                  <div className="bg-white/80 p-3 rounded-xl border border-amber-50">
                    <span className="block text-xs text-amber-600">Stories Healed</span>
                    <span className="font-serif text-xl font-bold">{stats.completedStories}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Audio & Cozy Soundscapes Panel */}
            <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-100 space-y-6">
              <h3 className="font-serif font-medium text-lg text-amber-800 flex items-center gap-2 border-b border-amber-100/60 pb-2">
                <Music className="w-5 h-5 text-amber-700" /> Audio & Cozy Soundscapes
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Toggles & Volume */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-amber-100">
                    <div>
                      <span className="block text-xs font-bold text-amber-900 uppercase">Chime Sound FX</span>
                      <span className="text-[10px] text-amber-600">Audible response to typing keystrokes</span>
                    </div>
                    <button
                      onClick={() => onSoundEnabledChange(!soundEnabled)}
                      className={`text-[10px] px-3 py-1.5 rounded-lg border font-bold transition-all cursor-pointer ${
                        soundEnabled 
                          ? 'bg-amber-600 text-white border-amber-600' 
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {soundEnabled ? 'ENABLED' : 'MUTED'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-amber-100">
                    <div>
                      <span className="block text-xs font-bold text-amber-900 uppercase">Procedural Ambient Music</span>
                      <span className="text-[10px] text-amber-600">Melodic canvas responding to story corruption</span>
                    </div>
                    <button
                      onClick={() => onMusicEnabledChange(!musicEnabled)}
                      className={`text-[10px] px-3 py-1.5 rounded-lg border font-bold transition-all cursor-pointer ${
                        musicEnabled 
                          ? 'bg-amber-600 text-white border-amber-600' 
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {musicEnabled ? 'ENABLED' : 'MUTED'}
                    </button>
                  </div>

                  {/* Volume Slider */}
                  <div className="bg-white p-3 rounded-xl border border-amber-100">
                    <div className="flex justify-between text-xs font-bold text-amber-900 mb-1.5 uppercase">
                      <span>Soundtrack Volume</span>
                      <span>{Math.round(musicVolume * 100)}%</span>
                    </div>
                    <input 
                      type="range"
                      min="0"
                      max="2"
                      step="0.05"
                      value={musicVolume}
                      onChange={(e) => onMusicVolumeChange(parseFloat(e.target.value))}
                      className="w-full accent-amber-600 cursor-pointer h-1.5 bg-amber-100 rounded-lg outline-none"
                    />
                  </div>
                </div>

                {/* Soundscapes List */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-amber-900 uppercase block mb-1">Select Active Atmosphere Soundscape</span>
                  <div className="grid grid-cols-1 gap-1.5 max-h-48 overflow-y-auto pr-1">
                    {SOUNDSCAPES.map((preset) => {
                      const isActive = activeSoundscapeId === preset.id;
                      return (
                        <button
                          key={preset.id}
                          onClick={() => {
                            onActiveSoundscapeIdChange(preset.id);
                            if (!musicEnabled) onMusicEnabledChange(true);
                          }}
                          className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col ${
                            isActive
                              ? 'bg-amber-600 border-amber-600 text-white'
                              : 'bg-white border-amber-100 hover:bg-amber-50 text-amber-950'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm">{preset.emoji}</span>
                            <span className={`text-xs font-serif font-bold leading-none ${isActive ? 'text-white' : 'text-amber-900'}`}>{preset.name}</span>
                          </div>
                          <span className={`text-[10px] mt-1 font-sans leading-tight ${isActive ? 'text-amber-100' : 'text-amber-700'}`}>
                            {preset.description}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Atmospheric Environmental Engine */}
            <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-100 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-100/60 pb-2">
                <h3 className="font-serif font-medium text-lg text-amber-800 flex items-center gap-2">
                  <Sun className="w-5 h-5 text-amber-700" /> World Atmosphere & Graphics
                </h3>
                <button
                  type="button"
                  onClick={() => onAutoAtmosphereChange(!autoAtmosphere)}
                  className={`text-xs px-3.5 py-2 rounded-xl border font-bold transition-all cursor-pointer flex items-center gap-2 shadow-sm ${
                    autoAtmosphere 
                      ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700' 
                      : 'bg-white text-amber-800 border-amber-200 hover:bg-amber-50'
                  }`}
                >
                  <span>{autoAtmosphere ? '🌍 AUTO-DETECTION: ON' : '⚙️ MANUAL OVERRIDE'}</span>
                </button>
              </div>

              {autoAtmosphere && (
                <div className="p-4 bg-emerald-50/80 border border-emerald-100/80 rounded-xl text-xs text-emerald-800 space-y-2 font-sans animate-fade-in">
                  <div className="font-bold flex items-center gap-2 text-emerald-900">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    Live device atmosphere & location sync active
                  </div>
                  <p className="text-[11px] text-emerald-700 leading-relaxed">
                    The environment dynamically computes ambient weather, graphics quality, and day/night cycle based on your local clock and hemispheric seasons:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[10px] pl-1 text-emerald-600 pt-1 border-t border-emerald-100/60">
                    <div>
                      <strong className="text-emerald-800 block mb-0.5">NORTHERN HEMISPHERE (Tropic of Cancer):</strong>
                      <ul className="list-disc list-inside space-y-0.5">
                        <li>March to May: Summer (Sunny)</li>
                        <li>June to October: Rainy (Rain)</li>
                        <li>November to February: Winter (Snow)</li>
                      </ul>
                    </div>
                    <div>
                      <strong className="text-emerald-800 block mb-0.5">SOUTHERN HEMISPHERE (Tropic of Capricorn):</strong>
                      <ul className="list-disc list-inside space-y-0.5">
                        <li>March to May: Opposite (Winter/Snow)</li>
                        <li>June to February: Clear (Sunny)</li>
                      </ul>
                    </div>
                  </div>
                  <p className="text-[9px] text-emerald-500/80 pt-1 italic font-medium">
                    *Tip: Deactivate auto-detection above to manually force custom time, graphics quality, or weather presets.
                  </p>
                </div>
              )}

              <div className="relative">
                {autoAtmosphere && (
                  <div className="absolute inset-0 bg-amber-50/20 backdrop-blur-[0.5px] z-10 flex items-center justify-center rounded-xl pointer-events-none">
                    <div className="bg-emerald-900/90 text-[10px] text-white font-bold px-3 py-1.5 rounded-full shadow-lg border border-emerald-500/30 flex items-center gap-1.5 backdrop-blur-md pointer-events-auto">
                      <span>🌍 Controlled by Device Geolocation & Local Time</span>
                    </div>
                  </div>
                )}
                
                <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 transition-all duration-300 ${autoAtmosphere ? 'opacity-40 select-none' : 'opacity-100'}`}>
                  {/* Time of Day Cycle */}
                  <div className="bg-white p-3.5 rounded-xl border border-amber-100 flex flex-col justify-between">
                    <div>
                      <span className="block text-xs font-bold text-amber-900 uppercase">Atmosphere Cycle</span>
                      <span className="text-[10px] text-amber-600 block mb-2">Set current sky and ambient color lighting</span>
                    </div>
                    <div className="flex gap-1.5">
                      {(['day', 'sunset', 'night'] as const).map((t) => (
                        <button
                          key={t}
                          disabled={autoAtmosphere}
                          onClick={() => onTimeOfDayChange(t)}
                          className={`flex-1 text-[10px] py-1.5 rounded-lg border font-bold capitalize transition-all cursor-pointer ${
                            timeOfDay === t 
                              ? 'bg-amber-600 text-white border-amber-600' 
                              : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100/60'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Weather select */}
                  <div className="bg-white p-3.5 rounded-xl border border-amber-100 flex flex-col justify-between">
                    <div>
                      <span className="block text-xs font-bold text-amber-900 uppercase">Weather Condition</span>
                      <span className="text-[10px] text-amber-600 block mb-2">Configure localized precipitation effects</span>
                    </div>
                    <select
                      value={weather}
                      disabled={autoAtmosphere}
                      onChange={(e: any) => onWeatherChange(e.target.value)}
                      className="w-full bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5 text-xs text-amber-900 focus:outline-none focus:ring-1 focus:ring-amber-500 font-sans font-medium"
                    >
                      <option value="sunny">☀️ Sunny & Clear</option>
                      <option value="rain">🌧️ Rain Shower</option>
                      <option value="snow">❄️ Snow Drift</option>
                      <option value="aurora">🌌 Cosmic Aurora</option>
                    </select>
                  </div>

                  {/* Graphics Quality */}
                  <div className="bg-white p-3.5 rounded-xl border border-amber-100 flex flex-col justify-between">
                    <div>
                      <span className="block text-xs font-bold text-amber-900 uppercase">Graphics & Particles</span>
                      <span className="text-[10px] text-amber-600 block mb-2">Select canvas rendering resolution quality</span>
                    </div>
                    <select
                      value={graphicsQuality}
                      disabled={autoAtmosphere}
                      onChange={(e: any) => onGraphicsQualityChange(e.target.value)}
                      className="w-full bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5 text-xs text-amber-900 focus:outline-none focus:ring-1 focus:ring-amber-500 font-sans font-medium"
                    >
                      <option value="low">Low (Fewer sparkles)</option>
                      <option value="medium">Medium</option>
                      <option value="high">High (Full effects)</option>
                      <option value="ultra">Ultra (Epic details)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. AI Storytelling System */}
            <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <h3 className="font-serif font-medium text-lg text-amber-800 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-700" /> AI Storyteller Engine
                </h3>
                <p className="text-xs text-amber-700 max-w-xl font-sans">
                  {aiStorytellerEnabled 
                    ? "Currently online. Every scroll paragraph is generated uniquely by Gemini 3.5 Flash based on your realm progress." 
                    : "Currently offline. Reading from classical offline storybook scrolls."}
                </p>
              </div>
              <button
                onClick={() => onAiStorytellerEnabledChange(!aiStorytellerEnabled)}
                className={`text-xs px-4 py-2 rounded-xl border font-bold transition-all cursor-pointer whitespace-nowrap ${
                  aiStorytellerEnabled 
                    ? 'bg-amber-600 text-white border-amber-600' 
                    : 'bg-white text-amber-700 border-amber-200 hover:bg-amber-50'
                }`}
              >
                {aiStorytellerEnabled ? 'SWITCH TO COZY OFFLINE' : 'ACTIVATE GEMINI AI'}
              </button>
            </div>

            {/* 5. Save & Account Management */}
            <div className="bg-amber-50/30 p-6 rounded-2xl border border-amber-100 space-y-4">
              <h3 className="font-serif text-lg font-medium text-amber-800 flex items-center gap-2">
                <Settings className="w-5 h-5 text-amber-700" /> Account & Save Management
              </h3>
              <p className="text-sm text-amber-700">
                Your game data is saved automatically locally and synchronized with the TypeTales fantasy server so you never lose progress.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleExport}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-medium px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer text-sm"
                >
                  <Download className="w-4 h-4" /> Export Save Data
                </button>
                <button
                  onClick={onResetSave}
                  className="bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 font-medium px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer text-sm"
                >
                  <Trash2 className="w-4 h-4" /> Reset Adventure Data
                </button>
              </div>

              {/* Import form */}
              <form onSubmit={handleImportSubmit} className="pt-4 border-t border-amber-100 space-y-2">
                <label className="block text-xs font-medium text-amber-800">Import Save Data (Paste JSON)</label>
                <textarea
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder='{"username": "Hero", "score": 100, ...}'
                  rows={2}
                  className="w-full bg-white border border-amber-200 rounded-xl px-3 py-2 text-xs font-mono text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="submit"
                  className="bg-amber-200 hover:bg-amber-300 text-amber-900 font-medium px-4 py-1.5 rounded-lg text-xs transition-all cursor-pointer"
                >
                  Apply Save Data
                </button>
                {importSuccess && (
                  <p className="text-xs text-emerald-700 flex items-center gap-1 mt-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Save file imported successfully!
                  </p>
                )}
                {importError && (
                  <p className="text-xs text-rose-700 flex items-center gap-1 mt-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> {importError}
                  </p>
                )}
              </form>
            </div>
          </div>
        );

      case 'leaderboard':
        return (
          <div className="space-y-6" id="leaderboard-section">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-serif text-amber-900 flex items-center gap-2">
                <Trophy className="w-6 h-6 text-amber-700" /> Global Leaderboard
              </h2>
              <button 
                onClick={fetchLeaderboard}
                className="text-amber-700 hover:text-amber-900 transition-colors p-1.5 rounded-lg hover:bg-amber-50 cursor-pointer"
                title="Refresh rankings"
              >
                <RefreshCw className={`w-5 h-5 ${loadingLeaderboard ? 'animate-spin' : ''}`} />
              </button>
            </div>
            <p className="text-sm text-amber-700">
              Adventurers who have restored balance to the most realms. Every word typed brings light back to TypeTales!
            </p>

            <div className="bg-white/80 rounded-2xl border border-amber-100 overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse text-amber-900">
                <thead>
                  <tr className="bg-amber-50 border-b border-amber-100 text-xs text-amber-800 font-medium">
                    <th className="py-3 px-4">Rank</th>
                    <th className="py-3 px-4">Adventurer</th>
                    <th className="py-3 px-4">Score</th>
                    <th className="py-3 px-4">Accuracy</th>
                    <th className="py-3 px-4 text-right">Furthest Area</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-50 text-sm">
                  {leaderboard.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-amber-500 font-serif">
                        Loading great typing legends...
                      </td>
                    </tr>
                  ) : (
                    leaderboard.map((entry, index) => (
                      <tr key={index} className="hover:bg-amber-50/40 transition-colors">
                        <td className="py-3.5 px-4 font-serif font-bold">
                          {index === 0 && '👑 '}
                          {index === 1 && '🥈 '}
                          {index === 2 && '🥉 '}
                          {index > 2 && `${index + 1}`}
                        </td>
                        <td className="py-3.5 px-4 font-medium flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: index === 0 ? '#f59e0b' : '#3b82f6' }} />
                          {entry.username}
                        </td>
                        <td className="py-3.5 px-4 font-serif font-bold text-amber-800">{entry.score}</td>
                        <td className="py-3.5 px-4 font-sans text-xs text-amber-600">{entry.accuracy.toFixed(1)}%</td>
                        <td className="py-3.5 px-4 text-right font-serif text-xs text-emerald-800">{entry.area}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'achievements':
        return (
          <div className="space-y-6" id="achievements-section">
            <h2 className="text-2xl font-serif text-amber-900 flex items-center gap-2">
              <Award className="w-6 h-6 text-amber-700" /> Storybook Achievements
            </h2>
            <p className="text-sm text-amber-700">
              Uncover ancient milestones as you restore the solarpunk world. You have unlocked {unlockedAchievements.length} of {ACHIEVEMENTS.length} deeds!
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ACHIEVEMENTS.map((ach) => {
                const isUnlocked = unlockedAchievements.includes(ach.id);
                return (
                  <div 
                    key={ach.id} 
                    className={`p-4 rounded-2xl border transition-all flex items-start gap-4 ${
                      isUnlocked 
                        ? 'bg-amber-50/60 border-amber-200' 
                        : 'bg-stone-50 border-stone-200 opacity-60'
                    }`}
                  >
                    <div className={`p-3 rounded-xl ${isUnlocked ? 'bg-amber-200/60 text-amber-900' : 'bg-stone-200 text-stone-500'}`}>
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-serif font-medium text-amber-900 flex items-center gap-2">
                        {ach.title}
                        {isUnlocked && <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-sans">Unlocked</span>}
                      </h4>
                      <p className="text-xs text-amber-700/90 font-sans">{ach.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'about':
        return (
          <div className="space-y-6 text-amber-900 max-w-3xl" id="about-section">
            <h2 className="text-2xl font-serif text-amber-900 flex items-center gap-2">
              <Book className="w-6 h-6 text-amber-700" /> About TypeTales
            </h2>
            <div className="space-y-4 text-sm leading-relaxed">
              <p className="font-serif text-base italic text-amber-800">
                "Where typing becomes magical energy, and every stroke restores the earth."
              </p>
              <p>
                TypeTales is an experimental cozy typing adventure designed to merge the calmness of fantasy storybooks with the tactile satisfaction of keyboard games. Built on the values of **solarpunk optimism**, discovery, and healing, TypeTales completely rejects violent mechanics in favor of natural restoration.
              </p>
              <p>
                As you type correctly, your keystrokes are channeled as glowing leaves, floral petals, and bright sparkles. These magical particles dissolve shadow curses, heal towering tree spirits, and reawaken sleeping windmills in cozy solarpunk villages.
              </p>
              <h3 className="text-lg font-serif text-amber-800 pt-2">The AI Story Engine</h3>
              <p>
                Under the hood, TypeTales features an advanced server-side AI Story Engine powered by **Gemini 3.5 Flash**. The engine continuously reads your progress and the exact atmospheric mood of your location to craft a continuous, coherent story segment just for you.
              </p>
            </div>
          </div>
        );

      case 'faq':
        return (
          <div className="space-y-6 text-amber-900 max-w-3xl" id="faq-section">
            <h2 className="text-2xl font-serif text-amber-900 flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-amber-700" /> Help & FAQ Center
            </h2>
            <div className="space-y-4 divide-y divide-amber-100">
              {[
                {
                  q: "How do I play?",
                  a: "Look at the story panel at the bottom of the screen. Start typing the highlighted word. As you complete each word correctly, you release healing magic into the scene. Finish the paragraph to restore the current stage!"
                },
                {
                  q: "Are mistakes penalized?",
                  a: "There are no punishing game overs! Mistakes simply halt the text cursor temporarily, glowing soft red. Take your time, breathe, and type at your own comfortable rhythm."
                },
                {
                  q: "How does the weather and day/night cycle work?",
                  a: "The game features a dynamic environmental engine! The world transitions between Sunny, sunset, and starry Night. Watch lanterns glow, fireflies arrive, and villagers go to sleep as time flows."
                },
                {
                  q: "Can I use TypeTales on a phone or tablet?",
                  a: "Yes! TypeTales fully supports portrait and landscape mode. For mobile devices, you can tap the story panel to open your device's virtual keyboard, or enjoy responsive visual guides."
                },
                {
                  q: "What is Solarpunk?",
                  a: "Solarpunk is a hopeful movement envisioning a sustainable, green future where humanity, technology, and nature exist in beautiful harmony. It replaces concrete and pollution with glass domes, solar petals, and beautiful clean wind turbines."
                }
              ].map((item, i) => (
                <div key={i} className={`${i > 0 ? 'pt-4' : ''}`}>
                  <h4 className="font-serif font-bold text-amber-950 mb-1">✨ {item.q}</h4>
                  <p className="text-sm text-amber-800 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-6 text-amber-900 max-w-2xl" id="contact-section">
            <h2 className="text-2xl font-serif text-amber-900 flex items-center gap-2">
              <Mail className="w-6 h-6 text-amber-700" /> Contact & Feedback System
            </h2>
            <p className="text-sm text-amber-700">
              Have ideas, feedback, or found a bug? Send us a direct report. Submissions are stored durably on our TypeTales server database.
            </p>

            <form onSubmit={handleFeedbackSubmit} className="space-y-4 bg-amber-50/50 p-6 rounded-2xl border border-amber-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-amber-800 mb-1">Report Type</label>
                  <select 
                    value={fbType} 
                    onChange={(e: any) => setFbType(e.target.value)}
                    className="w-full bg-white border border-amber-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="feedback">Cozy Suggestion & Feedback</option>
                    <option value="bug">Technical Bug Report</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-amber-800 mb-1">Your Email (Optional)</label>
                  <input 
                    type="email" 
                    value={fbEmail}
                    onChange={(e) => setFbEmail(e.target.value)}
                    className="w-full bg-white border border-amber-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="explorer@solarpunk.org"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-amber-800 mb-1">Title</label>
                <input 
                  type="text" 
                  value={fbTitle}
                  onChange={(e) => setFbTitle(e.target.value)}
                  className="w-full bg-white border border-amber-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="e.g., Let leaves drift slightly slower"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-amber-800 mb-1">Description / Details</label>
                <textarea 
                  value={fbDescription}
                  onChange={(e) => setFbDescription(e.target.value)}
                  className="w-full bg-white border border-amber-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Write your suggestions or describe the issue in detail..."
                  rows={4}
                  required
                />
              </div>

              <button
                type="submit"
                className="bg-amber-700 hover:bg-amber-800 text-white font-medium px-6 py-2 rounded-xl text-sm transition-all cursor-pointer shadow-sm"
              >
                Send to Server
              </button>

              {fbStatus.type && (
                <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  fbStatus.type === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  <MessageSquare className="w-4 h-4" /> {fbStatus.message}
                </div>
              )}
            </form>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6 text-amber-900 max-w-3xl leading-relaxed text-sm" id="privacy-section">
            <h2 className="text-2xl font-serif text-amber-900 flex items-center gap-2">
              <Shield className="w-6 h-6 text-amber-700" /> Privacy Policy
            </h2>
            <p className="text-xs text-amber-600 font-medium">Last updated: June 2026</p>
            <div className="space-y-4">
              <p>
                Your privacy is paramount to us in the TypeTales universe. We believe in high transparency, complete data autonomy, and extreme security.
              </p>
              <h3 className="font-serif font-bold text-amber-950 mt-4">1. What Information is Collected</h3>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>**Account Details**: Adventurer username and avatar color accent configurations.</li>
                <li>**Gameplay Progress**: Score, words typed, accuracy levels, unlocked levels, and achievements list.</li>
                <li>**Feedback & Bug Reports**: Title, description, email address (if provided), and submission dates.</li>
              </ul>
              <h3 className="font-serif font-bold text-amber-950 mt-4">2. What is NOT Collected</h3>
              <p>
                We do NOT access or collect data from your microphone, camera, contacts, or location unless you explicitly request a specific feature and provide system permission.
              </p>
              <h3 className="font-serif font-bold text-amber-950 mt-4">3. Storage & Protection</h3>
              <p>
                Gameplay data is securely cached in your local browser storage and permanently synced on our server data systems. We utilize standard SSL encryption in transit.
              </p>
              <h3 className="font-serif font-bold text-amber-950 mt-4">4. Data Deletion and Portability</h3>
              <p>
                Under our compliance-ready structures (including GDPR), you retain the absolute right to export your complete gameplay statistics as a clean JSON file or completely erase your entire profile from both your browser cache and our remote server instantly. You can perform these actions inside the **Adventurer Profile** tab.
              </p>
              <h3 className="font-serif font-bold text-amber-950 mt-4">5. Children's Protections</h3>
              <p>
                TypeTales is fully designed as a welcoming, violence-free experience. We collect zero PII from children and never share data with third-party advertising companies.
              </p>
            </div>
          </div>
        );

      case 'terms':
        return (
          <div className="space-y-6 text-amber-900 max-w-3xl leading-relaxed text-sm" id="terms-section">
            <h2 className="text-2xl font-serif text-amber-900 flex items-center gap-2">
              <FileText className="w-6 h-6 text-amber-700" /> Terms of Service
            </h2>
            <p className="text-xs text-amber-600 font-medium">Effective date: June 2026</p>
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-amber-950">1. Adventurer Conduct</h3>
              <p>
                By starting your journey in TypeTales, you agree to respect our community atmosphere. You agree not to manipulate client states to broadcast offensive names onto the global leaderboard, inject malicious scripts into feedback channels, or disrupt the peaceful Solarpunk environment.
              </p>
              <h3 className="font-serif font-bold text-amber-950">2. Fair Play & Anti-Cheat</h3>
              <p>
                While the typing environment is cozy, typing records should reflect genuine human effort. The use of macro scripts or automated robotic keystrokes is strongly discouraged in order to keep the leaderboard inspiring for casual writers.
              </p>
              <h3 className="font-serif font-bold text-amber-950">3. Account Ownership</h3>
              <p>
                Your save state profile belongs strictly to you. TypeTales does not charge fees for cosmetics or virtual items. Everything is unlocked through real gameplay achievements.
              </p>
              <h3 className="font-serif font-bold text-amber-950">4. Disclaimers of Liability</h3>
              <p>
                TypeTales is provided "as is" for entertainment and typing education. While we make every effort to preserve your beautiful garden progress, we are not liable for accidental data loss due to browser storage resets.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-amber-100/50 animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="p-6 border-b border-amber-100 flex justify-between items-center bg-amber-50/20 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-100/60 text-amber-900">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-serif text-amber-950 font-bold capitalize">
                {activeTab} - TypeTales
              </h1>
              <p className="text-xs text-amber-700/80">Every word restores the world</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 transition-colors bg-stone-100 hover:bg-stone-200 p-2 rounded-full cursor-pointer"
          >
            &times;
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {renderContent()}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-amber-100 bg-amber-50/10 flex justify-end gap-3 text-xs text-stone-500 rounded-b-3xl">
          <span>TypeTales v1.0.0</span>
          <span>&bull;</span>
          <span>Cozy Storybook Engine</span>
        </div>
      </div>
    </div>
  );
}
