import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { MathView } from '../MathView.js';

export const OscillatorSimulator: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(true);
  const [mass, setMass] = useState(1.0); // kg
  const [kSpring, setKSpring] = useState(25.0); // N/m
  const [damping, setDamping] = useState(0.8); // N*s/m

  // Physics state
  const stateRef = useRef({
    x: 1.5, // initial displacement
    v: 0.0, // velocity
    t: 0.0,
    history: [] as Array<{ x: number; v: number }>
  });

  const resetSimulation = () => {
    stateRef.current = {
      x: 1.5,
      v: 0.0,
      t: 0.0,
      history: []
    };
  };

  useEffect(() => {
    let animId: number;
    const dt = 0.02;

    const render = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const width = canvas.width;
          const height = canvas.height;

          // Physics update if running
          if (isRunning) {
            const current = stateRef.current;
            // EDO: m*a + gamma*v + k*x = 0 => a = (-gamma*v - k*x) / m
            const a = (-damping * current.v - kSpring * current.x) / mass;
            current.v += a * dt;
            current.x += current.v * dt;
            current.t += dt;

            current.history.push({ x: current.x, v: current.v });
            if (current.history.length > 300) {
              current.history.shift();
            }
          }

          // Clear
          ctx.clearRect(0, 0, width, height);

          // Divider
          const midX = width / 2;
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(midX, 0);
          ctx.lineTo(midX, height);
          ctx.stroke();

          // --- LEFT PANEL: Physical Spring & Mass ---
          const leftCx = midX / 2;
          const baseY = height / 2;
          const currentX = stateRef.current.x;
          const blockY = baseY + currentX * 50;

          // Wall / ceiling
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(leftCx - 50, 30);
          ctx.lineTo(leftCx + 50, 30);
          ctx.stroke();

          // Spring (zigzag)
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(leftCx, 30);
          const coils = 12;
          const springLen = Math.max(20, blockY - 55);
          for (let i = 1; i <= coils; i++) {
            const y = 30 + (springLen / coils) * i;
            const xOffset = i % 2 === 0 ? 12 : -12;
            ctx.lineTo(leftCx + (i === coils ? 0 : xOffset), y);
          }
          ctx.stroke();

          // Oscillating mass block
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = '#ffffff';
          ctx.shadowBlur = 8;
          ctx.fillRect(leftCx - 25, blockY - 25, 50, 50);
          ctx.shadowBlur = 0;

          // Text labels left
          ctx.font = '10px monospace';
          ctx.fillStyle = '#a3a3a3';
          ctx.fillText(`x = ${currentX.toFixed(3)} m`, leftCx - 35, height - 20);
          ctx.fillText(`v = ${stateRef.current.v.toFixed(3)} m/s`, leftCx - 35, height - 35);
          ctx.fillText('Espacio Físico', 16, 25);

          // --- RIGHT PANEL: Phase Space Trajectory (x vs v) ---
          const rightCx = midX + (width - midX) / 2;
          const rightCy = height / 2;
          const scale = 40;

          // Phase space axes
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
          ctx.setLineDash([2, 2]);
          ctx.beginPath();
          ctx.moveTo(midX + 20, rightCy);
          ctx.lineTo(width - 20, rightCy);
          ctx.moveTo(rightCx, 20);
          ctx.lineTo(rightCx, height - 20);
          ctx.stroke();
          ctx.setLineDash([]);

          ctx.font = '10px monospace';
          ctx.fillStyle = '#737373';
          ctx.fillText('x (posición)', width - 80, rightCy - 6);
          ctx.fillText('v (velocidad)', rightCx + 6, 25);
          ctx.fillText('Espacio de Fase (x, v)', midX + 16, 25);

          // Phase space spiral curve
          const hist = stateRef.current.history;
          if (hist.length > 1) {
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            for (let i = 0; i < hist.length; i++) {
              const px = rightCx + hist[i].x * scale;
              const py = rightCy - hist[i].v * (scale / 2);
              if (i === 0) ctx.moveTo(px, py);
              else ctx.lineTo(px, py);
            }
            ctx.stroke();

            // Current point dot
            const last = hist[hist.length - 1];
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(rightCx + last.x * scale, rightCy - last.v * (scale / 2), 4, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [isRunning, mass, kSpring, damping]);

  // Derived properties
  const omega0 = Math.sqrt(kSpring / mass);
  const dampingRatio = damping / (2 * Math.sqrt(mass * kSpring));
  const regime =
    dampingRatio < 1.0 ? 'Subamortiguado (Espiral)' : dampingRatio === 1.0 ? 'Crítico' : 'Sobreamortiguado';

  return (
    <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-white text-base">Dinámica del Oscilador Armónico y Espacio de Fase</h3>
          <p className="text-xs text-neutral-400 font-light">
            Integración de segundo orden <MathView math="m\ddot{x} + \gamma\dot{x} + kx = 0" /> con representación de trayectorias en plano de fase.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="p-2 rounded-xl bg-white text-black text-xs font-semibold hover:bg-neutral-200 transition"
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={resetSimulation}
            className="p-2 rounded-xl glass-pill hover:bg-white/10 text-neutral-300 transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex items-center justify-center bg-black/60 rounded-2xl border border-white/10 p-2 overflow-hidden">
          <canvas
            ref={canvasRef}
            width={600}
            height={320}
            className="w-full max-w-[600px] h-auto rounded-xl"
          />
        </div>

        <div className="space-y-4 flex flex-col justify-between">
          <div className="space-y-3.5">
            {/* Mass */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-neutral-300">Masa (m):</span>
                <span className="text-white font-bold">{mass.toFixed(1)} kg</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="5.0"
                step="0.1"
                value={mass}
                onChange={e => setMass(parseFloat(e.target.value))}
                className="w-full accent-white bg-neutral-800"
              />
            </div>

            {/* k Spring */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-neutral-300">Constante Resorte (k):</span>
                <span className="text-white font-bold">{kSpring.toFixed(1)} N/m</span>
              </div>
              <input
                type="range"
                min="5.0"
                max="80.0"
                step="1.0"
                value={kSpring}
                onChange={e => setKSpring(parseFloat(e.target.value))}
                className="w-full accent-white bg-neutral-800"
              />
            </div>

            {/* Damping */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-neutral-300">Amortiguamiento (γ):</span>
                <span className="text-white font-bold">{damping.toFixed(2)} N·s/m</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="6.0"
                step="0.05"
                value={damping}
                onChange={e => setDamping(parseFloat(e.target.value))}
                className="w-full accent-white bg-neutral-800"
              />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-neutral-400">Frecuencia Natural ω₀:</span>
              <span className="text-white font-bold">{omega0.toFixed(2)} rad/s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Factor de Amortiguamiento ζ:</span>
              <span className="text-neutral-200">{dampingRatio.toFixed(3)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Régimen Físico:</span>
              <span className="text-white font-bold">{regime}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
