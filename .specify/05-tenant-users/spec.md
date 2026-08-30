# MVP 4: Gestión de Usuarios del Tenant - Especificación

## 1. Resumen Ejecutivo
El Módulo de Gestión de Usuarios permite a los administradores de un tenant (OWNER y ADMIN) visualizar, invitar, editar y revocar acceso al personal de su organización. Garantiza que la gestión de personal interno quede aislada criptográficamente por `tenantId` y su actividad quede registrada en el log de auditoría (AuditLog).

## 2. Declaración del Problema
Un SaaS empresarial no funciona con un único usuario por organización. Las agencias y negocios requieren invitar a sus equipos (ventas, soporte, gerencia) y delegarles permisos diferenciados mediante un sistema de Roles, sin depender del Hub Global de Celeritas.

## 3. Audiencia Objetivo
- **OWNER / ADMIN:** Tienen permisos totales para ver el listado, enviar invitaciones y cambiar roles.
- **MEMBER:** Pueden ver la lista de equipo (modo lectura) pero no pueden alterar roles ni enviar invitaciones.

## 4. Criterios de Éxito
- La ruta `/site/[tenant]/dashboard/users` muestra una tabla paginada/buscable con los usuarios del tenant actual.
- Existe un formulario o modal para invitar a un usuario nuevo mediante correo electrónico.
- El usuario invitado recibe un correo con un `VerificationToken` y pasa por el flujo del MVP 2 para establecer su contraseña.
- Cualquier modificación a los usuarios (creación, edición de rol, eliminación) se registra en `AuditLog`.

## 5. Casos de Uso
- **Caso A (Invitación de Equipo):** El OWNER del tenant "Consultorio Dental" entra a su dashboard, hace clic en "Invitar Usuario", escribe `doctor@clinica.com` y le asigna el rol `MEMBER`. El doctor recibe el email de bienvenida y se suma al tenant.
- **Caso B (Revocación de Acceso):** El OWNER despide a un empleado. Entra a Gestión de Usuarios y hace clic en "Desactivar/Eliminar" en el usuario respectivo. El empleado ya no puede iniciar sesión.

## 6. Requisitos Funcionales
- **Tipos de Rol (UserRole en Prisma):** SUPER_ADMIN (no asignable por tenant), OWNER, ADMIN, MEMBER.
- **Vistas:**
  - `page.tsx`: Tabla de usuarios con nombre, correo, rol, estado de verificación y acciones.
  - Formulario de Invitación: Pide Email y Selección de Rol (ADMIN o MEMBER).
- **Server Actions:**
  - `inviteUser(email, role)`: Crea el User `MEMBER/ADMIN`, inserta `VerificationToken`, envía email, loguea la acción.
  - `updateUserRole(userId, newRole)`: Muta el rol, protegiendo que un Admin no pueda rebajar a un Owner. Loguea la acción.
  - `removeUser(userId)`: Elimina la cuenta (o la desactiva marcando `isActive: false` si añadimos ese campo) y las sesiones activas, logueando la acción.

## 7. Asunciones y Fuera de Alcance
- **Fuera de Alcance:** Permisos granulares detallados (ej. "MEMBER puede ver CRM pero no Cotizador"). Por ahora, los permisos están estrictamente basados en jerarquía (OWNER > ADMIN > MEMBER) y acceso global a los módulos activos del tenant. El RBAC granular se tratará a nivel módulo.
- **Asunción:** El token JWT será invalidado si el usuario es eliminado, o la validación `Zero Trust` en la base de datos lo detendrá en acciones de servidor.
