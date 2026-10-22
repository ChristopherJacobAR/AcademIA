import React, { useState } from 'react';
import {
  GraduationCap,
  Search,
  ArrowRight,
  ArrowLeft,
  X,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { db } from '@academia/storage';
import { useLiveQuery } from 'dexie-react-hooks';
import { Course, SourceRecord } from '@academia/core';
import { GeminiService } from '../services/geminiService.js';

export const CoursesView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('ALL');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Topic search inside modal
  const [topicSearch, setTopicSearch] = useState('');
  const [explainingTopicId, setExplainingTopicId] = useState<string | null>(null);
  const [topicExplanation, setTopicExplanation] = useState<{ topicId: string; text: string } | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const courses = useLiveQuery(async () => {
    return await db.courses.toArray();
  }, []) ?? [];

  const edges = useLiveQuery(async () => {
    return await db.prerequisite_edges.toArray();
  }, []) ?? [];

  // Topics for selected course - directly query IndexedDB
  const selectedCourseTopics = useLiveQuery(async () => {
    if (!selectedCourse) return [];
    return await db.source_records
      .where('subject_id')
      .equals(selectedCourse.id)
      .sortBy('position');
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

  const filteredTopics = selectedCourseTopics.filter(t => {
    if (!topicSearch.trim()) return true;
    const lower = topicSearch.toLowerCase();
    return t.text.toLowerCase().includes(lower) || t.id.toLowerCase().includes(lower) || (t.module && t.module.toLowerCase().includes(lower));
  });

  const handleExplainWithGemini = async (topic: SourceRecord) => {
    setAiError(null);
    setExplainingTopicId(topic.id);
    try {
      const explanation = await GeminiService.explainTopic(topic.text, selectedCourse?.name || '');
      setTopicExplanation({ topicId: topic.id, text: explanation });
    } catch (err: any) {
      setAiError(err.message || 'Error al conectar con Gemini. Configura tu API Key en el botón "IA & Nube".');
    } finally {
      setExplainingTopicId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5 tracking-tight">
            <GraduationCap className="w-7 h-7 text-white" />
            307 Asignaturas Científicas
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 font-light mt-1">
            Cada materia contiene su temario íntegro sin omisión de contenidos, requisitos directos y conexiones en el grafo.
          </p>
        </div>

        {/* Discipline Filter Pills in Minimalist B&W */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {['ALL', 'Física', 'Matemáticas', 'Química', 'Ingeniería'].map(disc => (
            <button
              key={disc}
              onClick={() => setSelectedDiscipline(disc)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                selectedDiscipline === disc
                  ? 'bg-white text-black font-semibold shadow-md shadow-white/10'
                  : 'glass-pill hover:bg-white/10 text-neutral-300'
              }`}
            >
              {disc === 'ALL' ? 'Todas' : disc}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-4 top-3.5 text-neutral-500" />
        <input
          type="text"
          placeholder="Buscar asignatura por nombre o código (ej: FIS-096, Mecánica Cuántica, Cálculo, Termodinámica)..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="glass-input w-full pl-11 pr-4 py-3 rounded-2xl text-xs sm:text-sm text-white placeholder-neutral-500 font-light"
        />
      </div>

      {/* Grid of Courses */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredCourses.map(course => (
          <div
            key={course.id}
            onClick={() => {
              setSelectedCourse(course);
              setTopicSearch('');
              setTopicExplanation(null);
              setAiError(null);
            }}
            className="glass-card rounded-2xl p-5 cursor-pointer flex flex-col justify-between group touch-manipulation"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-white tracking-wider">{course.id}</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-neutral-300">
                  {course.discipline}
                </span>
              </div>
              <h3 className="font-bold text-white text-sm group-hover:text-neutral-200 transition leading-snug">
                {course.name}
              </h3>
            </div>

            <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-neutral-400">
              <span className="text-[11px] font-light">{course.academic_level || 'Nivel Superior'}</span>
              <span className="text-white font-medium flex items-center gap-1 group-hover:translate-x-1 transition text-xs">
                Ver temario completo →
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="p-12 text-center rounded-2xl glass-panel text-neutral-400 text-xs">
          No se encontraron asignaturas con los criterios actuales.
        </div>
      )}

      {/* Course Detail Modal (Temario Completo Sin Falta de Ningún Tema) */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <div className="glass-panel rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-white/15 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold bg-white text-black px-2 py-0.5 rounded">
                    {selectedCourse.id}
                  </span>
                  <span className="text-xs text-neutral-400 font-mono">
                    {selectedCourse.discipline} • Bloque {selectedCourse.parallel_wave || 1}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  {selectedCourse.name}
                </h2>
              </div>
              <button
                onClick={() => setSelectedCourse(null)}
                className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-neutral-300">
              {/* DAG Connections */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-1.5">
                  <span className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                    <ArrowLeft className="w-3.5 h-3.5 text-neutral-400" />
                    Prerrequisitos Requeridos ({prerequisites.length}):
                  </span>
                  {prerequisites.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {prerequisites.map(p => (
                        <span key={p} className="font-mono text-[10px] bg-white/10 text-white px-2 py-0.5 rounded border border-white/10">
                          {p}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-neutral-500 text-[11px] block">Materia inicial (sin requisitos previos)</span>
                  )}
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-1.5">
                  <span className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
                    Materias Habilitadas ({dependents.length}):
                  </span>
                  {dependents.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {dependents.map(d => (
                        <span key={d} className="font-mono text-[10px] bg-white/10 text-white px-2 py-0.5 rounded border border-white/10">
                          {d}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-neutral-500 text-[11px] block">Materia terminal o avanzada</span>
                  )}
                </div>
              </div>

              {/* Complete Topics List */}
              <div className="space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-white" />
                    Temario Completo Registrado ({selectedCourseTopics.length} temas)
                  </h3>
                  <div className="w-full sm:w-64">
                    <input
                      type="text"
                      placeholder="Filtrar temas de esta materia..."
                      value={topicSearch}
                      onChange={e => setTopicSearch(e.target.value)}
                      className="glass-input w-full px-3 py-1.5 rounded-xl text-xs"
                    />
                  </div>
                </div>

                {aiError && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
                    {aiError}
                  </div>
                )}

                <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1 divide-y divide-white/[0.05]">
                  {filteredTopics.map((topic, index) => (
                    <div key={topic.id} className="pt-3 pb-3 space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] text-neutral-400 font-bold">
                              #{topic.position || index + 1} • {topic.id}
                            </span>
                            <span className="text-[9px] uppercase px-1.5 py-0.5 rounded border border-white/10 text-neutral-300 font-mono">
                              {topic.track}
                            </span>
                            {topic.module && (
                              <span className="text-[10px] text-neutral-400">
                                [{topic.module}]
                              </span>
                            )}
                          </div>
                          <p className="text-white text-xs sm:text-sm font-medium leading-snug">
                            {topic.text}
                          </p>
                          {topic.source_locator && (
                            <p className="text-[10px] text-neutral-500 font-mono">
                              {topic.source_name} ({topic.source_locator})
                            </p>
                          )}
                        </div>

                        {/* Explain with Gemini Button */}
                        <button
                          onClick={() => handleExplainWithGemini(topic)}
                          disabled={explainingTopicId === topic.id}
                          className="px-2.5 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white text-neutral-300 hover:text-black text-[11px] font-medium border border-white/10 transition shrink-0 flex items-center gap-1.5"
                          title="Explicar con rigor doctoral y analogía intuitiva"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>{explainingTopicId === topic.id ? 'Generando...' : 'Explicar IA'}</span>
                        </button>
                      </div>

                      {/* Displayed Explanation if active */}
                      {topicExplanation?.topicId === topic.id && (
                        <div className="mt-2.5 p-4 rounded-xl bg-white/[0.03] border border-white/15 space-y-2 animate-in fade-in">
                          <div className="flex items-center justify-between text-white font-bold text-xs">
                            <span className="flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-neutral-300" />
                              Explicación Doctoral — Gemini IA
                            </span>
                            <button
                              onClick={() => setTopicExplanation(null)}
                              className="text-neutral-400 hover:text-white"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="text-xs text-neutral-300 whitespace-pre-wrap leading-relaxed font-light">
                            {topicExplanation.text}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {filteredTopics.length === 0 && (
                    <div className="p-8 text-center text-neutral-500 text-xs">
                      No hay temas que coincidan con la búsqueda.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
