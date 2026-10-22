import React, { useState, useEffect, useRef } from 'react';
import { MathView } from '../MathView.js';

export const SnellSimulator: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [n1, setN1] = useState(1.0); // Medium 1 index
  const [n2, setN2] = useState(1.5); // Medium 2 index
  const [theta1Deg, setTheta1Deg] = useState(45); // Incident angle in degrees

  const theta1Rad = (theta1Deg * Math.PI) / 180;
  const sinTheta2 = (n1 / n2) * Math.sin(theta1Rad);
  const isTIR = sinTheta2 > 1.0; // Total internal reflection
  const theta2Rad = isTIR ? 0 : Math.asin(sinTheta2);
  const theta2Deg = isTIR ? 0 : (theta2Rad * 180) / Math.PI;

  const criticalAngleDeg = n1 > n2 ? (Math.asin(n2 / n1) * 180) / Math.PI : null;
  const brewsterAngleDeg = (Math.atan(n2 / n1) * 180) / Math.PI;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height / 2;
    const rayLength = Math.min(width, height) * 0.42;

    ctx.clearRect(0, 0, width, height);

    // Medium 1 background (top)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
    ctx.fillRect(0, 0, width, cy);

    // Medium 2 background (bottom)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.fillRect(0, cy, width, height - cy);

    // Interface line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(width, cy);
    ctx.stroke();

    // Normal line (dashed vertical)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx, 20);
    ctx.lineTo(cx, height - 20);
    ctx.stroke();
    ctx.setLineDash([]);

    // Incident Ray (from top-left down to center)
    const incX = cx - rayLength * Math.sin(theta1Rad);
    const incY = cy - rayLength * Math.cos(theta1Rad);

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(incX, incY);
    ctx.lineTo(cx, cy);
    ctx.stroke();

    // Reflected Ray (symmetric across normal)
    const refX = cx + rayLength * Math.sin(theta1Rad);
    const refY = cy - rayLength * Math.cos(theta1Rad);
    ctx.strokeStyle = isTIR ? '#ffffff' : 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = isTIR ? 2.5 : 1.5;
    ctx.shadowBlur = isTIR ? 10 : 0;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(refX, refY);
    ctx.stroke();

    // Refracted Ray (into medium 2)
    if (!isTIR) {
      const traX = cx + rayLength * Math.sin(theta2Rad);
      const traY = cy + rayLength * Math.cos(theta2Rad);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(traX, traY);
      ctx.stroke();
    }

    ctx.shadowBlur = 0;

    // Contact point dot
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fill();

    // Labels
    ctx.font = '11px monospace';
    ctx.fillStyle = '#a3a3a3';
    ctx.fillText(`Medio 1: n₁ = ${n1.toFixed(2)}`, 16, 28);
    ctx.fillText(`Medio 2: n₂ = ${n2.toFixed(2)}`, 16, cy + 28);
    ctx.fillText(`θ₁ = ${theta1Deg.toFixed(1)}°`, incX + 10, incY + 20);

    if (isTIR) {
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px monospace';
      ctx.fillText('¡REFLEXIÓN TOTAL INTERNA (TIR)!', cx - 110, cy + 50);
    } else {
      ctx.fillText(`θ₂ = ${theta2Deg.toFixed(1)}°`, cx + 30, cy + 60);
    }
  }, [n1, n2, theta1Deg, isTIR, theta1Rad, theta2Rad, theta2Deg]);

  return (
    <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-white text-base">Simulador Óptico de Refracción (Ley de Snell)</h3>
          <p className="text-xs text-neutral-400 font-light">
            Trazado de rayos y cálculo analítico de ángulos en interfaz dieléctrica plana.
          </p>
        </div>
        <div className="glass-pill px-3 py-1.5 rounded-xl font-mono text-xs">
          <MathView math="n_1 \sin\theta_1 = n_2 \sin\theta_2" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Canvas Display */}
        <div className="lg:col-span-2 flex items-center justify-center bg-black/60 rounded-2xl border border-white/10 p-2 overflow-hidden">
          <canvas
            ref={canvasRef}
            width={600}
            height={360}
            className="w-full max-w-[600px] h-auto rounded-xl"
          />
        </div>

        {/* Controls and Real-time Metrics */}
        <div className="space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Incident Angle Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-neutral-300">Ángulo Incidente θ₁:</span>
                <span className="text-white font-bold">{theta1Deg}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="89"
                step="0.5"
                value={theta1Deg}
                onChange={e => setTheta1Deg(parseFloat(e.target.value))}
                className="w-full accent-white bg-neutral-800"
              />
            </div>

            {/* n1 Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-neutral-300">Índice n₁ (Medio 1):</span>
                <span className="text-white font-bold">{n1.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="3.0"
                step="0.05"
                value={n1}
                onChange={e => setN1(parseFloat(e.target.value))}
                className="w-full accent-white bg-neutral-800"
              />
              <div className="flex gap-1.5 pt-1">
                {[{ label: 'Aire', val: 1.0 }, { label: 'Agua', val: 1.33 }, { label: 'Vidrio', val: 1.5 }, { label: 'Diamante', val: 2.42 }].map(preset => (
                  <button
                    key={preset.label}
                    onClick={() => setN1(preset.val)}
                    className="text-[10px] px-2 py-0.5 rounded bg-white/[0.05] hover:bg-white/10 text-neutral-300 border border-white/10"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* n2 Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-neutral-300">Índice n₂ (Medio 2):</span>
                <span className="text-white font-bold">{n2.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="3.0"
                step="0.05"
                value={n2}
                onChange={e => setN2(parseFloat(e.target.value))}
                className="w-full accent-white bg-neutral-800"
              />
              <div className="flex gap-1.5 pt-1">
                {[{ label: 'Aire', val: 1.0 }, { label: 'Agua', val: 1.33 }, { label: 'Vidrio', val: 1.5 }, { label: 'Diamante', val: 2.42 }].map(preset => (
                  <button
                    key={preset.label}
                    onClick={() => setN2(preset.val)}
                    className="text-[10px] px-2 py-0.5 rounded bg-white/[0.05] hover:bg-white/10 text-neutral-300 border border-white/10"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Analytical Outputs */}
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-neutral-400">Ángulo Refractado θ₂:</span>
              <span className="text-white font-bold">{isTIR ? 'N/A (TIR)' : `${theta2Deg.toFixed(2)}°`}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Ángulo Crítico θ_c:</span>
              <span className="text-neutral-200">{criticalAngleDeg ? `${criticalAngleDeg.toFixed(2)}°` : 'No existe (n₁ ≤ n₂)'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Ángulo de Brewster θ_B:</span>
              <span className="text-neutral-200">{brewsterAngleDeg.toFixed(2)}°</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
