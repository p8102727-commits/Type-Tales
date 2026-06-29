import React, { useRef, useEffect, useState } from 'react';
import { Sparkles, RefreshCw, Keyboard, ArrowRight } from 'lucide-react';

interface StoryPanelProps {
  text: string;
  onWordTyped: (word: string, isCorrect: boolean, accuracy: number) => void;
  onParagraphCompleted: () => void;
  accentColor: string; // Hex or CSS color
  onStartTyping?: () => void;
  onKeystroke?: (charCount: number) => void;
  onErrorKeystroke?: () => void;
}

export default function StoryPanel({
  text,
  onWordTyped,
  onParagraphCompleted,
  accentColor,
  onStartTyping,
  onKeystroke,
  onErrorKeystroke
}: StoryPanelProps) {
  const words = text.split(' ');
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [errorCount, setErrorCount] = useState(0);
  const [correctKeyCount, setCorrectKeyCount] = useState(0);
  
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset panel state when story text changes
  useEffect(() => {
    setCurrentWordIdx(0);
    setInputValue('');
    setErrorCount(0);
    setCorrectKeyCount(0);
    // Autofocus input on PC
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [text]);

  const targetWord = words[currentWordIdx] || '';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onStartTyping) {
      onStartTyping();
    }

    const val = e.target.value;
    
    // Space triggered word completion
    if (val.endsWith(' ')) {
      const trimmed = val.trim();
      if (trimmed === targetWord) {
        // Correct word typed!
        onWordTyped(targetWord, true, calculateAccuracy());
        
        // Report keystrokes including the spacebar
        const completedChars = words.slice(0, currentWordIdx + 1).join(' ').length + 1;
        onKeystroke?.(completedChars);

        advanceWord();
      } else {
        // Mistake made on Space
        setErrorCount(prev => prev + 1);
        onErrorKeystroke?.();
      }
      return;
    }

    // Checking character by character input
    const expectedPrefix = targetWord.substring(0, val.length);
    if (val === expectedPrefix) {
      setInputValue(val);
      setCorrectKeyCount(prev => prev + 1);

      const currentCharsCount = words.slice(0, currentWordIdx).join(' ').length + (currentWordIdx > 0 ? 1 : 0) + val.length;
      onKeystroke?.(currentCharsCount);
    } else {
      // Mistake!
      setErrorCount(prev => prev + 1);
      onErrorKeystroke?.();
    }
  };

  const advanceWord = () => {
    setInputValue('');
    if (currentWordIdx + 1 >= words.length) {
      // Completed the full paragraph!
      onParagraphCompleted();
    } else {
      setCurrentWordIdx(prev => prev + 1);
    }
  };

  const calculateAccuracy = (): number => {
    const totalKeys = correctKeyCount + errorCount;
    if (totalKeys === 0) return 100;
    return Math.max(0, Math.min(100, (correctKeyCount / totalKeys) * 100));
  };

  // Quick helper to force focus when clicking on the frosted glass card
  const handleCardClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className="relative w-full max-w-4xl mx-auto bg-stone-900/45 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl transition-all hover:bg-stone-900/50 cursor-text"
      id="cozy-story-panel"
    >
      {/* Hidden input for capturing keys - works perfectly on Mobile and Desktop */}
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        className="absolute top-0 left-0 w-0 h-0 opacity-0 pointer-events-none"
        autoComplete="off"
        autoCapitalize="none"
        spellCheck="false"
      />

      {/* Typing Story Body */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-4 text-lg md:text-2xl font-serif text-white leading-relaxed select-none">
        {words.map((word, idx) => {
          if (idx < currentWordIdx) {
            // Already typed - fade gently
            return (
              <span key={idx} className="opacity-35 transition-all duration-300 line-through decoration-emerald-400 decoration-2">
                {word}
              </span>
            );
          } else if (idx === currentWordIdx) {
            // Current active word - glowing text
            return (
              <span 
                key={idx} 
                style={{ 
                  textShadow: `0 0 12px ${accentColor || '#fbbf24'}`,
                  borderColor: accentColor || '#fbbf24'
                }}
                className="relative inline-block bg-white/10 px-2 py-0.5 rounded-xl border-b-2 font-bold transition-all duration-200"
              >
                {/* Typed characters prefix */}
                <span className="text-emerald-400 font-bold">{inputValue}</span>
                {/* Remaining characters */}
                <span className="opacity-95">{word.substring(inputValue.length)}</span>
                
                {/* Soft pulsing cursor */}
                <span 
                  style={{ backgroundColor: accentColor || '#fbbf24' }}
                  className="inline-block w-1 h-6 ml-0.5 animate-pulse rounded"
                />
              </span>
            );
          } else {
            // Future words
            return (
              <span key={idx} className="opacity-80">
                {word}
              </span>
            );
          }
        })}
      </div>

      {/* Floating Prompt Helpers */}
      <div className="mt-6 flex flex-wrap justify-between items-center gap-3 border-t border-white/5 pt-4 text-xs text-stone-300 font-sans">
        <div className="flex items-center gap-2">
          <Keyboard className="w-4 h-4 text-stone-400" />
          <span>Type each word followed by <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] font-mono text-white">Space</kbd></span>
        </div>
        
        <div className="flex items-center gap-4">
          <div>
            Accuracy: <span className="font-bold text-emerald-400">{calculateAccuracy().toFixed(0)}%</span>
          </div>
          <div>
            Word: <span className="font-bold text-amber-300">{currentWordIdx + 1}</span> of {words.length}
          </div>
        </div>
      </div>
    </div>
  );
}
