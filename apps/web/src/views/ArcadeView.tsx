import React, { useState } from 'react';
import { Gamepad2, Cpu } from 'lucide-react';
import { OFFICIAL_SCIENTIFIC_GAMES } from '@academia/core';

export const ArcadeView: React.FC = () => {
  const [selectedDomain, setSelectedDomain] = useState<string>('ALL');

  const filteredGames = OFFICIAL_SCIENTIFIC_GAMES.filter(game => {
    if (selectedDomain === 'ALL') return true;
    return game.domains.includes(selectedDomain.toLowerCase());
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-8">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5 tracking-tight">
          <Gamepad2 className="w-7 h-7 text-white" />
          Arcade Científico (18 Videojuegos con Física Real)
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 font-light mt-1">
          Invariante mandatorio: El entretenimiento nunca altera ecuaciones ni enseña una aproximación como ley universal. Cada juego incorpora un motor diferencial determinista y validación dimensional.
        </p>
      </div>

      {/* Domain Filters in Minimalist B&W */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {['ALL', 'Fisica', 'Matematicas', 'Quimica', 'Ingenieria'].map(domain => (
          <button
            key={domain}
            onClick={() => setSelectedDomain(domain)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 ${
              selectedDomain === domain
                ? 'bg-white text-black font-semibold'
                : 'glass-pill hover:bg-white/10 text-neutral-300'
            }`}
          >
            {domain === 'ALL' ? 'Todos los Dominios (18)' : domain}
          </button>
        ))}
      </div>

      {/* Games Grid in Frosted Glass */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGames.map(game => (
          <div
            key={game.id}
            className="glass-card rounded-2xl p-5 flex flex-col justify-between transition-all duration-250 space-y-4"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-neutral-400 font-bold">{game.id}</span>
                <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded-full border border-white/10 text-neutral-300">
                  {game.status}
                </span>
              </div>

              <h3 className="font-bold text-white text-base leading-snug">
                {game.title}
              </h3>

              <p className="text-xs text-neutral-300 leading-relaxed font-light">
                {game.description}
              </p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {game.domains.map(d => (
                  <span
                    key={d}
                    className="text-[10px] capitalize px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/10 text-neutral-400 font-mono"
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>

            {/* Differential Physical Model Box */}
            <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 space-y-1">
              <div className="text-[10px] uppercase font-mono font-bold text-neutral-400 flex items-center gap-1.5">
                <Cpu className="w-3 h-3 text-white" />
                Modelo Físico-Matemático:
              </div>
              <p className="text-[11px] font-mono text-neutral-200 leading-snug">
                {game.physicsModel}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
