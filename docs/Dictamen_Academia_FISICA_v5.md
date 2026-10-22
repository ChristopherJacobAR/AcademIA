# Dictamen FÍSICA v5 — conservación e integración curricular

## Alcance y límite epistemológico

Se han conservado literalmente **3,695** temas del Excel, **3,313** epígrafes TECH y **1,609** líneas de contenido temático UdeG (estas líneas incluyen fragmentos; existen **1,421** entradas didácticas reconstruidas como *vista derivada*, no como temas adicionales independientes). Se añaden **520 temas específicos redactados como propuesta**, agrupados en **52 módulos**. Total: **9,137 registros de contenido y propuestas sin pérdida de IDs**. Los 3 registros UdeG sin temario no se imparten, pero sus metadatos están en el archivo v4 archivado.

**No se certifica** exhaustividad universal, completitud semántica, ausencia de duplicados conceptuales, ni secuencia didáctica fina. Las cadenas de número de capítulo en PDF pueden tener errores de origen. Una bibliografía de referencia no equivale a cobertura textual comprobada.

## Distribución de las ampliaciones v5

| Disciplina | Módulos nuevos | Temas propuestos |
|--|--:|--:|
|Física|12|120|
|Matemáticas|12|120|
|Química|12|120|
|Ingeniería|16|160|

## Aprendizaje concurrente por bloques

Se han formado **14 frentes de aprendizaje** mediante ordenamiento topológico de **540** relaciones directas entre **307** cursos. Que dos asignaturas estén en el mismo frente significa únicamente que no hay dependencia entre ellas **dentro del grafo declarado**. No implica equivalencia de carga, simultaneidad garantizada de horarios, ni que sus subtemas estén ordenados.

Un plan de estudio semanal requiere seleccionar un subconjunto de cada bloque respetando horas disponibles, cursos pendientes, pruebas diagnósticas y dependencias semánticas por completar. La aplicación no debería habilitar automáticamente las 307 materias por el simple hecho de figurar en un bloque.

## Evidencia de integridad

- Las listas originales v4 se incluyen **sin editar** bajo `original_complete_v4_unchanged`.
- Los cuatro conjuntos de registros tienen cardinalidades exactas **3,695 + 3,313 + 1,609 + 520 = 9,137**.
- Todos los identificadores son únicos y las 307 materias destino existen.
- Los archivos de procedencia quedan identificados mediante hash SHA-256 en `source_files_hashes`.
- Se mantienen 112 alertas de auditoría (algunas de ellas repetidas a nivel referencia/ocurrencia, y tres exclusiones de cursos genéricos).

## Criterios de aceptación futuros

1. Resolver discrepancias PDF vs extracción mediante comparación visual de página.
2. Ejecutar comparación semántica asistida por un experto para equivalencias y solapamientos; registrar resultado aprobado/rechazado y justificación.
3. Crear dependencias conceptuales entre **cada unidad enseñable** y aprobar el grafo a nivel subtema.
4. Asignar bibliografía con URL verificable, licencia y capítulo y producir prácticas y pruebas de competencias.
5. Registrar todo cambio editorial con IDs de origen, hashes, autor, fecha, motivo y prueba de no-pérdida.
6. Planificar trayectorias paralelas sin obligar a una secuencia total y respetando la duración realista.

## Referencias de benchmarking (contextuales, no transcripciones)

- MIT-Physics: https://physics.mit.edu/academic-programs/undergrads/
- MIT-Mathematics: https://math.mit.edu/academics/undergrad/major/course18/index.html
- MIT-Chemistry: https://chemistry.mit.edu/academic-programs/undergraduate-programs/chemistry-major-chem-flex/
- MIT-ChemEng: https://cheme.mit.edu/academics/undergraduate-students/undergraduate-programs/
- MIT-MechEng: https://catalog.mit.edu/schools/engineering/mechanical-engineering/
- MIT-EECS: https://www.eecs.mit.edu/academics/undergraduate-programs/curriculum/
- ABET: https://www.abet.org/accreditation/accreditation-criteria/criteria-for-accrediting-engineering-programs-2025-2026/
