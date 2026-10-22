import { db, BatchImporter, ImportProgress } from '@academia/storage';

export async function ensureCatalogLoaded(
  onProgress?: (progress: ImportProgress) => void
): Promise<boolean> {
  const currentCount = await db.courses.count();
  if (currentCount > 0) {
    return false; // Already loaded
  }

  try {
    onProgress?.({
      phase: 'Descargando catálogo maestro v5...',
      current: 0,
      total: 100,
      percentage: 2
    });

    const response = await fetch('/curriculum/catalog.json');
    if (!response.ok) {
      throw new Error(`Error HTTP al cargar catálogo: ${response.statusText}`);
    }

    onProgress?.({
      phase: 'Decodificando 9,137 registros fuente...',
      current: 10,
      total: 100,
      percentage: 10
    });

    const payload = await response.json();
    const importer = new BatchImporter(db);
    await importer.importCatalog(payload, onProgress);
    return true;
  } catch (err) {
    console.error('Error al inicializar catálogo:', err);
    throw err;
  }
}
