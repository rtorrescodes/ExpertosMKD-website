# MVP 5: Feature Flags y Módulos Opcionales - Especificación

## 1. Resumen Ejecutivo
Este MVP establece el mecanismo centralizado para encender o apagar los módulos de negocio (CRM, Tienda, Cotizador, Citas, Proyectos) de cada Tenant. Esta gestión es privilegio exclusivo del SuperAdmin desde el Hub Global (`/hub`). Los tenants no pueden auto-habilitar módulos; su habilitación depende estrictamente de su plan comercial contratado.

## 2. Declaración del Problema
Actualmente, los tenants se crean con los Feature Flags iniciales pero, una vez creados, no existe una interfaz para que el SuperAdmin de Celeritas actualice esos permisos si un cliente decide realizar un "upgrade" (ej. contratar el módulo CRM) o un "downgrade" de su suscripción.

## 3. Audiencia Objetivo
- **SuperAdmin de Celeritas:** Personal interno de Celeritas que opera el panel `/hub`.

## 4. Criterios de Éxito
- La tabla de Tenants en el `/hub` permite abrir una vista o modal de configuración para un Tenant específico.
- El modal permite al SuperAdmin visualizar y alternar los "Feature Flags" mediante un sistema de toggles (interruptores).
- Los cambios se guardan persistentemente en la columna `featureFlags` (tipo JSON) del modelo `Tenant` en Prisma.
- Cuando el SuperAdmin enciende un feature (ej. CRM), el sidebar del respectivo Tenant (`TenantSidebar.tsx`) muestra el enlace de forma inmediata (al refrescar).

## 5. Casos de Uso
- **Caso A (Upsell de Cliente):** El cliente "Agencia Alfa" que solo tenía el plan base decide contratar el Módulo CRM. El SuperAdmin de Celeritas ingresa al Hub Global, hace clic en "Gestionar Módulos" para la Agencia Alfa, enciende el switch de CRM y guarda. Al día siguiente, la Agencia Alfa ve el módulo CRM en su menú lateral.
- **Caso B (Downgrade/Falta de Pago de un módulo):** Un cliente deja de pagar por el Módulo de Citas. El SuperAdmin apaga el módulo de Citas para ese Tenant. La vista desaparece para los usuarios del Tenant.

## 6. Requisitos Funcionales
- **Estructura JSON (featureFlags):**
  - `crm` (boolean)
  - `ecommerce` (boolean)
  - `quotes` (boolean)
  - `appointments` (boolean)
  - `projects` (boolean)
- **Vistas y Componentes (`/hub`):**
  - Actualizar la tabla en `/hub/page.tsx` para incluir un botón "Módulos" o "Configurar".
  - Componente `<FeatureFlagsModal />` que cargue el estado actual del JSON del Tenant.
- **Server Actions (`src/actions/hub.ts`):**
  - `updateTenantFeatures(tenantId: string, features: object)`: Ejecuta el update en Prisma. Registra la acción en `AuditLog` como `tenant.features_updated` a nivel global (o a nivel de tenant).

## 7. Asunciones y Fuera de Alcance
- **Fuera de Alcance:** Cobro automático vía Stripe por activar un módulo. Por ahora, el switch es manual (asumiendo que el SuperAdmin verificó el pago externamente).
- **Asunción:** La seguridad del `/hub` (limitada al SuperAdmin) ya está garantizada, pero se reforzará en el Server Action exigiendo un rol de SUPERADMIN o un entorno administrativo seguro (Zero Trust).
