import React, { useState } from 'react';
import { Microscope, Sparkles, Activity, Layers, Box, Compass, BookOpen } from 'lucide-react';
import { SnellSimulator } from '../components/science/SnellSimulator.js';
import { OscillatorSimulator } from '../components/science/OscillatorSimulator.js';
import { FourierSimulator } from '../components/science/FourierSimulator.js';
import { MolecularViewer } from '../components/science/MolecularViewer.js';
import { UnitsInspector } from '../components/science/UnitsInspector.js';
import { LiteratureSearch } from '../components/science/LiteratureSearch.js';

export type ScienceSubTab = 'optical' | 'oscillator' | 'fourier' | 'molecular' | 'units' | 'literature';

export const ScienceHubView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<ScienceSubTab>('optical');

  const tools = [
    { id: 'optical', label: 'Óptica (Snell & Brewster)', icon: Compass },
    { id: 'oscillator', label: 'Dinámica & Fase (Oscilador)', icon: Activity },
    { id: 'fourier', label: 'Síntesis de Fourier', icon: Layers },
    { id: 'molecular', label: 'Moléculas 3D (Química)', icon: Box },
    { id: 'units', label: 'Análisis Dimensional (SI)', icon: Sparkles },
    { id: 'literature', label: 'Literatura (arXiv / OpenAlex)', icon: BookOpen }
  ] as const;

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-white text-[11px] font-mono tracking-wider">
          SCIENCE HUB • SIMULACIONES DETERMINISTAS Y HERRAMIENTAS DE INVESTIGACIÓN
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5 tracking-tight">
          <Microscope className="w-7 h-7 text-white" />
          Laboratorio Científico & Centro de Simulación
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 font-light mt-1">
          Modelos matemáticos interactivos, visualización molecular 3D, síntesis armónica y búsqueda bibliográfica para apoyar el estudio de las 307 asignaturas.
        </p>
      </div>

      {/* Sub-tabs pills in Minimalist Monochrome */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {tools.map(tool => {
          const Icon = tool.icon;
          const isActive = activeSubTab === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => setActiveSubTab(tool.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'bg-white text-black font-semibold shadow-md shadow-white/10'
                  : 'glass-pill hover:bg-white/10 text-neutral-300'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-black' : 'text-neutral-400'}`} />
              <span>{tool.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tool View */}
      <div className="pt-2">
        {activeSubTab === 'optical' && <SnellSimulator />}
        {activeSubTab === 'oscillator' && <OscillatorSimulator />}
        {activeSubTab === 'fourier' && <FourierSimulator />}
        {activeSubTab === 'molecular' && <MolecularViewer />}
        {activeSubTab === 'units' && <UnitsInspector />}
        {activeSubTab === 'literature' && <LiteratureSearch />}
      </div>
    </div>
  );
};
