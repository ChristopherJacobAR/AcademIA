import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.js';
import { Navigation, ActiveTab } from './components/Navigation.js';
import { DashboardView } from './views/DashboardView.js';
import { ParallelWavesView } from './views/ParallelWavesView.js';
import { CoursesView } from './views/CoursesView.js';
import { SourceRecordsView } from './views/SourceRecordsView.js';
import { AuditAlertsView } from './views/AuditAlertsView.js';
import { ConceptKaTeXView } from './views/ConceptKaTeXView.js';
import { ArcadeView } from './views/ArcadeView.js';
import { BackupView } from './views/BackupView.js';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('academia_theme') !== 'light';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('academia_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('academia_theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans transition-colors duration-200">
      <Header darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 pb-16">
        {activeTab === 'dashboard' && <DashboardView onNavigateTab={setActiveTab} />}
        {activeTab === 'waves' && <ParallelWavesView />}
        {activeTab === 'courses' && <CoursesView />}
        {activeTab === 'records' && <SourceRecordsView />}
        {activeTab === 'alerts' && <AuditAlertsView />}
        {activeTab === 'concept' && <ConceptKaTeXView />}
        {activeTab === 'arcade' && <ArcadeView />}
        {activeTab === 'backup' && <BackupView />}
      </main>

      <footer className="border-t border-slate-800/60 bg-[#090d16] py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>AcademIA v2.0 • Local-First para iPadOS y Windows • Presupuesto 0 MXN/mes</span>
          <span className="text-slate-600">
            Física (307 cursos) • Matemáticas • Química • Ingeniería • 9,137 registros fuente
          </span>
        </div>
      </footer>
    </div>
  );
};

export default App;
