import { PrerequisiteEdge } from '../types/curriculum.js';

export interface GraphAnalysisResult {
  isDAG: boolean;
  cycles: string[][];
  topologicalOrder: string[];
  parallelWaves: Array<{ wave: number; subjects: string[] }>;
  inDegree: Map<string, number>;
  outDegree: Map<string, number>;
}

export class CurriculumGraph {
  private adjacencyList: Map<string, Set<string>> = new Map();
  private reverseAdjacencyList: Map<string, Set<string>> = new Map();
  private allNodes: Set<string> = new Set();

  constructor(nodeIds: string[], edges: PrerequisiteEdge[]) {
    for (const id of nodeIds) {
      this.addNode(id);
    }
    for (const edge of edges) {
      this.addEdge(edge.from, edge.to);
    }
  }

  public addNode(id: string): void {
    this.allNodes.add(id);
    if (!this.adjacencyList.has(id)) {
      this.adjacencyList.set(id, new Set());
    }
    if (!this.reverseAdjacencyList.has(id)) {
      this.reverseAdjacencyList.set(id, new Set());
    }
  }

  public addEdge(from: string, to: string): void {
    this.addNode(from);
    this.addNode(to);
    this.adjacencyList.get(from)!.add(to);
    this.reverseAdjacencyList.get(to)!.add(from);
  }

  /**
   * Returns direct prerequisites for a given course (courses that must be taken before 'toId').
   */
  public getPrerequisites(toId: string): string[] {
    return Array.from(this.reverseAdjacencyList.get(toId) || []);
  }

  /**
   * Returns direct dependents of a given course (courses that require 'fromId').
   */
  public getDependents(fromId: string): string[] {
    return Array.from(this.adjacencyList.get(fromId) || []);
  }

  /**
   * Executes Kahn's algorithm to analyze the DAG and compute parallel waves.
   */
  public analyze(): GraphAnalysisResult {
    const inDegree = new Map<string, number>();
    const outDegree = new Map<string, number>();

    for (const node of this.allNodes) {
      inDegree.set(node, this.reverseAdjacencyList.get(node)?.size || 0);
      outDegree.set(node, this.adjacencyList.get(node)?.size || 0);
    }

    // Kahn's algorithm
    const queue: string[] = [];
    for (const [node, degree] of inDegree.entries()) {
      if (degree === 0) {
        queue.push(node);
      }
    }

    const topologicalOrder: string[] = [];
    const waveAssignments = new Map<string, number>();

    // Initial wave for nodes with 0 in-degree
    for (const node of queue) {
      waveAssignments.set(node, 1);
    }

    const currentInDegree = new Map(inDegree);
    let head = 0;

    while (head < queue.length) {
      const u = queue[head++];
      topologicalOrder.push(u);
      const currentWave = waveAssignments.get(u) || 1;

      const neighbors = this.adjacencyList.get(u) || new Set();
      for (const v of neighbors) {
        const nextWave = Math.max(waveAssignments.get(v) || 1, currentWave + 1);
        waveAssignments.set(v, nextWave);

        const newDeg = (currentInDegree.get(v) || 0) - 1;
        currentInDegree.set(v, newDeg);
        if (newDeg === 0) {
          queue.push(v);
        }
      }
    }

    const isDAG = topologicalOrder.length === this.allNodes.size;

    // Group into parallel waves
    const wavesMap = new Map<number, string[]>();
    for (const [node, waveNum] of waveAssignments.entries()) {
      if (!wavesMap.has(waveNum)) {
        wavesMap.set(waveNum, []);
      }
      wavesMap.get(waveNum)!.push(node);
    }

    const sortedWaveKeys = Array.from(wavesMap.keys()).sort((a, b) => a - b);
    const parallelWaves = sortedWaveKeys.map(wave => ({
      wave,
      subjects: wavesMap.get(wave)!.sort()
    }));

    return {
      isDAG,
      cycles: isDAG ? [] : this.findCycles(),
      topologicalOrder,
      parallelWaves,
      inDegree,
      outDegree
    };
  }

  /**
   * Checks whether a course is eligible given the set of mastered courses.
   */
  public isEligible(courseId: string, masteredIds: Set<string>): boolean {
    const prereqs = this.getPrerequisites(courseId);
    return prereqs.every(req => masteredIds.has(req));
  }

  private findCycles(): string[][] {
    // Basic cycle finder for diagnostic reporting if any cycle is present
    const visited = new Set<string>();
    const recStack = new Set<string>();
    const cycles: string[][] = [];

    const dfs = (node: string, path: string[]) => {
      visited.add(node);
      recStack.add(node);
      path.push(node);

      const neighbors = this.adjacencyList.get(node) || new Set();
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          dfs(neighbor, [...path]);
        } else if (recStack.has(neighbor)) {
          const cycleStart = path.indexOf(neighbor);
          if (cycleStart !== -1) {
            cycles.push(path.slice(cycleStart));
          }
        }
      }

      recStack.delete(node);
    };

    for (const node of this.allNodes) {
      if (!visited.has(node)) {
        dfs(node, []);
      }
    }

    return cycles;
  }
}
