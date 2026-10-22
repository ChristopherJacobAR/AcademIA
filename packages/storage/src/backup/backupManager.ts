import { AcademiaDatabase } from '../db/academiaDb.js';
import { BackupManifest } from '@academia/core';

export interface ExportDataPayload {
  manifest: BackupManifest;
  data: {
    courses: unknown[];
    prerequisite_edges: unknown[];
    parallel_waves: unknown[];
    audit_alerts: unknown[];
    source_records: unknown[];
    game_sessions: unknown[];
    sync_outbox: unknown[];
    system_metadata: unknown[];
  };
}

export class BackupManager {
  constructor(private db: AcademiaDatabase) {}

  public async exportBackup(password?: string): Promise<string> {
    const courses = await this.db.courses.toArray();
    const prerequisite_edges = await this.db.prerequisite_edges.toArray();
    const parallel_waves = await this.db.parallel_waves.toArray();
    const audit_alerts = await this.db.audit_alerts.toArray();
    const source_records = await this.db.source_records.toArray();
    const game_sessions = await this.db.game_sessions.toArray();
    const sync_outbox = await this.db.sync_outbox.toArray();
    const system_metadata = await this.db.system_metadata.toArray();

    const dataPayload = {
      courses,
      prerequisite_edges,
      parallel_waves,
      audit_alerts,
      source_records,
      game_sessions,
      sync_outbox,
      system_metadata
    };

    const dataString = JSON.stringify(dataPayload);
    const checksum = await this.calculateSHA256(dataString);

    const manifest: BackupManifest = {
      version: '2.0',
      app: 'Academia Científica IA',
      exported_at: new Date().toISOString(),
      schema_version: '2.0',
      is_encrypted: !!password,
      checksum_sha256: checksum,
      counts: {
        source_records: source_records.length,
        courses: courses.length,
        prerequisite_edges: prerequisite_edges.length,
        parallel_waves: parallel_waves.length,
        audit_alerts: audit_alerts.length,
        attempts: 0,
        mastery: 0,
        game_sessions: game_sessions.length
      }
    };

    const fullExport: ExportDataPayload = {
      manifest,
      data: dataPayload
    };

    const serialized = JSON.stringify(fullExport, null, 2);

    if (password) {
      return await this.encryptAESGCM(serialized, password);
    }

    return serialized;
  }

  public async restoreBackup(backupText: string, password?: string): Promise<BackupManifest> {
    let payloadText = backupText;

    if (password) {
      payloadText = await this.decryptAESGCM(backupText, password);
    }

    let parsed: ExportDataPayload;
    try {
      parsed = JSON.parse(payloadText);
    } catch {
      throw new Error('El archivo de respaldo no tiene un formato JSON válido o la contraseña de descifrado es incorrecta.');
    }

    if (!parsed.manifest || !parsed.data) {
      throw new Error('Formato de respaldo inválido: faltan manifest o datos requeridos.');
    }

    // Verify SHA-256
    const calculatedChecksum = await this.calculateSHA256(JSON.stringify(parsed.data));
    if (calculatedChecksum !== parsed.manifest.checksum_sha256) {
      throw new Error(`Fallo de integridad: el checksum calculado (${calculatedChecksum.substring(0, 8)}...) no coincide con el manifiesto (${parsed.manifest.checksum_sha256.substring(0, 8)}...).`);
    }

    // Restore to DB within transaction
    await this.db.transaction(
      'rw',
      [
        this.db.courses,
        this.db.prerequisite_edges,
        this.db.parallel_waves,
        this.db.audit_alerts,
        this.db.source_records,
        this.db.game_sessions,
        this.db.sync_outbox,
        this.db.system_metadata
      ],
      async () => {
        await this.db.courses.clear();
        await this.db.courses.bulkPut(parsed.data.courses as any);

        await this.db.prerequisite_edges.clear();
        await this.db.prerequisite_edges.bulkAdd(parsed.data.prerequisite_edges as any);

        await this.db.parallel_waves.clear();
        await this.db.parallel_waves.bulkPut(parsed.data.parallel_waves as any);

        await this.db.audit_alerts.clear();
        await this.db.audit_alerts.bulkPut(parsed.data.audit_alerts as any);

        await this.db.source_records.clear();
        await this.db.source_records.bulkPut(parsed.data.source_records as any);

        if (parsed.data.game_sessions?.length) {
          await this.db.game_sessions.clear();
          await this.db.game_sessions.bulkPut(parsed.data.game_sessions as any);
        }

        if (parsed.data.sync_outbox?.length) {
          await this.db.sync_outbox.clear();
          await this.db.sync_outbox.bulkPut(parsed.data.sync_outbox as any);
        }

        if (parsed.data.system_metadata?.length) {
          await this.db.system_metadata.clear();
          await this.db.system_metadata.bulkPut(parsed.data.system_metadata as any);
        }
      }
    );

    return parsed.manifest;
  }

  private async calculateSHA256(text: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    if (typeof globalThis !== 'undefined' && globalThis.crypto?.subtle) {
      const hashBuffer = await globalThis.crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
    // Fallback if needed
    throw new Error('WebCrypto API no está disponible en este entorno.');
  }

  private async encryptAESGCM(plainText: string, password: string): Promise<string> {
    const encoder = new TextEncoder();
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveKey']
    );

    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt']
    );

    const cipherBuffer = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encoder.encode(plainText)
    );

    const result = {
      salt: Array.from(salt),
      iv: Array.from(iv),
      cipher: Array.from(new Uint8Array(cipherBuffer))
    };

    return JSON.stringify(result);
  }

  private async decryptAESGCM(encryptedJson: string, password: string): Promise<string> {
    const { salt, iv, cipher } = JSON.parse(encryptedJson);
    const encoder = new TextEncoder();

    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveKey']
    );

    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: new Uint8Array(salt),
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    );

    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: new Uint8Array(iv) },
      key,
      new Uint8Array(cipher)
    );

    return new TextDecoder().decode(decryptedBuffer);
  }
}
