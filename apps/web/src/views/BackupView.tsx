import React, { useState, useEffect } from 'react';
import {
  HardDriveDownload,
  Upload,
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle,
  Database
} from 'lucide-react';
import { db, BackupManager } from '@academia/storage';

export const BackupView: React.FC = () => {
  const [encrypt, setEncrypt] = useState(false);
  const [password, setPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [storageUsage, setStorageUsage] = useState<{ usageMB: number; quotaMB: number } | null>(null);

  useEffect(() => {
    if (navigator.storage && navigator.storage.estimate) {
      navigator.storage.estimate().then(estimate => {
        setStorageUsage({
          usageMB: Math.round((estimate.usage || 0) / (1024 * 1024)),
          quotaMB: Math.round((estimate.quota || 0) / (1024 * 1024))
        });
      });
    }
  }, []);

  const handleExport = async () => {
    try {
      setStatusMessage(null);
      const manager = new BackupManager(db);
      const backupText = await manager.exportBackup(encrypt && password ? password : undefined);

      const blob = new Blob([backupText], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const dateStr = new Date().toISOString().split('T')[0];
      a.href = url;
      a.download = `AcademIA_backup_${dateStr}${encrypt ? '.encrypted' : ''}.academybackup`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setStatusMessage({
        text: 'Copia de seguridad generada y descargada exitosamente con suma SHA-256.',
        type: 'success'
      });
    } catch (err: any) {
      console.error(err);
      setStatusMessage({
        text: `Error al exportar: ${err.message}`,
        type: 'error'
      });
    }
  };

  const handleRestore = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setStatusMessage(null);
      const text = await file.text();
      const manager = new BackupManager(db);
      const manifest = await manager.restoreBackup(text, encrypt && password ? password : undefined);

      setStatusMessage({
        text: `Restauración exitosa verificada: ${manifest.counts.courses} cursos y ${manifest.counts.source_records.toLocaleString()} registros fuente restaurados.`,
        type: 'success'
      });
    } catch (err: any) {
      console.error(err);
      setStatusMessage({
        text: `Fallo al restaurar: ${err.message}`,
        type: 'error'
      });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-8">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5 tracking-tight">
          <HardDriveDownload className="w-7 h-7 text-white" />
          Soberanía de Datos y Respaldos Cifrados
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 font-light mt-1">
          Invariante mandatorio: Al menos dos soportes independientes de los datos críticos. Puedes exportar copias `.academybackup` con cifrado AES-GCM (PBKDF2).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Card */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4 border border-white/10">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <HardDriveDownload className="w-5 h-5 text-white" />
            Exportar Respaldo Completo (.academybackup)
          </h2>
          <p className="text-xs text-neutral-300 leading-relaxed font-light">
            Genera un archivo JSON durable con manifiesto, hashes de contenido, los 9,137 registros fuente, notas y configuraciones.
          </p>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2.5">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs text-neutral-200">
              <input
                type="checkbox"
                checked={encrypt}
                onChange={e => setEncrypt(e.target.checked)}
                className="rounded bg-black border-white/20 text-white focus:ring-0"
              />
              <span className="flex items-center gap-1.5 font-medium">
                {encrypt ? <Lock className="w-3.5 h-3.5 text-white" /> : <Unlock className="w-3.5 h-3.5 text-neutral-500" />}
                Cifrar copia con WebCrypto AES-GCM (PBKDF2)
              </span>
            </label>

            {encrypt && (
              <input
                type="password"
                placeholder="Ingresa contraseña de cifrado..."
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="glass-input w-full px-3.5 py-2.5 rounded-xl text-xs text-white placeholder-neutral-500 font-mono"
              />
            )}
          </div>

          <button
            onClick={handleExport}
            className="w-full py-3 rounded-xl bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition shadow-lg shadow-white/10"
          >
            Descargar Respaldo .academybackup
          </button>
        </div>

        {/* Restore Card */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4 border border-white/10 flex flex-col justify-between">
          <div className="space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Upload className="w-5 h-5 text-white" />
              Restaurar Respaldo
            </h2>
            <p className="text-xs text-neutral-300 leading-relaxed font-light">
              Verifica el checksum SHA-256 antes de aplicar los datos y reemplaza la base IndexedDB de forma atómica y consistente.
            </p>

            <div className="p-6 rounded-2xl border border-dashed border-white/20 bg-white/[0.02] text-center space-y-3">
              <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black text-xs font-semibold hover:bg-neutral-200 transition shadow-lg shadow-white/10">
                <Upload className="w-4 h-4" />
                <span>Seleccionar archivo .academybackup</span>
                <input
                  type="file"
                  accept=".json,.academybackup"
                  onChange={handleRestore}
                  className="hidden"
                />
              </label>
              <p className="text-[11px] text-neutral-500 font-light">
                Si el respaldo está cifrado, ingresa la contraseña en la casilla de la izquierda antes de cargar el archivo.
              </p>
            </div>
          </div>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-2xl text-xs flex items-center gap-2 border ${
            statusMessage.type === 'success'
              ? 'bg-white/[0.04] border-white/20 text-white'
              : 'bg-red-500/10 border-red-500/20 text-red-300'
          }`}
        >
          {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Storage Health */}
      <div className="glass-panel rounded-3xl p-6 space-y-3 border border-white/10">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 tracking-wide font-mono">
          <Database className="w-4 h-4 text-white" />
          Salud de Almacenamiento Local
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10">
            <span className="text-neutral-500 block text-[10px] font-mono">Uso del Navegador</span>
            <span className="font-mono font-bold text-white">
              {storageUsage ? `${storageUsage.usageMB} MB` : '...'}
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10">
            <span className="text-neutral-500 block text-[10px] font-mono">Cuota Disponible</span>
            <span className="font-mono font-bold text-white">
              {storageUsage ? `${(storageUsage.quotaMB / 1024).toFixed(1)} GB` : '...'}
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10">
            <span className="text-neutral-500 block text-[10px] font-mono">Respaldo Cloud</span>
            <span className="font-mono font-bold text-white">
              Supabase Free (Desactivable)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
