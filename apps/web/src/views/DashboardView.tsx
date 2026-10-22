import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Layers,
  FileText,
  AlertTriangle,
  Gamepad2,
  Upload,
  RefreshCw,
  Cpu,
  ArrowRight
} from 'lucide-react';
import { db, BatchImporter } from '@academia/storage';
import { useLiveQuery } from 'dexie-react-hooks';
import { ensureCatalogLoaded } from '../services/curriculumLoader.js';

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

  // AUTO-LOAD on first mount if DB is empty!
  useEffect(() => {
    const autoInit = async () => {
      const count = await db.courses.count();
      if (count === 0) {
        setImporting(true);
        try {
          await ensureCatalogLoaded(p => {
            setImportProgress({ phase: p.phase, percentage: p.percentage });
          });
        } catch (err: any) {
          setImportError(err.message);
        } finally {
          setImporting(false);
          setImportProgress(null);
        }
      }
    };
    autoInit();
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setImporting(true);
      setImportError(null);
      setImportProgress({ phase: 'Cargando archivo...', percentage: 0 });

      const text = await file.text();
      const payload = JSON.parse(text);

      const importer = new BatchImporter(db);
      await importer.importCatalog(payload, p => {
        setImportProgress({ phase: p.phase, percentage: p.percentage });
      });

      setImportProgress({ phase: 'Catálogo sincronizado exitosamente', percentage: 100 });
      setTimeout(() => setImportProgress(null), 2000);
    } catch (err: any) {
      console.error('Import error:', err);
      setImportError(err.message || 'Error al procesar el archivo');
    } finally {
      setImporting(false);
    }
  };

  const handleClearDatabase = async () => {
    if (window.confirm('¿Deseas reiniciar la base de datos local del navegador?')) {
      await db.courses.clear();
      await db.prerequisite_edges.clear();
      await db.parallel_waves.clear();
      await db.source_records.clear();
      await db.audit_alerts.clear();
      await db.system_metadata.clear();
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-8">
      {/* Minimalist Glass Hero Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] relative overflow-hidden">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-white text-[11px] font-mono tracking-wider">
            PLAN MAESTRO CURRICULAR v5.0 • MONOCROMO
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Academia Científica IA
          </h1>
          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-light">
            Currículo integral para Física, Matemáticas, Química e Ingeniería. 307 asignaturas organizadas en 14 frentes paralelos con 9,137 temas inmutables y trazabilidad documental total.
          </p>
        </div>
      </div>

      {/* Auto-loading or Syncing Status */}
      {importProgress && (
        <div className="glass-panel p-5 rounded-2xl border border-white/20 space-y-2.5 animate-in fade-in">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-white flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              {importProgress.phase}
            </span>
            <span className="text-neutral-400 font-bold">{importProgress.percentage}%</span>
          </div>
          <div className="w-full bg-white/[0.08] rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-white h-full transition-all duration-300 shadow-[0_0_12px_rgba(255,255,255,0.8)]"
              style={{ width: `${importProgress.percentage}%` }}
            />
          </div>
        </div>
      )}

      {importError && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{importError}</span>
        </div>
      )}

      {/* Key Metric Cards in Glassmorphism Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {[
          { id: 'courses', label: 'Asignaturas', count: coursesCount, target: '307', icon: GraduationCap },
          { id: 'courses', label: 'Relaciones DAG', count: edgesCount, target: '540', icon: Cpu },
          { id: 'waves', label: 'Olas Paralelas', count: wavesCount, target: '14', icon: Layers },
          { id: 'records', label: 'Temas Fuente', count: recordsCount.toLocaleString(), target: '9,137', icon: FileText },
          { id: 'alerts', label: 'Alertas Revisión', count: alertsCount, target: '112', icon: AlertTriangle },
          { id: 'arcade', label: 'Videojuegos', count: 18, target: '18', icon: Gamepad2 }
        ].map(kpi => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              onClick={() => onNavigateTab(kpi.id)}
              className="glass-card rounded-2xl p-4 cursor-pointer group touch-manipulation flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-neutral-400 group-hover:text-white transition">
                <Icon className="w-4 h-4" />
                <span className="text-[10px] font-mono text-neutral-400">{kpi.target} meta</span>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-black text-white tracking-tight">
                  {kpi.count}
                </div>
                <div className="text-xs text-neutral-400 mt-0.5 font-medium">{kpi.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Invariant Breakdown & Direct Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Desglose de Fuentes */}
        <div className="glass-panel rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 tracking-wide">
              <FileText className="w-4 h-4 text-neutral-300" />
              Desglose de Temas Fuente (9,137 en Total)
            </h3>
            <button
              onClick={() => onNavigateTab('records')}
              className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 transition"
            >
              Ver todos <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5">
            {[
              { label: 'Plan Base Excel', desc: '3,695 temas literales originales', count: trackCounts.base, total: 3695 },
              { label: 'TECH Universidad', desc: '3,313 epígrafes por página/capítulo', count: trackCounts.tech, total: 3313 },
              { label: 'UdeG Literal', desc: '1,609 líneas de contenido temático', count: trackCounts.udeg, total: 1609 },
              { label: 'Propuestas v5 Ampliadas', desc: '520 temas en 52 módulos avanzados', count: trackCounts.prop, total: 520 }
            ].map(item => (
              <div
                key={item.label}
                className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-semibold text-white block">{item.label}</span>
                  <span className="text-[11px] text-neutral-400 font-light">{item.desc}</span>
                </div>
                <span className="font-mono text-xs font-bold text-neutral-200">
                  {item.count.toLocaleString()} / {item.total.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Cursos y Navegación Rápida */}
        <div className="glass-panel rounded-3xl p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 tracking-wide">
              <GraduationCap className="w-4 h-4 text-neutral-300" />
              Exploración de Asignaturas y Temarios
            </h3>
            <p className="text-xs text-neutral-300 leading-relaxed font-light">
              Cada una de las 307 asignaturas tiene vinculado su temario completo, requisitos en el grafo y epígrafes. Haz clic abajo para consultar cualquier curso sin falta de ningún tema:
            </p>
            <div className="space-y-2 pt-1">
              <button
                onClick={() => onNavigateTab('courses')}
                className="w-full py-3 px-4 rounded-xl bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition shadow-lg shadow-white/10 flex items-center justify-between touch-manipulation"
              >
                <span>Explorar las 307 Asignaturas con Temario Completo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigateTab('waves')}
                className="w-full py-2.5 px-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white font-medium text-xs border border-white/10 transition flex items-center justify-between touch-manipulation"
              >
                <span>Ver los 14 Frentes de Estudio Paralelo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Database Tools */}
          <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs text-neutral-400">
            <label className="cursor-pointer hover:text-white transition flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5" />
              <span>Importar otro archivo JSON</span>
              <input type="file" accept=".json" onChange={handleFileUpload} disabled={importing} className="hidden" />
            </label>
            {recordsCount > 0 && (
              <button
                onClick={handleClearDatabase}
                className="hover:text-red-400 transition"
              >
                Restablecer datos
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
