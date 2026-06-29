import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Compass, Trophy, Settings, Sun, Moon, CloudRain, 
  ChevronRight, Volume2, VolumeX, Shield, Award, HelpCircle, 
  MessageSquare, Sliders, RefreshCw, AlertCircle, Music
} from 'lucide-react';
import { Area, Boss, GameSave } from './types';
import { AREAS, BOSSES, ACHIEVEMENTS, INITIAL_STORIES, DEFAULT_STORIES } from './constants';
import WorldCanvas from './components/WorldCanvas';
import StoryPanel from './components/StoryPanel';
import StaticPages from './components/StaticPages';
import { ambientMusic, SOUNDSCAPES } from './lib/audioManager';

export default function App() {
  // Save State and Profiles
  const [username, setUsername] = useState<string>(() => {
    return localStorage.getItem('typetales_username') || 'AuraExplorer';
  });
  const [avatarColor, setAvatarColor] = useState<string>(() => {
    return localStorage.getItem('typetales_avatar_color') || '#fbbf24';
  });

  // Load game save
  const [saveData, setSaveData] = useState<GameSave>(() => {
    const raw = localStorage.getItem(`typetales_save_${username}`);
    if (raw) {
      try { return JSON.parse(raw); } catch (e) {}
    }
    return {
      id: `save_${Date.now()}`,
      username,
      avatarColor,
      createdAt: new Date().toISOString(),
      currentAreaId: 'whispering_forest',
      currentBossId: 'tree_spirit',
      bossHp: 20,
      score: 0,
      wordsTyped: 0,
      accuracySum: 0,
      keysPressed: 0,
      errorsCount: 0,
      unlockedAreaIds: ['whispering_forest'],
      unlockedAchievements: []
    };
  });

  // Current stage states
  const [currentArea, setCurrentArea] = useState<Area>(() => {
    return AREAS.find(a => a.id === saveData.currentAreaId) || AREAS[0];
  });
  const [currentBoss, setCurrentBoss] = useState<Boss | null>(() => {
    return BOSSES.find(b => b.id === saveData.currentBossId) || BOSSES[0];
  });
  const [bossHp, setBossHp] = useState<number>(saveData.bossHp);
  const [isCorrupted, setIsCorrupted] = useState<boolean>(true);

  // Story state
  const [storyParagraph, setStoryParagraph] = useState<string>('');
  const [loadingStory, setLoadingStory] = useState<boolean>(false);
  const [storyHistory, setStoryHistory] = useState<string[]>([]);

  // WPM and Typing Speed Session tracking
  const [typingStartTime, setTypingStartTime] = useState<number | null>(null);
  const [paragraphKeysCount, setParagraphKeysCount] = useState<number>(0);
  const [currentWpm, setCurrentWpm] = useState<number>(0);

  // Sound, Graphics, Weather configurations
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [musicEnabled, setMusicEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('typetales_music_enabled');
    return saved === null ? true : saved === 'true';
  });
  const [musicVolume, setMusicVolume] = useState<number>(() => {
    const saved = localStorage.getItem('typetales_music_volume');
    return saved === null ? 0.65 : parseFloat(saved);
  });
  const [activeSoundscapeId, setActiveSoundscapeId] = useState<string>('lofi_study');
  const [musicPanelOpen, setMusicPanelOpen] = useState<boolean>(false);

  const [graphicsQuality, setGraphicsQuality] = useState<'low' | 'medium' | 'high' | 'ultra'>('high');
  const [timeOfDay, setTimeOfDay] = useState<'day' | 'sunset' | 'night'>('day');
  const [weather, setWeather] = useState<'sunny' | 'rain' | 'snow' | 'aurora'>('sunny');
  const [aiStorytellerEnabled, setAiStorytellerEnabled] = useState<boolean>(false);

  // Automatic Atmospheric Engine state
  const [autoAtmosphere, setAutoAtmosphere] = useState<boolean>(() => {
    const saved = localStorage.getItem('typetales_auto_atmosphere');
    return saved === null ? true : saved === 'true';
  });
  const [lat, setLat] = useState<number | null>(null);

  // Modal pages state
  const [activeModalTab, setActiveModalTab] = useState<string | null>(null);

  // Trigger correct key visual effect
  const [triggerMagicBlast, setTriggerMagicBlast] = useState<boolean>(false);

  // Achievements Toast Queue
  const [toast, setToast] = useState<{ id: string; title: string; desc: string } | null>(null);

  // On mount: Load initial story text and connect to server save
  useEffect(() => {
    loadNextStoryText();
    syncSaveToServer(saveData);
  }, []);

  // Save autoAtmosphere value when changed
  useEffect(() => {
    localStorage.setItem('typetales_auto_atmosphere', autoAtmosphere.toString());
  }, [autoAtmosphere]);

  // Request browser geolocation coordinates when autoAtmosphere is active
  useEffect(() => {
    if (!autoAtmosphere) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude);
        },
        (error) => {
          console.warn("Could not retrieve precise location. Using estimated hemisphere via timezone.");
        },
        { enableHighAccuracy: false, timeout: 6000, maximumAge: 600000 }
      );
    }
  }, [autoAtmosphere]);

  // Deciding Atmosphere, Weather, and Graphics automatically depending on device time, location, and hemisphere season rules:
  useEffect(() => {
    if (!autoAtmosphere) return;

    const updateAtmosphereAutomatically = () => {
      const now = new Date();
      const month = now.getMonth(); // 0 (Jan) to 11 (Dec)
      const hour = now.getHours();   // 0 to 23

      // 1. Time of Day Calculation
      let computedTimeOfDay: 'day' | 'sunset' | 'night' = 'day';
      if (hour >= 6 && hour < 17) {
        computedTimeOfDay = 'day';
      } else if (hour >= 17 && hour < 20) {
        computedTimeOfDay = 'sunset';
      } else {
        computedTimeOfDay = 'night';
      }
      setTimeOfDay(computedTimeOfDay);

      // 2. Latitude Estimation & Weather Season Calculation
      let estimatedLatitude = 30; // Default above Tropic of Cancer
      try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const southernZones = [
          'Australia', 'Sydney', 'Melbourne', 'Brisbane', 'Adelaide', 'Perth', 'Hobart',
          'Auckland', 'Wellington', 'Johannesburg', 'Cape_Town', 'Santiago', 'Buenos_Aires',
          'Sao_Paulo', 'Rio_de_Janeiro', 'Lima', 'Montevideo', 'La_Paz', 'Luanda', 'Maputo',
          'Nairobi', 'Antarctica'
        ];
        if (southernZones.some(zone => tz.includes(zone))) {
          estimatedLatitude = -30; // Tropic of Capricorn region
        }
      } catch (e) {}

      const activeLat = lat !== null ? lat : estimatedLatitude;
      let computedWeather: 'sunny' | 'rain' | 'snow' | 'aurora' = 'sunny';

      // Hemisphere Season Rules:
      if (activeLat > 23.4368) {
        // Above Tropic of Cancer (Northern Hemisphere)
        if (month >= 2 && month <= 4) {
          // March to May -> Summer
          computedWeather = 'sunny';
        } else if (month >= 5 && month <= 9) {
          // June to October -> Rainy in cancer region
          computedWeather = 'rain';
        } else {
          // November to February -> Winter/Snowfalls
          computedWeather = 'snow';
        }
      } else if (activeLat < -23.4368) {
        // Tropic of Capricorn (Southern Hemisphere)
        if (month >= 2 && month <= 4) {
          // March to May -> Winter/Snowfalls (Opposite of Cancer summer)
          computedWeather = 'snow';
        } else if (month >= 5 && month <= 9) {
          // June to October -> Summer/Clear (Sunny)
          computedWeather = 'sunny';
        } else {
          // November to February -> Dry/Clear (Sunny)
          computedWeather = 'sunny';
        }
      } else {
        // Tropical region
        if (month >= 5 && month <= 9) {
          computedWeather = 'rain';
        } else {
          computedWeather = 'sunny';
        }
      }
      setWeather(computedWeather);

      // 3. Graphics auto adjustment (Ultra for desktop/multicore, Medium for mobile/lowcore)
      let computedGraphics: 'low' | 'medium' | 'high' | 'ultra' = 'high';
      if (typeof navigator !== 'undefined') {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const cores = navigator.hardwareConcurrency || 4;
        if (isMobile) {
          computedGraphics = cores > 4 ? 'high' : 'medium';
        } else {
          computedGraphics = cores >= 8 ? 'ultra' : 'high';
        }
      }
      setGraphicsQuality(computedGraphics);
    };

    updateAtmosphereAutomatically();
    const interval = setInterval(updateAtmosphereAutomatically, 10000); // refresh every 10 seconds

    return () => clearInterval(interval);
  }, [autoAtmosphere, lat]);

  // Fallback completed stories paragraph atmospheric cycler (only active in Manual mode)
  useEffect(() => {
    if (autoAtmosphere) return;
    const completedCount = Math.max(0, storyHistory.length - 1);
    const cycle = completedCount % 3;
    if (cycle === 0) {
      setTimeOfDay('day');
    } else if (cycle === 1) {
      setTimeOfDay('sunset');
    } else {
      setTimeOfDay('night');
    }
  }, [storyHistory.length, autoAtmosphere]);

  // Live calculation of WPM (Words Per Minute) during the active paragraph session
  useEffect(() => {
    if (!typingStartTime) {
      setCurrentWpm(0);
      return;
    }

    const interval = setInterval(() => {
      const elapsedMinutes = (Date.now() - typingStartTime) / 60000;
      if (elapsedMinutes > 0.01) {
        const calculatedWpm = Math.round((paragraphKeysCount / 5) / elapsedMinutes);
        setCurrentWpm(Math.min(250, Math.max(0, calculatedWpm)));
      }
    }, 500);

    return () => clearInterval(interval);
  }, [typingStartTime, paragraphKeysCount]);

  // Keyboard shortcut listener (Ctrl+S / Cmd+S) to manually trigger 'Save Progress'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        
        // Persist progress to local storage and sync with server
        localStorage.setItem(`typetales_save_${username}`, JSON.stringify(saveData));
        syncSaveToServer(saveData);
        
        setToast({
          id: `save_${Date.now()}`,
          title: 'Progress Saved Manually!',
          desc: 'Your Typing Realm progress has been successfully written to local memory and the cloud.'
        });
        
        setTimeout(() => {
          setToast(null);
        }, 3000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [saveData, username]);

  // Whenever storyParagraph changes, reset current typing timer metrics
  useEffect(() => {
    setTypingStartTime(null);
    setParagraphKeysCount(0);
    setCurrentWpm(0);
  }, [storyParagraph]);

  // Save progress locally whenever saveData updates
  useEffect(() => {
    localStorage.setItem('typetales_username', username);
    localStorage.setItem('typetales_avatar_color', avatarColor);
    localStorage.setItem(`typetales_save_${username}`, JSON.stringify(saveData));
  }, [saveData, username, avatarColor]);

  // Sync background music configurations with the ambientMusic generator
  useEffect(() => {
    localStorage.setItem('typetales_music_enabled', String(musicEnabled));
    localStorage.setItem('typetales_music_volume', String(musicVolume));
  }, [musicEnabled, musicVolume]);

  useEffect(() => {
    ambientMusic.setVolume(musicVolume);
  }, [musicVolume]);

  useEffect(() => {
    ambientMusic.setPreset(activeSoundscapeId);
  }, [activeSoundscapeId]);

  useEffect(() => {
    ambientMusic.setCorrupted(isCorrupted);
  }, [isCorrupted]);

  useEffect(() => {
    if (musicEnabled && soundEnabled) {
      const startAudio = () => {
        ambientMusic.start();
        window.removeEventListener('click', startAudio);
        window.removeEventListener('keydown', startAudio);
      };
      window.addEventListener('click', startAudio);
      window.addEventListener('keydown', startAudio);
      
      ambientMusic.start();

      return () => {
        window.removeEventListener('click', startAudio);
        window.removeEventListener('keydown', startAudio);
      };
    } else {
      ambientMusic.stop();
    }
  }, [musicEnabled, soundEnabled]);

  // Automatically switch soundscapes when currentArea changes
  useEffect(() => {
    if (currentArea.id === 'whispering_forest') setActiveSoundscapeId('lofi_study');
    else if (currentArea.id === 'sunflower_plains') setActiveSoundscapeId('summer_meadow');
    else if (currentArea.id === 'coral_sea') setActiveSoundscapeId('abyssal_deep');
    else if (currentArea.id === 'ancient_library') setActiveSoundscapeId('ancient_parchment');
    else if (currentArea.id === 'star_observatory' || currentArea.id === 'crystal_mountains' || currentArea.id === 'floating_islands') {
      setActiveSoundscapeId('celestial_aurora');
    } else {
      setActiveSoundscapeId('lofi_study');
    }
  }, [currentArea]);

  // Sync state variables to saveData object
  const updateSaveState = (updater: (prev: GameSave) => Partial<GameSave>) => {
    setSaveData(prev => {
      const next = { ...prev, ...updater(prev) };
      syncSaveToServer(next);
      return next;
    });
  };

  const syncSaveToServer = async (save: GameSave) => {
    try {
      await fetch('/api/saves', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(save)
      });
    } catch (err) {
      console.warn('Failed to sync save with server. Progress kept offline.', err);
    }
  };

  const playMagicalChime = (success: boolean) => {
    if (!soundEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (success) {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(900 + Math.random() * 500, ctx.currentTime);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } else {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(140, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      }
    } catch (err) {}
  };

  const triggerAchievement = (achId: string) => {
    if (saveData.unlockedAchievements.includes(achId)) return;
    const ach = ACHIEVEMENTS.find(a => a.id === achId);
    if (!ach) return;

    const updated = [...saveData.unlockedAchievements, achId];
    updateSaveState(() => ({ unlockedAchievements: updated }));

    setToast({
      id: achId,
      title: ach.title,
      desc: ach.description
    });

    // Remove toast after 5s
    setTimeout(() => {
      setToast(null);
    }, 5000);
  };

  // Determine which story to show next
  const loadNextStoryText = async (customAreaId?: string) => {
    const areaId = customAreaId || currentArea.id;
    setLoadingStory(true);

    const prevTexts = storyHistory.slice(-2).join(' ');

    if (aiStorytellerEnabled) {
      try {
        const res = await fetch('/api/generate-story', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            areaName: AREAS.find(a => a.id === areaId)?.name || 'Whispering Forest',
            currentScore: saveData.score,
            previousText: prevTexts,
            bossName: currentBoss ? currentBoss.name : null
          })
        });

        if (res.ok) {
          const data = await res.json();
          setStoryParagraph(data.text);
          setStoryHistory(prev => [...prev, data.text]);
          setLoadingStory(false);
          return;
        }
      } catch (err) {
        console.warn('AI Story generator failed or key missing. Falling back to static story book.', err);
      }
    }

    // Pick a predefined, high-quality story segment randomly (from 8 variants per area)
    const list = INITIAL_STORIES[areaId] || DEFAULT_STORIES[areaId] || ["The forest continues to recover in quiet harmony as your letters shine with warm solarpunk hope."];
    const index = Math.floor(Math.random() * list.length);
    const fallbackText = list[index];
    setStoryParagraph(fallbackText);
    setStoryHistory(prev => [...prev, fallbackText]);
    setLoadingStory(false);
  };

  const handleErrorKeystroke = () => {
    if (musicEnabled) {
      ambientMusic.playHarmonicTypewriter(false);
    } else {
      playMagicalChime(false);
    }

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(80);
      } catch (err) {}
    }

    updateSaveState(prev => ({
      errorsCount: prev.errorsCount + 1,
      keysPressed: prev.keysPressed + 1
    }));
  };

  const handleWordTyped = (word: string, isCorrect: boolean, accuracy: number) => {
    playMagicalChime(isCorrect);
    
    if (musicEnabled) {
      ambientMusic.playHarmonicTypewriter(isCorrect);
    }
    
    if (isCorrect) {
      setTriggerMagicBlast(true);
      
      // Update statistics
      const wordLen = word.length;
      updateSaveState((prev) => {
        const nextWordsCount = prev.wordsTyped + 1;
        const nextScore = prev.score + Math.floor(wordLen * (accuracy / 100) * 10);
        
        // Check for 1000 words achievement
        if (nextWordsCount >= 1000) {
          triggerAchievement('words_1000');
        }

        return {
          wordsTyped: nextWordsCount,
          score: nextScore,
          keysPressed: prev.keysPressed + wordLen,
          accuracySum: prev.accuracySum + accuracy
        };
      });

      // Update active boss HP
      if (currentBoss && bossHp > 0) {
        setBossHp(prev => {
          const nextHp = prev - 1;
          if (nextHp <= 0) {
            // Boss is purified!
            setIsCorrupted(false);
            triggerAchievement('forest_savior');
            postScoreToLeaderboard(saveData.score + 2500);

            // Unlock next area
            const currentIdx = AREAS.findIndex(a => a.id === currentArea.id);
            const nextArea = AREAS[currentIdx + 1];
            if (nextArea && !saveData.unlockedAreaIds.includes(nextArea.id)) {
              updateSaveState(prev => ({
                unlockedAreaIds: [...prev.unlockedAreaIds, nextArea.id]
              }));
            }
          }
          return nextHp;
        });
      }
    }
  };

  const postScoreToLeaderboard = async (finalScore: number) => {
    try {
      await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          score: finalScore,
          wordsTyped: saveData.wordsTyped,
          accuracy: saveData.wordsTyped > 0 ? (saveData.accuracySum / saveData.wordsTyped) : 100,
          area: currentArea.name
        })
      });
    } catch (err) {
      console.warn('Leaderboard connection error', err);
    }
  };

  const handleParagraphCompleted = () => {
    triggerAchievement('first_adventure');
    
    // Check for perfect accuracy achievement
    const avgAcc = saveData.wordsTyped > 0 ? (saveData.accuracySum / saveData.wordsTyped) : 100;
    if (avgAcc >= 99.8) {
      triggerAchievement('perfect_accuracy');
    }

    if (storyHistory.length >= 10) {
      triggerAchievement('story_master');
    }

    // Load next segment
    loadNextStoryText();
  };

  const handleAreaChange = (areaId: string) => {
    const nextArea = AREAS.find(a => a.id === areaId);
    if (!nextArea) return;

    setCurrentArea(nextArea);
    
    // Find matching boss
    const nextBoss = BOSSES.find(b => b.areaId === areaId) || null;
    setCurrentBoss(nextBoss);
    setBossHp(nextBoss ? nextBoss.maxHp : 0);
    setIsCorrupted(true); // new area has a curse

    // Save area choice
    updateSaveState(() => ({
      currentAreaId: areaId,
      currentBossId: nextBoss ? nextBoss.id : null,
      bossHp: nextBoss ? nextBoss.maxHp : 0
    }));

    // Trigger story refresh
    loadNextStoryText(areaId);
  };

  const handleResetSave = () => {
    if (window.confirm('Are you absolutely sure you want to erase all your typing memories and begin fresh?')) {
      const freshSave: GameSave = {
        id: `save_${Date.now()}`,
        username,
        avatarColor,
        createdAt: new Date().toISOString(),
        currentAreaId: 'whispering_forest',
        currentBossId: 'tree_spirit',
        bossHp: 20,
        score: 0,
        wordsTyped: 0,
        accuracySum: 0,
        keysPressed: 0,
        errorsCount: 0,
        unlockedAreaIds: ['whispering_forest'],
        unlockedAchievements: []
      };
      setSaveData(freshSave);
      setCurrentArea(AREAS[0]);
      setCurrentBoss(BOSSES[0]);
      setBossHp(20);
      setIsCorrupted(true);
      setStoryHistory([]);
      setTimeout(() => {
        loadNextStoryText('whispering_forest');
      }, 200);
      setActiveModalTab(null);
    }
  };

  const handleImportSave = (json: string) => {
    try {
      const parsed = JSON.parse(json);
      setSaveData(parsed);
      if (parsed.username) setUsername(parsed.username);
      if (parsed.avatarColor) setAvatarColor(parsed.avatarColor);
      const matchedArea = AREAS.find(a => a.id === parsed.currentAreaId) || AREAS[0];
      setCurrentArea(matchedArea);
      const matchedBoss = BOSSES.find(b => b.id === parsed.currentBossId) || null;
      setCurrentBoss(matchedBoss);
      setBossHp(parsed.bossHp || 0);
      setIsCorrupted(parsed.bossHp > 0);
      loadNextStoryText(parsed.currentAreaId);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-stone-950 flex flex-col justify-between p-4 md:p-6 select-none font-sans">
      {/* 1. Full Screen World Canvas */}
      <div className="absolute inset-0 w-full h-full z-0">
        <WorldCanvas
          currentArea={currentArea}
          currentBoss={currentBoss}
          bossHp={bossHp}
          isCorrupted={isCorrupted}
          timeOfDay={timeOfDay}
          weather={weather}
          graphicsQuality={graphicsQuality}
          triggerMagicBlast={triggerMagicBlast}
          onMagicBlastComplete={() => setTriggerMagicBlast(false)}
        />
      </div>

      {/* 2. Top HUD Navigation */}
      <header className="relative z-10 w-full flex flex-wrap items-center justify-between gap-4 bg-stone-900/40 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/5 shadow-lg">
        {/* Realm Selector */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl text-amber-300">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs text-stone-300 font-sans font-medium">
                <span>Realm:</span>
                <select
                  value={currentArea.id}
                  onChange={(e) => handleAreaChange(e.target.value)}
                  className="bg-transparent font-bold text-amber-300 outline-none border-none cursor-pointer p-0 font-serif"
                >
                  {AREAS.map((area) => {
                    const isUnlocked = saveData.unlockedAreaIds.includes(area.id);
                    return (
                      <option key={area.id} value={area.id} disabled={!isUnlocked} className="bg-stone-900 text-stone-200">
                        {area.emoji} {area.name} {!isUnlocked ? '(🔒 Locked)' : ''}
                      </option>
                    );
                  })}
                </select>
              </div>
              <p className="text-[10px] text-stone-400 font-sans max-w-[200px] md:max-w-xs truncate">{currentArea.description}</p>
            </div>
          </div>

          {/* Visual Progress Bar for Boss HP Remaining */}
          {currentBoss && (
            <div className="w-full px-1">
              <div className="flex justify-between items-center text-[9px] font-sans font-bold text-stone-400 mb-1 uppercase tracking-wider">
                <span>{isCorrupted ? 'Boss HP Remaining' : 'Purified'}</span>
                <span className="font-mono text-amber-400">{bossHp} / {currentBoss.maxHp} HP ({Math.round((Math.max(0, bossHp) / currentBoss.maxHp) * 100)}%)</span>
              </div>
              <div className="w-full h-1.5 bg-stone-950/70 rounded-full overflow-hidden border border-white/5">
                <motion.div
                  className={`h-full bg-gradient-to-r ${
                    isCorrupted ? 'from-amber-500 to-rose-500' : 'from-emerald-500 to-teal-400'
                  }`}
                  initial={{ width: '100%' }}
                  animate={{ width: `${(Math.max(0, bossHp) / currentBoss.maxHp) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Corrupted Guardian Name */}
        {currentBoss && (
          <div className="hidden md:flex flex-col items-center">
            <span className="text-[10px] uppercase tracking-wider text-amber-300 font-bold">
              {isCorrupted ? '⚠️ Corrupted Guardian' : '✨ Purified Spirit'}
            </span>
            <h1 className="text-sm font-serif font-bold text-white flex items-center gap-2">
              {currentBoss.emoji} {currentBoss.name}
            </h1>
          </div>
        )}

        {/* Global Stats & Options */}
        <div className="flex items-center gap-4 text-white">
          {/* Profile Badge */}
          <div 
            onClick={() => setActiveModalTab('profile')}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 px-3 py-1.5 cursor-pointer transition-all"
            title="Profile & Settings"
          >
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-serif font-bold text-stone-900" style={{ backgroundColor: avatarColor }}>
              {username ? username.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="hidden sm:block text-left">
              <span className="block text-[10px] text-stone-400 leading-none">Settings & Profile</span>
              <span className="text-xs font-serif text-white font-bold max-w-[80px] truncate block leading-none mt-0.5">{username}</span>
            </div>
          </div>
        </div>
      </header>

      {/* 3. Center Screen Boss Header or Purifying Banner */}
      <main className="flex-1 w-full flex flex-col justify-center items-center z-10 my-4 max-h-[50vh]">
        <AnimatePresence mode="wait">
          {loadingStory ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3 text-stone-300 text-sm font-serif"
            >
              <RefreshCw className="w-8 h-8 animate-spin text-amber-300" />
              <span>Weaving story scroll with Gemini...</span>
            </motion.div>
          ) : (
            <div key="loaded" className="w-full" />
          )}
        </AnimatePresence>
      </main>

      {/* 4. Frosted Glass Story Typing Panel */}
      <div className="relative z-10 w-full mb-6">
        {storyParagraph && !loadingStory && (
          <StoryPanel
            text={storyParagraph}
            onWordTyped={handleWordTyped}
            onParagraphCompleted={handleParagraphCompleted}
            accentColor={currentArea.accentColor === 'mint' ? '#10b981' : currentArea.accentColor === 'coral' ? '#f43f5e' : '#fbbf24'}
            onStartTyping={() => {
              if (!typingStartTime) {
                setTypingStartTime(Date.now());
              }
            }}
            onKeystroke={(charCount) => {
              setParagraphKeysCount(charCount);
            }}
            onErrorKeystroke={handleErrorKeystroke}
          />
        )}
      </div>

      {/* 5. Static Secondary Pages Links / Drawer Trigger */}
      <footer className="relative z-10 w-full bg-stone-900/40 backdrop-blur-md py-4 px-6 rounded-3xl border border-white/5 flex flex-wrap justify-between items-center gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-4 text-stone-300 font-sans">
          <button onClick={() => setActiveModalTab('about')} className="hover:text-amber-300 transition-colors cursor-pointer">About</button>
          <button onClick={() => setActiveModalTab('faq')} className="hover:text-amber-300 transition-colors cursor-pointer">Help & FAQ</button>
          <button onClick={() => setActiveModalTab('leaderboard')} className="hover:text-amber-300 transition-colors cursor-pointer flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5" /> Leaderboard
          </button>
          <button onClick={() => setActiveModalTab('achievements')} className="hover:text-amber-300 transition-colors cursor-pointer flex items-center gap-1">
            <Award className="w-3.5 h-3.5" /> Achievements
          </button>
          <button onClick={() => setActiveModalTab('contact')} className="hover:text-amber-300 transition-colors cursor-pointer">Feedback & Bug</button>
          <button onClick={() => setActiveModalTab('privacy')} className="hover:text-amber-300 transition-colors cursor-pointer flex items-center gap-1">
            <Shield className="w-3.5 h-3.5" /> Privacy Policy
          </button>
          <button onClick={() => setActiveModalTab('terms')} className="hover:text-amber-300 transition-colors cursor-pointer">Terms</button>
        </div>

        <div className="flex items-center gap-4 text-stone-400">
          <div>
            WPM: <span className="font-bold text-amber-400 font-sans">{currentWpm || '0'}</span>
          </div>
          <div>
            Score: <span className="font-serif font-bold text-amber-300">{saveData.score}</span>
          </div>
          <div>
            Accuracy: <span className="font-bold text-emerald-400">
              {saveData.wordsTyped > 0 ? (saveData.accuracySum / saveData.wordsTyped).toFixed(1) : '100'}%
            </span>
          </div>

          <button 
            onClick={() => setActiveModalTab('profile')}
            className="p-1.5 bg-white/5 hover:bg-white/10 border border-white/5 text-stone-300 hover:text-white rounded-lg transition-all cursor-pointer"
            title="Settings & Save File"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </footer>

      {/* static/legal popup controller */}
      <AnimatePresence>
        {activeModalTab && (
          <StaticPages
            activeTab={activeModalTab}
            onClose={() => setActiveModalTab(null)}
            username={username}
            onUsernameChange={(val) => {
              setUsername(val);
              updateSaveState(() => ({ username: val }));
            }}
            avatarColor={avatarColor}
            onAvatarColorChange={(val) => {
              setAvatarColor(val);
              updateSaveState(() => ({ avatarColor: val }));
            }}
            onResetSave={handleResetSave}
            stats={{
              wordsTyped: saveData.wordsTyped,
              accuracy: saveData.wordsTyped > 0 ? (saveData.accuracySum / saveData.wordsTyped) : 100,
              score: saveData.score,
              keysPressed: saveData.keysPressed,
              errorsCount: saveData.errorsCount,
              completedStories: storyHistory.length
            }}
            saveDataJson={JSON.stringify(saveData, null, 2)}
            onImportSave={handleImportSave}
            unlockedAchievements={saveData.unlockedAchievements}
            
            // Settings props
            soundEnabled={soundEnabled}
            onSoundEnabledChange={setSoundEnabled}
            musicEnabled={musicEnabled}
            onMusicEnabledChange={setMusicEnabled}
            musicVolume={musicVolume}
            onMusicVolumeChange={setMusicVolume}
            activeSoundscapeId={activeSoundscapeId}
            onActiveSoundscapeIdChange={setActiveSoundscapeId}
            aiStorytellerEnabled={aiStorytellerEnabled}
            onAiStorytellerEnabledChange={setAiStorytellerEnabled}
            timeOfDay={timeOfDay}
            onTimeOfDayChange={setTimeOfDay}
            weather={weather}
            onWeatherChange={setWeather}
            graphicsQuality={graphicsQuality}
            onGraphicsQualityChange={setGraphicsQuality}
            autoAtmosphere={autoAtmosphere}
            onAutoAtmosphereChange={setAutoAtmosphere}
          />
        )}
      </AnimatePresence>

      {/* Achievement Unlocked Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-stone-900 border border-amber-300 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4"
          >
            <div className="p-2 bg-amber-100 rounded-xl text-amber-900">
              <Award className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-amber-300">Achievement Unlocked!</h4>
              <p className="text-xs text-white/90 font-medium">{toast.title}</p>
              <p className="text-[10px] text-stone-400 font-sans mt-0.5">{toast.desc}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
