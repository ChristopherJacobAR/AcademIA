import React, { useState } from 'react';
import { Layers, ChevronDown, ChevronRight, GraduationCap } from 'lucide-react';
import { db } from '@academia/storage';
import { useLiveQuery } from 'dexie-react-hooks';

export const ParallelWavesView: React.FC = () => {
  const [expandedWave, setExpandedWave] = useState<number | null>(1);

  const waves = useLiveQuery(async () => {
    return await db.parallel_waves.orderBy('wave').toArray();
  }, []) ?? [];

  const courses = useLiveQuery(async () => {
    return await db.courses.toArray();
  }, []) ?? [];

  const courseMap = new Map(courses.map(c => [c.id, c]));

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-6">
      <div className="space-y-1">
        <h1 className="text-xl md:text-2xl font-extrabold text-white flex items-center gap-2">
          <Layers className="w-6 h-6 text-indigo-400" />
          Frentes de Aprendizaje Paralelo (14 Bloques Concurrenciales)
        </h1>
        <p className="text-xs md:text-sm text-slate-400">
          Ordenamiento topológico derivado de 540 relaciones directas entre 307 cursos. Las asignaturas de un mismo bloque no tienen dependencias entre sí y pueden cursarse en paralelo.
        </p>
      </div>

      {waves.length === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400 text-sm">
          No hay frentes cargados. Importa el catálogo v5 en el Panel General.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {waves.map(wave => {
            const isExpanded = expandedWave === wave.wave;
            const waveSubjects = wave.subjects || [];

            return (
              <div
                key={wave.wave}
                className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden transition"
              >
                <button
                  onClick={() => setExpandedWave(isExpanded ? null : wave.wave)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-800/40 transition touch-manipulation"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold text-sm flex items-center justify-center">
                      {wave.wave}
                    </span>
                    <div>
                      <h3 className="font-semibold text-white text-sm">
                        Bloque Topológico {wave.wave}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {waveSubjects.length} {waveSubjects.length === 1 ? 'asignatura' : 'asignaturas concurrentes'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="text-xs hidden sm:inline">
                      {isExpanded ? 'Ocultar' : 'Ver asignaturas'}
                    </span>
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-800/60 bg-slate-950/40">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 mt-2">
                      {waveSubjects.map(subjectId => {
                        const course = courseMap.get(subjectId);
                        const discipline = course?.discipline || 'General';

                        const badgeColor =
                          discipline === 'Física'
                            ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                            : discipline === 'Matemáticas'
                            ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                            : discipline === 'Química'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20';

                        return (
                          <div
                            key={subjectId}
                            className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-mono text-xs text-slate-400 font-bold">{subjectId}</span>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded border ${badgeColor}`}>
                                  {discipline}
                                </span>
                              </div>
                              <h4 className="text-xs font-semibold text-slate-200 line-clamp-2">
                                {course?.name || subjectId}
                              </h4>
                            </div>

                            {course?.academic_level && (
                              <div className="mt-2 text-[10px] text-slate-500 flex items-center gap-1">
                                <GraduationCap className="w-3 h-3" />
                                <span>{course.academic_level}</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
