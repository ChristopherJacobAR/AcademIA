import React, { useState } from 'react';
import { Variable, HelpCircle, Sparkles, BookOpen, Send } from 'lucide-react';
import { MathView } from '../components/MathView.js';
import { GeminiService } from '../services/geminiService.js';

export const ConceptKaTeXView: React.FC = () => {
  const [activeRecallRevealed, setActiveRecallRevealed] = useState(false);
  const [userHypothesis, setUserHypothesis] = useState('');
  const [feynmanText, setFeynmanText] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [evaluatedFeynman, setEvaluatedFeynman] = useState<{
    score: number;
    feedback: string[];
    rubricScores: { [key: string]: number };
    isAI?: boolean;
    recommendation?: string;
  } | null>(null);

  const [sandboxLatex, setSandboxLatex] = useState(
    '\\nabla \\times \\mathbf{B} = \\mu_0 \\mathbf{J} + \\mu_0 \\varepsilon_0 \\frac{\\partial \\mathbf{E}}{\\partial t}'
  );

  const handleEvaluateFeynman = async () => {
    if (!feynmanText.trim()) return;
    setEvaluating(true);

    try {
      if (GeminiService.hasKey()) {
        const aiResult = await GeminiService.evaluateFeynmanWithGemini(
          'Ley de Snell y refracción en medios dieléctricos',
          feynmanText
        );
        setEvaluatedFeynman({
          score: aiResult.score,
          feedback: aiResult.feedback,
          rubricScores: {
            'Exactitud Conceptual (30%)': aiResult.rubricScores.exactitud,
            'Supuestos y Límites (20%)': aiResult.rubricScores.supuestos,
            'Rigor Deductivo (20%)': aiResult.rubricScores.deduccion,
            'Claridad Causal (15%)': aiResult.rubricScores.causalidad,
            'Transferencia Interdisciplinar (15%)': aiResult.rubricScores.transferencia
          },
          isAI: true,
          recommendation: aiResult.recommendation
        });
        return;
      }
    } catch (err) {
      console.warn('Gemini eval fallback to heuristic:', err);
    } finally {
      setEvaluating(false);
    }

    // Heuristic Fallback
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

    setEvaluatedFeynman({ score: total, feedback, rubricScores, isAI: false });
    setEvaluating(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-8">
      {/* Title */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-white text-[11px] font-mono tracking-wider">
          DEMOSTRACIÓN FORMAL • KATEX & FEYNMAN
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5 tracking-tight">
          <Variable className="w-7 h-7 text-white" />
          Ley de Snell y Refracción en Medios Dieléctricos
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 font-light mt-1">
          Código: <span className="text-white font-mono">CONCEPT.FIS.OPTICA.SNELL</span> • Asignatura: <span className="text-white font-mono">FIS-096</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Mathematical Exposition */}
        <div className="lg:col-span-2 space-y-5">
          {/* Active Recall Prediction Phase */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 font-mono">
                <HelpCircle className="w-4 h-4 text-neutral-400" />
                Paso 1: Predicción e Intuición (Active Recall)
              </span>
              <span className="text-[11px] text-neutral-500 font-light">Antes de ver la derivación</span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-light">
              Si un rayo de luz viaja del aire (<MathView math="n_1 \approx 1.0" />) al agua (<MathView math="n_2 \approx 1.33" />), ¿se acerca o se aleja de la normal? ¿Qué propiedad de la onda permanece invariante: frecuencia, longitud de onda o velocidad?
            </p>
            <textarea
              rows={2}
              placeholder="Escribe tu hipótesis antes de revelar la solución formal..."
              value={userHypothesis}
              onChange={e => setUserHypothesis(e.target.value)}
              className="glass-input w-full p-3 rounded-xl text-xs text-white placeholder-neutral-500 font-light"
            />
            <button
              onClick={() => setActiveRecallRevealed(!activeRecallRevealed)}
              className="px-4 py-2 rounded-xl bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition shadow-lg shadow-white/10"
            >
              {activeRecallRevealed ? 'Ocultar deducción formal' : 'Verificar deducción matemática'}
            </button>
          </div>

          {/* Mathematical Derivation Card with KaTeX */}
          {activeRecallRevealed && (
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/15 space-y-4 animate-in fade-in">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-white" />
                Deducción Mediante Continuidad de Fase en la Interfaz
              </h3>

              <div className="space-y-3.5 text-xs sm:text-sm text-neutral-300 leading-relaxed font-light">
                <p>
                  Consideremos una onda electromagnética plana monocromática incidente sobre una interfaz plana en <MathView math="z = 0" /> entre dos medios dieléctricos lineales, homogéneos e isotrópicos con índices de refracción <MathView math="n_1" /> y <MathView math="n_2" />.
                </p>

                <div className="p-5 rounded-2xl bg-black/60 border border-white/10 text-center space-y-2">
                  <div className="text-xs text-neutral-400 font-mono">Ecuación fundamental de la ley de Snell:</div>
                  <MathView math="n_1 \sin\theta_1 = n_2 \sin\theta_2" block className="text-xl text-white font-bold" />
                </div>

                <p>
                  Para satisfacer las condiciones de frontera de Maxwell para todo tiempo <MathView math="t" /> y cualquier posición tangencial <MathView math="\mathbf{r}_\parallel" />, las fases temporales y espaciales deben igualarse:
                </p>

                <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-center">
                  <MathView math="\mathbf{k}_1 \cdot \mathbf{r}_\parallel = \mathbf{k}_2 \cdot \mathbf{r}_\parallel \implies k_1 \sin\theta_1 = k_2 \sin\theta_2" block className="text-sm text-neutral-200 font-mono" />
                </div>

                <p>
                  Dado que el número de onda es <MathView math="k = \frac{\omega}{v} = \frac{\omega n}{c}" /> y la frecuencia angular <MathView math="\omega" /> se conserva estrictamente por linealidad temporal:
                </p>

                <div className="p-4 rounded-xl bg-black/60 border border-white/10 text-center">
                  <MathView math="\frac{\omega n_1}{c}\sin\theta_1 = \frac{\omega n_2}{c}\sin\theta_2 \iff n_1 \sin\theta_1 = n_2 \sin\theta_2 \quad \blacksquare" block className="text-base text-white font-bold" />
                </div>
              </div>

              {/* Assumptions Box */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 text-xs text-neutral-300 space-y-1 font-light">
                <strong className="block text-white font-semibold">Límites de Validez y Supuestos:</strong>
                <ul className="list-disc list-inside space-y-1 text-neutral-400">
                  <li>Medios isotrópicos (en cristales anisótropos ocurre birrefringencia con índices ordinario y extraordinario).</li>
                  <li>Interfaz plana sin rugosidad comparable a la longitud de onda.</li>
                  <li>Régimen lineal de baja intensidad óptica (no óptica no lineal Kerr/Pockels).</li>
                </ul>
              </div>
            </div>
          )}

          {/* Interactive KaTeX Formula Sandbox */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-3.5">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2 font-mono">
              <Sparkles className="w-4 h-4 text-white" />
              Lienzo KaTeX Interactivo
            </h3>
            <p className="text-xs text-neutral-400 font-light">
              Escribe cualquier ecuación matemática en LaTeX para verificar renderizado KaTeX en iPad y Windows:
            </p>
            <input
              type="text"
              value={sandboxLatex}
              onChange={e => setSandboxLatex(e.target.value)}
              className="glass-input w-full px-4 py-2.5 rounded-xl text-xs font-mono text-white"
            />
            <div className="p-6 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-center min-h-[72px] text-center overflow-x-auto">
              <MathView math={sandboxLatex} block className="text-base text-white font-medium" />
            </div>
          </div>
        </div>

        {/* Right Column: Structured Feynman Teach-Back */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4 flex flex-col justify-between">
          <div className="space-y-3.5">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-white text-black flex items-center justify-center font-bold text-xs font-mono">
                F
              </span>
              <div>
                <h3 className="font-bold text-white text-sm">Explica como Feynman</h3>
                <span className="text-[10px] text-neutral-400 font-mono">
                  {GeminiService.hasKey() ? 'Evaluador Gemini IA Activo' : 'Rúbrica Cuantitativa'}
                </span>
              </div>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed font-light">
              Explica la refracción como si se la enseñaras a un estudiante de bachillerato. Incluye: analogía intuitiva, límites donde falla la analogía y conexión con la conservación de fase.
            </p>

            <textarea
              rows={8}
              placeholder="Ejemplo: 'Imagina un carrito de compras que avanza del pavimento al césped en ángulo. La primera llanta que entra al césped se frena...'"
              value={feynmanText}
              onChange={e => setFeynmanText(e.target.value)}
              className="glass-input w-full p-3.5 rounded-xl text-xs text-white placeholder-neutral-500 font-light"
            />

            <button
              onClick={handleEvaluateFeynman}
              disabled={evaluating || !feynmanText.trim()}
              className="w-full py-3 rounded-xl bg-white text-black font-semibold text-xs hover:bg-neutral-200 disabled:opacity-30 transition flex items-center justify-center gap-2 shadow-lg shadow-white/10"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{evaluating ? 'Evaluando con IA...' : 'Evaluar con Rúbrica Feynman'}</span>
            </button>

            {evaluatedFeynman && (
              <div className="mt-3.5 p-4 rounded-2xl bg-white/[0.03] border border-white/15 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white flex items-center gap-1.5">
                    {evaluatedFeynman.isAI && <Sparkles className="w-3.5 h-3.5 text-neutral-300" />}
                    Puntaje de Rúbrica:
                  </span>
                  <span className="text-lg font-black text-white">{evaluatedFeynman.score} / 100</span>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-white/10 text-[11px]">
                  {Object.entries(evaluatedFeynman.rubricScores).map(([name, score]) => (
                    <div key={name} className="flex justify-between text-neutral-400">
                      <span>{name}</span>
                      <span className="font-mono font-bold text-white">{score} pts</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-white/10 space-y-1">
                  {evaluatedFeynman.feedback.map((f, i) => (
                    <p key={i} className="text-[11px] text-neutral-300 font-light">{f}</p>
                  ))}
                </div>

                {evaluatedFeynman.recommendation && (
                  <p className="pt-2 border-t border-white/10 text-[11px] text-white font-medium italic">
                    Recomendación: {evaluatedFeynman.recommendation}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-[11px] text-neutral-400 font-light">
            Invariante pedagógico: ningún modelo sustituye la demostración formal y resolución de problemas.
          </div>
        </div>
      </div>
    </div>
  );
};
