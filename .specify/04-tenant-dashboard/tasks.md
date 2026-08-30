# MVP 3: Tareas de Dashboard Base

## Fase 1: Estructura y Protección (Layout)
- [x] Crear `src/app/site/[tenant]/dashboard/layout.tsx`.
- [x] Implementar verificación de sesión y correspondencia estricta de `tenantId` vs `params.tenant`.
- [x] Hacer la consulta de `featureFlags` del tenant actual.

## Fase 2: Componentes de Navegación
- [x] Crear `src/components/dashboard/Sidebar.tsx` que acepte `featureFlags` como prop.
- [x] Renderizar enlaces condicionales en el Sidebar usando íconos de `lucide-react`.
- [x] Crear componente de cabecera `Header.tsx` con perfil de usuario (opción de logout rápido).

## Fase 3: Dashboard Principal (Inicio)
- [x] Crear `src/app/site/[tenant]/dashboard/page.tsx`.
- [x] Construir el componente `<MetricCard />`.
- [x] Extraer métricas básicas (Total de Usuarios, Estado del Tenant).
- [x] Extraer y mostrar los últimos registros de `AuditLog` del tenant en una tabla de "Actividad Reciente".

## Fase 4: Pruebas UI y Compilación
- [x] Validar que la interfaz sea responsive (sidebar colapsable en móviles, opcional pero deseable).
- [x] Probar el Logout desde el Header que redirija correctamente a `/site/[tenant]/login`.
