import React, { useState, useEffect } from 'react';
import {
  Atom,
  Database,
  Moon,
  Sun,
  Wifi,
  WifiOff,
  Sparkles
} from 'lucide-react';
import { db } from '@academia/storage';
import { useLiveQuery } from 'dexie-react-hooks';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({ darkMode, onToggleDarkMode }) => {
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
    <header className="border-b border-slate-800 bg-[#090d16]/95 backdrop-blur sticky top-0 z-50 px-4 lg:px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Atom className="w-6 h-6 text-white animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white">AcademIA</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-medium">
                v2.0 Local-First
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Academia Científica IA — Física, Matemáticas, Química e Ingeniería
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* IndexedDB Live Indicator */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
            <Database className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-slate-400">IndexedDB:</span>
            <span className="font-semibold text-slate-200">
              {recordsCount !== undefined ? `${recordsCount.toLocaleString()} reg` : 'Cargando...'}
            </span>
            <span className="text-slate-600">|</span>
            <span className="font-semibold text-slate-200">
              {coursesCount !== undefined ? `${coursesCount} cursos` : ''}
            </span>
          </div>

          {/* Network / Offline pill */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
              isOnline
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
            }`}
            title={isOnline ? 'Conectado a internet' : 'Modo fuera de línea activo (IndexedDB)'}
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isOnline ? 'Online' : 'Offline'}</span>
          </div>

          {/* Zero Cost Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/60 border border-slate-700/50 text-xs text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>0 MXN/mes</span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Cambiar tema visual"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>
        </div>
      </div>
    </header>
  );
};
