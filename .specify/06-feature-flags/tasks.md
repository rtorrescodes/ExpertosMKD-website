# MVP 5: Tareas de Feature Flags

## Fase 1: Server Actions para el Hub
- [x] Crear archivo `src/actions/hub.ts`.
- [x] Implementar la función `updateTenantFeatures(tenantId, flags)`.
- [x] Agregar validación estricta para asegurar que solo usuarios autorizados (SuperAdmins) puedan ejecutar esta acción.
- [x] Incorporar el registro en `AuditLog` dentro de la transacción Prisma.

## Fase 2: Componentes UI
- [x] Refactorizar la tabla de Tenants en `/hub/page.tsx` para inyectar componentes interactivos, extrayendo la tabla hacia un `<HubTenantsTable />` Client Component si es necesario.
- [x] Crear el componente `<FeatureFlagsModal />` en `src/components/hub/FeatureFlagsModal.tsx` con soporte para Toggles (Switch).
- [x] El modal debe mapear las 5 features clave: CRM, Tienda, Cotizador, Citas, Proyectos.

## Fase 3: Integración
- [x] Vincular el botón "Módulos" de la tabla de Tenants para abrir el `<FeatureFlagsModal />` pasando los flags actuales.
- [x] En el `onSubmit` del modal, invocar `updateTenantFeatures`, manejar estados de carga y mostrar errores si ocurren.
- [x] Ejecutar `router.refresh()` o `revalidatePath` al concluir exitosamente para actualizar la UI del Hub en tiempo real.

## Fase 4: Pruebas Globales
- [x] Probar encender/apagar un módulo en el Hub.
- [x] Confirmar que el registro de `AuditLog` del respectivo Tenant se crea exitosamente reflejando el cambio de estructura.
- [x] Confirmar que el Tenant observa instantáneamente el cambio en el menú lateral.
