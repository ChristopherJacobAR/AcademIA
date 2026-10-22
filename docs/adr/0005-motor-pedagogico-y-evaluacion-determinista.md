# ADR 0005: Motor Pedagógico, Active Recall, FSRS y Evaluación Determinista

- **Fecha:** 2026-10-21
- **Estado:** Aceptado
- **Contexto:**
  La aplicación no es un repositorio pasivo de vídeos ni un lector de PDFs. Su misión es garantizar la asimilación conceptual rigurosa y la capacidad de transferir conocimiento a problemas nuevos, con un balance de intuición y deducción matemática.
- **Decisión:**
  1. **Active Recall Estructurado:**
     - Preguntas de predicción antes de la demostración formal.
     - Reconstrucción de ecuaciones y supuestos con notas ocultas.
     - Tarjetas espaciadas gestionadas mediante el algoritmo moderno **FSRS** (`ts-fsrs`).
  2. **Técnica Feynman con Rúbrica Cuantitativa:**
     - 30% exactitud conceptual, 20% supuestos y límites de validez, 20% rigor deductivo, 15% claridad causal, 15% transferencia interdisciplinar.
     - Registro explícito de limitaciones y contraejemplos.
  3. **Evaluación Científica Determinista:**
     - Validación de consistencia dimensional y unidades (SI).
     - Las simulaciones numéricas separan explícitamente "ilustraciones didácticas" de "simulaciones con modelo diferencial".
     - Ningún juicio de LLM puede otorgar certificación sin verificación determinista de ejercicios.
