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
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-6">
      <div className="space-y-1">
        <h1 className="text-xl md:text-2xl font-extrabold text-white flex items-center gap-2">
          <HardDriveDownload className="w-6 h-6 text-sky-400" />
          Copias de Seguridad y Soberanía de Datos
        </h1>
        <p className="text-xs md:text-sm text-slate-400">
          Invariante mandatorio: Al menos dos soportes independientes de los datos críticos (Nube + exportación local externa). Un proveedor gratuito no es garantía de retención.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Card */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <HardDriveDownload className="w-5 h-5 text-sky-400" />
            Exportar Respaldo Completo (.academybackup)
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Genera un archivo JSON durable con manifiesto, hashes de contenido, registros fuente, avance y configuración.
          </p>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-200">
              <input
                type="checkbox"
                checked={encrypt}
                onChange={e => setEncrypt(e.target.checked)}
                className="rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-0"
              />
              <span className="flex items-center gap-1.5 font-medium">
                {encrypt ? <Lock className="w-3.5 h-3.5 text-amber-400" /> : <Unlock className="w-3.5 h-3.5 text-slate-400" />}
                Cifrar copia con WebCrypto AES-GCM (PBKDF2)
              </span>
            </label>

            {encrypt && (
              <input
                type="password"
                placeholder="Ingresa contraseña de cifrado..."
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            )}
          </div>

          <button
            onClick={handleExport}
            className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition shadow-lg shadow-sky-600/20"
          >
            Descargar Respaldo .academybackup
          </button>
        </div>

        {/* Restore Card */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Upload className="w-5 h-5 text-indigo-400" />
            Restaurar Respaldo
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Verifica el checksum SHA-256 antes de aplicar los datos y reemplaza la base IndexedDB de forma atómica y consistente.
          </p>

          <div className="p-4 rounded-xl border border-dashed border-slate-700 bg-slate-950/40 text-center space-y-2">
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition">
              <Upload className="w-4 h-4" />
              <span>Seleccionar archivo .academybackup</span>
              <input
                type="file"
                accept=".json,.academybackup"
                onChange={handleRestore}
                className="hidden"
              />
            </label>
            <p className="text-[11px] text-slate-500">
              Si el archivo está cifrado, ingresa la contraseña en la casilla izquierda antes de restaurar.
            </p>
          </div>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2 border ${
            statusMessage.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
              : 'bg-red-500/10 border-red-500/20 text-red-300'
          }`}
        >
          {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Storage Health & Zero Cost Policy */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Database className="w-4 h-4 text-sky-400" />
          Salud de Almacenamiento en el Dispositivo
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">Uso Actual del Navegador</span>
            <span className="font-mono font-bold text-white">
              {storageUsage ? `${storageUsage.usageMB} MB` : 'Estimando...'}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">Cuota Disponible</span>
            <span className="font-mono font-bold text-white">
              {storageUsage ? `${(storageUsage.quotaMB / 1024).toFixed(1)} GB` : 'Estimando...'}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">Sincronización Cloud</span>
            <span className="font-mono font-bold text-emerald-400">
              Supabase Free (Opcional, Modo Offline)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
