# MVP 7: Módulo de Cotizador Avanzado - Especificación

## 1. Resumen Ejecutivo
El Módulo de Cotizador permite a los tenants de Celeritas generar propuestas comerciales y cotizaciones interactivas con visualización en tiempo real. Estas cotizaciones pueden enviarse por correo, exportarse a PDF o compartirse vía un link público optimizado para WhatsApp (celulares), el cual incluye un botón para "Aceptar Propuesta" y conectar con flujos de pago o creación de órdenes.

## 2. Requerimientos Core (Funcionalidad)
1. **Visualizador en Tiempo Real:** Interfaz dividida (Split-screen). A la izquierda, el formulario de construcción (ítems, descuentos, notas); a la derecha, la previsualización del documento final (con 3 plantillas a escoger: Moderno, Clásico, Minimalista).
2. **Integración Modular (Smart Fetching):**
   - **CRM Habilitado:** Si el tenant tiene el CRM activo, puede seleccionar un Lead/Contacto existente desde un droplist. La cotización generada se registrará automáticamente como una *Actividad* en el historial (timeline) de ese contacto.
   - **CRM Deshabilitado:** Muestra campos de texto libre para teclear el Nombre y Correo del prospecto.
   - **E-Commerce Habilitado (Medusa.js futuro):** Permite buscar y autocompletar productos/precios desde el inventario de la tienda.
   - **Ítems Libres:** Siempre es posible agregar ítems manuales (servicios, productos no listados), ajustar precios, aplicar descuentos (porcentaje o fijos) y promociones.
3. **Distribución Omnicanal:**
   - Envío directo por email (preparado para el futuro Email Piping IMAP del CRM).
   - Generación de PDF estático (descargable).
   - Link Público (Ej: `/cumbres-del-lago/quote/token-abc-123`).
4. **Link Público y Cierre (Conversión):**
   - Vista responsiva para móviles (ideal para que el cliente la abra desde WhatsApp).
   - Botón "Aceptar Propuesta".
   - Al aceptar, la cotización cambia de estado (`SENT` -> `ACCEPTED`).
   - (Futuro) Conexión a pasarelas de pago (Stripe/PayPal/MercadoPago) o creación de orden en Medusa.

## 3. Arquitectura de Datos (Prisma)
- **CrmQuote:** Modelo principal de la cotización (`tenantId`, `quoteNumber`, `personId` (opcional), `status` (DRAFT, SENT, ACCEPTED, DECLINED), `template`, `publicToken`, totales, descuentos).
- **CrmQuoteItem:** Modelo para los renglones/productos de la cotización (`quoteId`, `productId` (opcional para Medusa), `name`, `quantity`, `unitPrice`, `discount`).
- **CrmActivity:** Modelo para registrar el historial en el CRM (Ej: "Cotización #100 enviada", "El cliente abrió el correo" (futuro), "Cotización Aceptada").

## 4. UI / UX Esperada
- **Dashboard:** `/dashboard/quotes` (Listado de cotizaciones y su estado).
- **Builder:** `/dashboard/quotes/new` (UI en tiempo real con previsualización del formato de carta/PDF).
- **Página Pública:** `/quote/[publicToken]` (Diseño limpio, enfocado a la conversión, responsivo, marca blanca pero con el branding del Tenant).

## 5. Prevención de Riesgos y Reglas Zero-Trust
- Todas las consultas de creación, edición y listado del builder deben incluir el `tenantId` de la sesión del usuario.
- La vista pública (`/quote/[token]`) NO requiere sesión, pero debe recuperar estrictamente solo los datos de esa cotización usando el `publicToken` (UUID aleatorio), sin exponer `id` secuenciales ni información de otros clientes.
