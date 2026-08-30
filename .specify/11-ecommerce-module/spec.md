# MVP 10: Módulo de Tienda Virtual (Medusa.js Architecture) - Especificación

## 1. Resumen Ejecutivo
Construiremos el módulo de Tienda Virtual nativo para Celeritas, modelando la arquitectura de datos (Dominio) basada en los conceptos de **Medusa.js** (Productos, Variantes, Órdenes, Clientes). En lugar de levantar un servidor Node independiente de Medusa (que rompería el multi-tenant y aislaría las bases de datos), integraremos estos modelos directamente en el esquema Prisma de Celeritas. Esto asegura que la tienda comparta la misma estética UI, el mismo inicio de sesión, y se conecte fluidamente con el CRM y el Cotizador.

## 2. Requerimientos Core (Arquitectura Medusa)
1. **Modelado de Productos y Variantes:**
   - Un producto base (Ej. "Playera Celeritas").
   - Múltiples variantes por producto (Ej. "Chica", "Mediana", "Grande") con control de inventario y precios por SKU.
2. **Carrito de Compras y Órdenes:**
   - Gestión de órdenes de compra con estados estilo Medusa (`PENDING`, `COMPLETED`, `CANCELED`, `SHIPPED`).
   - Conexión del cliente de la orden con el `CrmPerson` si el módulo de CRM está activo.
3. **Escaparate Público (Storefront Headless):**
   - Una ruta pública `/site/[tenant]/store` y `/site/[tenant]/store/p/[handle]`.
   - Diseño limpio, minimalista y responsivo (Tailwind) alineado con la UI de Celeritas.
   - Carrito de compras persistente en cliente (LocalStorage/Zustand o Cookies).
4. **Panel de Administración (Admin Dashboard):**
   - Gestión de catálogo y stock.
   - Visor de Órdenes.

## 3. Arquitectura de Datos (Clon Medusa en Prisma)
- **EcomProduct:** `id`, `tenantId`, `title`, `handle` (slug), `description`, `isPublished`.
- **EcomVariant:** `id`, `productId`, `title`, `sku`, `price`, `inventoryQuantity`.
- **EcomOrder:** `id`, `tenantId`, `displayId` (Ej. #1001), `status`, `customerEmail`, `customerName`, `personId` (Opcional), `total`.
- **EcomOrderItem:** `id`, `orderId`, `variantId`, `title`, `quantity`, `unitPrice`.

## 4. Diseño y UI (Estética Celeritas)
- Mantendremos los componentes de Radix / Lucide Icons.
- Botones negros, esquinas redondeadas suaves, bordes grises (`border-gray-200`), y mucho espacio en blanco (White-space) para que los productos destaquen visualmente sin ruido.
- La navegación pública de la tienda compartirá el layout del tenant pero optimizada para conversión B2B/B2C.
