import React, { useState, useEffect, useRef } from 'react';
import { MathView } from '../MathView.js';

export const FourierSimulator: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Amplitudes for harmonics 1 to 7
  const [harmonics, setHarmonics] = useState<number[]>([1.0, 0.0, 0.33, 0.0, 0.2, 0.0, 0.14]); // Square wave preset

  const setPreset = (type: 'square' | 'sawtooth' | 'triangle' | 'single') => {
    if (type === 'square') {
      setHarmonics([1.0, 0.0, 0.33, 0.0, 0.2, 0.0, 0.14]);
    } else if (type === 'sawtooth') {
      setHarmonics([1.0, 0.5, 0.33, 0.25, 0.2, 0.16, 0.14]);
    } else if (type === 'triangle') {
      setHarmonics([1.0, 0.0, -0.11, 0.0, 0.04, 0.0, -0.02]);
    } else {
      setHarmonics([1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const cy = height / 2;

    ctx.clearRect(0, 0, width, height);

    // Grid & zero line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(width, cy);
    ctx.stroke();

    // Synthesis: f(x) = sum_n [ a_n * sin(n * x) ]
    const points: Array<{ x: number; y: number }> = [];
    const scaleY = 60;
    const periods = 3;

    for (let px = 0; px < width; px++) {
      const t = (px / width) * periods * Math.PI * 2;
      let val = 0;
      for (let n = 0; n < harmonics.length; n++) {
        const harmNum = n + 1;
        val += harmonics[n] * Math.sin(harmNum * t);
      }
      points.push({ x: px, y: cy - val * scaleY });
    }

    // Draw synthesized wave
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    for (let i = 0; i < points.length; i++) {
      if (i === 0) ctx.moveTo(points[i].x, points[i].y);
      else ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Draw individual active harmonics in faint lines
    harmonics.forEach((amp, idx) => {
      if (Math.abs(amp) > 0.01) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let px = 0; px < width; px += 2) {
          const t = (px / width) * periods * Math.PI * 2;
          const y = cy - amp * Math.sin((idx + 1) * t) * scaleY;
          if (px === 0) ctx.moveTo(px, y);
          else ctx.lineTo(px, y);
        }
        ctx.stroke();
      }
    });
  }, [harmonics]);

  return (
    <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-white text-base">Sintetizador de Fourier (Descomposición Armónica)</h3>
          <p className="text-xs text-neutral-400 font-light">
            Reconstrucción espectral <MathView math="f(t) = \sum_{n=1}^N a_n \sin(n \omega t)" /> y suma de modos normales.
          </p>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {(['square', 'sawtooth', 'triangle', 'single'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPreset(p)}
              className="text-xs px-3 py-1.5 rounded-xl glass-pill hover:bg-white/10 text-neutral-300 capitalize transition"
            >
              {p === 'square' ? 'Cuadrada' : p === 'sawtooth' ? 'Diente Sierra' : p === 'triangle' ? 'Triangular' : 'Fundamental'}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-black/60 rounded-2xl border border-white/10 p-2 overflow-hidden flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={700}
          height={240}
          className="w-full max-w-[700px] h-auto rounded-xl"
        />
      </div>

      {/* Sliders for 7 Harmonics */}
      <div className="space-y-3 pt-2">
        <span className="text-xs font-mono font-bold text-neutral-300 block">
          Amplitudes Armónicas (n = 1 a 7):
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {harmonics.map((amp, idx) => (
            <div key={idx} className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-neutral-400">Armónico {idx + 1}:</span>
                <span className="text-white font-bold">{amp.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="-1.0"
                max="1.0"
                step="0.05"
                value={amp}
                onChange={e => {
                  const val = parseFloat(e.target.value);
                  setHarmonics(prev => {
                    const next = [...prev];
                    next[idx] = val;
                    return next;
                  });
                }}
                className="w-full accent-white bg-neutral-800"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
