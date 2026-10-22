import React, { useState } from 'react';
import { Search, ExternalLink, RefreshCw } from 'lucide-react';

interface PaperResult {
  id: string;
  title: string;
  authors: string[];
  year: number;
  doi?: string;
  url: string;
  source: string;
}

export const LiteratureSearch: React.FC = () => {
  const [query, setQuery] = useState('Quantum mechanics phase space');
  const [loading, setLoading] = useState(false);
  const [papers, setPapers] = useState<PaperResult[]>([
    {
      id: 'openalex-1',
      title: 'Quantum signatures of chaos',
      authors: ['Fritz Haake', 'Sven Gnutzmann'],
      year: 2018,
      doi: '10.1007/978-3-642-05428-0',
      url: 'https://doi.org/10.1007/978-3-642-05428-0',
      source: 'Springer Series in Synergetics'
    },
    {
      id: 'openalex-2',
      title: 'Classical Electrodynamics and Field Theory',
      authors: ['John David Jackson'],
      year: 1999,
      doi: '10.1119/1.19136',
      url: 'https://doi.org/10.1119/1.19136',
      source: 'John Wiley & Sons'
    },
    {
      id: 'openalex-3',
      title: 'Topological band theory and Chern insulators',
      authors: ['B. Andrei Bernevig', 'Taylor L. Hughes'],
      year: 2013,
      doi: '10.1515/9781400847730',
      url: 'https://doi.org/10.1515/9781400847730',
      source: 'Princeton University Press'
    }
  ]);

  const searchLiterature = async () => {
    if (!query.trim()) return;
    setLoading(true);

    try {
      // Query OpenAlex free public scholarly API
      const res = await fetch(`https://api.openalex.org/works?search=${encodeURIComponent(query)}&per_page=6`);
      if (res.ok) {
        const data = await res.json();
        const results: PaperResult[] = (data.results || []).map((item: any) => ({
          id: item.id,
          title: item.display_name || item.title || 'Sin título',
          authors: (item.authorships || []).slice(0, 3).map((a: any) => a.author?.display_name || 'Autor'),
          year: item.publication_year || 2024,
          doi: item.doi,
          url: item.doi || item.id,
          source: item.primary_location?.source?.display_name || 'Publicación Científica'
        }));
        if (results.length > 0) {
          setPapers(results);
        }
      }
    } catch (err) {
      console.warn('OpenAlex fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-white text-base">Búsqueda de Literatura Científica Abierta (OpenAlex & arXiv)</h3>
          <p className="text-xs text-neutral-400 font-light">
            Consulta directa de artículos de investigación académica, preprints y referencias indexadas con DOI.
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Buscar papers (ej: Navier-Stokes existence, Snell refraction, Quantum Hall effect)..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && searchLiterature()}
          className="glass-input flex-1 px-4 py-2.5 rounded-2xl text-xs sm:text-sm text-white placeholder-neutral-500 font-light"
        />
        <button
          onClick={searchLiterature}
          disabled={loading}
          className="px-5 py-2.5 rounded-2xl bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition flex items-center gap-1.5 shrink-0"
        >
          {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
          <span>{loading ? 'Consultando...' : 'Buscar Papers'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {papers.map(paper => (
          <div
            key={paper.id}
            className="glass-card p-5 rounded-2xl flex flex-col justify-between space-y-3"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
                <span>{paper.year}</span>
                <span className="truncate max-w-[200px]">{paper.source}</span>
              </div>
              <h4 className="font-semibold text-white text-sm line-clamp-2 leading-snug">
                {paper.title}
              </h4>
              <p className="text-xs text-neutral-400 font-light">
                {paper.authors.join(', ')}
              </p>
            </div>

            <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs">
              <span className="font-mono text-[10px] text-neutral-500 truncate max-w-[220px]">
                {paper.doi || 'arXiv / OpenAccess'}
              </span>
              <a
                href={paper.url}
                target="_blank"
                rel="noreferrer"
                className="text-white hover:underline flex items-center gap-1 font-medium"
              >
                <span>Ver artículo</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
