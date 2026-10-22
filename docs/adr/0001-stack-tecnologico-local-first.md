# ADR 0001: Stack Tecnológico Local-First y PWA

- **Fecha:** 2026-10-21
- **Estado:** Aceptado
- **Contexto:**
  Academia Científica IA es una aplicación personal de aprendizaje científico exigente (Física, Matemáticas, Química, Ingeniería), diseñada para operar a costo 0 MXN/mes en software/hosting, con desarrollo primario en Windows, sincronización vía GitHub, y ejecución/estudio en iPadOS y navegadores modernos.
- **Decisión:**
  Se adopta una arquitectura monorepo administrada con `pnpm` workspace conteniendo:
  1. `apps/web`: Aplicación PWA construida con **React 18/19**, **TypeScript**, **Vite** y `vite-plugin-pwa` para funcionamiento 100% offline tras la instalación.
  2. `packages/core`: Entidades de dominio, contratos y esquemas **Zod**, motor de grafos DAG (Kahn / ordenamiento topológico), tipos de gamificación y evaluación.
  3. `packages/storage`: Capa de persistencia local sobre **IndexedDB** usando **Dexie.js**, motor de importación en lotes, verificador de integridad SHA-256 y exportador/restaurador de copias de seguridad cifradas con WebCrypto (AES-GCM).
  4. Interfaz táctil y de escritorio con **Tailwind CSS**, componentes accesibles sin dependencias de CDN, iconos SVG de **Lucide React**, y renderizado matemático con **KaTeX**.
- **Consecuencias:**
  - Cero costo de servidor: la app funciona enteramente en el cliente (iPad / PC / Mac).
  - Portabilidad inmediata a macOS y Xcode vía Capacitor cuando se requiera empaquetado nativo para iPad.
  - Independencia de APIs de pago: las funciones de IA externas son colaboradoras manuales asistidas (copiar/pegar/importar).
