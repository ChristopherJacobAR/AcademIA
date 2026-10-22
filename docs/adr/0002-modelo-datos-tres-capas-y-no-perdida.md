# ADR 0002: Arquitectura Curricular en Tres Capas y Garantía de No Pérdida

- **Fecha:** 2026-10-21
- **Estado:** Aceptado
- **Contexto:**
  El currículo maestro v5 contiene 9,137 registros de procedencia múltiple (3,695 temas base Excel, 3,313 epígrafes TECH, 1,609 líneas literales UdeG, y 520 propuestas v5) junto a 307 asignaturas y 540 relaciones de precedencia. Fusionar o eliminar registros arbitrariamente causaría pérdida irreversible de trazabilidad histórica y científica.
- **Decisión:**
  Se implementa una separación estricta en tres capas independientes:
  1. **Capa 1: Fuente Inmutable (`source_records`)**: Almacena el texto íntegro, localizador exacto, hash SHA-256, origen (`BASE`, `TECH`, `UDEG_LITERAL`, `PROPUESTA_V5`) y archivo fuente. Ningún registro fuente se elimina ni se sobrescribe jamás.
  2. **Capa 2: Catálogo Canónico y Relaciones (`courses`, `prerequisites`, `parallel_waves`, `concept_mappings`)**: Estructuras curriculares normalizadas. La relación entre registros de origen y conceptos es de muchos-a-muchos (`M:N`). Las equivalencias semánticas no aprobadas se conservan como propuestas pendientes, no como uniones destructivas.
  3. **Capa 3: Perfil y Evidencia Personal (`attempts`, `mastery`, `review_cards`, `game_sessions`, `sync_outbox`)**: Registro append-only de intentos, ejercicios resueltos, intervalos FSRS y logros del estudiante. Puede restablecerse sin afectar las fuentes ni el catálogo.
- **Invariantes del Importador:**
  - Total de registros: exactamente 9,137 (3,695 BASE + 3,313 TECH + 1,609 UDEG + 520 PROPUESTA_V5).
  - Asignaturas: 307 cursos únicos.
  - Relaciones: 540 dependencias dirigidas sin ciclos (DAG acíclico verificado).
  - Frentes topológicos: 14 bloques concurrentes calculados.
  - Alertas de revisión: 112 auditorías catalogadas y visibles.
