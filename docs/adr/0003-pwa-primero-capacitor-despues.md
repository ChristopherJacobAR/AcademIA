# ADR 0003: Estrategia de Plataforma (PWA Primero, Capacitor para iPadOS/Xcode)

- **Fecha:** 2026-10-21
- **Estado:** Aceptado
- **Contexto:**
  El desarrollo se lleva a cabo en una estación Windows mientras el dispositivo de estudio principal es un iPad con soporte para Apple Pencil y teclado, disponiendo de una Mac con Xcode y cuenta de Apple Developer para compilaciones finales.
- **Decisión:**
  1. Construir la aplicación como **Progressive Web App (PWA)** totalmente funcional en Windows y en Safari de iPad (pantalla completa mediante "Añadir a pantalla de inicio").
  2. Implementar diseño adaptativo de primer nivel para iPad:
     - Orientaciones Horizontal (Landscape) y Vertical (Portrait).
     - Áreas seguras (`safe-area-inset`), zonas táctiles mínimas de 44x44 pt.
     - Soporte para navegación con teclado, atajos de hardware y reducción de movimiento (`prefers-reduced-motion`).
  3. Dejar el proyecto preparado para encapsular con **Capacitor iOS** en la Mac sin reescribir la lógica de UI ni las simulaciones matemáticas.
- **Consecuencias:**
  - Desarrollo ágil e iterativo desde Windows.
  - El usuario puede probar y usar la app en su iPad inmediatamente sin depender del límite de 7 días del aprovisionamiento gratuito de Xcode.
  - Cuando se use la Mac, un simple `git pull` y `npx cap sync` preparará el proyecto en Xcode.
