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
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-8">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5 tracking-tight">
          <Layers className="w-7 h-7 text-white" />
          14 Frentes de Aprendizaje Paralelo
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 font-light mt-1">
          Ordenamiento topológico derivado de 540 relaciones directas entre 307 cursos. Asignaturas del mismo bloque carecen de dependencias mutuas y pueden cursarse concurrentemente.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {waves.map(wave => {
          const isExpanded = expandedWave === wave.wave;
          const waveSubjects = wave.subjects || [];

          return (
            <div
              key={wave.wave}
              className="glass-panel rounded-2xl overflow-hidden transition-all duration-200 border border-white/[0.08]"
            >
              <button
                onClick={() => setExpandedWave(isExpanded ? null : wave.wave)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/[0.04] transition touch-manipulation"
              >
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 rounded-xl bg-white text-black font-extrabold text-xs flex items-center justify-center font-mono">
                    {wave.wave}
                  </span>
                  <div>
                    <h3 className="font-bold text-white text-sm">
                      Bloque Concurrente {wave.wave}
                    </h3>
                    <p className="text-xs text-neutral-400 font-light">
                      {waveSubjects.length} {waveSubjects.length === 1 ? 'asignatura disponible' : 'asignaturas independientes'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-neutral-400">
                  <span className="text-xs font-light hidden sm:inline">
                    {isExpanded ? 'Colapsar' : 'Ver asignaturas'}
                  </span>
                  {isExpanded ? <ChevronDown className="w-4 h-4 text-white" /> : <ChevronRight className="w-4 h-4" />}
                </div>
              </button>

              {isExpanded && (
                <div className="px-6 pb-6 pt-2 border-t border-white/[0.06] bg-black/40">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-3">
                    {waveSubjects.map(subjectId => {
                      const course = courseMap.get(subjectId);
                      const discipline = course?.discipline || 'General';

                      return (
                        <div
                          key={subjectId}
                          className="glass-card p-3.5 rounded-xl flex flex-col justify-between"
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-xs text-white font-bold">{subjectId}</span>
                              <span className="text-[9px] uppercase px-1.5 py-0.5 rounded border border-white/10 text-neutral-300 font-mono">
                                {discipline}
                              </span>
                            </div>
                            <h4 className="text-xs font-semibold text-neutral-200 line-clamp-2 leading-snug">
                              {course?.name || subjectId}
                            </h4>
                          </div>

                          {course?.academic_level && (
                            <div className="mt-3 text-[10px] text-neutral-500 font-light flex items-center gap-1">
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
    </div>
  );
};
