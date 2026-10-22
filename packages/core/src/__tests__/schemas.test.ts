import { describe, it, expect } from 'vitest';
import {
  SourceRecordSchema,
  CourseSchema,
  PrerequisiteEdgeSchema,
  AuditAlertSchema
} from '../schemas/curriculum.js';

describe('Zod Curriculum Schemas', () => {
  it('validates a correct SourceRecord', () => {
    const raw = {
      id: 'MAT-001-T0001',
      track: 'BASE',
      discipline: 'Matemáticas',
      subject_id: 'MAT-001',
      subject_name: 'Fundamentos de Álgebra',
      module: 'Aritmética',
      position: 1,
      source_name: 'Plan de estudios base .xlsx',
      source_locator: 'Fila 6',
      text: 'Lenguaje algebraico y lógica de igualdad',
      classification: 'tema_base_literal',
      validation: 'conservado_no_validado_semanticamente'
    };

    const parsed = SourceRecordSchema.safeParse(raw);
    expect(parsed.success).toBe(true);
  });

  it('rejects SourceRecord with invalid track or missing required fields', () => {
    const invalid = {
      id: 'INVALID',
      track: 'NON_EXISTENT_TRACK',
      discipline: 'Física',
      text: 'Missing subject_id'
    };

    const parsed = SourceRecordSchema.safeParse(invalid);
    expect(parsed.success).toBe(false);
  });

  it('validates Course and PrerequisiteEdge schemas', () => {
    const course = {
      id: 'FIS-096',
      name: 'Mecánica Clásica',
      discipline: 'Física',
      academic_level: 'Licenciatura'
    };
    expect(CourseSchema.safeParse(course).success).toBe(true);

    const edge = {
      from: 'MAT-001',
      to: 'FIS-096',
      kind: 'hard'
    };
    expect(PrerequisiteEdgeSchema.safeParse(edge).success).toBe(true);
  });

  it('validates AuditAlert schema', () => {
    const alert = {
      id: 'ALERT-001',
      type: 'missing_locator',
      severity: 'medium',
      subject_id: 'FIS-096',
      description: 'Revisión pendiente de epígrafe',
      resolution_status: 'pending'
    };
    expect(AuditAlertSchema.safeParse(alert).success).toBe(true);
  });
});
