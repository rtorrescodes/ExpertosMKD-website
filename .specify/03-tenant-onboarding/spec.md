# MVP 2: Login y Onboarding del Tenant - Especificación

## 1. Resumen Ejecutivo
Este módulo gestiona la entrada inicial y recurrente de los usuarios a sus respectivos tenants. Cubre el flujo desde que el usuario recibe el correo de invitación, valida su token, establece su contraseña por primera vez, hasta el login recurrente mediante subdominios (ej. `agencia.celeritas.local`).

## 2. Declaración del Problema
Actualmente los tenants pueden ser creados por un Super Admin, y se les envía un correo con un token seguro. Sin embargo, no existe un flujo en la aplicación para que el usuario canjee ese token, asigne su credencial de acceso permanente y navegue a su espacio de trabajo aislado.

## 3. Audiencia Objetivo
- **Dueños de Tenant (Owners):** Clientes finales que ingresan por primera vez para configurar su cuenta.
- **Usuarios de Tenant (Admins/Members):** Empleados del cliente que accederán recurrentemente al dashboard.

## 4. Criterios de Éxito
- El sistema valida matemáticamente el `VerificationToken` de un usuario.
- El usuario puede establecer su contraseña de forma segura (hasheada con bcrypt).
- El usuario puede iniciar sesión en la URL de su tenant (ej. `cliente.celeritas.local/login`) pero no en el de otros.
- El sistema restringe el acceso si el Tenant está suspendido (`SUSPENDED`).

## 5. Casos de Uso
- **Caso A (Onboarding Inicial):** El usuario hace clic en el enlace del correo (`/auth/verify?token=XYZ&email=correo@...`). La página valida el token. Si es válido, muestra un formulario para "Establecer Contraseña". Al enviarlo, el usuario queda autenticado y es redirigido a `/dashboard`.
- **Caso B (Login Recurrente):** Un usuario entra a `cliente.celeritas.local/login`. Ingresa su correo y contraseña. NextAuth verifica las credenciales y además verifica que el `tenantId` del usuario coincida con el subdominio actual.
- **Caso C (Tenant Suspendido):** Un usuario intenta loguearse en un tenant con estado `SUSPENDED`. El sistema deniega el acceso con un mensaje apropiado.

## 6. Requisitos Funcionales
- **Páginas (App Router):**
  - `/site/[tenant]/auth/verify`: Página SSR que lee los search params (`token`, `email`) y verifica contra Prisma.
  - `/site/[tenant]/login`: Página principal de autenticación del tenant.
- **Validación de Seguridad:**
  - Las contraseñas deben cifrarse siempre con `bcrypt` (ya instalado).
  - La sesión de NextAuth (`session.user`) debe incluir el `tenantId` y `role` para validaciones posteriores (Zero Trust).
- **Control de Estado:** El middleware o el callback de NextAuth debe evaluar el estado del Tenant (`ACTIVE`, `SUSPENDED`, etc.).

## 7. Asunciones y Fuera de Alcance
- **Fuera de Alcance:** Integración con OAuth (Google/Microsoft). Por ahora solo validaremos credenciales (Email/Password). Recuperación de contraseña (Forgot Password) se tratará de ser posible, pero el onboarding es la prioridad.
