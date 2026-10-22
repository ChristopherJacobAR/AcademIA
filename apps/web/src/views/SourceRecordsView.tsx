import React, { useState } from 'react';
import { FileText, Search, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { db } from '@academia/storage';
import { useLiveQuery } from 'dexie-react-hooks';
import { SourceRecord, SourceTrack } from '@academia/core';

export const SourceRecordsView: React.FC = () => {
  const [selectedTrack, setSelectedTrack] = useState<string>('ALL');
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [selectedRecord, setSelectedRecord] = useState<SourceRecord | null>(null);

  const PAGE_SIZE = 50;

  // Query records with filters and pagination
  const records = useLiveQuery(async () => {
    let collection = db.source_records.toCollection();

    if (selectedTrack !== 'ALL') {
      collection = db.source_records.where('track').equals(selectedTrack as SourceTrack);
    }

    let all = await collection.toArray();

    if (selectedDiscipline !== 'ALL') {
      all = all.filter(r => r.discipline === selectedDiscipline);
    }

    if (searchTerm.trim()) {
      const lower = searchTerm.toLowerCase();
      all = all.filter(
        r =>
          r.text.toLowerCase().includes(lower) ||
          r.id.toLowerCase().includes(lower) ||
          r.subject_name.toLowerCase().includes(lower)
      );
    }

    return all;
  }, [selectedTrack, selectedDiscipline, searchTerm]) ?? [];

  const totalPages = Math.ceil(records.length / PAGE_SIZE);
  const paginatedRecords = records.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-6">
      <div className="space-y-1">
        <h1 className="text-xl md:text-2xl font-extrabold text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-emerald-400" />
          Explorador de 9,137 Registros Fuente Inmutables
        </h1>
        <p className="text-xs md:text-sm text-slate-400">
          Garantía de no pérdida: ningún identificador se sobrescribe ni se elimina. Las equivalencias semánticas son relaciones M:N.
        </p>
      </div>

      {/* Filter Tabs by Track */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { id: 'ALL', label: 'Todos los Registros' },
          { id: 'BASE', label: 'Base Excel (3,695)' },
          { id: 'TECH', label: 'TECH Universidad (3,313)' },
          { id: 'UDEG_LITERAL', label: 'UdeG Literal (1,609)' },
          { id: 'PROPUESTA_V5', label: 'Propuestas v5 (520)' }
        ].map(track => (
          <button
            key={track.id}
            onClick={() => {
              setSelectedTrack(track.id);
              setPage(0);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedTrack === track.id
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {track.label}
          </button>
        ))}
      </div>

      {/* Search and Secondary Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por texto del tema, ID (ej. LIC-21-0035, EXT-M052) o asignatura..."
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
              setPage(0);
            }}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {['ALL', 'Física', 'Matemáticas', 'Química', 'Ingeniería'].map(disc => (
            <button
              key={disc}
              onClick={() => {
                setSelectedDiscipline(disc);
                setPage(0);
              }}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition ${
                selectedDiscipline === disc
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {disc === 'ALL' ? 'Todas las áreas' : disc}
            </button>
          ))}
        </div>
      </div>

      {/* Records Count & Pagination Info */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>
          Mostrando {records.length.toLocaleString()} resultados{' '}
          {records.length > 0 && `(Página ${page + 1} de ${Math.max(1, totalPages)})`}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-400 disabled:opacity-30 hover:text-white"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-400 disabled:opacity-30 hover:text-white"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Table / List of Records */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800/80">
        {paginatedRecords.map(record => {
          const trackBadge =
            record.track === 'BASE'
              ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
              : record.track === 'TECH'
              ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
              : record.track === 'UDEG_LITERAL'
              ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';

          return (
            <div
              key={record.id}
              onClick={() => setSelectedRecord(record)}
              className="p-4 hover:bg-slate-800/40 cursor-pointer transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs touch-manipulation"
            >
              <div className="space-y-1 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono font-bold text-slate-300">{record.id}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${trackBadge}`}>
                    {record.track}
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400 font-medium">{record.discipline}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400">{record.subject_name}</span>
                </div>
                <p className="text-white text-sm font-semibold line-clamp-2">{record.text}</p>
                {record.source_locator && (
                  <p className="text-[11px] text-slate-500">
                    Localizador: {record.source_locator} ({record.source_name})
                  </p>
                )}
              </div>

              <div className="shrink-0 text-right sm:text-right text-[11px] text-slate-400">
                <span className="inline-block px-2 py-1 rounded bg-slate-950/80 border border-slate-800 font-mono text-[10px] text-slate-400">
                  {record.classification || 'literal'}
                </span>
              </div>
            </div>
          );
        })}

        {paginatedRecords.length === 0 && (
          <div className="p-8 text-center text-slate-500 text-xs">
            No se encontraron registros fuente con los criterios de búsqueda.
          </div>
        )}
      </div>

      {/* Record Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-xs animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="font-mono text-emerald-400 font-bold">{selectedRecord.id}</span>
                <h3 className="font-bold text-white text-base mt-0.5">Ficha de Registro Inmutable</h3>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Texto Original Literal</span>
              <p className="text-sm font-semibold text-white leading-snug">{selectedRecord.text}</p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800">
                <span className="text-slate-500 text-[10px] block">Track de Origen</span>
                <span className="font-semibold text-slate-200">{selectedRecord.track}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800">
                <span className="text-slate-500 text-[10px] block">Disciplina</span>
                <span className="font-semibold text-slate-200">{selectedRecord.discipline}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800">
                <span className="text-slate-500 text-[10px] block">Asignatura</span>
                <span className="font-semibold text-slate-200">{selectedRecord.subject_name} ({selectedRecord.subject_id})</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800">
                <span className="text-slate-500 text-[10px] block">Módulo / Sección</span>
                <span className="font-semibold text-slate-200">{selectedRecord.module || 'Tronco General'}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Procedencia y Auditoría</span>
              <p className="text-slate-300"><strong>Fuente:</strong> {selectedRecord.source_name}</p>
              <p className="text-slate-300"><strong>Localizador:</strong> {selectedRecord.source_locator || 'No especificado'}</p>
              <p className="text-slate-300"><strong>Validación:</strong> {selectedRecord.validation}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
