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
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-8">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5 tracking-tight">
          <FileText className="w-7 h-7 text-white" />
          9,137 Temas Fuente Inmutables
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 font-light mt-1">
          Invariante de no-pérdida: cada tema conserva su identificador unívoco de origen, procedencia documental y texto literal.
        </p>
      </div>

      {/* Filter Tabs by Track in Minimalist Monochrome */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { id: 'ALL', label: 'Todos (9,137)' },
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
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 ${
              selectedTrack === track.id
                ? 'bg-white text-black font-semibold shadow-md shadow-white/10'
                : 'glass-pill hover:bg-white/10 text-neutral-300'
            }`}
          >
            {track.label}
          </button>
        ))}
      </div>

      {/* Search and Secondary Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-4 top-3 text-neutral-500" />
          <input
            type="text"
            placeholder="Buscar por tema, ID o materia..."
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
              setPage(0);
            }}
            className="glass-input w-full pl-11 pr-4 py-2.5 rounded-2xl text-xs sm:text-sm text-white placeholder-neutral-500 font-light"
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
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition ${
                selectedDiscipline === disc
                  ? 'bg-white text-black font-semibold'
                  : 'glass-pill hover:bg-white/10 text-neutral-400'
              }`}
            >
              {disc === 'ALL' ? 'Todas' : disc}
            </button>
          ))}
        </div>
      </div>

      {/* Pagination Bar */}
      <div className="flex items-center justify-between text-xs text-neutral-400 px-1 font-mono">
        <span>
          Mostrando {records.length.toLocaleString()} temas{' '}
          {records.length > 0 && `(Pág ${page + 1} de ${Math.max(1, totalPages)})`}
        </span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="p-1.5 rounded-lg glass-pill disabled:opacity-20 hover:text-white"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="p-1.5 rounded-lg glass-pill disabled:opacity-20 hover:text-white"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Records Glass List */}
      <div className="glass-panel rounded-3xl overflow-hidden divide-y divide-white/[0.05] border border-white/10">
        {paginatedRecords.map(record => (
          <div
            key={record.id}
            onClick={() => setSelectedRecord(record)}
            className="p-4 sm:p-5 hover:bg-white/[0.04] cursor-pointer transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs touch-manipulation"
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono font-bold text-white tracking-wide">{record.id}</span>
                <span className="text-[9px] uppercase px-2 py-0.5 rounded-full border border-white/15 text-neutral-300 font-mono">
                  {record.track}
                </span>
                <span className="text-neutral-600">•</span>
                <span className="text-neutral-400">{record.discipline}</span>
                <span className="text-neutral-600">•</span>
                <span className="text-neutral-400 font-medium">{record.subject_name}</span>
              </div>
              <p className="text-white text-sm font-semibold line-clamp-2 leading-snug">
                {record.text}
              </p>
              {record.source_locator && (
                <p className="text-[11px] text-neutral-500 font-light font-mono">
                  {record.source_name} ({record.source_locator})
                </p>
              )}
            </div>

            <div className="shrink-0 text-right">
              <span className="inline-block px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] font-mono text-[10px] text-neutral-400">
                {record.classification || 'literal'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-2xl flex items-center justify-center p-4">
          <div className="glass-panel rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-xs border border-white/15">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="font-mono text-white font-bold">{selectedRecord.id}</span>
                <h3 className="font-bold text-white text-base mt-0.5">Registro Literal de Origen</h3>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
              <span className="text-neutral-500 text-[10px] uppercase font-bold tracking-wider">Texto Transcrito</span>
              <p className="text-sm font-semibold text-white leading-snug">{selectedRecord.text}</p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <span className="text-neutral-500 text-[10px] block">Colección</span>
                <span className="font-semibold text-white">{selectedRecord.track}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <span className="text-neutral-500 text-[10px] block">Disciplina</span>
                <span className="font-semibold text-white">{selectedRecord.discipline}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <span className="text-neutral-500 text-[10px] block">Asignatura</span>
                <span className="font-semibold text-white">{selectedRecord.subject_name} ({selectedRecord.subject_id})</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <span className="text-neutral-500 text-[10px] block">Módulo</span>
                <span className="font-semibold text-white">{selectedRecord.module || 'General'}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1 text-neutral-300 font-light">
              <p><strong>Fuente:</strong> {selectedRecord.source_name}</p>
              <p><strong>Ubicación:</strong> {selectedRecord.source_locator || 'N/A'}</p>
              <p><strong>Validación:</strong> {selectedRecord.validation}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
