import React, { useState } from 'react';
import {
  GraduationCap,
  Search,
  ArrowRight,
  ArrowLeft,
  FileText,
  X
} from 'lucide-react';
import { db } from '@academia/storage';
import { useLiveQuery } from 'dexie-react-hooks';
import { Course } from '@academia/core';

export const CoursesView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('ALL');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const courses = useLiveQuery(async () => {
    return await db.courses.toArray();
  }, []) ?? [];

  const edges = useLiveQuery(async () => {
    return await db.prerequisite_edges.toArray();
  }, []) ?? [];

  // Topics for selected course
  const selectedCourseTopics = useLiveQuery(async () => {
    if (!selectedCourse) return [];
    return await db.source_records.where('subject_id').equals(selectedCourse.id).toArray();
  }, [selectedCourse]) ?? [];

  const filteredCourses = courses.filter(c => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDiscipline = selectedDiscipline === 'ALL' || c.discipline === selectedDiscipline;
    return matchesSearch && matchesDiscipline;
  });

  const prerequisites = edges.filter(e => e.to === selectedCourse?.id).map(e => e.from);
  const dependents = edges.filter(e => e.from === selectedCourse?.id).map(e => e.to);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-white flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-sky-400" />
            Catálogo de 307 Asignaturas Científicas
          </h1>
          <p className="text-xs md:text-sm text-slate-400">
            303 materias base + 4 propuestas previas, organizadas por disciplina y conectadas mediante el grafo DAG.
          </p>
        </div>

        {/* Discipline filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {['ALL', 'Física', 'Matemáticas', 'Química', 'Ingeniería'].map(disc => (
            <button
              key={disc}
              onClick={() => setSelectedDiscipline(disc)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition ${
                selectedDiscipline === disc
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {disc === 'ALL' ? 'Todas' : disc}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar asignatura por nombre o código (ej: FIS-096, Álgebra, Electrodinámica)..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition"
        />
      </div>

      {/* Grid of Courses */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredCourses.map(course => {
          const badgeColor =
            course.discipline === 'Física'
              ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
              : course.discipline === 'Matemáticas'
              ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
              : course.discipline === 'Química'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : 'bg-amber-500/10 text-amber-400 border-amber-500/20';

          return (
            <div
              key={course.id}
              onClick={() => setSelectedCourse(course)}
              className="cursor-pointer bg-slate-900/70 border border-slate-800 hover:border-sky-500/40 rounded-xl p-4 transition flex flex-col justify-between group touch-manipulation"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-300">{course.id}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${badgeColor}`}>
                    {course.discipline}
                  </span>
                </div>
                <h3 className="font-semibold text-white text-sm group-hover:text-sky-300 transition">
                  {course.name}
                </h3>
              </div>

              <div className="mt-4 pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                <span>{course.academic_level || 'Nivel Superior'}</span>
                <span className="text-[11px] text-sky-400 group-hover:translate-x-0.5 transition">
                  Ver detalle →
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCourses.length === 0 && (
        <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400 text-sm">
          No se encontraron asignaturas con los filtros seleccionados.
        </div>
      )}

      {/* Course Detail Modal / Drawer */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
              <div>
                <span className="font-mono text-xs font-bold text-sky-400">{selectedCourse.id}</span>
                <h2 className="text-lg font-bold text-white">{selectedCourse.name}</h2>
              </div>
              <button
                onClick={() => setSelectedCourse(null)}
                className="p-2 rounded-lg bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-300">
              {/* Metadata pills */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Disciplina</span>
                  <span className="font-semibold text-white">{selectedCourse.discipline}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Nivel</span>
                  <span className="font-semibold text-white">{selectedCourse.academic_level || 'Universitario'}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Estado</span>
                  <span className="font-semibold text-white">{selectedCourse.official_status || 'Oficial'}</span>
                </div>
              </div>

              {/* DAG Connections */}
              <div className="space-y-3">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400">
                  Conexiones en el Grafo DAG (540 Relaciones)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                    <span className="text-[11px] font-semibold text-amber-400 flex items-center gap-1">
                      <ArrowLeft className="w-3.5 h-3.5" />
                      Prerrequisitos Requeridos ({prerequisites.length}):
                    </span>
                    {prerequisites.length > 0 ? (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {prerequisites.map(p => (
                          <span key={p} className="font-mono text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-200">
                            {p}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-500 block text-[11px]">Ninguno (Materia inicial o Wave 1)</span>
                    )}
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                    <span className="text-[11px] font-semibold text-sky-400 flex items-center gap-1">
                      <ArrowRight className="w-3.5 h-3.5" />
                      Materias Habilitadas ({dependents.length}):
                    </span>
                    {dependents.length > 0 ? (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {dependents.map(d => (
                          <span key={d} className="font-mono text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-200">
                            {d}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-500 block text-[11px]">Ninguna (Materia terminal o de frente alto)</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Source Topics */}
              <div className="space-y-2">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  Temas y Epígrafes Registrados ({selectedCourseTopics.length}):
                </h4>
                {selectedCourseTopics.length > 0 ? (
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {selectedCourseTopics.map(topic => (
                      <div key={topic.id} className="p-2 rounded-lg bg-slate-950/50 border border-slate-800/80 text-[11px]">
                        <div className="flex items-center justify-between text-slate-500 text-[10px] mb-0.5">
                          <span>{topic.id}</span>
                          <span className="uppercase text-indigo-400">{topic.track}</span>
                        </div>
                        <p className="text-slate-200 font-medium">{topic.text}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-xs italic">
                    Sin registros temáticos importados aún para este curso.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
