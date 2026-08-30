# MVP 3: Dashboard Base del Tenant - Especificación

## 1. Resumen Ejecutivo
Este MVP provee la interfaz principal y el "home" (dashboard) al que el usuario es redirigido tras hacer login en su tenant. Incluye la estructura general de navegación (Layout y Sidebar), un resumen de métricas clave, un registro de actividad reciente y la lectura visual de los "Feature Flags" activos para la organización.

## 2. Declaración del Problema
Tras completar el Onboarding (MVP 2), el usuario carece de una interfaz de administración. Se necesita un marco base sólido donde los módulos posteriores (CRM, Ecommerce, Citas) puedan inyectarse dinámicamente según la suscripción del tenant.

## 3. Audiencia Objetivo
- **Usuarios Finales del Tenant:** Quienes utilizarán el software a diario (Admins y Miembros regulares).

## 4. Criterios de Éxito
- La ruta `/site/[tenant]/dashboard` está protegida por sesión.
- El Sidebar muestra condicionalmente los enlaces a los módulos activados en los Feature Flags del Tenant actual.
- Se muestran tarjetas de métricas genéricas y un historial (mock o basado en AuditLog).

## 5. Casos de Uso
- **Caso A (Navegación Dinámica):** Un usuario inicia sesión en una instancia que solo tiene contratado el "CRM". El sidebar solo le mostrará "Inicio", "Contactos" y "Configuración". No verá la pestaña de "Tienda".
- **Caso B (Dashboard Resumen):** El usuario ingresa y ve 4 tarjetas (ej. Usuarios Totales, Nuevos Contactos, etc.) y una tabla de Actividad Reciente.

## 6. Requisitos Funcionales
- **Páginas (App Router):**
  - `/site/[tenant]/dashboard/layout.tsx`: La envoltura general con el Sidebar y el Navbar (Header).
  - `/site/[tenant]/dashboard/page.tsx`: El contenido principal del dashboard.
- **Componentes UI:**
  - `<TenantSidebar />`: Navegación vertical reactiva a `tenant.featureFlags`.
  - `<MetricCard />`: Tarjeta estándar para datos.
  - `<RecentActivity />`: Tabla o lista de eventos.

## 7. Asunciones y Fuera de Alcance
- **Fuera de Alcance:** Lógica real detrás de las métricas de módulos que aún no existen (CRM, Ecommerce). Se utilizarán placeholders visuales o contadores básicos (ej. total de usuarios) hasta que se desarrollen dichos módulos. Selector de múltiples tenants se dejará en UI pero sin lógica profunda, ya que un usuario ahorita pertenece a un solo tenant por el esquema actual.
