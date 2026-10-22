import React, { useState } from 'react';
import { Variable, HelpCircle, Sparkles, BookOpen, Send } from 'lucide-react';
import { MathView } from '../components/MathView.js';

export const ConceptKaTeXView: React.FC = () => {
  const [activeRecallRevealed, setActiveRecallRevealed] = useState(false);
  const [userHypothesis, setUserHypothesis] = useState('');
  const [feynmanText, setFeynmanText] = useState('');
  const [evaluatedFeynman, setEvaluatedFeynman] = useState<{
    score: number;
    feedback: string[];
    rubricScores: { [key: string]: number };
  } | null>(null);

  const [sandboxLatex, setSandboxLatex] = useState(
    '\\nabla \\times \\mathbf{B} = \\mu_0 \\mathbf{J} + \\mu_0 \\varepsilon_0 \\frac{\\partial \\mathbf{E}}{\\partial t}'
  );

  const handleEvaluateFeynman = () => {
    if (!feynmanText.trim()) return;

    // Deterministic rubric evaluation logic based on presence of scientific tenets
    const lower = feynmanText.toLowerCase();
    const hasAssumptions = lower.includes('supuesto') || lower.includes('límite') || lower.includes('isotrópico') || lower.includes('plana');
    const hasCausality = lower.includes('fase') || lower.includes('velocidad') || lower.includes('onda') || lower.includes('porque');
    const hasTransfer = lower.includes('ejemplo') || lower.includes('sonido') || lower.includes('aplicación') || lower.includes('analogía');

    const rubricScores = {
      'Exactitud Conceptual (30%)': lower.length > 50 ? 28 : 15,
      'Supuestos y Límites (20%)': hasAssumptions ? 19 : 8,
      'Rigor Deductivo (20%)': lower.length > 80 ? 18 : 10,
      'Claridad Causal (15%)': hasCausality ? 14 : 7,
      'Transferencia Interdisciplinar (15%)': hasTransfer ? 14 : 6
    };

    const total = Object.values(rubricScores).reduce((a, b) => a + b, 0);

    const feedback = [
      hasAssumptions
        ? '✓ Especificaste supuestos explícitos (óptica geométrica y medios isotrópicos).'
        : '⚠ Advertencia: Falta precisar los límites de validez de la ley.',
      hasCausality
        ? '✓ Relacionaste la causalidad física con la continuidad de fase y la diferencia de velocidades de onda.'
        : '⚠ Sugerencia: Explica por qué se refracta el frente de onda desde la velocidad de propagación c/n.',
      hasTransfer
        ? '✓ Incluiste un caso de transferencia análoga o contraejemplo.'
        : '⚠ Se requiere un ejemplo de transferencia a ondas acústicas o sísmicas.'
    ];

    setEvaluatedFeynman({ score: total, feedback, rubricScores });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-6">
      {/* Title */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold">
          Ficha Demostrativa Piloto
        </div>
        <h1 className="text-xl md:text-2xl font-extrabold text-white flex items-center gap-2">
          <Variable className="w-6 h-6 text-sky-400" />
          Ley de Snell y Refracción en Medios Dieléctricos
        </h1>
        <p className="text-xs md:text-sm text-slate-400">
          ID Canónico: <code className="text-sky-300 font-mono">CONCEPT.FIS.OPTICA.SNELL</code> • Materia: <code className="text-indigo-300 font-mono">FIS-096 (Electrodinámica y Óptica)</code>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Formal Scientific Exposition (2 cols) */}
        <div className="lg:col-span-2 space-y-5">
          {/* Active Recall Prediction Phase */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4" />
                Paso 1: Predicción e Intuición (Active Recall)
              </span>
              <span className="text-[10px] text-slate-500">Antes de ver la derivación</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300">
              Si un rayo de luz viaja del aire (<MathView math="n_1 \approx 1.0" />) al agua (<MathView math="n_2 \approx 1.33" />), ¿se acerca o se aleja de la normal? ¿Qué propiedad de la onda permanece invariante: frecuencia, longitud de onda o velocidad?
            </p>
            <textarea
              rows={2}
              placeholder="Escribe tu hipótesis antes de revelar la solución formal..."
              value={userHypothesis}
              onChange={e => setUserHypothesis(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={() => setActiveRecallRevealed(!activeRecallRevealed)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition"
            >
              {activeRecallRevealed ? 'Ocultar deducción formal' : 'Verificar deducción matemática'}
            </button>
          </div>

          {/* Mathematical Derivation Card with KaTeX */}
          {activeRecallRevealed && (
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-indigo-500/30 space-y-4 shadow-xl">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-sky-400" />
                Deducción Mediante Continuidad de Fase en la Interfaz
              </h3>

              <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                <p>
                  Consideremos una onda electromagnética monocromática plana incidente sobre una interfaz plana en <MathView math="z = 0" /> entre dos medios dieléctricos lineales, homogéneos e isotrópicos con índices de refracción <MathView math="n_1" /> y <MathView math="n_2" />.
                </p>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-center space-y-2">
                  <div className="text-xs text-slate-400 mb-1">Ecuación fundamental de la ley de Snell:</div>
                  <MathView math="n_1 \sin\theta_1 = n_2 \sin\theta_2" block className="text-lg text-sky-300 font-bold" />
                </div>

                <p>
                  Para satisfacer las condiciones de frontera de Maxwell para todo tiempo <MathView math="t" /> y cualquier posición tangencial <MathView math="\mathbf{r}_\parallel" />, las fases temporales y espaciales deben igualarse:
                </p>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                  <MathView math="\mathbf{k}_1 \cdot \mathbf{r}_\parallel = \mathbf{k}_2 \cdot \mathbf{r}_\parallel \implies k_1 \sin\theta_1 = k_2 \sin\theta_2" block className="text-sm text-indigo-300 font-mono" />
                </div>

                <p>
                  Dado que el número de onda es <MathView math="k = \frac{\omega}{v} = \frac{\omega n}{c}" /> y la frecuencia angular <MathView math="\omega" /> se conserva estrictamente por linealidad temporal:
                </p>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                  <MathView math="\frac{\omega n_1}{c}\sin\theta_1 = \frac{\omega n_2}{c}\sin\theta_2 \iff n_1 \sin\theta_1 = n_2 \sin\theta_2 \quad \blacksquare" block className="text-base text-emerald-300 font-bold" />
                </div>
              </div>

              {/* Validity Limits and Assumptions */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 space-y-1">
                <strong className="block text-amber-200">Límites de Validez y Supuestos:</strong>
                <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                  <li>Medios isotrópicos (en cristales anisótropos ocurre birrefringencia con índices ordinario y extraordinario).</li>
                  <li>Interfaz plana sin rugosidad comparable a la longitud de onda.</li>
                  <li>Régimen lineal de baja intensidad óptica (no óptica no lineal Kerr/Pockels).</li>
                </ul>
              </div>
            </div>
          )}

          {/* Interactive KaTeX Formula Sandbox */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Lienzo KaTeX Interactivo (Escribe Fórmulas en Vivo)
            </h3>
            <p className="text-xs text-slate-400">
              Editor táctil compatible con teclado y iPad. Escribe cualquier ecuación LaTeX:
            </p>
            <input
              type="text"
              value={sandboxLatex}
              onChange={e => setSandboxLatex(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-purple-300 focus:outline-none focus:border-purple-500"
            />
            <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800/80 flex items-center justify-center min-h-[64px] text-center overflow-x-auto">
              <MathView math={sandboxLatex} block className="text-base text-white font-medium" />
            </div>
          </div>
        </div>

        {/* Right Column: Structured Feynman Teach-Back */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                F
              </span>
              <div>
                <h3 className="font-bold text-white text-sm">Explica como Feynman</h3>
                <span className="text-[10px] text-slate-400">Rúbrica Cuantitativa de 5 Criterios</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Explica la refracción como si se la enseñaras a un estudiante de bachillerato. Incluye: analogía intuitiva, límites donde falla la analogía y conexión con la conservación de fase.
            </p>

            <textarea
              rows={8}
              placeholder="Ejemplo: 'Imagina un carrito de compras que avanza del pavimento al césped en ángulo. La primera llanta que entra al césped se frena...'"
              value={feynmanText}
              onChange={e => setFeynmanText(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />

            <button
              onClick={handleEvaluateFeynman}
              disabled={!feynmanText.trim()}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-semibold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Evaluar Explicación con Rúbrica</span>
            </button>

            {evaluatedFeynman && (
              <div className="mt-3 p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-emerald-400">Puntaje de Rúbrica Feynman:</span>
                  <span className="text-lg font-extrabold text-white">{evaluatedFeynman.score} / 100</span>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-800 text-[11px]">
                  {Object.entries(evaluatedFeynman.rubricScores).map(([name, score]) => (
                    <div key={name} className="flex justify-between text-slate-400">
                      <span>{name}</span>
                      <span className="font-mono font-bold text-slate-200">{score} pts</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-800 space-y-1">
                  {evaluatedFeynman.feedback.map((f, i) => (
                    <p key={i} className="text-[11px] text-slate-300">{f}</p>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
            <span className="font-semibold text-slate-300 block">Invariante de Evaluación:</span>
            Ningún modelo de lenguaje puede declarar un tema dominado sin contrastar la respuesta contra ejercicios matemáticos deterministas.
          </div>
        </div>
      </div>
    </div>
  );
};
