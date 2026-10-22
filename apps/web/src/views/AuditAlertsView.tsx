import React, { useState } from 'react';
import { AlertTriangle, Search } from 'lucide-react';
import { db } from '@academia/storage';
import { useLiveQuery } from 'dexie-react-hooks';

export const AuditAlertsView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');

  const alerts = useLiveQuery(async () => {
    return await db.audit_alerts.toArray();
  }, []) ?? [];

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch =
      alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (alert.subject_id && alert.subject_id.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSeverity = selectedSeverity === 'ALL' || alert.severity === selectedSeverity;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-8">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5 tracking-tight">
          <AlertTriangle className="w-7 h-7 text-white" />
          112 Alertas de Integridad Curricular
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 font-light mt-1">
          Invariante epistemológico: no maquillar datos. Las discrepancias de extracción y epígrafes pendientes de homologación se preservan auditables.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-4 top-3 text-neutral-500" />
          <input
            type="text"
            placeholder="Buscar alertas por descripción, código o materia..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="glass-input w-full pl-11 pr-4 py-2.5 rounded-2xl text-xs sm:text-sm text-white placeholder-neutral-500 font-light"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {['ALL', 'critical', 'high', 'medium', 'low'].map(sev => (
            <button
              key={sev}
              onClick={() => setSelectedSeverity(sev)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                selectedSeverity === sev
                  ? 'bg-white text-black font-semibold'
                  : 'glass-pill hover:bg-white/10 text-neutral-300'
              }`}
            >
              {sev === 'ALL' ? 'Todas' : sev.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.map(alert => (
          <div
            key={alert.id}
            className="p-5 rounded-2xl glass-card space-y-2 text-xs border border-white/10"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="font-mono font-bold text-white tracking-wider">{alert.id}</span>
                <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded-full border border-white/15 text-neutral-300">
                  {alert.severity}
                </span>
                {alert.subject_id && (
                  <span className="font-mono text-neutral-300 bg-white/[0.05] px-2 py-0.5 rounded border border-white/10 text-[10px]">
                    {alert.subject_id}
                  </span>
                )}
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-white/[0.03] text-neutral-400 border border-white/10">
                {alert.resolution_status}
              </span>
            </div>

            <p className="text-neutral-200 text-xs sm:text-sm leading-relaxed font-light">
              {alert.description}
            </p>
          </div>
        ))}

        {filteredAlerts.length === 0 && (
          <div className="p-12 text-center rounded-2xl glass-panel text-neutral-500 text-xs">
            No se encontraron alertas registradas con los filtros actuales.
          </div>
        )}
      </div>
    </div>
  );
};
