# MVP 9: Módulo de Control de Proyectos - Plan de Implementación

## 1. Actualización de Prisma (`schema.prisma`)

```prisma
// ==========================================
// ====== CELERITAS PROJECTS (ASANA/GANTT) ==
// ==========================================

model PrjProject {
  id             String   @id @default(cuid())
  tenantId       String
  name           String
  description    String?  @db.Text
  status         String   @default("PLANNING") // PLANNING, ACTIVE, ON_HOLD, COMPLETED
  
  startDate      DateTime?
  endDate        DateTime?

  // Relaciones Modulares
  personId       String?
  companyId      String?
  opportunityId  String?

  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  
  tasks          PrjTask[]

  tenant         Tenant          @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  person         CrmPerson?      @relation(fields: [personId], references: [id])
  company        CrmCompany?     @relation(fields: [companyId], references: [id])
  opportunity    CrmOpportunity? @relation(fields: [opportunityId], references: [id])
}

model PrjTask {
  id             String   @id @default(cuid())
  projectId      String
  
  title          String
  description    String?  @db.Text
  status         String   @default("TODO") // TODO, IN_PROGRESS, REVIEW, DONE
  priority       String   @default("MEDIUM") // LOW, MEDIUM, HIGH, URGENT
  
  startDate      DateTime?
  dueDate        DateTime?

  // Asignación de Equipo (Usuarios del Tenant)
  assignedToId   String?
  
  // Dependencias (MS Project style)
  dependsOnId    String?

  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  project        PrjProject  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  assignedTo     User?       @relation(fields: [assignedToId], references: [id])
  
  dependsOn      PrjTask?    @relation("TaskDependencies", fields: [dependsOnId], references: [id])
  dependentTasks PrjTask[]   @relation("TaskDependencies")
}
```
*(Nota: Añadir array `assignedTasks PrjTask[]` al modelo `User`, y `prjProjects`, `prjTasks` a `Tenant`).*

## 2. Server Actions Core (`src/actions/projects.ts`)
- `createProject(data)`: Crea la cabecera del proyecto.
- `createTask(data)`: Crea una tarea, valida dependencias cíclicas si las hay.
- `updateTaskStatus(taskId, status)`: Cambia de columna en Kanban.
- `updateTaskDates(taskId, startDate, dueDate)`: Modificado desde el Gantt.

## 3. UI Administrativa (`/dashboard/projects`)
- **Lista Global (`/dashboard/projects`)**: Tabla con barra de progreso circular calculada dinámicamente (`doneTasks / totalTasks * 100`).
- **Navegación Interna del Proyecto (`/dashboard/projects/[id]`)**: Pestañas de sub-navegación (Lista, Kanban, Gantt, Configuración).

## 4. Visualizaciones Complejas
1. **El Kanban:** Reutilizaremos lógica exacta del CRM (Drag & Drop con `@hello-pangea/dnd`), pero mapeando los `status` de `PrjTask`.
2. **El Diagrama de Gantt:** Construiremos un componente nativo usando Tailwind CSS Grid o Flexbox.
   - Algoritmo: Encontrar la fecha mínima del proyecto y la fecha máxima. Generar un array de días. Dibujar un grid. Cada tarea calcula su `marginLeft` (días desde el inicio general) y su `width` (duración en días) para renderizar una barra horizontal de color.
   - Si la tarea tiene `dependsOnId`, se puede trazar un SVG o un indicativo visual.
