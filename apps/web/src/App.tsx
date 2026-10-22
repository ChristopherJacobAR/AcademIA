import React, { useState } from 'react';
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
import { ScienceHubView } from './views/ScienceHubView.js';
import { SettingsModal } from './components/SettingsModal.js';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-neutral-100 flex flex-col font-sans selection:bg-white selection:text-black antialiased relative">
      {/* Subtle Ambient Glass Glows */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-white/[0.015] rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[32rem] h-[32rem] bg-white/[0.01] rounded-full blur-3xl pointer-events-none" />

      <Header onOpenSettings={() => setSettingsOpen(true)} />
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 pb-20 relative z-10">
        {activeTab === 'dashboard' && <DashboardView onNavigateTab={setActiveTab} />}
        {activeTab === 'courses' && <CoursesView />}
        {activeTab === 'waves' && <ParallelWavesView />}
        {activeTab === 'records' && <SourceRecordsView />}
        {activeTab === 'science' && <ScienceHubView />}
        {activeTab === 'alerts' && <AuditAlertsView />}
        {activeTab === 'concept' && <ConceptKaTeXView />}
        {activeTab === 'arcade' && <ArcadeView />}
        {activeTab === 'backup' && <BackupView />}
      </main>

      <footer className="border-t border-white/[0.06] bg-black/80 py-5 px-6 text-center text-xs text-neutral-500 font-light relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>AcademIA v2.0 • UX/UI Pro Max • Minimalista Monocromo & Glassmorphism</span>
          <span className="font-mono text-[11px] text-neutral-400">
            307 Asignaturas • 14 Frentes • 9,137 Temas Inmutables • Science Lab
          </span>
        </div>
      </footer>

      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
};

export default App;
