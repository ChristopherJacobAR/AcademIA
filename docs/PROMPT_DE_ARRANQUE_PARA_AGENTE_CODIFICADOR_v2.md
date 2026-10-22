# Prompt de arranque — Academia Científica IA (repo GitHub, Windows → iPad)

> **Cómo usarlo:** adjunta o coloca en la raíz del repo `ARQUITECTURA_MAESTRA_ACADEMIA_CIENTIFICA_IA_v2.md`, el archivo `Academia_FISICA_v5_catalogo_integro.json` y `FISICA_v5_manifiesto_integridad.json`. Pega el texto a continuación en la herramienta/agente de desarrollo que vayas a utilizar.

---

## INSTRUCCIÓN MAESTRA

Eres el **agente principal de ingeniería** de un producto real, no de un mockup. Vas a construir **Academia Científica IA**, app educativa PERSONAL para un solo usuario, de costo recurrente **0 MXN**, offline-first, pensada primero para **Windows y iPadOS**. La UI debe ser excepcional, funcional y científicamente honesta.

### Insumos de autoridad (leer antes de producir código)

1. `ARQUITECTURA_MAESTRA_ACADEMIA_CIENTIFICA_IA_v2.md`: arquitectura y UX/UI, videojuegos científicos y sincronización gratuita opcional. No usar ADR-002 de v1.
2. `Academia_FISICA_v5_catalogo_integro.json`: catálogo importable **sin modificar la procedencia**.
3. `FISICA_v5_manifiesto_integridad.json`: hashes y cardinalidades.
4. `Dictamen_Academia_FISICA_v5.md`: límites epistemológicos; nunca afirmes que está certificado lo que sigue en revisión.

### Objetivo de tu primer PR/MVP

- Inicializar un monorepo **React+TypeScript+Vite**, `pnpm` y una PWA installable.
- Implementar pantalla inicial iPad landscape/portrait + Windows responsive, modo claro/oscuro, navegación, tipografía y accesibilidad.
- Importar y conservar en IndexedDB el catálogo v5, procesándolo en lotes y sin congelar interfaz.
- Preservar los conteos del origen: **307** asignaturas, **540** dependencias, **14** frentes topológicos, **9,137** registros literales/propuestas desglosados en **3,695 Excel + 3,313 TECH + 1,609 UdeG + 520 propuestas**.
- Mostrar disciplinas Física/Matemáticas/Química/Ingeniería, mapa de temas, asignaturas por bloque, vista de materia y panel de alertas (112 revisiones pendientes).
- Construir ficha de concepto con localizador de fuente, estado de revisión, relaciones, prerequisitos y modo lectura con KaTeX.
- Persistencia local y export/import de copia de seguridad con tests. La copia no se borra sin confirmación; definir estructuras y tests de guardado de partidas y sync outbox.
- Funcionar offline después de la primera instalación de la PWA.
- Preparar estructura para FSRS, **videojuegos científicos, minijuegos y un protocolo de sincronización Supabase Free**, laboratorio Pyodide, método Feynman y conectores **manuales** de Gemini Deep Research/NotebookLM/ChatGPT, pero no fingir que están automatizados.

### Restricciones de ingeniería

1. **Cero servicios cloud pagados ni APIs de pago obligatorias.** Supabase Free es el sincronizador opcional aprobado (Auth + Postgres + RLS y Storage pequeño); no bloquear la primera ejecución ni el estudio por falta de cuenta o por suspensión del cloud.
2. **No subir datos privados, PDFs ni licencias de terceros a un repo Pages público.** La app pública es solo el shell, los contenidos se importan en el navegador.
3. **No perder fuentes.** Los registros `source_records` son inmutables; las equivalencias se guardan en relaciones, no con borrado.
4. **No inventar temas:** si el dato viene del JSON, señalar origen; si fue propuesto por IA, etiqueta `draft_external_proposal`.
5. **No producir pantallas con datos falsos** salvo un conjunto `DEMO` aislado y marcado. Botones que aparecen son funcionales.
6. Validar entrada con Zod; separar `domain / storage / UI / simulation` y mantener pruebas automatizadas.
7. Sistema de diseño propio accesible, táctil, Apple Pencil opcional, VoiceOver y reducción de movimiento.
8. El motor de evaluación y las simulaciones deben validar unidades, leyes, supuestos y límites; no aprobar recursos automáticamente por generarlos con IA.
9. No insertar claves secretas en frontend.
10. No dar estimaciones no sustentadas ni declarar pruebas no ejecutadas.

### Flujo de trabajo que exijo

**Paso 1.** Inspecciona el repositorio actual y las fuentes. Explica brevemente qué hay y qué falta, con IDs/conteos reales. Si no hay repo, créalo desde cero.

**Paso 2.** Redacta `docs/adr/` para elecciones irreversibles o importantes; implementa contratos Zod y almacenamiento local. Agrega test de importación y checksum antes de construir visualizaciones.

**Paso 3.** Construye UI principal con componentes reutilizables reales. Proporciona `loading`, `empty`, `error`, `offline`, `draft` y `approved` states.

**Paso 4.** Implementa importación y navegación curricular real. Recalcula grafo y frentes. No habilites conceptos por equivalencias semánticas no aprobadas.

**Paso 5.** Crea backups y prueba restore después de reinicio. Comprueba la identidad de los registros antes/después.

**Paso 6.** Ejecuta lint, TypeScript check, Vitest, Playwright (cuando viable), análisis de accesibilidad y build. Reporta resultados reales, no supuestos.

**Paso 7.** Entrega resumen: archivos creados, arquitectura, comandos de arranque, evidencia de pruebas, límites conocidos, próximos pasos concretos.

### Definición de terminado para este primer hito

- Se puede iniciar desde Windows con una secuencia documentada de comandos.
- Se puede importar `v5.json` y ver los registros reales, materias y bloques.
- La importación doble es idempotente y no altera archivos fuente.
- La página puede instalarse como PWA y se precachean los recursos críticos.
- La interfaz es utilizable con tacto/teclado y dos orientaciones iPad.
- Un backup puede restaurar la app en otra instalación sin pérdida detectable de IDs.
- No hay recursos privados publicados en Pages ni errores TypeScript/test críticos.

### Orden de fases siguientes (NO mezclar en el primer PR)

1. **Módulo piloto FIS-096:** vectores y unidades, simulación vectorial, explicación y evaluación.
2. **FSRS, active recall y Feynman:** flashcards, teach-back, rubricas y repaso real.
3. **Laboratorios científicos:** Pyodide en worker, CodeMirror, tests y curvas verificadas.
4. **IA asistida gratuita:** botones Copiar/Open/Import para Gemini Deep Research, NotebookLM y ChatGPT; ningún API supuesto.
5. **Supabase Free opcional y Drive como archivo:** migraciones SQL, RLS owner-only, outbox idempotente, copia cifrada manual, test de recuperación tras pausa y sin cuotas de pago.
6. **Arcade científico:** prototipo jugable Inspector de Unidades + Synth Fourier, luego órbitas/circuitos/cocina; cada uno con physics engine, seed, test de invariantes, predicción/transferencia y grabación de partidas.
7. **Capacitor iPad:** al pasar al Mac, Xcode y dispositivo personal; recordar vencimiento de firma gratuita.

**Empieza ahora por inspección y construcción del primer hito. Evita rediseños especulativos sin código comprobable.**


## ADENDA V2 — PR siguiente al MVP local

El agente implementará después el juego Inspector de Unidades con validación determinista, 2 pruebas de transferencia y un prototipo de sincronización Supabase Free (RLS por usuario) que pueda deshabilitarse totalmente. También debe crear una pantalla de archivo para indexar media y backups guardados en Drive/manual sin inventar una integración API. Exigir tests de recuperación de partida, duplicidad de eventos y acceso no autorizado.
