# AcademIA — Academia Científica IA

> **Sistema personal de aprendizaje científico exigente (Física, Matemáticas, Química e Ingeniería), local-first, con videojuegos educativos, active recall y presupuesto objetivo 0 MXN/mes.**

Desarrollado en estación **Windows**, respaldado y sincronizado a través de **GitHub**, e implementado para estudio táctil y compilación nativa en **iPadOS** (vía Safari PWA y Mac/Xcode).

---

## 🏛️ Arquitectura Maestra v2.0

- **Enfoque:** Local-First (la verdad primaria de trabajo vive en el dispositivo mediante **IndexedDB / Dexie.js**).
- **Presupuesto objetivo:** **0 MXN/mes**. Sin APIs de pago obligatorias ni bases de datos con facturación oculta.
- **Sincronización:** Supabase Free (Auth + Postgres + RLS) y Google Drive como almacenamiento de archivo frío.
- **Rigor Científico:** Las simulaciones no son ilustraciones artísticas; se rigen por ecuaciones diferenciales explícitas, invariantes físicos y análisis dimensional homogéneo (SI).
- **Garantía de No Pérdida:** Todos los registros fuente originales son inmutables; las equivalencias semánticas son relaciones M:N que unen conceptos sin destruir procedencia.

---

## 📊 Invariantes Curriculares Auditados (Catálogo v5)

| Métrica | Valor Auditado v5 | Descripción e Integridad |
|---|---:|---|
| **Asignaturas** | **307** | 303 materias base + 4 propuestas previas |
| **Relaciones DAG** | **540** | Grafo dirigido acíclico estricto (0 ciclos) |
| **Frentes Topológicos** | **14** | Bloques concurrentes de estudio sin dependencias mutuas |
| **Registros Fuente** | **9,137** | **Invariable total de registros y propuestas sin pérdida de IDs** |
| ↳ *Base Excel* | 3,695 | Temas literales del plan de estudios base |
| ↳ *TECH Universidad* | 3,313 | Epígrafes preservados por página y capítulo |
| ↳ *UdeG Literal* | 1,609 | Líneas de contenido temático original UdeG |
| ↳ *Propuestas v5* | 520 | 52 módulos nuevos (12 Física, 12 Matemáticas, 12 Química, 16 Ingeniería) |
| **Alertas de Auditoría** | **112** | Discrepancias documentales y epígrafes catalogados para revisión |
| **Videojuegos Científicos** | **18** | Diseñados con modelos diferenciales reales (RK4, Navier-Stokes, Euler-Lagrange, Fourier) |

---

## 🚀 Inicio Rápido en Windows (Desarrollo)

### Requisitos previos
- Node.js LTS (v20+ o v24+)
- `pnpm` (v10+ o v12+)
- Git

### Comandos de instalación y ejecución
```bash
# 1. Clonar repositorio
git clone https://github.com/ChristopherJacobAR/AcademIA.git
cd AcademIA

# 2. Instalar dependencias del monorepo
pnpm install

# 3. Ejecutar pruebas unitarias y de integridad curricular
pnpm test

# 4. Iniciar servidor de desarrollo PWA
pnpm dev
```
La aplicación abrirá en `http://localhost:3000` con recarga rápida y soporte táctil para iPad.

---

## 🍎 Despliegue en iPad y Mac

### Opción A: Acceso Inmediato en iPad (PWA sin cables ni Xcode)
1. Abre Safari en tu iPad y navega a la URL de la aplicación (o vía red local `http://<IP-DE-TU-PC>:3000`).
2. Toca el botón **Compartir** de Safari.
3. Selecciona **«Añadir a pantalla de inicio»**.
4. ¡Listo! La app se ejecutará a pantalla completa, con caché offline persistente y soporte para Apple Pencil.

### Opción B: Compilación Nativa en Mac con Xcode
Cuando tu Mac esté libre:
```bash
# En tu Mac:
git pull origin main
pnpm install
pnpm build

# Si utilizas el wrapper de Capacitor:
npx cap sync ios
npx cap open ios
```
En Xcode, selecciona tu equipo de desarrollo personal y tu iPad conectado, y presiona **Run (Cmd+R)**.

---

## 📁 Estructura del Monorepo

```text
AcademIA/
├── apps/
│   └── web/                   # Aplicación PWA (React 18 + Vite + Tailwind + KaTeX)
│       ├── src/
│       │   ├── components/    # Header, Navigation, MathView (KaTeX)
│       │   ├── views/         # Dashboard, Waves, Courses, Records, Alerts, KaTeX, Arcade, Backup
│       │   └── index.css      # Estilos adaptativos iPadOS (safe-areas, touch)
│       └── vite.config.ts     # Configuración PWA y service worker
├── packages/
│   ├── core/                  # Dominio, contratos Zod, algoritmos DAG (Kahn), FSRS, catálogo de juegos
│   │   └── src/
│   │       ├── types/         # Tipos TypeScript inmutables
│   │       ├── schemas/       # Validación Zod
│   │       ├── dag/           # Grafo DAG, detección de ciclos y frentes
│   │       ├── games/         # Catálogo de 18 juegos científicos
│   │       └── integrity/     # Validador de invariantes v5
│   └── storage/               # Capa de persistencia local-first
│       └── src/
│           ├── db/            # Base de datos Dexie (IndexedDB)
│           ├── importer/      # Importador por lotes (chunking sin congelar UI)
│           └── backup/        # Exportador/importador cifrado AES-GCM (WebCrypto)
├── docs/
│   ├── adr/                   # Registros de Decisiones Arquitectónicas (ADR 0001 a 0005)
│   ├── ARQUITECTURA_MAESTRA_ACADEMIA_CIENTIFICA_IA_v2.md
│   ├── Dictamen_Academia_FISICA_v5.md
│   ├── FISICA_v5_manifiesto_integridad.json
│   └── MANIFIESTO_ARQUITECTURA_ACADEMIA_CIENTIFICA_IA_v2.json
├── pnpm-workspace.yaml        # Configuración del monorepo pnpm
└── package.json
```

---

## 🧪 Pruebas Automatizadas

El proyecto incluye una suite de pruebas con **Vitest**:
- ✅ **DAG & Orden Topológico:** Verificación de aciclicidad y cálculo determinista de las 14 olas.
- ✅ **Contratos Zod:** Validación estricta de registros fuente, asignaturas y alertas.
- ✅ **Integridad de Catálogo Real v5:** Validación automatizada de los 307 cursos, 540 relaciones y 9,137 registros fuente.
- ✅ **Persistencia Dexie en Memoria:** Ingestión por lotes, idempotencia y no duplicación de identificadores.
- ✅ **Respaldos y Cifrado:** Comprobación de sumas SHA-256 y cifrado simétrico AES-GCM (PBKDF2).

```bash
pnpm test
```

---

## 🛡️ Licencia y Privacidad
Este software está diseñado para uso personal. No almacena datos en la nube sin autorización explícita del usuario y no redistribuye material de terceros con derechos reservados.
