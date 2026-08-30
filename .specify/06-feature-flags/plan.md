# MVP 5: Feature Flags y Módulos Opcionales - Plan de Implementación

## 1. Arquitectura y Almacenamiento
El modelo `Tenant` en `schema.prisma` ya posee el campo `featureFlags Json @default("{}")`. Aprovecharemos este campo sin necesidad de migraciones. Toda la lógica de alteración de este JSON ocurrirá en un Server Action nuevo, exclusivo para administradores globales de Celeritas.

## 2. Componentes y Flujo UI en el Hub
- **Componente: `HubTenantsTable.tsx`**
  - Actualmente, el dashboard global renderiza los tenants en una tabla dentro de `page.tsx`. Separaremos la tabla a un **Client Component** (o mantendremos la tabla Server Side e inyectaremos un botón cliente) para manejar estados de modales (Toggles).
  - Por cada fila, añadiremos un botón "⚙️ Módulos".
- **Componente: `FeatureFlagsModal.tsx`**
  - Un Slide-Over o Modal central que recibe el `tenantId` y su `featureFlags` actual.
  - Renderiza una lista de Toggles UI (usando botones estilizados o componentes nativos de HTML) para los 5 módulos: CRM, Tienda, Cotizador, Citas y Proyectos.
  - Al hacer "Guardar", dispara el Server Action enviando un JSON validado.

## 3. Lógica de Negocio (Server Action)
- **Ruta del Server Action:** `src/actions/hub.ts` (Nuevo archivo para acciones globales, distinto a `tenant.ts` que puede orientarse a tenants individuales).
- **Acción:** `updateTenantFeatures(tenantId: string, flags: object)`
  - **Validación Zero Trust:** Solo permitir si el usuario en sesión es un `SUPER_ADMIN` (o tiene permisos globales). NOTA: Como en MVP 1 implementamos acceso al `/hub` libre (o basado en un hardcoded check, lo verificaremos), aseguraremos que no cualquier usuario de tenant pueda acceder a este action.
  - **Prisma:** Ejecutar `prisma.tenant.update({ where: { id: tenantId }, data: { featureFlags: flags } })`.
  - **Auditoría:** Crear un registro en `AuditLog` detallando el cambio (ej. `{ action: "feature.enabled", details: { modules: flags } }`).

## 4. Efecto de Propagación (Side-effects)
Al guardar los flags:
- La revalidación de la caché de Next.js (`revalidatePath("/hub")` y potencialmente revalidar layouts) garantizará que cuando los usuarios de ese tenant recarguen su página, el `TenantSidebar` mostrará u ocultará los botones según la nueva verdad en la base de datos.

## 5. Prevención de Riesgos de Seguridad
- Validar minuciosamente la sesión de NextAuth en el Server Action para asegurar que solo los operadores de la plataforma matriz (Celeritas) puedan mutar los Feature Flags, no los tenants en sí (incluso si son Owners de sus tenants). En nuestro modelo actual, un Owner solo es Owner de su `tenantId`.

## 6. Verificación Manual
1. Ingresar al `/hub`. Abrir modal de módulos para un tenant.
2. Activar "Cotizador" y guardar.
3. Iniciar sesión en ese tenant en otra pestaña. Verificar que "Cotizador" aparece en el Sidebar.
