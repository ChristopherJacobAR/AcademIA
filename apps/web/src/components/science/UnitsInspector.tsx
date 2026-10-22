import React, { useState } from 'react';
import { MathView } from '../MathView.js';

interface Quantity {
  name: string;
  symbol: string;
  unit: string;
  dims: { M: number; L: number; T: number; I: number; Theta: number };
}

const QUANTITIES: Quantity[] = [
  { name: 'Fuerza', symbol: 'F', unit: 'N (Newton)', dims: { M: 1, L: 1, T: -2, I: 0, Theta: 0 } },
  { name: 'Energía / Trabajo', symbol: 'E, W', unit: 'J (Joule)', dims: { M: 1, L: 2, T: -2, I: 0, Theta: 0 } },
  { name: 'Potencia', symbol: 'P', unit: 'W (Watt)', dims: { M: 1, L: 2, T: -3, I: 0, Theta: 0 } },
  { name: 'Presión / Esfuerzo', symbol: 'p, \\sigma', unit: 'Pa (Pascal)', dims: { M: 1, L: -1, T: -2, I: 0, Theta: 0 } },
  { name: 'Momento Lineal', symbol: 'p', unit: 'kg·m/s', dims: { M: 1, L: 1, T: -1, I: 0, Theta: 0 } },
  { name: 'Momento Angular', symbol: 'L', unit: 'J·s', dims: { M: 1, L: 2, T: -1, I: 0, Theta: 0 } },
  { name: 'Carga Eléctrica', symbol: 'q, Q', unit: 'C (Coulomb)', dims: { M: 0, L: 0, T: 1, I: 1, Theta: 0 } },
  { name: 'Potencial Eléctrico / Voltaje', symbol: 'V', unit: 'V (Volt)', dims: { M: 1, L: 2, T: -3, I: -1, Theta: 0 } },
  { name: 'Campo Eléctrico', symbol: 'E', unit: 'V/m', dims: { M: 1, L: 1, T: -3, I: -1, Theta: 0 } },
  { name: 'Campo Magnético', symbol: 'B', unit: 'T (Tesla)', dims: { M: 1, L: 0, T: -2, I: -1, Theta: 0 } },
  { name: 'Flujo Magnético', symbol: '\\Phi_B', unit: 'Wb (Weber)', dims: { M: 1, L: 2, T: -2, I: -1, Theta: 0 } },
  { name: 'Capacitancia', symbol: 'C', unit: 'F (Farad)', dims: { M: -1, L: -2, T: 4, I: 2, Theta: 0 } },
  { name: 'Inductancia', symbol: 'L', unit: 'H (Henry)', dims: { M: 1, L: 2, T: -2, I: -2, Theta: 0 } },
  { name: 'Resistencia Eléctrica', symbol: 'R', unit: '\\Omega (Ohm)', dims: { M: 1, L: 2, T: -3, I: -2, Theta: 0 } },
  { name: 'Viscosidad Dinámica', symbol: '\\mu', unit: 'Pa·s', dims: { M: 1, L: -1, T: -1, I: 0, Theta: 0 } },
  { name: 'Densidad de Masa', symbol: '\\rho', unit: 'kg/m³', dims: { M: 1, L: -3, T: 0, I: 0, Theta: 0 } },
  { name: 'Constante de Planck', symbol: 'h, \\hbar', unit: 'J·s', dims: { M: 1, L: 2, T: -1, I: 0, Theta: 0 } },
  { name: 'Constante de Gravitación', symbol: 'G', unit: 'm³/(kg·s²)', dims: { M: -1, L: 3, T: -2, I: 0, Theta: 0 } },
  { name: 'Entropía / Capacidad Calorífica', symbol: 'S, C_p', unit: 'J/K', dims: { M: 1, L: 2, T: -2, I: 0, Theta: -1 } }
];

export const UnitsInspector: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedQty, setSelectedQty] = useState<Quantity>(QUANTITIES[0]);

  const filtered = QUANTITIES.filter(
    q => q.name.toLowerCase().includes(search.toLowerCase()) || q.unit.toLowerCase().includes(search.toLowerCase())
  );

  const formatDimString = (dims: Quantity['dims']) => {
    const parts: string[] = [];
    if (dims.M !== 0) parts.push(`\\text{M}^{${dims.M}}`);
    if (dims.L !== 0) parts.push(`\\text{L}^{${dims.L}}`);
    if (dims.T !== 0) parts.push(`\\text{T}^{${dims.T}}`);
    if (dims.I !== 0) parts.push(`\\text{I}^{${dims.I}}`);
    if (dims.Theta !== 0) parts.push(`\\Theta^{${dims.Theta}}`);
    if (parts.length === 0) return '1 \\text{ (adimensional)}';
    return `[${parts.join(' \\cdot ')}]`;
  };

  return (
    <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-white text-base">Inspector de Unidades SI y Análisis Dimensional</h3>
          <p className="text-xs text-neutral-400 font-light">
            Base dimensional en Sistema Internacional $[M, L, T, I, \Theta]$. Garantiza homogeneidad dimensional según el Teorema Pi de Buckingham.
          </p>
        </div>
        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Buscar magnitud o unidad..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="glass-input w-full px-3 py-1.5 rounded-xl text-xs"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quantities Table */}
        <div className="lg:col-span-2 glass-panel rounded-2xl overflow-hidden divide-y divide-white/[0.05] max-h-80 overflow-y-auto">
          {filtered.map(qty => (
            <div
              key={qty.name}
              onClick={() => setSelectedQty(qty)}
              className={`p-3.5 flex items-center justify-between cursor-pointer transition text-xs ${
                selectedQty.name === qty.name
                  ? 'bg-white text-black font-semibold'
                  : 'hover:bg-white/[0.04] text-neutral-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs w-16">{qty.symbol}</span>
                <span>{qty.name}</span>
              </div>
              <span className="font-mono text-[11px] opacity-80">{qty.unit}</span>
            </div>
          ))}
        </div>

        {/* Selected Dimension Detail Card */}
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <span className="text-[10px] uppercase font-mono text-neutral-400">Magnitud Seleccionada</span>
            <h4 className="text-xl font-bold text-white">{selectedQty.name}</h4>
            <p className="text-xs text-neutral-300 font-mono">Unidad SI: {selectedQty.unit}</p>

            <div className="p-4 rounded-xl bg-black/60 border border-white/10 text-center space-y-1">
              <span className="text-[10px] text-neutral-400 font-mono block">Ecuación Dimensional:</span>
              <MathView math={formatDimString(selectedQty.dims)} block className="text-base text-white font-bold" />
            </div>

            <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-neutral-300 pt-2">
              <div className="p-2 rounded bg-white/[0.02] border border-white/5 text-center">
                M: {selectedQty.dims.M}
              </div>
              <div className="p-2 rounded bg-white/[0.02] border border-white/5 text-center">
                L: {selectedQty.dims.L}
              </div>
              <div className="p-2 rounded bg-white/[0.02] border border-white/5 text-center">
                T: {selectedQty.dims.T}
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[10px] text-neutral-400 font-light">
            Regla de Fourier: dos expresiones solo pueden sumarse o igualarse si tienen la misma signatura dimensional.
          </div>
        </div>
      </div>
    </div>
  );
};
