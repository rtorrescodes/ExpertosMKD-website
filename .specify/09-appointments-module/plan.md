# MVP 8: Módulo de Control de Citas - Plan de Implementación

## 1. Actualización de Prisma (`schema.prisma`)
Agregaremos los modelos requeridos bajo un namespace claro `Appt` (Appointment). Para el manejo de horarios, usaremos un campo de configuración de disponibilidad estándar a nivel Tenant (o EventType) para mantenerlo flexible.

```prisma
// ==========================================
// ====== CELERITAS APPOINTMENTS (CAL) ======
// ==========================================

model ApptEventType {
  id              String   @id @default(cuid())
  tenantId        String
  title           String   // Ej. "Corte de Cabello", "Consulta Médica"
  slug            String   // Ej. "corte-cabello" (para la URL)
  description     String?  @db.Text
  durationMinutes Int      @default(30)
  price           Decimal? @default(0) // 0 si es gratis/no aplica
  isActive        Boolean  @default(true)
  
  // Disponibilidad base (JSON). Ej: { "monday": ["09:00-13:00", "15:00-18:00"], "tuesday": ... }
  availability    Json     @default("{}")

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  bookings        ApptBooking[]
  tenant          Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@unique([tenantId, slug])
}

model ApptBooking {
  id              String   @id @default(cuid())
  tenantId        String
  eventTypeId     String
  
  startTime       DateTime // Fecha y hora exacta de inicio
  endTime         DateTime // Fecha y hora exacta de fin (startTime + duration)
  
  status          String   @default("CONFIRMED") // PENDING, CONFIRMED, CANCELLED
  
  customerName    String
  customerEmail   String
  customerPhone   String?
  notes           String?  @db.Text
  customResponses Json?    // Para campos extra (razón de consulta, placa del auto, etc.)

  personId        String?  // Si hace match con el CRM
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  eventType       ApptEventType @relation(fields: [eventTypeId], references: [id])
  person          CrmPerson?    @relation(fields: [personId], references: [id])
  tenant          Tenant        @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  
  @@index([startTime])
}
```

## 2. Server Actions y Lógica Core (`src/actions/appointments.ts`)
- `getAvailableSlots(tenantId, eventTypeId, date)`: 
  - Esta es la **función crítica**. Lee el JSON de `availability` del `EventType` para el día de la semana solicitado.
  - Genera slots consecutivos (Ej. 09:00, 09:30, 10:00).
  - Consulta la base de datos `ApptBooking` buscando choques (`startTime` < slotEnd AND `endTime` > slotStart).
  - Filtra los slots ocupados y devuelve los libres.
- `createBooking(data)`: Recibe la reserva, re-verifica disponibilidad por seguridad (doble check), crea el registro en Prisma e intenta asociar un `CrmPerson` por email.

## 3. UI Administrativa (`/dashboard/appointments`)
- **Pestaña Citas:** Lista/Calendario de próximas citas agendadas, con botones de Confirmar/Cancelar.
- **Pestaña Servicios (Event Types):** CRUD para crear los tipos de eventos. UI para configurar los días y horas hábiles de manera fácil (checkbox por día y campos de texto para hora inicio/fin).

## 4. UI Pública (`/site/[tenant]/book/[slug]`)
- **Fase 1 (Fecha):** Componente de Calendario (Ej. `react-day-picker` o nativo) para elegir un día.
- **Fase 2 (Hora):** Petición al servidor (Server Action) para traer los `availableSlots`. Renderizado en grid de botones.
- **Fase 3 (Formulario):** Inputs de contacto universales.
- **Diseño Móvil Primero:** Para asegurar que los clientes de mecánicos, peluquerías, etc., puedan reservar desde WhatsApp sin fricción.
