# MVP 6: Módulo de CRM (Basado en Twenty) - Especificación

## 1. Resumen Ejecutivo
El Módulo CRM de Celeritas proporciona a los tenants las capacidades esenciales de gestión de clientes inspiradas en la simplicidad y poder de [Twenty CRM](https://twenty.com). Esto incluye la gestión de Empresas (Companies), Personas (People), y Oportunidades (Opportunities/Deals) con una interfaz limpia, orientada a tablas y pipelines Kanban.

## 2. Declaración del Problema
Las PYMES y Agencias que contratan Celeritas necesitan un lugar centralizado para gestionar a sus clientes. Un CRM estándar es complejo de integrar y costoso. Al proveer un CRM embebido en Celeritas (activable vía Feature Flags), los tenants pueden gestionar todo su embudo comercial en el mismo lugar donde administran su página web.

## 3. Arquitectura de Datos (Clonación Conceptual de Twenty)
El esquema de datos respetará la arquitectura relacional principal de Twenty, adaptada a nuestro entorno Prisma Multi-Tenant (RLS):
- **CrmCompany:** Representa cuentas u organizaciones B2B. Atributos: `name`, `domain`, `linkedin`, `annualRevenue`, `address`.
- **CrmPerson:** Representa contactos o leads B2C/B2B. Atributos: `firstName`, `lastName`, `email`, `phone`, `jobTitle`, `linkedin`. Relacionado a `CrmCompany`.
- **CrmOpportunity:** Representa negocios (Deals) en un Pipeline. Atributos: `name`, `amount`, `closeDate`, `stage`. Relacionado a `CrmPerson` y/o `CrmCompany`.
- Todas las entidades incluirán `tenantId` para garantizar aislamiento por RLS, y `ownerId` para asignar responsables.

## 4. Criterios de Éxito
- El esquema Prisma se actualiza con los modelos `CrmCompany`, `CrmPerson`, `CrmOpportunity`, `CrmNote` y `CrmTask`.
- Dentro de `apps/celeritas` (o la ruta correspondiente al Tenant), si el flag `crm` está activo, las vistas `/dashboard/crm/companies`, `/dashboard/crm/people` y `/dashboard/crm/opportunities` son accesibles.
- UI idéntica o inspirada en Twenty: Tablas con scroll horizontal para listados, y tableros Kanban (`dnd-kit` o similar nativo) para las oportunidades.
- Se puede crear, editar y eliminar registros asegurando cero filtraciones de datos entre Tenants.

## 5. UI / UX Esperada
- **Diseño minimalista:** Uso extenso de blanco, gris claro y tipografía Inter/sans-serif.
- **Tablas interactivas:** Celdas editables en línea o Side-sheets (Paneles laterales) para editar los detalles de una Persona o Empresa.
- **Kanban:** Las etapas de oportunidad (`NEW`, `CONTACTED`, `QUALIFIED`, `PROPOSAL`, `WON`, `LOST`) representadas en columnas arrastrables.

## 6. Fuera de Alcance Inicial (Fase 1 del CRM)
- Workflows automáticos (ej. envío de correos al cambiar de etapa).
- Integraciones con Gmail/Outlook (IMAP sync) nativas a cada registro (se hará después).
- Permisos granulares a nivel de fila (Row-level permissions intra-tenant). Todos los usuarios ADMIN y MEMBER de un tenant verán todos los leads de su tenant en esta fase.
