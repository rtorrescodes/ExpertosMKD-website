# MVP 4: Tareas de Gestión de Usuarios

## Fase 1: Vistas y UI (Read-Only)
- [x] Crear el directorio `src/app/site/[tenant]/dashboard/users`.
- [x] Construir `page.tsx` para obtener y mostrar la lista de usuarios del `tenantId` activo.
- [x] Construir el componente `<UsersTable />` usando el diseño de tablas estándar de Tailwind (Name, Title/Role, Status, Actions).

## Fase 2: Lógica de Server Actions
- [x] Crear el archivo `src/actions/tenant-users.ts`.
- [x] Implementar `inviteUser`: Validar acceso, comprobar duplicados, usar `$transaction` para crear `User`, `VerificationToken` y `AuditLog`, y disparar `sendTenantInvite`.
- [x] Implementar `updateUserRole`: Validar permisos jerárquicos (ADMIN vs OWNER), actualizar el rol y generar `AuditLog`.
- [x] Implementar `removeUser`: Eliminar al usuario, pero asegurando el filtro estricto por `tenantId` y generando `AuditLog`.

## Fase 3: Formularios Interactivos (Client)
- [x] Crear `<InviteUserModal />` que capture `email` y `role`, con soporte de errores y estado de carga (`isSubmitting`).
- [x] Implementar menú contextual en `<UsersTable />` (Dropdown con `lucide-react`) para mostrar opciones "Cambiar a Admin", "Cambiar a Member", y "Eliminar".
- [x] Conectar los Server Actions a las opciones del menú con prompts de confirmación (ej. "Estás seguro que deseas eliminar este usuario?").

## Fase 4: Refinamiento y QA
- [x] Asegurar que el botón "Invitar Usuario" y las acciones de edición estén ocultas en la UI si el usuario en sesión es solo `MEMBER`.
- [x] Revisar el registro de `AuditLog` en la vista de Actividad Reciente del dashboard principal (MVP 3) para confirmar que "user.invited" aparece correctamente.
