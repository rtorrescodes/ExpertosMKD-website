# MVP 6: Módulo CRM - Plan de Implementación

## 1. Actualización de Prisma (`schema.prisma`)
Agregaremos los siguientes modelos, asegurando que todos tengan `tenantId` y RLS (Row Level Security):

```prisma
model CrmCompany {
  id             String   @id @default(uuid())
  tenantId       String
  name           String
  domain         String?
  linkedin       String?
  annualRevenue  Decimal?
  address        String?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  
  people         CrmPerson[]
  opportunities  CrmOpportunity[]
  notes          CrmNote[]
  
  tenant         Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
}

model CrmPerson {
  id             String   @id @default(uuid())
  tenantId       String
  firstName      String
  lastName       String
  email          String?
  phone          String?
  jobTitle       String?
  linkedin       String?
  companyId      String?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  company        CrmCompany? @relation(fields: [companyId], references: [id])
  opportunities  CrmOpportunity[]
  notes          CrmNote[]
  
  tenant         Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
}

model CrmOpportunity {
  id             String   @id @default(uuid())
  tenantId       String
  name           String
  amount         Decimal?
  stage          String   @default("NEW") // NEW, CONTACTED, QUALIFIED, PROPOSAL, WON, LOST
  closeDate      DateTime?
  personId       String?
  companyId      String?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  person         CrmPerson?  @relation(fields: [personId], references: [id])
  company        CrmCompany? @relation(fields: [companyId], references: [id])
  notes          CrmNote[]
  
  tenant         Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
}

model CrmNote {
  id             String   @id @default(uuid())
  tenantId       String
  content        String
  companyId      String?
  personId       String?
  opportunityId  String?
  createdAt      DateTime @default(now())

  company        CrmCompany? @relation(fields: [companyId], references: [id])
  person         CrmPerson?  @relation(fields: [personId], references: [id])
  opportunity    CrmOpportunity? @relation(fields: [opportunityId], references: [id])
  
  tenant         Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
}
```

## 2. Server Actions (`src/actions/crm.ts`)
Crearemos CRUD actions genéricos y seguros (validando `tenantId` en sesión):
- `createCompany`, `getCompanies`, `updateCompany`, `deleteCompany`
- `createPerson`, `getPeople`, `updatePerson`, `deletePerson`
- `createOpportunity`, `getOpportunities`, `updateOpportunityStage`

## 3. UI y Componentes (App Celeritas)
Dado que estamos usando la arquitectura base (`ExpertosMKD-website` actual en root, o moviéndonos a `apps/celeritas`), construiremos las rutas bajo el scope del tenant:
- `/site/[tenant]/dashboard/crm/companies`
- `/site/[tenant]/dashboard/crm/people`
- `/site/[tenant]/dashboard/crm/opportunities` (Kanban Board)

Reutilizaremos la estética de tablas del MVP 4 pero con un diseño más denso (tipo data-grid) inspirado en Twenty.

## 4. Dependencias Adicionales
- Para el tablero Kanban, instalaremos `@hello-pangea/dnd` (el fork moderno y mantenido de `react-beautiful-dnd`) para garantizar compatibilidad con React 18/19.

## 5. Prevención de Riesgos de Seguridad (Zero Trust)
Todas las consultas a la base de datos deben incluir obligatoriamente el `where: { tenantId: session.user.tenantId }`. Ningún endpoint del CRM puede confiar en un `tenantId` enviado desde el cliente.
