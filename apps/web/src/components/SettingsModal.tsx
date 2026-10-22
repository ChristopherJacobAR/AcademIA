import React, { useState, useEffect } from 'react';
import { X, Key, Cloud, CheckCircle2, AlertCircle, Sparkles, ExternalLink } from 'lucide-react';
import { GeminiService } from '../services/geminiService.js';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [geminiKey, setGeminiKey] = useState('');
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [testResult, setTestResult] = useState<{ message: string; ok: boolean } | null>(null);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    setGeminiKey(localStorage.getItem('academia_gemini_key') || '');
    setSupabaseUrl(localStorage.getItem('academia_supabase_url') || '');
    setSupabaseKey(localStorage.getItem('academia_supabase_key') || '');
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    GeminiService.setStoredKey(geminiKey);
    localStorage.setItem('academia_supabase_url', supabaseUrl.trim());
    localStorage.setItem('academia_supabase_key', supabaseKey.trim());
    setTestResult({ message: 'Configuración guardada en este dispositivo.', ok: true });
    setTimeout(() => onClose(), 1200);
  };

  const handleTestGemini = async () => {
    if (!geminiKey.trim()) {
      setTestResult({ message: 'Ingresa una API Key de Gemini primero.', ok: false });
      return;
    }
    setTesting(true);
    setTestResult(null);
    try {
      const response = await GeminiService.callGemini('Responde sólo con: OK_CONEXION_EXITOSA', geminiKey.trim());
      if (response) {
        setTestResult({ message: '✓ Conexión con Google Gemini verificada con éxito.', ok: true });
      }
    } catch (err: any) {
      setTestResult({ message: `Fallo al verificar Gemini: ${err.message}`, ok: false });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-2xl flex items-center justify-center p-4">
      <div className="glass-panel rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-150 border border-white/10">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center font-bold">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Integraciones: IA & Nube</h3>
              <p className="text-xs text-neutral-400">Google Gemini API (Plan Plus/Gratuito) y Supabase</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Gemini API Key Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-neutral-300" />
              Google Gemini API Key
            </label>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-neutral-400 hover:text-white flex items-center gap-1 underline transition"
            >
              Obtener clave gratuita en Google AI Studio
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <p className="text-[11px] text-neutral-400">
            Permite al tutor explicar temas a profundidad, calificar Feynman con IA y generar retos de active recall. Tu clave se guarda exclusivamente en tu navegador local.
          </p>
          <div className="flex gap-2">
            <input
              type="password"
              placeholder="AIzaSy..."
              value={geminiKey}
              onChange={e => setGeminiKey(e.target.value)}
              className="glass-input flex-1 px-3 py-2 rounded-xl text-xs font-mono"
            />
            <button
              onClick={handleTestGemini}
              disabled={testing || !geminiKey.trim()}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white text-xs font-medium border border-white/15 transition"
            >
              {testing ? 'Probando...' : 'Probar'}
            </button>
          </div>
        </div>

        {/* Supabase Section */}
        <div className="space-y-3 pt-3 border-t border-white/10">
          <label className="text-xs font-semibold text-white flex items-center gap-1.5">
            <Cloud className="w-3.5 h-3.5 text-neutral-300" />
            Supabase Free (Opcional para Sincronización)
          </label>
          <p className="text-[11px] text-neutral-400">
            Conecta tu proyecto gratuito de Supabase para respaldar tus intentos y notas en PostgreSQL.
          </p>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="https://xyzcompany.supabase.co"
              value={supabaseUrl}
              onChange={e => setSupabaseUrl(e.target.value)}
              className="glass-input w-full px-3 py-2 rounded-xl text-xs font-mono"
            />
            <input
              type="password"
              placeholder="anon-public-key..."
              value={supabaseKey}
              onChange={e => setSupabaseKey(e.target.value)}
              className="glass-input w-full px-3 py-2 rounded-xl text-xs font-mono"
            />
          </div>
        </div>

        {/* Test Result Banner */}
        {testResult && (
          <div
            className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${
              testResult.ok
                ? 'bg-white/5 border-white/20 text-white'
                : 'bg-red-500/10 border-red-500/30 text-red-300'
            }`}
          >
            {testResult.ok ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{testResult.message}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2.5 pt-2 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-400 hover:text-white transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition shadow-lg shadow-white/10"
          >
            Guardar Configuración
          </button>
        </div>
      </div>
    </div>
  );
};
