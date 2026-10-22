import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { verifyCurriculumIntegrity } from '../integrity/verifier.js';
import { Course, PrerequisiteEdge, SourceRecord } from '../types/curriculum.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Real Curriculum Catalog Integrity (v5.json)', () => {
  const catalogPath = path.resolve(__dirname, '../../../../docs/Academia_FISICA_v5_catalogo_integro.json');

  it('verifies that the actual v5 catalog strictly preserves all invariant counts', () => {
    if (!fs.existsSync(catalogPath)) {
      console.warn('Catalog file not found at', catalogPath);
      return;
    }

    const rawData = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

    const courses: Course[] = rawData.courses || [];
    const edges: PrerequisiteEdge[] = (rawData.prerequisite_edges || []).map((e: any) => ({
      from: Array.isArray(e) ? e[0] : (e.prerequisite_id ?? e.from),
      to: Array.isArray(e) ? e[1] : (e.target_id ?? e.to)
    }));
    const records: SourceRecord[] = rawData.all_source_and_proposal_records || [];
    const waves = rawData.parallel_learning_waves || [];
    const alerts = rawData.review_alerts || [];

    const integrity = verifyCurriculumIntegrity(courses, edges, records);

    // Exact required counts
    expect(integrity.summary.totalCourses).toBe(307);
    expect(integrity.summary.totalEdges).toBe(540);
    expect(integrity.summary.totalWaves).toBe(14);
    expect(integrity.summary.totalRecords).toBe(9137);

    // Tracks breakdown
    expect(integrity.summary.recordsByTrack.BASE).toBe(3695);
    expect(integrity.summary.recordsByTrack.TECH).toBe(3313);
    expect(integrity.summary.recordsByTrack.UDEG_LITERAL).toBe(1609);
    expect(integrity.summary.recordsByTrack.PROPUESTA_V5).toBe(520);

    // DAG acyclicity
    expect(integrity.summary.isDAG).toBe(true);

    // Parallel waves & review alerts
    expect(waves.length).toBe(14);
    expect(alerts.length).toBe(112);

    expect(integrity.valid).toBe(true);
    expect(integrity.errors.length).toBe(0);
  });
});
