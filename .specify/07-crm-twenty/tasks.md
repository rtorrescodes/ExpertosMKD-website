# MVP 6: Tareas de Módulo CRM

## Fase 1: Arquitectura de Base de Datos
- [x] Modificar `prisma/schema.prisma` para incluir `CrmCompany`, `CrmPerson`, `CrmOpportunity` y `CrmNote`.
- [x] Ejecutar `prisma format` y `prisma db push` (o crear migración local) para actualizar la BD.
- [x] Generar los tipos de Prisma actualizados (`prisma generate`).

## Fase 2: Lógica de Servidor (Server Actions)
- [x] Instalar `@hello-pangea/dnd` para el soporte Kanban futuro.
- [x] Crear `src/actions/crm.ts`.
- [x] Implementar operaciones CRUD para `CrmCompany` con validación estricta de `tenantId`.
- [x] Implementar operaciones CRUD para `CrmPerson` vinculables a `CrmCompany`.
- [x] Implementar operaciones CRUD para `CrmOpportunity` y la lógica para actualizar el `stage` del Kanban.

## Fase 3: UI - Tablas de Personas y Empresas (Data-Grids)
- [x] Construir `/site/[tenant]/dashboard/crm/companies/page.tsx` y su respectiva tabla interactiva.
- [x] Construir `/site/[tenant]/dashboard/crm/people/page.tsx` con un diseño similar.
- [x] Crear modales de creación (Slide-overs o dialogs) para dar de alta registros rápidamente.

## Fase 4: UI - Tablero Kanban de Oportunidades
- [x] Construir `/site/[tenant]/dashboard/crm/opportunities/page.tsx`.
- [x] Implementar el componente `<KanbanBoard />` usando `@hello-pangea/dnd`.
- [x] Mapear las oportunidades a las columnas: NEW, CONTACTED, QUALIFIED, PROPOSAL, WON, LOST.
- [x] Conectar el evento `onDragEnd` con el Server Action `updateOpportunityStage`.

## Fase 5: Integración y QA
- [x] Actualizar `TenantSidebar.tsx` para mostrar la sección "CRM" (con sub-links) **solo si** `tenant.featureFlags.crm` es verdadero.
- [ ] Probar flujo completo: Crear Empresa -> Crear Persona -> Crear Oportunidad -> Mover Oportunidad en Kanban.
