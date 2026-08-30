# MVP 7: Módulo Cotizador - Plan de Implementación

## 1. Actualización de Prisma (`schema.prisma`)
Se extenderá el esquema actual para soportar Cotizaciones e Historial de Actividades (para sincronizar con el CRM).

```prisma
model CrmActivity {
  id             String   @id @default(cuid())
  tenantId       String
  type           String   // "NOTE", "QUOTE_SENT", "QUOTE_ACCEPTED", "EMAIL_RECEIVED"
  content        String?  @db.Text
  personId       String?
  opportunityId  String?
  quoteId        String?
  createdAt      DateTime @default(now())

  tenant         Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  person         CrmPerson? @relation(fields: [personId], references: [id])
  // opportunity, quote...
}

model CrmQuote {
  id             String   @id @default(cuid())
  tenantId       String
  quoteNumber    Int      @default(autoincrement()) // Simplificado para autoincremento por BD (requerirá lógica custom si se quiere autoincremento por tenant)
  publicToken    String   @unique @default(uuid())
  status         String   @default("DRAFT") // DRAFT, SENT, ACCEPTED, DECLINED, PAID
  template       String   @default("MODERN") // MODERN, CLASSIC, MINIMALIST
  
  // Datos del cliente (Si no hay CRM, se guardan estáticos)
  customerName   String?
  customerEmail  String?
  
  // Relación con CRM (opcional)
  personId       String?
  person         CrmPerson? @relation(fields: [personId], references: [id])

  // Financieros
  subtotal       Decimal  @default(0)
  discountTotal  Decimal  @default(0)
  taxTotal       Decimal  @default(0)
  grandTotal     Decimal  @default(0)
  notes          String?  @db.Text

  validUntil     DateTime?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  
  items          CrmQuoteItem[]
  activities     CrmActivity[]
  tenant         Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
}

model CrmQuoteItem {
  id             String   @id @default(cuid())
  quoteId        String
  productId      String?  // Referencia externa a Medusa o BD
  name           String
  description    String?
  quantity       Int      @default(1)
  unitPrice      Decimal  @default(0)
  discount       Decimal  @default(0) // Puede ser fijo o % en la lógica, aquí guardamos el valor descontado
  total          Decimal  @default(0)

  quote          CrmQuote @relation(fields: [quoteId], references: [id], onDelete: Cascade)
}
```
*(Nota: Prisma no soporta autoincremento particionado por Tenant nativamente, usaremos un UUID amigable para el UI o un campo de string `quoteRef` generado en código).*

## 2. Server Actions (`src/actions/quote.ts`)
- `createQuote(data, items)`: Crea la cabecera y los ítems en una transacción de Prisma. Dispara la creación de un `CrmActivity` si está atado a una persona del CRM.
- `updateQuoteStatus(id, status)`: Cambia el estado (ej: Al abrir el link, al aceptar).
- `generatePDF(id)`: Lógica para renderizar el componente reactivo en un buffer PDF (o delegar al cliente usando `window.print()` / librerías client-side para ahorrar costos de servidor).

## 3. Interfaces de Usuario (Rutas)
- `/site/[tenant]/dashboard/quotes`: Tabla con el historial de cotizaciones.
- `/site/[tenant]/dashboard/quotes/new`: El **Quote Builder**. Interfaz dividida.
  - Componente `<QuoteForm />` (Izquierda).
  - Componente `<LivePreview template={selectedTemplate} data={formData} />` (Derecha).
- `/site/[tenant]/quote/[token]`: Ruta pública. Presenta el componente `<LivePreview>` en formato web con un Call to Action flotante en móviles: **"Aceptar y Continuar"**.

## 4. Estrategia de Renderizado PDF / UI
En vez de usar motores pesados en el backend como Puppeteer, implementaremos la previsualización usando componentes puros de React (HTML/CSS) responsivos.
- Para "Exportar a PDF", el componente usará CSS `@media print` y una llamada a `window.print()` estilizada, o si se requiere render real de archivos sin intervención del usuario, se usará `@react-pdf/renderer` en un endpoint API. En esta fase MVP, priorizaremos la vista web responsiva y CSS Print.
