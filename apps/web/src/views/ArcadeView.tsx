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
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-6">
      <div className="space-y-1">
        <h1 className="text-xl md:text-2xl font-extrabold text-white flex items-center gap-2">
          <Gamepad2 className="w-6 h-6 text-pink-400" />
          Arcade Científico (18 Videojuegos con Física Real)
        </h1>
        <p className="text-xs md:text-sm text-slate-400">
          Invariante mandatorio: El entretenimiento nunca altera ecuaciones ni enseña una aproximación como ley universal. Cada juego incorpora un motor diferencial determinista y validación dimensional.
        </p>
      </div>

      {/* Domain Filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {['ALL', 'Fisica', 'Matematicas', 'Quimica', 'Ingenieria'].map(domain => (
          <button
            key={domain}
            onClick={() => setSelectedDomain(domain)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedDomain === domain
                ? 'bg-pink-600 text-white shadow-md shadow-pink-600/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {domain === 'ALL' ? 'Todos los Dominios (18)' : domain}
          </button>
        ))}
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGames.map(game => {
          return (
            <div
              key={game.id}
              className="bg-slate-900/70 border border-slate-800 hover:border-pink-500/40 rounded-2xl p-5 flex flex-col justify-between transition space-y-4 group"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-slate-500 font-bold">{game.id}</span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400">
                    {game.status}
                  </span>
                </div>

                <h3 className="font-bold text-white text-base group-hover:text-pink-300 transition">
                  {game.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {game.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {game.domains.map(d => (
                    <span
                      key={d}
                      className="text-[10px] capitalize px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-slate-400"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              {/* Physical Differential Model Box */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                  <Cpu className="w-3 h-3 text-pink-400" />
                  Modelo Físico-Matemático:
                </div>
                <p className="text-[11px] font-mono text-slate-300 leading-snug">
                  {game.physicsModel}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
