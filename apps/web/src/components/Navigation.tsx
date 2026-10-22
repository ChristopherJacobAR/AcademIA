import React from 'react';
import {
  LayoutDashboard,
  Layers,
  GraduationCap,
  FileText,
  AlertTriangle,
  Variable,
  Gamepad2,
  HardDriveDownload
} from 'lucide-react';

export type ActiveTab =
  | 'dashboard'
  | 'waves'
  | 'courses'
  | 'records'
  | 'alerts'
  | 'concept'
  | 'arcade'
  | 'backup';

interface NavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'dashboard', label: 'Panel General', icon: LayoutDashboard },
    { id: 'waves', label: '14 Frentes', icon: Layers },
    { id: 'courses', label: '307 Cursos', icon: GraduationCap },
    { id: 'records', label: '9,137 Fuentes', icon: FileText },
    { id: 'alerts', label: '112 Alertas', icon: AlertTriangle },
    { id: 'concept', label: 'Ficha & KaTeX', icon: Variable },
    { id: 'arcade', label: 'Arcade (18)', icon: Gamepad2 },
    { id: 'backup', label: 'Respaldo', icon: HardDriveDownload }
  ] as const;

  return (
    <nav className="bg-[#0b101d] border-b border-slate-800/80 px-2 sm:px-4 py-2 overflow-x-auto no-scrollbar sticky top-[61px] z-40">
      <div className="max-w-7xl mx-auto flex items-center gap-1.5 sm:gap-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition min-h-[44px] touch-manipulation ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
