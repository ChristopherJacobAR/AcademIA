import { describe, it, expect } from 'vitest';
import { CurriculumGraph } from '../dag/graph.js';
import { PrerequisiteEdge } from '../types/curriculum.js';

describe('CurriculumGraph (DAG & Parallel Waves)', () => {
  it('correctly calculates topological order and parallel waves for a simple DAG', () => {
    // A -> B -> D
    // A -> C -> D
    // E (independent)
    const nodes = ['A', 'B', 'C', 'D', 'E'];
    const edges: PrerequisiteEdge[] = [
      { from: 'A', to: 'B' },
      { from: 'A', to: 'C' },
      { from: 'B', to: 'D' },
      { from: 'C', to: 'D' }
    ];

    const graph = new CurriculumGraph(nodes, edges);
    const analysis = graph.analyze();

    expect(analysis.isDAG).toBe(true);
    expect(analysis.cycles.length).toBe(0);

    // Wave 1 should have nodes with in-degree 0: A and E
    const wave1 = analysis.parallelWaves.find(w => w.wave === 1);
    expect(wave1?.subjects).toEqual(['A', 'E']);

    // Wave 2 should have B and C
    const wave2 = analysis.parallelWaves.find(w => w.wave === 2);
    expect(wave2?.subjects).toEqual(['B', 'C']);

    // Wave 3 should have D
    const wave3 = analysis.parallelWaves.find(w => w.wave === 3);
    expect(wave3?.subjects).toEqual(['D']);
  });

  it('detects cycles when graph is not a DAG', () => {
    // X -> Y -> Z -> X
    const nodes = ['X', 'Y', 'Z'];
    const edges: PrerequisiteEdge[] = [
      { from: 'X', to: 'Y' },
      { from: 'Y', to: 'Z' },
      { from: 'Z', to: 'X' }
    ];

    const graph = new CurriculumGraph(nodes, edges);
    const analysis = graph.analyze();

    expect(analysis.isDAG).toBe(false);
    expect(analysis.cycles.length).toBeGreaterThan(0);
  });

  it('determines eligibility based on mastered prerequisites', () => {
    const nodes = ['MAT1', 'MAT2', 'FIS1'];
    const edges: PrerequisiteEdge[] = [
      { from: 'MAT1', to: 'MAT2' },
      { from: 'MAT1', to: 'FIS1' },
      { from: 'MAT2', to: 'FIS1' }
    ];

    const graph = new CurriculumGraph(nodes, edges);

    // Without MAT1, neither MAT2 nor FIS1 is eligible
    expect(graph.isEligible('MAT2', new Set())).toBe(false);
    expect(graph.isEligible('FIS1', new Set())).toBe(false);

    // With MAT1 mastered, MAT2 is eligible, but FIS1 still requires MAT2
    expect(graph.isEligible('MAT2', new Set(['MAT1']))).toBe(true);
    expect(graph.isEligible('FIS1', new Set(['MAT1']))).toBe(false);

    // With both MAT1 and MAT2 mastered, FIS1 is eligible
    expect(graph.isEligible('FIS1', new Set(['MAT1', 'MAT2']))).toBe(true);
  });
});
