# ADR 0004: Persistencia IndexedDB con Dexie y Sync Outbox Idempotente

- **Fecha:** 2026-10-21
- **Estado:** Aceptado
- **Contexto:**
  El aprendizaje personal debe funcionar de forma autónoma sin conexión a internet y sin incurrir en cuotas de servicios en la nube. Cuando el usuario decida enlazar su cuenta opcional de Supabase Free, la sincronización no debe depender de conexiones estables ni generar colisiones destructivas.
- **Decisión:**
  1. La fuente primaria de verdad local es **IndexedDB** gestionada a través de **Dexie.js**.
  2. Cada mutación en el perfil o progreso genera un registro atómico en la tabla `sync_outbox` con UUID inmutable, timestamp ISO y hash del contenido.
  3. Los intentos y partidas de videojuegos son **append-only** (sólo inserción).
  4. La exportación e importación de copias de seguridad (`.academybackup`) incluye manifiesto con suma de verificación SHA-256 y opción de cifrado simétrico AES-GCM (PBKDF2) en el navegador vía WebCrypto API.
- **Consecuencias:**
  - Garantía de retención 100% offline.
  - La suspensión por inactividad de Supabase Free no interrumpe el estudio ni borra datos del dispositivo.
  - Cero secretos o credenciales expuestas en el frontend.
