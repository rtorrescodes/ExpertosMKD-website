# MVP 2: Login y Onboarding del Tenant - Plan de Implementación

## 1. Arquitectura de Autenticación
Usaremos **NextAuth.js (v4)** con un proveedor de Credenciales. La validación ocurrirá en `src/lib/auth/auth.config.ts`. Extenderemos los callbacks de NextAuth para inyectar el `tenantId`, `role`, y el estado del Tenant directamente en el token JWT, garantizando una filosofía "Zero Trust" donde la sesión del servidor es la fuente de verdad.

## 2. Modificaciones a NextAuth
- Actualizar `authOptions` (`src/lib/auth/auth.config.ts`):
  - **Authorize Callback:** Buscar el usuario por email. Validar la contraseña usando `bcrypt.compare`.
  - **Validación Adicional:** Comprobar que el Tenant al que pertenece el usuario esté activo (`tenant.isActive`). Si está suspendido, lanzar error.
  - **JWT / Session Callbacks:** Mutar el objeto `token` y `session` para devolver `tenantId` y `role` al cliente.

## 3. Estructura de Rutas y Componentes
Dentro del dominio del tenant (`src/app/site/[tenant]`):
- **Ruta:** `src/app/site/[tenant]/login/page.tsx`
  - Renderiza `<LoginForm />` (Client Component). Llama a `signIn("credentials")`.
- **Ruta:** `src/app/site/[tenant]/auth/verify/page.tsx`
  - Componente de servidor que extrae `searchParams.token` y `searchParams.email`.
  - Verifica si el token existe en `VerificationToken` y no ha expirado.
  - Si es válido, renderiza `<SetPasswordForm token={token} email={email} />`.
  - Si es inválido, renderiza un mensaje de error genérico.

## 4. Server Actions
- **`src/actions/auth.ts`:**
  - `setPasswordFromToken(data: z.infer<typeof setPasswordSchema>)`: 
    1. Verifica el token atómicamente.
    2. Hashea la nueva contraseña con `bcrypt`.
    3. Actualiza el `User.passwordHash`.
    4. Elimina el `VerificationToken`.
    5. Redirige al login o autologuea.

## 5. Middleware y Redirección
- Ajustaremos o nos aseguraremos de que `src/proxy.ts` proteja `/dashboard` dentro del tenant.
- Si el usuario visita `cliente.celeritas.local/dashboard` sin sesión, será redirigido a `cliente.celeritas.local/login`.

## 6. Pruebas de Verificación
1. **Flujo de Invitación:** Generar un Tenant desde el Hub, capturar el token de la base de datos (o la terminal), navegar a `/auth/verify`.
2. **Asignación de Password:** Crear la contraseña, intentar login repetido.
3. **Restricción Multi-Tenant:** Intentar loguear a un usuario del `tenant A` ingresando desde la URL del `tenant B`. El sistema debe denegarlo (se validará el subdominio en el callback de NextAuth a través del header o verificando que el user pertenece al tenant actual).
