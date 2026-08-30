# MVP 9: Tareas de Módulo de Control de Proyectos

## Fase 1: Arquitectura de Datos
- [x] Inyectar `PrjProject` y `PrjTask` en `schema.prisma`.
- [x] Actualizar relaciones inversas en `User`, `Tenant`, `CrmPerson`, `CrmCompany`, `CrmOpportunity`.
- [x] Ejecutar migraciones (`prisma db push` y generar tipos).

## Fase 2: Lógica de Servidor
- [x] Crear `src/actions/projects.ts` con CRUD para proyectos y tareas.
- [x] Habilitar función `updateTaskStatus` y `updateTaskDates` para soportar las UI interactivas.

## Fase 3: Layout y Navegación
- [x] Actualizar `TenantSidebar.tsx` para inyectar "Proyectos" (icono: Kanban o Folder).
- [x] Crear `/site/[tenant]/dashboard/projects/page.tsx` (Lista de proyectos con su % de avance).
- [x] Crear layout base del proyecto: `/site/[tenant]/dashboard/projects/[id]/layout.tsx` (Para albergar las pestañas de Kanban y Gantt).

## Fase 4: Kanban Board
- [x] Crear vista `/site/[tenant]/dashboard/projects/[id]/kanban/page.tsx`.
- [x] Implementar componente Kanban usando `@hello-pangea/dnd` mapeando estados (TODO, IN_PROGRESS, REVIEW, DONE).

## Fase 5: Diagrama de Gantt
- [x] Crear vista `/site/[tenant]/dashboard/projects/[id]/gantt/page.tsx`.
- [x] Construir componente custom de línea de tiempo con Tailwind (CSS Grid o Flex).
- [x] Mapear tareas en el timeline, respetando `startDate` y `dueDate`.

## Fase 6: QA e Integraciones
- [x] Validar que las tareas se asignan correctamente a usuarios del sistema.
- [x] Chequear permisos y zero-trust (Tenant isolation).
