# CONSTITUCIÓN DEL PROYECTO — CELERITAS

Este documento es la fuente de verdad del proyecto. Antes de escribir código, léelo completo. Si en algún momento una instrucción puntual contradice esta constitución, esta constitución gana — detente y pregunta.

Úsalo como base para `/speckit.constitution` si estamos trabajando con GitHub Spec Kit.

---

## 1. Qué es Celeritas

Celeritas es una plataforma SaaS multi-tenant para crear y operar sitios web rápidos (landing pages con SEO, micro-CMS, y features de negocio activables como CRM, cotizador, citas, tienda, proyectos y menú de restaurante) para clientes que no arman su propio sitio — el equipo de Celeritas da de alta al tenant, lo puebla de contenido con ayuda de IA, y el cliente después administra su sitio desde un backend, con el nivel de features que contrató.

**Roles del proyecto:**
- **Rodrigo** — dueño del producto y arquitecto de decisiones. Da los prompts maestros y aprueba cada fase.
- **Antigravity / Gemini** — agente de desarrollo. Construye siguiendo esta constitución y las specs de cada módulo. Nunca decide arquitectura por su cuenta sin señalarla primero (ver sección 8).

## 2. Infraestructura y dominio

- Celeritas se monta sobre **expertosmkd.com**, pero corre **separado** del sitio de marketing existente que ya vive ahí: repo propio, base de datos propia (proyecto de Supabase dedicado, nunca el mismo que usa el sitio de marketing).
- La separación se resuelve en la capa de infraestructura: un **Load Balancer / enrutamiento por host** decide qué Cloud Run atiende cada request. `expertosmkd.com` (raíz y demás rutas del sitio de marketing) sigue yendo al servicio actual sin tocarlo.
- `expertosmkd.com/hub` — panel de administración maestro de Celeritas (alta de tenants, features, billing). Es una ruta fija y reservada, no un tenant.
- **Tenants se resuelven por subdominio**, no por ruta: `{slug}.expertosmkd.com` (ej. `consultoriodental.expertosmkd.com`) para demos y tenants sin dominio propio. Esto evita colisiones de nombres con las páginas del sitio de marketing y simplifica la migración cuando el cliente conecta su propio dominio.
- Cuando un tenant compra: el cliente apunta su dominio propio vía CNAME/A siguiendo instrucciones que le da Celeritas; Cloud Run maneja el certificado SSL vía domain mapping.
- El middleware de resolución de tenant (lee `Host`, resuelve a `tenant_id`) es el punto de entrada único — toda request pasa por ahí antes de tocar datos.

## 3. Stack técnico

Next.js 15, TypeScript 5, Prisma 6, PostgreSQL 16 (Supabase, proyecto dedicado a Celeritas), Tailwind CSS. Despliegue en Google Cloud Run. Archivos/medios en Google Cloud Storage (no Supabase Storage), organizados con prefijo `tenants/{tenant_id}/...` desde el día uno. Secretos de terceros por tenant (Stripe, DeepSeek, etc.) en Google Secret Manager — nunca en columnas de base de datos en texto plano.

## 4. Arquitectura multi-tenant

- **Shared DB con `tenant_id` + Row-Level Security de Postgres** — decisión tomada por el volumen esperado (300+ tenants en el año 1). No hay bases de datos ni schemas separados por tenant.
- RLS es la última línea de defensa, no la única: **toda query de Prisma debe filtrar explícitamente por `tenant_id`**, tomado siempre de la sesión del servidor, nunca de un parámetro del cliente.
- Todo lo personalizable por tenant (etiquetas, categorías, precios, contenido, config de features) debe modelarse como **datos por tenant**, nunca como texto o lógica fija en código compartido. Esta es la regla que hace segura la futura mega-feature de edición conversacional por IA en el panel del cliente.
- **Regla de "no contaminación"**: ningún módulo compartido (CRM, citas, cotizador, tienda, proyectos) debe contener lógica específica de un solo tenant. Si un cliente pide algo que no se resuelve con configuración existente ni con una feature flag genérica nueva, la respuesta es "esto es un proyecto a la medida" — candidato a **graduación** (ver sección 6), nunca un parche dentro del código compartido.
- Actualizaciones a un módulo compartido afectan a todos los tenants que lo usan simultáneamente — por eso staging y un grupo de tenants canario son **obligatorios** antes de desplegar cambios a producción, sin excepción.

## 5. Ciclo de vida del tenant

`esqueleto` (features elegidas por Rodrigo, sin contenido, sin dominio) → `contenido_listo` (IA llenó el sitio con info real o de demo) → `activo` (dominio conectado, en vivo) → `cancelado` (periodo de gracia, respaldo disponible) → `purgado` (borrado total tras el periodo de gracia, vía lifecycle policies de GCS + limpieza de filas) → `graduado` (extraído a deployment independiente, caso excepcional).

Los "demos" de venta usan el mismo estado `esqueleto`/`contenido_listo`, solo con contenido falso o scrapeado en vez de real.

## 6. La ruta de graduación (escape hatch)

Un tenant que necesite algo verdaderamente a la medida puede extraerse a un Cloud Run y base de datos independientes, posiblemente otro repo. Esto es viable **solo si cada feature está modularizada como paquete desacoplado** dentro del monorepo, con fronteras claras hacia el core (auth, tenant context, billing). Antigravity debe construir cada módulo pensando en esta extracción como posibilidad, aunque no se use pronto.

## 7. Sistema de diseño compartido

Antes de construir cualquier feature de negocio, existe una **librería de componentes compartida** (botones, tablas con edición inline, tableros kanban, modales, formularios, navegación, tokens de color/tipografía) que vive como su propio paquete. Todo módulo del panel de administración del tenant (CRM, citas, cotizador, proyectos, tienda) se construye **usando solo estos componentes**, nunca inventando UI propia — así se sienten un solo producto, no sistemas pegados. Esto **no aplica** a las landing pages públicas de cada tenant, que sí varían libremente por marca/template.

## 8. Reglas de seguridad (obligatorias, sin excepción)

- **Zero trust**: nunca confiar en `tenantId`, `userId` o roles enviados desde el cliente. La identidad siempre sale de la sesión real del servidor.
- **Validación con Zod** en toda Server Action / API Route antes de tocar la base de datos. Prohibido el tipo `any`.
- **Sanitización obligatoria** de todo HTML/rich text que venga del usuario antes de guardarlo (ej. `sanitize-html`), y prohibido `dangerouslySetInnerHTML` sin sanitizar.
- **Contraseñas con bcrypt**, mínimo 10-12 salt rounds. Cero credenciales o tokens en código plano.
- **Sesiones**: JWT cifrado, cookies HTTP-only y SameSite strict.
- **Pagos**: cero almacenamiento de números de tarjeta. Todo pago se redirige a Stripe/Medusa (certificación PCI del proveedor). Cada tenant tiene su propio webhook con firma criptográfica verificada antes de asentar cualquier pago.
- **Serialización segura**: ninguna Server Action retorna objetos crudos de Prisma o `Date` sin serializar. Usar `JSON.parse(JSON.stringify(obj))` o un `safeSerialize()` propio.
- **Frontend a prueba de fallos**: todo componente cliente que llame una Server Action debe usar `try/catch` y liberar el loading state en `finally`.
- Content-Type explícito (`text/html; charset=utf-8`) y `<meta charset="utf-8">` en cualquier respuesta HTML cruda desde una API route.

## 9. Reglas de ingeniería con IA (de [[alddea]], vigentes aquí)

- **GitFlow estricto**: prohibido commit directo a `main`. Toda tarea en su propia rama.
- **Backward compatibility siempre**: nunca asumir que la base de datos estará vacía; verificar que datos/registros existentes sigan funcionando tras cualquier cambio.
- **Archivos monolíticos (>1000 líneas)**: modularizar antes de editar con reemplazo de texto masivo. Nombrar variables de forma ultra-específica en archivos grandes (`filteredCRMLeads`, no `filteredData`).
- **Modales y UI**: usar portales (`createPortal`) o modales a nivel raíz, nunca inyectados dentro de un `map()`.
- **Ahorro de tokens**: usar el interceptor de `console.error` (`dev-console-errors.log`) o el comando `/browser` en vez de pegar logs largos. El agente **nunca** corre `npm run build` o `npm run dev` — eso lo mantiene corriendo Rodrigo en terminal aparte con hot-reload.
- **Verificación continua**: tras editar un archivo grande, revisar imports y compilación antes de dar la tarea por terminada.
- **Antigravity es el experto técnico; Rodrigo decide.** Si existe una alternativa mejor a lo pedido explícitamente, Antigravity debe señalarla antes de implementar a ciegas la opción inferior.

## 10. Referencia a proyectos open source (Twenty, Cal.com, Medusa, etc.)

- Medusa.js (MIT) se usa como framework real, importado como piezas dentro de nuestra app — es la excepción, no la regla.
- Twenty CRM, Cal.com y similares (AGPL en su mayoría) se usan **solo como especificación funcional de referencia**: se pueden clonar en una carpeta separada de estudio (nunca dentro del código que se despliega) para extraer qué entidades manejan, qué acciones soportan, cómo es su UX — y reconstruir eso, original, en nuestro stack. **Prohibido copiar, transcribir o traducir línea por línea su código fuente** dentro de Celeritas.
- CRM, citas y cotizador se construyen nativos en Next.js/Prisma, no adoptando aplicaciones externas completas — no encajan en una arquitectura multi-tenant compartida y traerían riesgo de licencia.

## 11. Disciplina de documentación (Spec Kit + handoff.md)

1. `/speckit.constitution` se corre **una sola vez**, al inicio, con este documento como base.
2. **Regla dura**: ninguna implementación sin spec/plan/tasks ya creados para ese pedazo de trabajo (`/specify` → `/plan` → `/tasks` antes de `/implement`). Si no existe spec para lo que se va a tocar, se detiene y se crea primero.
3. Al cerrar cada sesión, Antigravity crea `handoff.md` con 5 secciones: (1) Objetivo, (2) Estado actual, (3) Archivos y cambios de la sesión, (4) Intentos fallidos (nunca se borra esta sección), (5) Próximos pasos exactos en orden — incluyendo qué tarea de Spec Kit sigue.
4. Al retomar: "Lee handoff.md y continúa desde los próximos pasos."
5. Cada 3-4 features cerradas, correr `/speckit.analyze` como checkpoint obligatorio para detectar si la spec y el código ya divergieron, antes de seguir avanzando.

## 12. Catálogo de módulos (para referencia — no todos se construyen de inicio)

CRM · CRM con scraping de leads · Cotizador (nativo, prioridad alta por ser diferenciador) · Catálogo de productos (cubre catálogo virtual y tienda virtual con el pago como capa opcional vía Medusa) · Organizador de proyectos (kanban) · Sistema de citas · Menú de restaurante + PWA de cocina + delivery/pickup (fase posterior, mayor complejidad).
