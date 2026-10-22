import { describe, it, expect, beforeEach } from 'vitest';
import 'fake-indexeddb/auto';
import { AcademiaDatabase } from '../db/academiaDb.js';
import { BatchImporter } from '../importer/batchImporter.js';
import { BackupManager } from '../backup/backupManager.js';
import { Course, PrerequisiteEdge, SourceRecord, AuditAlert } from '@academia/core';

describe('Storage & Dexie In-Memory Tests', () => {
  let db: AcademiaDatabase;
  let importer: BatchImporter;
  let backupManager: BackupManager;

  beforeEach(async () => {
    // Generate unique in-memory database for each test
    db = new AcademiaDatabase(`test_db_${Date.now()}_${Math.random()}`);
    importer = new BatchImporter(db);
    backupManager = new BackupManager(db);
  });

  it('imports catalog items and preserves counts and records', async () => {
    const mockCourses: Course[] = [
      { id: 'MAT-001', name: 'Álgebra', discipline: 'Matemáticas' },
      { id: 'FIS-001', name: 'Mecánica', discipline: 'Física' }
    ];

    const mockEdges: PrerequisiteEdge[] = [
      { from: 'MAT-001', to: 'FIS-001', kind: 'hard' }
    ];

    const mockRecords: SourceRecord[] = [
      {
        id: 'REC-001',
        track: 'BASE',
        discipline: 'Matemáticas',
        subject_id: 'MAT-001',
        subject_name: 'Álgebra',
        module: 'M1',
        position: 1,
        source_name: 'Base.xlsx',
        source_locator: 'p.1',
        text: 'Ecuaciones lineales',
        classification: 'tema_base_literal',
        validation: 'pendiente'
      },
      {
        id: 'REC-002',
        track: 'TECH',
        discipline: 'Física',
        subject_id: 'FIS-001',
        subject_name: 'Mecánica',
        module: 'M1',
        position: 1,
        source_name: 'Fisica.pdf',
        source_locator: 'p.5',
        text: 'Leyes de Newton',
        classification: 'epigrafe',
        validation: 'pendiente'
      }
    ];

    const mockAlerts: AuditAlert[] = [
      {
        id: 'ALT-1',
        type: 'check',
        severity: 'low',
        description: 'Test alert',
        resolution_status: 'pending'
      }
    ];

    const result = await importer.importCatalog({
      courses: mockCourses,
      prerequisite_edges: mockEdges,
      review_alerts: mockAlerts,
      all_source_and_proposal_records: mockRecords
    });

    expect(result.coursesCount).toBe(2);
    expect(result.edgesCount).toBe(1);
    expect(result.alertsCount).toBe(1);
    expect(result.recordsCount).toBe(2);

    const storedRecords = await db.source_records.toArray();
    expect(storedRecords.length).toBe(2);
    expect(storedRecords[0].text).toBe('Ecuaciones lineales');

    // Test idempotency: re-running import updates/preserves data without duplicating IDs
    await importer.importCatalog({
      courses: mockCourses,
      prerequisite_edges: mockEdges,
      review_alerts: mockAlerts,
      all_source_and_proposal_records: mockRecords
    });

    const recordsAfterReimport = await db.source_records.toArray();
    expect(recordsAfterReimport.length).toBe(2);
  });

  it('exports and restores a backup successfully with SHA-256 verification', async () => {
    await db.courses.add({ id: 'QUI-001', name: 'Química General', discipline: 'Química' });
    await db.source_records.add({
      id: 'REC-QUI-1',
      track: 'PROPUESTA_V5',
      discipline: 'Química',
      subject_id: 'QUI-001',
      subject_name: 'Química General',
      module: 'Termodinámica Química',
      position: 1,
      source_name: 'MIT OpenCourseWare',
      source_locator: 'Lecture 1',
      text: 'Entalpía y Ley de Hess',
      classification: 'tema_nuevo_propuesto',
      validation: 'requiere_validacion_profesor'
    });

    const backupJson = await backupManager.exportBackup();
    expect(backupJson).toContain('checksum_sha256');
    expect(backupJson).toContain('Química General');

    // Create a fresh clean database and restore into it
    const restoreDb = new AcademiaDatabase(`restore_db_${Date.now()}`);
    const restoreManager = new BackupManager(restoreDb);

    const manifest = await restoreManager.restoreBackup(backupJson);
    expect(manifest.counts.courses).toBe(1);
    expect(manifest.counts.source_records).toBe(1);

    const restoredCourse = await restoreDb.courses.get('QUI-001');
    expect(restoredCourse?.name).toBe('Química General');

    const restoredRecord = await restoreDb.source_records.get('REC-QUI-1');
    expect(restoredRecord?.text).toBe('Entalpía y Ley de Hess');
  });

  it('supports encrypted backups with AES-GCM password protection', async () => {
    await db.courses.add({ id: 'ING-001', name: 'Termodinámica Aplicada', discipline: 'Ingeniería' });

    const password = 'SecretPassword123!';
    const encryptedBackup = await backupManager.exportBackup(password);
    expect(encryptedBackup).not.toContain('Termodinámica Aplicada'); // payload is encrypted

    const restoreDb = new AcademiaDatabase(`restore_enc_${Date.now()}`);
    const restoreManager = new BackupManager(restoreDb);

    // Fails with wrong password
    await expect(
      restoreManager.restoreBackup(encryptedBackup, 'WrongPassword')
    ).rejects.toThrow();

    // Succeeds with correct password
    const manifest = await restoreManager.restoreBackup(encryptedBackup, password);
    expect(manifest.counts.courses).toBe(1);

    const restored = await restoreDb.courses.get('ING-001');
    expect(restored?.name).toBe('Termodinámica Aplicada');
  });
});
