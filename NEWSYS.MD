# Alddea AI Agent & Development Guidelines (NEWSYS)

This document contains the core operational principles, best practices, and lessons learned from the Alddea project. Use this as the starting `AGENT.MD` for any new project to avoid repeating past mistakes.

## 1. Regla de Oro: Backward Compatibility
**SIEMPRE verificar compatibilidad con datos existentes:** Antes de probar un feature nuevo en la UI, el agente y el desarrollador deben asegurar que los datos viejos/existentes en la BD sigan siendo accesibles y funcionales. Si una vista deja de renderizar registros porque un filtro nuevo los omitió, es un bug crítico. NUNCA asumas que la BD estará vacía en producción.

## 2. Flujo de Trabajo (GitFlow)
- **Prohibido tocar `main`:** Ningún agente de IA debe hacer *commit* directamente a la rama `main`. Es la rama de producción.
- **Ramas (Branches):** Todo nuevo requerimiento o arreglo debe desarrollarse en una rama separada (ej. `feature/landing-page`, `bugfix/qr-error`). Si algo se rompe, es infinitamente más rápido revertir o descartar una rama que intentar arreglar código sobrescrito.
- **Pruebas y Aprobación:** El código debe compilar (`npm run build`) en la rama aislada antes de fusionarse a `main`.

## 3. UI y Componentes (React / Next.js)
- **Cuidado con las Inyecciones en el DOM:** Intentar inyectar Modales (como "Editar") fuera de un entorno seguro o dentro de una tabla profunda (dentro de un `map()`) puede romper toda la UI. **Solución:** Usar portales (`createPortal`) o colocar los modales a nivel raíz del componente, pasándole los datos seleccionados mediante el estado.
- **Droplists y Enums (Radix UI / shadcn):** Al usar `<Select>` con valores en inglés del Backend (ej. `HIGH`), a veces el UI muestra el valor en inglés si no se tiene cuidado. **Solución:** Siempre pasa explícitamente el texto traducido como `children` de `<SelectValue>`. Ej: `<SelectValue>{value === 'HIGH' ? 'Alta' : 'Baja'}</SelectValue>`.
- **Cadenas Literales en JSX:** NUNCA inyectes el texto plano `\n` dentro de las etiquetas TSX/JSX si buscas un salto de línea (Next.js lo renderizará literalmente en pantalla). Realiza el salto de línea real (Enter) en el código, o encapsúlalo usando `{'\n'}`.
- **Responsividad Inicial en Gráficas (Recharts):** Gráficas dentro de pestañas ocultas pueden causar warnings (ej. `<ResponsiveContainer>` midiendo 0). Añadir siempre `minWidth={0}` o `minHeight={0}` a los contenedores responsivos que interactúan con Flexbox o pestañas dinámicas.

## 4. Edición de Archivos Masivos (Agentes IA)
- **Archivos Monolíticos:** Cuando un archivo supera las 1,000 líneas (ej. Vistas completas con múltiples tablas y lógica), el uso de herramientas de reemplazo de texto (`String.replace()` o Regex) es altamente propenso a errores (fallos de indentación, imports silenciosamente borrados). En estos casos se deben modularizar las vistas o usar manipulación cuidadosa.
- **Hooks y Variables:** En archivos masivos, usar variables genéricas (ej. `filteredData`) puede mezclarse con otras tablas y romper la paginación. Nombra las variables de forma ultra específica (ej. `filteredCRMLeads`).
- **Verificación Continua:** Después de editar un archivo grande, el agente debe ejecutar `npm run build` o verificar los imports antes de dar la tarea por concluida.

## 5. Logs y Monitoreo en Desarrollo (Ahorro de Tokens)
- En lugar de copiar y pegar errores de consola gigantes al Agente, usa la capacidad nativa `/browser` (Chrome DevTools MCP) para que el Agente visite `localhost:3000` y extraiga los errores él mismo.
- Alternativamente, implementa un interceptor de `console.error` (DevLogger) en el `layout.tsx` que intercepte los errores del navegador en modo desarrollo y los guarde en un archivo local `dev-console-errors.log` para que el agente los pueda leer sin interactuar con el navegador.

## 6. Instrucciones Prácticas: ¿Cómo pedirle al Agente que revise errores?
Para evitar copiar y pegar textos largos de la consola, el desarrollador (usuario) debe usar una de estas dos formas cada vez que pruebe una página nueva o note un fallo:

**Forma 1 (Recomendada - Lectura Local):**
El proyecto cuenta con un interceptor que guarda los errores en `dev-console-errors.log`.
- **Qué decirle al Agente:** *"Ocurrió un error en la vista de Ventas. Revisa el archivo `dev-console-errors.log` y corrígelo."* o *"Limpia los warnings del archivo de logs locales."*
- **Cuándo usarlo:** Continuamente. Cada vez que navegas en modo desarrollo y notas que algo falla en la consola (o para limpieza rutinaria).

**Forma 2 (Uso de Navegador Activo):**
- **Qué decirle al Agente:** *"Usa el comando `/browser` para navegar a `http://localhost:3000/ruta` y revisa la consola para arreglar los errores."*
- **Cuándo usarlo:** Cuando requieras que el agente haga pruebas de red, valide visualmente el DOM o analice cargas de página en tiempo real.

## 7. Rol del Agente Técnico (Proactividad y Asesoría)
- **El Agente es el Experto Técnico; el Usuario es el Tomador de Decisiones:** Si existe una herramienta, librería, arquitectura, skill o modelo de Inteligencia Artificial que sea mejor, más rápido o más eficiente que lo solicitado explícitamente por el usuario, el Agente **NUNCA debe proceder a ciegas con una implementación inferior**.
- **Obligación de Preguntar/Asesorar:** El Agente debe pausar o advertir al usuario, proponiendo la alternativa superior de forma clara y concisa (ejemplo: recomendar modelos Flash vs Pro para ahorro de tokens, o proponer un interceptor de logs local antes de Sentry), para que el usuario tome la decisión informada.

## 8. Seguridad Informática y Protección de Datos (Cybersecurity)
El Agente debe actuar con la mentalidad de un **Ingeniero Senior de Ciberseguridad**, asegurando que cada línea de código cumpla con los más altos estándares de producción SaaS:
- **Aislamiento Multi-tenant (Tenant Isolation):** En cada Server Action o consulta de Prisma, NUNCA confiar ciegamente en IDs enviados desde el cliente. SIEMPRE validar que el usuario autenticado (`session.user.id` / `session.user.tenantId`) tenga los permisos explícitos para modificar o leer ese registro.
- **Prevención de XSS e Inyección SQL:** Usar Prisma ORM con consultas parametrizadas. NUNCA usar `dangerouslySetInnerHTML` en React sin sanitización estricta (`DOMPurify`).
- **Validación del Lado del Servidor:** NUNCA confiar solo en validaciones de frontend (HTML/Form). Validar el tipo, rango y formato de cada input en las Server Actions o API Routes.
- **Protección de Credenciales y Secretos:** Passwords cifrados obligatoriamente con `bcrypt` (mínimo 10-12 salt rounds). Cero tokens o credenciales incrustadas en código plano.
- **Seguridad en Cookies y Sesiones:** NextAuth con JWT cifrado, HTTP-Only y SameSite strict para prevenir ataques CSRF.

## 9. Renderizado y Respuestas de API (Codificación)
- **Respuestas HTML en API Routes:** Siempre que se envíe código HTML crudo a través de una ruta API (`NextResponse` en `route.ts`), es **OBLIGATORIO** incluir el header `{'Content-Type': 'text/html; charset=utf-8'}` para evitar corrupción de caracteres (mojibake) en acentos y símbolos. También se debe inyectar `<meta charset="utf-8" />` en el `<head>` del HTML devuelto.

## 10. Optimización de Tokens y Velocidad de Antigravity
- **Modularización Urgente de Archivos Gigantes:** Editar archivos monolíticos (como \dmin-view.tsx\ de >4000 líneas) obliga a la IA a procesar masivamente el contexto, gastando miles de tokens por cada pequeño cambio y ralentizando el tiempo de respuesta. **Solución:** Dividir vistas complejas en sub-componentes (ej. \Bitacora.tsx\, \DashboardMetrics.tsx\).
- **Cero Compilaciones desde la IA:** Correr \
pm run build\ o \
pm run dev\ desde el Agente bloquea el hilo, retrasa la respuesta (20-40 segundos) y satura el contexto con logs de Webpack/Turbopack, inflando el costo. **Solución:** El Agente debe editar el código; el desarrollador debe mantener \
pm run dev\ corriendo en una terminal local separada y aprovechar el Hot-Reload (HMR) instantáneo, reportando los errores solo si ocurren.


## 11. Mandamientos de Seguridad y Arquitectura Multi-Tenant
- **Zero Trust en el Frontend:** Jamás se debe confiar en tenantId, userId o roles enviados en el payload del cliente. La identidad siempre debe extraerse en el backend usando la sesión real del servidor (ej. requireAuthSession()).
- **Validación Estricta (Runtime Types):** Queda estrictamente prohibido el uso de tipos any. Toda Server Action o API Endpoint debe validar su entrada mediante esquemas de Zod antes de ejecutar lógica de negocio o tocar la base de datos.
- **Prevención XSS por Defecto:** Todo contenido enriquecido (HTML, Rich Text) que provenga del usuario debe pasar obligatoriamente por desinfección en el backend (ej. sanitize-html) antes de almacenarse.
- **Data Isolation (Aislamiento Multi-Tenant):** Toda consulta a la base de datos (Prisma) que involucre lectura, modificación o eliminación, debe incluir explícitamente el filtro tenantId correspondiente a la sesión actual para evitar filtraciones de datos entre clientes.

## 12. Reglas Estrictas para Server Actions (Prevención de 500 y Cuelgues)
- **Cero Objetos de Prisma al Cliente:** Las funciones Server Actions NUNCA deben retornar instancias crudas de objetos Prisma o fechas (Date) sin serializar si el cliente no las necesita explícitamente. Esto evita errores 500 generados por fallos de serialización de Next.js (Error #418).
- **Serialización Segura Obligatoria:** Si el Frontend requiere recibir el objeto, este debe ser purificado utilizando \JSON.parse(JSON.stringify(obj))\ o una utilidad \safeSerialize()\ antes de viajar por la red.
- **Frontend Safe-Fails (try/catch):** Todo componente Cliente que ejecute `setLoading(true)` antes de un Server Action debe OBLIGATORIAMENTE envolver la llamada en un `try / catch` y asegurar la liberación de la UI con un `finally { setLoading(false) }`. Jamás se debe confiar en que el Action nunca fallará.

## 13. Next.js 15+ y NextAuth (Middleware vs Proxy)
- **Colisión de Archivos:** En las versiones modernas de Next.js (15+ / Turbopack), el archivo `middleware.ts` ha sido deprecado en favor de `proxy.ts`. Si usas NextAuth, **NO crees un `middleware.ts`**. Si existen ambos archivos simultáneamente, Next.js se bloquea (`Error: Both middleware file "./src/middleware.ts" and proxy file "./src/proxy.ts" are detected`).
- **Solución NextAuth:** Integra la lógica de protección de rutas de NextAuth (`getToken({ req, secret })`) directamente dentro de `proxy.ts` en lugar de usar el wrapper `withAuth` de NextAuth.
- **Provider de Sesión (App Router):** En el App Router, el hook `useSession()` solo puede utilizarse en componentes cliente (`'use client'`) que estén envueltos por un `<SessionProvider>`. Si omites el provider, la app crasheará en Runtime (`[next-auth]: useSession must be wrapped in a <SessionProvider />`). Crea un `AuthProvider.tsx` que devuelva `<SessionProvider>` y envuelve tu Layout.

## 14. Importaciones (Default vs Named Exports) en Turbopack
- **Error Común:** `Export default doesn't exist in target module`.
- **Causa:** Ocurre frecuentemente cuando intentas importar un módulo usando un Default Export (`import TipTapEditor from '@/components/TipTapEditor'`) pero el módulo internamente usa un Named Export (`export function TipTapEditor() { ... }`).
- **Solución:** Presta extrema atención a cómo están exportadas tus funciones y componentes. Si están exportadas con su nombre (`export const`, `export function`), SIEMPRE impórtalos con llaves: `import { Nombre } from '...'`. En un proyecto Next.js grande con Turbopack, estos desajustes rompen el Build instantáneamente.
