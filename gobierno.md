# CELERITAS — MANIFIESTO DEL PROYECTO Y MODELO DE NEGOCIO

## Versión 1.0 — Documento de Gobierno para Antigravity

### 1. IDENTIDAD Y PROPÓSITO
Celeritas (del latín celeritas: "rapidez, velocidad") es una plataforma SaaS de deployment ultrarrápido de sitios web con features modulares opcionales (CRM, tienda virtual, cotizador, control de citas y control de proyectos).
Propósito fundamental: Permitir que agencias de marketing, freelancers y pymes lancen sitios web profesionales en minutos, con la capacidad de activar herramientas de gestión de negocio según las necesidades de cada cliente, todo desde una única plataforma multi-tenant.

### 2. MODELO DE NEGOCIO
#### 2.1. Estructura de ingresos
- **Plan Base:** Incluye deployment rápido del sitio web + features básicos (hasta 5 páginas, formularios de contacto).
- **Planes de Features:** El cliente paga mensualmente por cada módulo adicional activado:
  - Módulo CRM
  - Módulo Tienda Virtual (Ecommerce)
  - Módulo Cotizador
  - Módulo Control de Citas
  - Módulo Control de Proyectos
- **Modelo de precios por tenant:** Cada tenant paga según su consumo. No hay costo fijo por "usuario" dentro del tenant.

#### 2.2. Ciclo de vida del tenant
- **TRIAL:** Periodo de prueba gratuito (30 días) con todas las features activas.
- **ACTIVE:** Suscripción activa con los módulos contratados.
- **GRACE_PERIOD:** Periodo de gracia post-vencimiento (15 días) donde el sitio sigue vivo pero los módulos premium se bloquean.
- **SUSPENDED:** Tenant suspendido por falta de pago. El sitio web sigue visible pero el dashboard de administración está bloqueado.
- **CANCELLED:** Tenant cancelado. Los datos se conservan en Coldline (Google Cloud Storage) por 90 días antes de la destrucción definitiva.

### 3. ARQUITECTURA TÉCNICA
#### 3.1. Infraestructura multi-tenant
Decisión clave: Base de datos compartida con RLS (Row-Level Security) en PostgreSQL, no bases de datos aisladas por tenant. Esto permite escalar a 300+ tenants sin el overhead.

**Estructura de URLs:**
- Dashboard global: `expertosmkd.com/hub`
- Sitio del tenant: `[subdominio].expertosmkd.com`
- Dashboard del tenant: `[subdominio].expertosmkd.com/dashboard`
- Dominio personalizado: `[dominio-cliente.com]` (apunta al tenant vía CNAME)

#### 3.2. Stack tecnológico (NO NEGOCIABLE)
- Frontend: Next.js 14 (App Router)
- Backend API: Server Actions + API Routes
- Base de Datos: PostgreSQL (Supabase)
- ORM: Prisma
- Autenticación: NextAuth.js con JWT
- UI Components: Tailwind CSS + Radix UI
- Gráficas: Recharts
- Validación: Zod
- Email: Nodemailer + Titan Email
- Infraestructura: Google Cloud Run + Load Balancer

#### 3.3. Integraciones externas
- **Medusa:** Backend completo de ecommerce (instalación completa, NO como referencia).
- **Stripe:** Pasarela de pagos para suscripciones de tenants.
- **Google Secret Manager:** Almacenamiento seguro de API keys por tenant.

### 4. REPOSITORIOS DE REFERENCIA (USO ESTRICTO)
#### 4.1. Medusa (INSTALACIÓN COMPLETA)
Medusa es nuestro backend de ecommerce. No se "traduce" ni se "analiza". Se instala como servicio separado y se integra con Celeritas. Cada tenant de Celeritas tiene su propia configuración en Medusa.

#### 4.2. Twenty (SOLO ANÁLISIS DE ARQUITECTURA)
Analizar para CRM: Modelos de datos (Companies, People, Opportunities, Notes, Activities), Pipeline visual, Relaciones. Traducir su lógica a nuestro stack (Next.js + Prisma + Tailwind), sin copiar código.

#### 4.3. Cal.com (SOLO ANÁLISIS DE ARQUITECTURA)
Analizar para Citas: Lógica de disponibilidad, husos horarios, flujo de reserva. Traducir su lógica a nuestro stack, sin copiar código.

### 5. REGLAS DE SEGURIDAD (NO NEGOCIABLES)
- **Zero Trust en tenant_id:** La fuente de verdad del tenant_id es la sesión del servidor. Nunca confiar en el payload del cliente.
- **RLS en PostgreSQL:** Políticas RLS como respaldo de defensa en profundidad.
- **Todas las queries filtran por tenant_id:** Nunca asumir que el usuario pertenece al tenant correcto.
- **bcrypt para contraseñas:** Salt rounds: 12.
- **Zod para validación:** Todos los inputs del cliente deben validarse.
- **Zero any:** TypeScript estricto.
- **Sanitización de HTML:** Todo contenido generado por usuarios debe sanitizarse.
- **Serialización segura:** Server Actions siempre con try/catch/finally.

### 6. METODOLOGÍA DE TRABAJO (SPECIFY + HANDOFF)
Flujo obligatorio para cada MVP:
1. `/specify specify "Descripción clara del MVP"`
2. `/specify plan`
3. `/specify tasks`
4. Seguir `tasks.md` al pie de la letra. Mantener `handoff.md` actualizado.
5. `/specify analyze` y actualización final del Handoff.

### 7. ROADMAP DE MVP'S (ORDEN ESTRICTO)
0. Fundación Técnica (✅ COMPLETADO)
1. Hub Global de Administración (✅ COMPLETADO)
2. Login y Onboarding del Tenant (✅ COMPLETADO)
3. Dashboard Base del Tenant (✅ COMPLETADO)
4. Gestión de Usuarios del Tenant (🔜 PRÓXIMO)
5. Feature Flags y Módulos Opcionales
6. Módulo de CRM (basado en Twenty)
7. Módulo de Cotizador
8. Módulo de Control de Citas (basado en Cal.com)
9. Módulo de Control de Proyectos
10. Módulo de Tienda Virtual (integración con Medusa)

### RECORDATORIO FINAL PARA ANTIGRAVITY
Este documento es tu norte. Celeritas no es un proyecto de código abierto genérico. Es un producto comercial con estándares de calidad, seguridad y funcionalidad muy altos. No entregues MVPs "flacos". Tienes el contexto completo. No hay excusa para entregar algo incompleto.
