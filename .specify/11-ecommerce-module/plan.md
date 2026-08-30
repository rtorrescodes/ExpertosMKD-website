# MVP 10: Tienda Virtual - Plan de Implementación

## 1. Actualización de Base de Datos (`schema.prisma`)
Se inyectarán los modelos del dominio de Medusa adaptados a Celeritas:

```prisma
// ==========================================
// ====== CELERITAS E-COMMERCE (MEDUSA) =====
// ==========================================

model EcomProduct {
  id          String   @id @default(cuid())
  tenantId    String
  title       String
  handle      String   // slug URL (ej. playera-negra)
  description String?  @db.Text
  isPublished Boolean  @default(true)
  imageUrl    String?

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  variants    EcomVariant[]
  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@unique([tenantId, handle])
}

model EcomVariant {
  id                String   @id @default(cuid())
  productId         String
  title             String   // Ej. "Grande / Azul" o "Default"
  sku               String?
  price             Decimal  @default(0)
  inventoryQuantity Int      @default(0)
  
  product           EcomProduct @relation(fields: [productId], references: [id], onDelete: Cascade)
  orderItems        EcomOrderItem[]
}

model EcomOrder {
  id            String   @id @default(cuid())
  tenantId      String
  displayId     Int      @default(autoincrement()) // Folio visible #1001
  status        String   @default("PENDING") // PENDING, PAID, SHIPPED, COMPLETED, CANCELED
  
  customerName  String
  customerEmail String
  personId      String?  // Relación a CRM

  subtotal      Decimal  @default(0)
  total         Decimal  @default(0)

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  items         EcomOrderItem[]
  tenant        Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  person        CrmPerson? @relation(fields: [personId], references: [id])
}

model EcomOrderItem {
  id          String   @id @default(cuid())
  orderId     String
  variantId   String?  // Relación opcional por si la variante se elimina, el histórico queda
  title       String   // Guardamos el título histórico por seguridad
  quantity    Int
  unitPrice   Decimal  @default(0)
  total       Decimal  @default(0)

  order       EcomOrder    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  variant     EcomVariant? @relation(fields: [variantId], references: [id])
}
```

## 2. Server Actions (`src/actions/ecommerce.ts`)
- `createProduct(data)`: Crea el producto base y su primera variante "Default".
- `createOrder(data)`: Recibe el carrito, crea la orden, descuenta el stock (`inventoryQuantity`) y la vincula con el CRM si el mail coincide.

## 3. UI Panel de Administración
- `/dashboard/ecommerce/products`: Catálogo y gestor de inventario.
- `/dashboard/ecommerce/orders`: Lista de órdenes recibidas (similar al panel de Shopify/Medusa).

## 4. Storefront UI (Rutas Públicas)
- `/site/[tenant]/store`: Grid de productos con imágenes placeholder.
- `/site/[tenant]/store/p/[handle]`: Detalles del producto, selector de cantidad y botón "Añadir al Carrito".
- `/site/[tenant]/store/checkout`: Formulario de cierre de orden (Checkout básico).
