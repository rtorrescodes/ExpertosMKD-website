# MVP 3: Dashboard Base del Tenant - Plan de Implementación

## 1. Arquitectura y Obtención de Datos
Usaremos un Server Component para el `layout.tsx` del dashboard, el cual interceptará la petición, leerá el `tenantId` de la sesión de NextAuth (y validará mediante el parámetro de ruta `[tenant]`). Se consultará Prisma para traer la fila completa del `Tenant` y leer la columna `featureFlags`.

## 2. Componentes Principales
- **`src/app/site/[tenant]/dashboard/layout.tsx`**: 
  1. Verifica que la sesión exista.
  2. Consulta la base de datos `prisma.tenant.findUnique` usando el subdominio de la ruta.
  3. Compara que `session.user.tenantId` coincida (Zero Trust). Si no, redirecciona a `/403`.
  4. Pasa los `featureFlags` al Sidebar.
- **`src/components/dashboard/Sidebar.tsx`**: 
  - Renderiza los links base (`Inicio`, `Usuarios`, `Configuración`).
  - Renderiza condicionalmente links como `Contactos` (CRM), `Cotizaciones` (Cotizador) evaluando el objeto `featureFlags`.
- **`src/app/site/[tenant]/dashboard/page.tsx`**:
  - Obtiene un conteo rápido (`prisma.user.count({ where: { tenantId } })`).
  - Renderiza un grid con las `<MetricCard />`.
  - Renderiza `<RecentActivity />` consultando la tabla `AuditLog` (filtrada por `tenantId`).

## 3. Manejo del AuditLog
Puesto que Celeritas implementa un sistema de logs de auditoría en la base de datos, lo inyectaremos en la pantalla de inicio del dashboard. Usaremos `prisma.auditLog.findMany` para listar los últimos 5 eventos.

## 4. UI/UX
Se utilizará Tailwind CSS con íconos de `lucide-react`. La disposición será un layout estándar de SaaS: Navbar superior estático o pequeño, y un Sidebar izquierdo oscuro o claro con navegación persistente.

## 5. Pruebas de Verificación
1. Iniciar sesión con un usuario de un tenant con el feature `crm` desactivado. Verificar que el enlace no aparezca en el Sidebar.
2. Ir a la configuración global (Hub), activar el `crm` y refrescar el dashboard del tenant para confirmar que el enlace ahora es visible.
