# MVP 2: Tareas de Login y Onboarding

## Fase 1: Configuración Core de NextAuth
- [x] Actualizar `types/next-auth.d.ts` para tipar correctamente `tenantId` y `role` en la sesión.
- [x] Editar `src/lib/auth/auth.config.ts`:
  - [x] Implementar verificación `bcrypt.compare` en el `authorize`.
  - [x] Validar que `tenant.isActive` sea verdadero.
  - [x] Inyectar `tenantId` y `role` en los callbacks `jwt` y `session`.

## Fase 2: Flujo de Verificación (Onboarding)
- [x] Crear el layout limpio de Auth en `src/app/site/[tenant]/(auth)/layout.tsx`.
- [x] Crear la página de verificación: `src/app/site/[tenant]/(auth)/auth/verify/page.tsx`.
- [x] Crear el Server Action `setPasswordFromToken` en `src/actions/auth.ts`.
- [x] Construir el `<SetPasswordForm />` (Zod + react-hook-form) con confirmación de contraseña.

## Fase 3: Portal de Login del Tenant
- [x] Crear la página de login en `src/app/site/[tenant]/(auth)/login/page.tsx`.
- [x] Construir el `<LoginForm />` utilizando `signIn('credentials')`.
- [x] En el servidor o middleware, asegurar que un usuario del Tenant A no pueda loguearse en el subdominio del Tenant B. (Validar `req.headers.host` contra `tenant.subdomain` en el `authorize`).

## Fase 4: Validaciones y UI
- [x] Diseñar las vistas de Auth usando los estilos de Tailwind base (minimalista y adaptable).
- [x] Refinar las redirecciones post-login hacia `/site/[tenant]/dashboard`.
- [x] Probar el flujo completo creando un Tenant manual o usando el del Hub.
