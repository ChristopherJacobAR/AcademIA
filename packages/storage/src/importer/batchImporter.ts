import { AcademiaDatabase } from '../db/academiaDb.js';
import {
  SourceRecord,
  Course,
  PrerequisiteEdge,
  ParallelLearningWave,
  AuditAlert
} from '@academia/core';

export interface ImportCatalogPayload {
  metadata?: Record<string, unknown>;
  courses: Course[];
  prerequisite_edges?: Array<{ from: string; to: string } | [string, string]>;
  parallel_learning_waves?: Array<{ wave?: number; wave_number?: number; subjects?: string[]; courses?: string[] }>;
  review_alerts?: AuditAlert[];
  all_source_and_proposal_records?: SourceRecord[];
}

export interface ImportProgress {
  phase: string;
  current: number;
  total: number;
  percentage: number;
}

export type ProgressCallback = (progress: ImportProgress) => void;

export class BatchImporter {
  constructor(private db: AcademiaDatabase) {}

  public async importCatalog(
    payload: ImportCatalogPayload,
    onProgress?: ProgressCallback
  ): Promise<{
    coursesCount: number;
    edgesCount: number;
    wavesCount: number;
    alertsCount: number;
    recordsCount: number;
  }> {
    // 1. Process Courses
    const courses = payload.courses || [];
    onProgress?.({
      phase: 'Importando asignaturas...',
      current: 0,
      total: courses.length,
      percentage: 5
    });

    await this.db.courses.bulkPut(courses);

    // 2. Process Prerequisite Edges
    const rawEdges = payload.prerequisite_edges || [];
    const normalizedEdges: PrerequisiteEdge[] = rawEdges.map(edge => {
      if (Array.isArray(edge)) {
        return { from: edge[0], to: edge[1] };
      }
      const e = edge as any;
      return {
        from: e.prerequisite_id ?? e.from,
        to: e.target_id ?? e.to,
        kind: e.kind ?? 'hard',
        rationale: e.resolution ?? e.rationale
      };
    });

    onProgress?.({
      phase: 'Importando relaciones de precedencia (DAG)...',
      current: normalizedEdges.length,
      total: normalizedEdges.length,
      percentage: 15
    });

    await this.db.prerequisite_edges.clear();
    await this.db.prerequisite_edges.bulkAdd(normalizedEdges);

    // 3. Process Parallel Waves
    const rawWaves = payload.parallel_learning_waves || [];
    const normalizedWaves: ParallelLearningWave[] = rawWaves.map((w: any, idx) => ({
      wave: w.wave ?? w.wave_number ?? (idx + 1),
      subjects: w.course_ids ?? w.subjects ?? w.courses ?? []
    }));

    onProgress?.({
      phase: 'Importando frentes de aprendizaje concurrente...',
      current: normalizedWaves.length,
      total: normalizedWaves.length,
      percentage: 25
    });

    await this.db.parallel_waves.bulkPut(normalizedWaves);

    // 4. Process Audit Alerts
    const alerts = payload.review_alerts || [];
    onProgress?.({
      phase: 'Registrando alertas de auditoría...',
      current: alerts.length,
      total: alerts.length,
      percentage: 35
    });

    await this.db.audit_alerts.bulkPut(alerts);

    // 5. Process Source Records in Chunks to avoid freezing
    const records = payload.all_source_and_proposal_records || [];
    const totalRecords = records.length;
    const CHUNK_SIZE = 500;

    for (let i = 0; i < totalRecords; i += CHUNK_SIZE) {
      const chunk = records.slice(i, i + CHUNK_SIZE);
      await this.db.source_records.bulkPut(chunk);

      const processed = Math.min(i + CHUNK_SIZE, totalRecords);
      const percentage = 35 + Math.round((processed / totalRecords) * 60);

      onProgress?.({
        phase: `Guardando registros fuente inmutables (${processed}/${totalRecords})...`,
        current: processed,
        total: totalRecords,
        percentage
      });
    }

    // 6. Record metadata
    await this.db.system_metadata.put({
      key: 'curriculum_v5_imported',
      value: {
        courses: courses.length,
        edges: normalizedEdges.length,
        waves: normalizedWaves.length,
        alerts: alerts.length,
        records: totalRecords
      },
      updated_at: new Date().toISOString()
    });

    onProgress?.({
      phase: 'Importación completada con éxito.',
      current: totalRecords,
      total: totalRecords,
      percentage: 100
    });

    return {
      coursesCount: courses.length,
      edgesCount: normalizedEdges.length,
      wavesCount: normalizedWaves.length,
      alertsCount: alerts.length,
      recordsCount: totalRecords
    };
  }
}
