export type SourceTrack = 'BASE' | 'TECH' | 'UDEG_LITERAL' | 'PROPUESTA_V5';

export type Discipline = 'Física' | 'Matemáticas' | 'Química' | 'Ingeniería';

export type DependencyKind = 'hard' | 'recommended' | 'co-requisite' | 'bridge' | 'research_optional';

export interface SourceRecord {
  id: string;
  track: SourceTrack;
  discipline: Discipline;
  subject_id: string;
  subject_name: string;
  module: string;
  position: number;
  source_name: string;
  source_locator: string;
  text: string;
  classification: string;
  validation: string;
  parent_id?: string;
  original_number?: string;
}

export interface Course {
  id: string;
  name: string;
  discipline: Discipline;
  academic_level?: string;
  official_status?: string;
  credits?: number;
  prerequisites?: string[];
  track?: string;
  parallel_wave?: number;
  total_topics?: number;
}

export interface PrerequisiteEdge {
  from: string; // The prerequisite course
  to: string;   // The course that depends on 'from'
  kind?: DependencyKind;
  rationale?: string;
}

export interface ParallelLearningWave {
  wave: number;
  subjects: string[];
}

export interface AuditAlert {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  subject_id?: string;
  record_id?: string;
  description: string;
  resolution_status: 'pending' | 'resolved' | 'acknowledged';
}

export interface Concept {
  id: string;
  canonicalTitle: string;
  definition?: string;
  discipline: Discipline;
  difficultyBand: 'intro' | 'intermediate' | 'advanced' | 'research';
  status: 'draft_external_proposal' | 'pendiente_revision_cientifica' | 'aprobado';
  scientificDomain: string;
  validityConditions: string[];
  prerequisites?: Array<{ id: string; kind: DependencyKind }>;
}

export interface GameDefinition {
  id: string;
  title: string;
  domains: string[];
  status: 'planned_not_implemented' | 'prototype' | 'stable';
  description?: string;
  physicsModel?: string;
}

export interface SyncOutboxEvent {
  id: string;
  device_id: string;
  entity_type: string;
  action: 'insert' | 'update' | 'delete';
  payload: Record<string, unknown>;
  created_at: string;
  status: 'pending' | 'synced' | 'failed';
  content_sha256?: string;
}

export interface BackupManifest {
  version: string;
  app: string;
  exported_at: string;
  schema_version: string;
  is_encrypted: boolean;
  checksum_sha256: string;
  counts: {
    source_records: number;
    courses: number;
    prerequisite_edges: number;
    parallel_waves: number;
    audit_alerts: number;
    attempts: number;
    mastery: number;
    game_sessions: number;
  };
}
