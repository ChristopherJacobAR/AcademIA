import { SourceRecord, Course, PrerequisiteEdge } from '../types/curriculum.js';
import { CurriculumGraph } from '../dag/graph.js';

export interface IntegrityCheckResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  summary: {
    totalCourses: number;
    totalEdges: number;
    totalWaves: number;
    totalRecords: number;
    recordsByTrack: {
      BASE: number;
      TECH: number;
      UDEG_LITERAL: number;
      PROPUESTA_V5: number;
    };
    isDAG: boolean;
  };
}

export function verifyCurriculumIntegrity(
  courses: Course[],
  edges: PrerequisiteEdge[],
  records: SourceRecord[]
): IntegrityCheckResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const courseIds = new Set(courses.map(c => c.id));
  if (courseIds.size !== courses.length) {
    errors.push(`Identificadores de asignaturas duplicados encontrados (${courses.length - courseIds.size} duplicados)`);
  }

  // Target count check
  if (courses.length !== 307) {
    warnings.push(`Conteo de asignaturas esperado: 307, obtenido: ${courses.length}`);
  }

  if (edges.length !== 540) {
    warnings.push(`Conteo de aristas esperado: 540, obtenido: ${edges.length}`);
  }

  // Validate edges reference existing courses
  for (const edge of edges) {
    if (!courseIds.has(edge.from)) {
      errors.push(`Arista inválida: asignatura origen '${edge.from}' no existe en el catálogo.`);
    }
    if (!courseIds.has(edge.to)) {
      errors.push(`Arista inválida: asignatura destino '${edge.to}' no existe en el catálogo.`);
    }
  }

  // DAG validation
  const graph = new CurriculumGraph(Array.from(courseIds), edges);
  const analysis = graph.analyze();

  if (!analysis.isDAG) {
    errors.push(`El grafo contiene ${analysis.cycles.length} ciclos, violando la propiedad de aciclicidad (DAG).`);
  }

  // Records counting
  const recordsByTrack = {
    BASE: 0,
    TECH: 0,
    UDEG_LITERAL: 0,
    PROPUESTA_V5: 0
  };

  const recordIds = new Set<string>();
  for (const record of records) {
    if (recordIds.has(record.id)) {
      errors.push(`ID de registro fuente duplicado: ${record.id}`);
    }
    recordIds.add(record.id);

    if (record.track in recordsByTrack) {
      recordsByTrack[record.track]++;
    } else {
      errors.push(`Track de origen desconocido: ${record.track} en registro ${record.id}`);
    }
  }

  if (records.length !== 9137) {
    warnings.push(`Total de registros fuente esperado: 9137, obtenido: ${records.length}`);
  }

  if (recordsByTrack.BASE !== 3695) {
    warnings.push(`Registros BASE esperados: 3695, obtenidos: ${recordsByTrack.BASE}`);
  }
  if (recordsByTrack.TECH !== 3313) {
    warnings.push(`Registros TECH esperados: 3313, obtenidos: ${recordsByTrack.TECH}`);
  }
  if (recordsByTrack.UDEG_LITERAL !== 1609) {
    warnings.push(`Registros UDEG_LITERAL esperados: 1609, obtenidos: ${recordsByTrack.UDEG_LITERAL}`);
  }
  if (recordsByTrack.PROPUESTA_V5 !== 520) {
    warnings.push(`Registros PROPUESTA_V5 esperados: 520, obtenidos: ${recordsByTrack.PROPUESTA_V5}`);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    summary: {
      totalCourses: courses.length,
      totalEdges: edges.length,
      totalWaves: analysis.parallelWaves.length,
      totalRecords: records.length,
      recordsByTrack,
      isDAG: analysis.isDAG
    }
  };
}
