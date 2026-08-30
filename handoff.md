# Handoff - Día 1 - Fundación Técnica
# Handoff - Celeritas

## Estado Actual
- **MVP 0 (Fundación Técnica):** COMPLETADO.
- **MVP 1 (Hub Global de Administración):** COMPLETADO.
- **MVP 2 (Login y Onboarding del Tenant):** COMPLETADO.
  - Generación de token y validación (Onboarding).
  - Flujo de creación de contraseña inicial (bcrypt).
  - Protección de Login multi-tenant (Zero Trust en authorize).
- **MVP 3 (Dashboard Base del Tenant):** COMPLETADO.
  - Sidebar reactivo a feature flags JSON.
  - Header con botón de logout y perfil.
  - Lectura de métricas base y bitácora (AuditLogs).
- **MVP 4 (Gestión de Usuarios del Tenant):** COMPLETADO.
  - Tabla de usuarios (`/dashboard/users`).
  - Modal de invitación y envío de email integrado.
  - Gestión de roles con Server Actions y validación de permisos.
- **MVP 5 (Feature Flags y Módulos Opcionales):** COMPLETADO.
  - Interfaz de administración de módulos (Toggles) agregada a la tabla del Hub.
  - Acción restringida solo para `SUPER_ADMIN`.
  - Impacto visual instantáneo en el menú lateral de los Tenants.
- **MVP 6 (Módulo de CRM basado en Twenty):** COMPLETADO.
  - Modelos en Prisma aislados con zero-trust multitenancy (`CrmCompany`, `CrmPerson`, `CrmOpportunity`, `CrmNote`).
  - Lógica de arrastrar y soltar optimista con `@hello-pangea/dnd` para el Kanban Board.
  - Vistas dedicadas y condicionales (FeatureFlags) en el Sidebar.
  - Scripts generados y schema.prisma de ExpertosMKD restaurado (se añadieron los de Celeritas sin destruir los anteriores).

## Próximos Pasos (Inmediatos)
1. Iniciar **MVP 7: Módulo de Cotizador** usando los procesos y ciclo Spec-Driven.
2. Explorar separación completa de Turborepo si se decide escalar el código físicamente (aunque actualmente Next.js rutea todo internamente y seguro en la branch).

## Decisiones Arquitectónicas Recientes
- Se movió el ecosistema de tenants a `src/app/site/[tenant]` y se ajustó `proxy.ts` para resolver el conflicto del App Router entre `/[lang]` y `/[tenant]`.

## 🚨 Issues conocidos
- **GitHub Spec Kit (`specify`) instalado exitosamente**: A diferencia de npm, `specify` fue instalado mediante el repositorio oficial de Python (`pip`). El proyecto fue inicializado en el directorio actual y se ha validado que los templates y la constitución ya residen en `.specify/memory/constitution.md`.
- El Middleware de Next.js en Edge Runtime falla al usar `PrismaClient` directamente. Se dejó comentada la llamada directa a Prisma en `tenant-middleware.ts` para evitar crash; la resolución final de tenant deberá hacerse a través de inyección de headers (subdominio) y consultas en Server Components o un fetch hacia una API Route.
- **Error de conexión a la Base de Datos (Supabase):** Al intentar aplicar la migración a la nueva base de datos (`nxhfluxdylpsgnodmxyq`), el servidor rechaza las credenciales con un error de `Authentication failed`. La contraseña (`yP1BDksAG4jM21$`) fue correctamente configurada usando url-encoding (`%24`) en el `.env`, por lo que es posible que haya un typo en la contraseña original que me compartiste o la base de datos de Supabase se encuentre pausada/bloqueando la IP. Se generó el Prisma Client localmente de todas formas.
- Las invitaciones se están enviando, pero aún no existe la vista `/auth/verify` para ser consumidas (se resolverá en el MVP 2).

## 🔗 Enlaces importantes
- Repositorio: C:\CODES\ExpertosMKD-website
- Base de datos: (Supabase Celeritas)
- Dominio de prueba: expertosmkd.com
