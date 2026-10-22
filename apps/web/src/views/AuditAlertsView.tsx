import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, Search } from 'lucide-react';
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
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-6">
      <div className="space-y-1">
        <h1 className="text-xl md:text-2xl font-extrabold text-white flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-amber-400" />
          Panel de Auditoría e Integridad (112 Alertas Registradas)
        </h1>
        <p className="text-xs md:text-sm text-slate-400">
          Invariante ética: no ocultar lagunas documentales. Cada discrepancia de extracción, ambigüedad en números de capítulo o epígrafe sin correspondencia unívoca se preserva como alerta auditable.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar alertas por descripción, código o materia..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {['ALL', 'critical', 'high', 'medium', 'low'].map(sev => (
            <button
              key={sev}
              onClick={() => setSelectedSeverity(sev)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedSeverity === sev
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {sev === 'ALL' ? 'Todas' : sev.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.map(alert => {
          const badgeColor =
            alert.severity === 'critical'
              ? 'bg-red-500/10 text-red-400 border-red-500/30'
              : alert.severity === 'high'
              ? 'bg-orange-500/10 text-orange-400 border-orange-500/30'
              : alert.severity === 'medium'
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              : 'bg-slate-800 text-slate-400 border-slate-700';

          return (
            <div
              key={alert.id}
              className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition space-y-2 text-xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span className="font-mono font-bold text-white">{alert.id}</span>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}>
                    {alert.severity}
                  </span>
                  {alert.subject_id && (
                    <span className="font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {alert.subject_id}
                    </span>
                  )}
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                  {alert.resolution_status}
                </span>
              </div>

              <p className="text-slate-200 text-sm leading-relaxed">{alert.description}</p>
            </div>
          );
        })}

        {filteredAlerts.length === 0 && (
          <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-500 text-xs">
            No se encontraron alertas con los filtros indicados.
          </div>
        )}
      </div>
    </div>
  );
};
