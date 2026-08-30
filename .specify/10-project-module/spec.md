# MVP 9: Módulo de Control de Proyectos - Especificación

## 1. Resumen Ejecutivo
Un híbrido entre Asana, Basecamp y MS Project, integrado de forma nativa en Celeritas. Permite a los negocios transformar un trato cerrado (CRM) o una cotización aceptada en un "Proyecto" ejecutable. Incluye gestión de tareas para el equipo interno, asignación de responsables, fechas de entrega, dependencias entre tareas, y vistas avanzadas (Kanban y Diagrama de Gantt).

## 2. Requerimientos Core
1. **Gestión de Proyectos:**
   - Creación de un proyecto ligado a un Cliente del CRM (`CrmPerson` / `CrmCompany`).
   - Estados del proyecto: PLANNING, ACTIVE, ON_HOLD, COMPLETED.
   - Equipo: Posibilidad de asignar tareas a los empleados dados de alta en el Tenant (reutilizando el módulo de Usuarios / MVP 4).
2. **Motor de Tareas y Dependencias:**
   - Crear tareas con `startDate` y `dueDate`.
   - Asignar responsable (`assignedToId`).
   - **Dependencias (MS Project style):** Una tarea puede requerir que otra tarea finalice antes de poder iniciarse (`dependsOnId`).
3. **Múltiples Vistas (Visualizaciones):**
   - **Vista de Lista:** Estilo Asana, rápida y tabular.
   - **Vista Kanban:** Columnas drag-and-drop (TODO, IN_PROGRESS, REVIEW, DONE). Reutilizaremos `@hello-pangea/dnd` ya instalado.
   - **Vista Gantt:** Una visualización temporal (Timeline/Gantt) basada en CSS Grid interactivo que muestre el flujo del proyecto y sus fechas.
4. **Interconexión Modular (Sinergia):**
   - Si el tenant tiene el CRM activo, puede convertir una Oportunidad (Won) directamente en un Proyecto, heredando el cliente.
   - (Futuro) Portal del Cliente: El cliente final recibe un link mágico para ver el estatus de su proyecto al estilo Basecamp.

## 3. Arquitectura de Datos
- **PrjProject:** Entidad contenedora (`tenantId`, `name`, `status`, `startDate`, `endDate`, `personId`, `companyId`).
- **PrjTask:** Renglón de trabajo (`projectId`, `title`, `description`, `status`, `startDate`, `dueDate`, `assignedToId` (User), `dependsOnId` (relación a sí misma)).

## 4. UI / UX Esperada
- **Hub de Proyectos:** `/site/[tenant]/dashboard/projects`
- **Dashboard del Proyecto:** `/site/[tenant]/dashboard/projects/[id]` (Muestra resumen, progreso en %).
- **Kanban:** `/site/[tenant]/dashboard/projects/[id]/kanban`
- **Gantt:** `/site/[tenant]/dashboard/projects/[id]/gantt`

## 5. Prevención de Riesgos y Reglas Zero-Trust
- Todas las tareas y proyectos deben filtrar por `tenantId`.
- Sólo el equipo interno (Users) autenticados pueden ver o mover tarjetas Kanban.
- Las vistas Gantt deben manejar fechas nulas de forma segura (fallback a la fecha actual si una tarea no tiene `startDate`).
