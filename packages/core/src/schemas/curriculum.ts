import { z } from 'zod';

export const DisciplineSchema = z.enum(['Física', 'Matemáticas', 'Química', 'Ingeniería']);

export const SourceTrackSchema = z.enum(['BASE', 'TECH', 'UDEG_LITERAL', 'PROPUESTA_V5']);

export const DependencyKindSchema = z.enum(['hard', 'recommended', 'co-requisite', 'bridge', 'research_optional']);

export const SourceRecordSchema = z.object({
  id: z.string().min(1),
  track: SourceTrackSchema,
  discipline: DisciplineSchema,
  subject_id: z.string().min(1),
  subject_name: z.string().min(1),
  module: z.string().default(''),
  position: z.number().int().nonnegative(),
  source_name: z.string().min(1),
  source_locator: z.string().default(''),
  text: z.string().min(1),
  classification: z.string().default(''),
  validation: z.string().default(''),
  parent_id: z.string().optional().default(''),
  original_number: z.string().optional().default('')
});

export const CourseSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  discipline: DisciplineSchema,
  academic_level: z.string().optional(),
  official_status: z.string().optional(),
  credits: z.number().optional(),
  prerequisites: z.array(z.string()).optional(),
  track: z.string().optional(),
  parallel_wave: z.number().int().optional(),
  total_topics: z.number().int().optional()
});

export const PrerequisiteEdgeSchema = z.object({
  from: z.string().min(1),
  to: z.string().min(1),
  kind: DependencyKindSchema.optional().default('hard'),
  rationale: z.string().optional()
});

export const ParallelLearningWaveSchema = z.object({
  wave: z.number().int().positive(),
  subjects: z.array(z.string().min(1))
});

export const AuditAlertSchema = z.object({
  id: z.string().min(1),
  type: z.string().min(1),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  subject_id: z.string().optional(),
  record_id: z.string().optional(),
  description: z.string().min(1),
  resolution_status: z.enum(['pending', 'resolved', 'acknowledged']).default('pending')
});

export const GameDefinitionSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  domains: z.array(z.string().min(1)),
  status: z.enum(['planned_not_implemented', 'prototype', 'stable']),
  description: z.string().optional(),
  physicsModel: z.string().optional()
});

export const SyncOutboxEventSchema = z.object({
  id: z.string().uuid(),
  device_id: z.string().min(1),
  entity_type: z.string().min(1),
  action: z.enum(['insert', 'update', 'delete']),
  payload: z.record(z.unknown()),
  created_at: z.string().datetime(),
  status: z.enum(['pending', 'synced', 'failed']),
  content_sha256: z.string().optional()
});

export const BackupManifestSchema = z.object({
  version: z.string(),
  app: z.string(),
  exported_at: z.string(),
  schema_version: z.string(),
  is_encrypted: z.boolean(),
  checksum_sha256: z.string(),
  counts: z.object({
    source_records: z.number().int().nonnegative(),
    courses: z.number().int().nonnegative(),
    prerequisite_edges: z.number().int().nonnegative(),
    parallel_waves: z.number().int().nonnegative(),
    audit_alerts: z.number().int().nonnegative(),
    attempts: z.number().int().nonnegative(),
    mastery: z.number().int().nonnegative(),
    game_sessions: z.number().int().nonnegative()
  })
});
