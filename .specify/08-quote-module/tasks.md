# MVP 7: Tareas de Módulo Cotizador

## Fase 1: Arquitectura de Base de Datos
- [x] Modificar `prisma/schema.prisma` agregando `CrmActivity`, `CrmQuote` y `CrmQuoteItem`.
- [x] Conectar las relaciones con `CrmPerson` y `Tenant`.
- [x] Ejecutar `prisma format` y `prisma db push --accept-data-loss` (asegurar el entorno actual).
- [x] Regenerar cliente de Prisma.

## Fase 2: Lógica de Servidor (Server Actions)
- [x] Crear `src/actions/quote.ts`.
- [x] Función `createQuote`: Lógica transaccional para guardar la cotización, sus ítems y registrar una Actividad en el CRM si aplica.
- [x] Función `acceptQuote`: Cambia el status a `ACCEPTED` dado un `publicToken`.

## Fase 3: UI - Panel Administrativo (Builder)
- [x] Actualizar `TenantSidebar.tsx` para mostrar "Cotizaciones" (FileText icon) si `featureFlags.quotes` o `featureFlags.crm` están activos (definir la regla).
- [x] Crear `/site/[tenant]/dashboard/quotes/page.tsx` (Lista de cotizaciones).
- [x] Crear `/site/[tenant]/dashboard/quotes/new/page.tsx` (Split-screen Builder).
- [x] Componente `<QuoteBuilderClient />`: Manejo de estado de los ítems (agregar, remover, recalcular subtotales).
- [x] Componente `<QuotePreview />`: Renderizado en vivo de la plantilla seleccionada.

## Fase 4: Vista Pública y Cierre
- [x] Crear ruta pública `/site/[tenant]/quote/[token]/page.tsx` (Fuera del scope de `/dashboard`, por lo tanto no requiere NextAuth).
- [x] Diseñar el layout público adaptado a móviles (pensando en WhatsApp).
- [x] Implementar el botón interactivo "Aceptar Propuesta" que llama a la Server Action `acceptQuote` y lanza un estado de "¡Gracias, pedido confirmado!".

## Fase 5: QA y Edge Cases
- [ ] Verificar que usuarios anónimos no puedan acceder a cotizaciones de otros tokens.
- [ ] Probar el generador de PDF vía navegador (`window.print`).
- [ ] Validar la integración opcional: Crear cotización sin seleccionar contacto CRM vs Seleccionando contacto CRM.
