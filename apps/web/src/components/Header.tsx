import React, { useState, useEffect } from 'react';
import {
  Atom,
  Database,
  Wifi,
  WifiOff,
  Sparkles
} from 'lucide-react';
import { db } from '@academia/storage';
import { useLiveQuery } from 'dexie-react-hooks';

interface HeaderProps {
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const recordsCount = useLiveQuery(async () => {
    try {
      return await db.source_records.count();
    } catch {
      return 0;
    }
  }, []);

  const coursesCount = useLiveQuery(async () => {
    try {
      return await db.courses.count();
    } catch {
      return 0;
    }
  }, []);

  return (
    <header className="border-b border-white/[0.08] bg-black/75 backdrop-blur-2xl sticky top-0 z-50 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center font-black tracking-tighter shadow-[0_0_20px_rgba(255,255,255,0.15)]">
            <Atom className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-widest text-white uppercase">
                Academ<span className="text-neutral-400">IA</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-neutral-300 font-mono tracking-wider">
                v2.0
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 hidden sm:block tracking-wide">
              Física • Matemáticas • Química • Ingeniería
            </p>
          </div>
        </div>

        {/* Status and Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* IndexedDB Live Indicator */}
          <div className="glass-pill px-3 py-1.5 rounded-xl text-xs flex items-center gap-2 hidden sm:flex">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <Database className="w-3.5 h-3.5 text-neutral-400" />
            <span className="font-mono text-neutral-200">
              {recordsCount !== undefined ? `${recordsCount.toLocaleString()} temas` : '...'}
            </span>
            <span className="text-neutral-600">/</span>
            <span className="font-mono text-neutral-200">
              {coursesCount !== undefined ? `${coursesCount} cursos` : ''}
            </span>
          </div>

          {/* Network indicator */}
          <div
            className="glass-pill px-2.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 font-mono"
            title={isOnline ? 'Online' : 'Offline'}
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5 text-neutral-300" /> : <WifiOff className="w-3.5 h-3.5 text-neutral-500" />}
            <span className="hidden md:inline text-[11px]">{isOnline ? 'Online' : 'Offline'}</span>
          </div>

          {/* Settings / IA button */}
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition shadow-[0_0_15px_rgba(255,255,255,0.12)] touch-manipulation"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>IA & Nube</span>
          </button>
        </div>
      </div>
    </header>
  );
};
