import Dexie, { type EntityTable } from 'dexie';
import {
  SourceRecord,
  Course,
  PrerequisiteEdge,
  ParallelLearningWave,
  AuditAlert,
  SyncOutboxEvent
} from '@academia/core';

export interface PrerequisiteEdgeRecord extends PrerequisiteEdge {
  id?: number;
}

export interface SystemMetadataRecord {
  key: string;
  value: unknown;
  updated_at: string;
}

export interface GameSessionRecord {
  id: string;
  game_id: string;
  seed: number;
  score: number;
  evidence: Record<string, unknown>;
  created_at: string;
}

export class AcademiaDatabase extends Dexie {
  source_records!: EntityTable<SourceRecord, 'id'>;
  courses!: EntityTable<Course, 'id'>;
  prerequisite_edges!: EntityTable<PrerequisiteEdgeRecord, 'id'>;
  parallel_waves!: EntityTable<ParallelLearningWave, 'wave'>;
  audit_alerts!: EntityTable<AuditAlert, 'id'>;
  sync_outbox!: EntityTable<SyncOutboxEvent, 'id'>;
  system_metadata!: EntityTable<SystemMetadataRecord, 'key'>;
  game_sessions!: EntityTable<GameSessionRecord, 'id'>;

  constructor(databaseName = 'academia_cientifica_v2') {
    super(databaseName);

    this.version(1).stores({
      source_records: 'id, track, discipline, subject_id, classification, validation',
      courses: 'id, discipline, academic_level, track, parallel_wave',
      prerequisite_edges: '++id, [from+to], from, to',
      parallel_waves: 'wave',
      audit_alerts: 'id, type, severity, subject_id, resolution_status',
      sync_outbox: 'id, entity_type, created_at, status',
      system_metadata: 'key',
      game_sessions: 'id, game_id, created_at'
    });
  }
}

export const db = new AcademiaDatabase();
