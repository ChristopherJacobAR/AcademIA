import React, { useState } from 'react';
import {
  GraduationCap,
  Layers,
  FileText,
  AlertTriangle,
  Gamepad2,
  CheckCircle2,
  Upload,
  RefreshCw,
  ShieldCheck,
  Cpu,
  BookOpen
} from 'lucide-react';
import { db, BatchImporter } from '@academia/storage';
import { useLiveQuery } from 'dexie-react-hooks';

interface DashboardViewProps {
  onNavigateTab: (tab: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigateTab }) => {
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState<{ phase: string; percentage: number } | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  // Live query counts from IndexedDB
  const coursesCount = useLiveQuery(async () => await db.courses.count(), []) ?? 0;
  const edgesCount = useLiveQuery(async () => await db.prerequisite_edges.count(), []) ?? 0;
  const wavesCount = useLiveQuery(async () => await db.parallel_waves.count(), []) ?? 0;
  const recordsCount = useLiveQuery(async () => await db.source_records.count(), []) ?? 0;
  const alertsCount = useLiveQuery(async () => await db.audit_alerts.count(), []) ?? 0;

  // Breakdown by track from IndexedDB
  const trackCounts = useLiveQuery(async () => {
    const base = await db.source_records.where('track').equals('BASE').count();
    const tech = await db.source_records.where('track').equals('TECH').count();
    const udeg = await db.source_records.where('track').equals('UDEG_LITERAL').count();
    const prop = await db.source_records.where('track').equals('PROPUESTA_V5').count();
    return { base, tech, udeg, prop };
  }, []) ?? { base: 0, tech: 0, udeg: 0, prop: 0 };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setImporting(true);
      setImportError(null);
      setImportProgress({ phase: 'Leyendo archivo JSON...', percentage: 0 });

      const text = await file.text();
      const payload = JSON.parse(text);

      const importer = new BatchImporter(db);
      await importer.importCatalog(payload, (p) => {
        setImportProgress({ phase: p.phase, percentage: p.percentage });
      });

      setImportProgress({ phase: '¡Importación finalizada con éxito!', percentage: 100 });
      setTimeout(() => setImportProgress(null), 3000);
    } catch (err: any) {
      console.error('Import error:', err);
      setImportError(err.message || 'Error al procesar el archivo');
    } finally {
      setImporting(false);
    }
  };

  const handleClearDatabase = async () => {
    if (window.confirm('¿Seguro que deseas reiniciar la base de datos local? Ningún archivo fuente se perderá en disco.')) {
      await db.courses.clear();
      await db.prerequisite_edges.clear();
      await db.parallel_waves.clear();
      await db.source_records.clear();
      await db.audit_alerts.clear();
      await db.system_metadata.clear();
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 p-6 md:p-8">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            Integridad Curricular Inmutable — Presupuesto 0 MXN/mes
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Academia Científica IA — Arquitectura v2.0
          </h1>
          <p className="text-sm md:text-base text-slate-300 leading-relaxed">
            Sistema personal de aprendizaje científico exigente para <span className="text-sky-400 font-semibold">Física</span>,{' '}
            <span className="text-purple-400 font-semibold">Matemáticas</span>, <span className="text-emerald-400 font-semibold">Química</span> e{' '}
            <span className="text-amber-400 font-semibold">Ingeniería</span>. Con 14 frentes paralelos, active recall riguroso, método Feynman y 18 videojuegos con física diferencial.
          </p>
        </div>
      </div>

      {/* Import / Database Status Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-sky-400" />
              Estado de la Base Local (IndexedDB)
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Almacenamiento durable en el navegador del iPad y Windows. No depende de conexión ni servidores.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition touch-manipulation">
              <Upload className="w-4 h-4" />
              <span>Importar Catálogo v5 (.json)</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                disabled={importing}
                className="hidden"
              />
            </label>

            {recordsCount > 0 && (
              <button
                onClick={handleClearDatabase}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-red-500/20 hover:text-red-300 text-slate-400 text-xs font-medium border border-slate-700/60 transition"
              >
                Limpiar datos locales
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {importProgress && (
          <div className="mt-4 p-4 rounded-xl bg-slate-950/80 border border-indigo-500/30 space-y-2">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-indigo-300">{importProgress.phase}</span>
              <span className="text-slate-400">{importProgress.percentage}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-indigo-500 h-full transition-all duration-300"
                style={{ width: `${importProgress.percentage}%` }}
              />
            </div>
          </div>
        )}

        {importError && (
          <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
            {importError}
          </div>
        )}

        {recordsCount === 0 && !importing && (
          <div className="mt-4 p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="text-xs text-indigo-200">
              💡 La base IndexedDB está vacía. Selecciona tu archivo <code className="bg-indigo-900/50 px-1 py-0.5 rounded text-indigo-300">Academia_FISICA_v5_catalogo_integro.json</code> para poblar los 9,137 registros y 307 materias.
            </div>
          </div>
        )}
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Asignaturas */}
        <div
          onClick={() => onNavigateTab('courses')}
          className="cursor-pointer bg-slate-900/70 border border-slate-800 hover:border-sky-500/40 rounded-xl p-4 transition group"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-sky-400">
            <GraduationCap className="w-5 h-5" />
            <span className="text-[10px] uppercase font-semibold text-sky-400/80">Meta: 307</span>
          </div>
          <div className="text-2xl font-bold text-white mt-2">
            {coursesCount}
          </div>
          <div className="text-xs text-slate-400 mt-0.5">Asignaturas</div>
        </div>

        {/* Relaciones DAG */}
        <div
          onClick={() => onNavigateTab('courses')}
          className="cursor-pointer bg-slate-900/70 border border-slate-800 hover:border-indigo-500/40 rounded-xl p-4 transition group"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-indigo-400">
            <Cpu className="w-5 h-5" />
            <span className="text-[10px] uppercase font-semibold text-indigo-400/80">Meta: 540</span>
          </div>
          <div className="text-2xl font-bold text-white mt-2">
            {edgesCount}
          </div>
          <div className="text-xs text-slate-400 mt-0.5">Relaciones DAG</div>
        </div>

        {/* Frentes */}
        <div
          onClick={() => onNavigateTab('waves')}
          className="cursor-pointer bg-slate-900/70 border border-slate-800 hover:border-purple-500/40 rounded-xl p-4 transition group"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-purple-400">
            <Layers className="w-5 h-5" />
            <span className="text-[10px] uppercase font-semibold text-purple-400/80">Meta: 14</span>
          </div>
          <div className="text-2xl font-bold text-white mt-2">
            {wavesCount}
          </div>
          <div className="text-xs text-slate-400 mt-0.5">Frentes Paralelos</div>
        </div>

        {/* Registros Fuente */}
        <div
          onClick={() => onNavigateTab('records')}
          className="cursor-pointer bg-slate-900/70 border border-slate-800 hover:border-emerald-500/40 rounded-xl p-4 transition group"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-emerald-400">
            <FileText className="w-5 h-5" />
            <span className="text-[10px] uppercase font-semibold text-emerald-400/80">Meta: 9,137</span>
          </div>
          <div className="text-2xl font-bold text-white mt-2">
            {recordsCount.toLocaleString()}
          </div>
          <div className="text-xs text-slate-400 mt-0.5">Registros Fuente</div>
        </div>

        {/* Alertas */}
        <div
          onClick={() => onNavigateTab('alerts')}
          className="cursor-pointer bg-slate-900/70 border border-slate-800 hover:border-amber-500/40 rounded-xl p-4 transition group"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-amber-400">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <span className="text-[10px] uppercase font-semibold text-amber-400/80">Meta: 112</span>
          </div>
          <div className="text-2xl font-bold text-amber-400 mt-2">
            {alertsCount}
          </div>
          <div className="text-xs text-slate-400 mt-0.5">Alertas Auditoría</div>
        </div>

        {/* Arcade */}
        <div
          onClick={() => onNavigateTab('arcade')}
          className="cursor-pointer bg-slate-900/70 border border-slate-800 hover:border-pink-500/40 rounded-xl p-4 transition group"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-pink-400">
            <Gamepad2 className="w-5 h-5 text-pink-400" />
            <span className="text-[10px] uppercase font-semibold text-pink-400/80">Física Real</span>
          </div>
          <div className="text-2xl font-bold text-pink-400 mt-2">
            18
          </div>
          <div className="text-xs text-slate-400 mt-0.5">Juegos Planeados</div>
        </div>
      </div>

      {/* Invariants & Tracks Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Source Breakdown */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            Desglose Inmutable de Registros (Invariante 9,137)
          </h3>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
              <div>
                <span className="font-semibold text-slate-200">Temas Base Excel</span>
                <span className="text-slate-500 block text-[11px]">Plan base original (3,695 temas literales)</span>
              </div>
              <span className="font-mono font-bold text-sky-400">{trackCounts.base} / 3,695</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
              <div>
                <span className="font-semibold text-slate-200">Epígrafes TECH Universidad</span>
                <span className="text-slate-500 block text-[11px]">Epígrafes detallados por página (3,313 registros)</span>
              </div>
              <span className="font-mono font-bold text-indigo-400">{trackCounts.tech} / 3,313</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
              <div>
                <span className="font-semibold text-slate-200">Líneas Temáticas UdeG</span>
                <span className="text-slate-500 block text-[11px]">Líneas de contenido UdeG (1,609 registros literales)</span>
              </div>
              <span className="font-mono font-bold text-purple-400">{trackCounts.udeg} / 1,609</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
              <div>
                <span className="font-semibold text-slate-200">Propuestas v5 Ampliadas</span>
                <span className="text-slate-500 block text-[11px]">52 módulos en 4 disciplinas (520 propuestas)</span>
              </div>
              <span className="font-mono font-bold text-emerald-400">{trackCounts.prop} / 520</span>
            </div>
          </div>
        </div>

        {/* Pedagogical Mandates */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-purple-400" />
            Mandatos de Pedagogía y Evaluación Científica
          </h3>
          <div className="space-y-2 text-xs text-slate-300">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">Ciclo de Aprendizaje Completo:</strong>
                Investigar → Comprender → Demostrar → Aplicar → Recordar (Active recall + FSRS).
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">Técnica Feynman con Rúbrica Cuantitativa:</strong>
                30% exactitud, 20% supuestos/límites, 20% rigor deductivo, 15% causalidad, 15% transferencia.
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">Ciencia con Modelos Deterministas:</strong>
                Las simulaciones no son dibujos estáticos; validan ecuaciones diferenciales, dimensiones y unidades (SI).
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
