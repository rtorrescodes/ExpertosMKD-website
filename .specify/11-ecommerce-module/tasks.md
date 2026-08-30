# MVP 10: Tareas de Tienda Virtual (E-commerce)

## Fase 1: Arquitectura Base
- [x] Incorporar los modelos (`EcomProduct`, `EcomVariant`, `EcomOrder`, `EcomOrderItem`) en `schema.prisma`.
- [x] Ejecutar migraciones `prisma db push` y regenerar el cliente Prisma.

## Fase 2: Backend y Server Actions
- [x] Crear `src/actions/ecommerce.ts`.
- [x] Programar `createProduct`: Creación transaccional del producto y su variante por defecto.
- [x] Programar `createOrder`: Validar stock disponible, reducir el stock y generar el `EcomOrder`.

## Fase 3: UI Admin (Backoffice)
- [x] Crear la página `/dashboard/ecommerce/page.tsx` con tabs para Productos y Órdenes (O dos páginas separadas).
- [x] Diseñar formulario para alta rápida de productos (Título, Precio, Stock).

## Fase 4: Storefront Público (UI)
- [x] Construir `/site/[tenant]/store/page.tsx`: Grid minimalista de productos (Storefront principal).
- [x] Construir `/site/[tenant]/store/p/[handle]/page.tsx`: Ficha técnica del producto con selector de cantidad.
- [x] Implementar un manejador de estado global/local (Zustand o LocalStorage) para el "Carrito de Compras" flotante.

## Fase 5: Checkout y Checkout Final
- [x] Crear `/site/[tenant]/store/checkout/page.tsx`: Pantalla de recolección de datos y desglose de totales.
- [x] Conectar botón "Realizar Pedido" a `createOrder`.
- [x] Pantalla de agradecimiento con folio de orden (Display ID).

## Fase 6: QA
- [x] Validar que un tenant no vea los productos de otro tenant.
- [x] Comprobar que el inventario se reduce al procesar la orden.
