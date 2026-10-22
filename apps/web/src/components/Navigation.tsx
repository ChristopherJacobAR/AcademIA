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
    { id: 'dashboard', label: 'Resumen', icon: LayoutDashboard },
    { id: 'courses', label: '307 Asignaturas', icon: GraduationCap },
    { id: 'waves', label: '14 Olas Paralelas', icon: Layers },
    { id: 'records', label: '9,137 Temas Fuente', icon: FileText },
    { id: 'alerts', label: '112 Alertas', icon: AlertTriangle },
    { id: 'concept', label: 'Ficha KaTeX', icon: Variable },
    { id: 'arcade', label: '18 Videojuegos', icon: Gamepad2 },
    { id: 'backup', label: 'Respaldos', icon: HardDriveDownload }
  ] as const;

  return (
    <nav className="bg-black/60 backdrop-blur-2xl border-b border-white/[0.06] px-3 sm:px-6 py-2.5 overflow-x-auto no-scrollbar sticky top-[60px] z-40">
      <div className="max-w-7xl mx-auto flex items-center gap-1.5 sm:gap-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 min-h-[42px] touch-manipulation ${
                isActive
                  ? 'bg-white text-black font-semibold shadow-[0_0_20px_rgba(255,255,255,0.22)]'
                  : 'text-neutral-400 hover:text-white hover:bg-white/[0.05] border border-transparent hover:border-white/[0.08]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-black' : 'text-neutral-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
