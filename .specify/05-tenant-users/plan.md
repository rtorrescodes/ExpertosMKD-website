# MVP 4: Gestión de Usuarios del Tenant - Plan de Implementación

## 1. Arquitectura y Obtención de Datos
Usaremos el patrón de App Router con componentes de servidor (`page.tsx`) para la obtención inicial de la lista de usuarios. Las mutaciones (Invitar, Editar Rol, Eliminar) se ejecutarán mediante **Server Actions** fuertemente tipados con Zod. El acceso a los Server Actions estará restringido comprobando que `session.user.role === 'OWNER' || 'ADMIN'`.

## 2. Componentes Principales
- **`src/app/site/[tenant]/dashboard/users/page.tsx`**: 
  - Ejecuta `prisma.user.findMany({ where: { tenantId } })`.
  - Renderiza una vista de tabla con encabezado y botón primario "Invitar Usuario".
- **`src/components/dashboard/users/UsersTable.tsx`**: 
  - Client Component interactivo. Presenta la lista, menús desplegables de contexto (Editar, Eliminar) por fila.
- **`src/components/dashboard/users/InviteUserModal.tsx`**: 
  - Modal o Formulario tipo "Slide-over" que ejecuta el Server Action de invitación.
- **`src/actions/tenant-users.ts`**:
  - Encapsula toda la lógica de negocio, incluyendo la creación de tokens y la auditoría (`prisma.auditLog.create`).

## 3. Lógica del Flujo de Invitación
1. **Validación:** Validar email (Zod) y rol (ADMIN, MEMBER).
2. **Duplicidad:** Comprobar que el email no exista ya en la BD global. (Limitante actual: Un correo no puede pertenecer a dos tenants si el correo es único globalmente en `User`).
3. **Transacción de Prisma (`$transaction`):**
   - Insertar nuevo `User` con contraseña vacía.
   - Insertar `VerificationToken`.
   - Insertar `AuditLog` (`action: "user.invited"`).
4. **Despacho:** Ejecutar `sendTenantInvite()` (reutilizado del MVP 1).

## 4. Control de Auditoría (AuditLog)
Cada mutación importante en este módulo debe registrar un log:
- `user.invited` (detalles: { invitedEmail, role })
- `user.role_updated` (detalles: { targetUserId, oldRole, newRole })
- `user.removed` (detalles: { removedUserId, removedEmail })

## 5. Prevención de Riesgos de Seguridad
- **Zero Trust:** En cada Server Action, debemos recuperar el usuario de la base de datos (`getServerSession`), obtener su `tenantId`, y obligatoriamente ejecutar la query de Prisma acoplada a ESE `tenantId`. Ej:
  `prisma.user.update({ where: { id: targetId, tenantId: session.tenantId } })`. Si no hay match, la consulta falla de manera segura, evitando que un inquilino modifique usuarios de otro.
- **Protección del Owner:** Un usuario ADMIN no puede eliminar ni degradar a un OWNER.

## 6. Pruebas de Verificación
1. Iniciar sesión como Owner, ir a `/users`, invitar a `test@test.com` con rol `ADMIN`.
2. Verificar en la base de datos (`User`, `VerificationToken`, `AuditLog`).
3. Intentar degradar un OWNER usando la sesión de un ADMIN (debe rechazar la acción).
