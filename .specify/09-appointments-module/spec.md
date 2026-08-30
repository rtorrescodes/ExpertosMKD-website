# MVP 8: Módulo de Control de Citas (Appointments) - Especificación

## 1. Resumen Ejecutivo
Un sistema universal de reservas (inspirado en Cal.com) diseñado para soportar cualquier nicho de mercado: médicos, peluquerías, mecánicos, clases de música, consultorías, etc. Permite a los negocios crear "Tipos de Eventos/Servicios" con duraciones específicas, definir sus horarios de disponibilidad, y compartir un enlace público interactivo donde sus clientes pueden agendar una cita de manera autónoma.

## 2. Requerimientos Core y Universalidad
Para que el sistema sirva a *n* casos de uso, la arquitectura debe ser agnóstica a la industria:
1. **Tipos de Evento (Servicios):**
   - El Tenant puede crear múltiples servicios (Ej. "Corte de Cabello - 30 min", "Consulta General - 1h", "Revisión de Frenos - 45m").
   - Tienen duración, descripción, y opcionalmente un precio base.
2. **Disponibilidad Flexible (Availability):**
   - El sistema calculará los "Time Slots" (huecos disponibles) basándose en las horas de trabajo del Tenant (Lunes a Viernes de 9:00 a 18:00).
   - Bloqueará automáticamente las horas que ya tengan reservas cruzadas (Double-booking prevention).
3. **Página Pública de Reservas (Booking Page):**
   - Interfaz limpia con un calendario (DatePicker) que muestra los días disponibles.
   - Al seleccionar un día, despliega los "Time Slots" generados dinámicamente.
   - Formulario genérico y expandible (Nombre, Email, Teléfono + Notas adicionales para el cliente, útil para "Síntomas", "Modelo del carro", "Nombre de mascota").
4. **Sincronización con CRM (Opcional):**
   - Si el cliente que agenda coincide con un correo de `CrmPerson`, la cita se adjunta a su expediente.
   - Si no existe, se puede configurar para que genere un nuevo Lead/Contacto automáticamente.

## 3. Arquitectura de Datos (Clon Conceptual de Cal.com)
- **ApptEventType:** Define el servicio que se puede reservar (`tenantId`, `title`, `slug`, `durationMinutes`, `price`, `isActive`).
- **ApptAvailability:** (Opcional para MVP, podemos guardar esto en el `settings` de Tenant o crear un modelo) Definirá los horarios semanales del negocio. Para fase inicial, guardaremos un JSON en el `ApptEventType` o `Tenant` con el horario base.
- **ApptBooking:** La reserva real (`tenantId`, `eventTypeId`, `startTime`, `endTime`, `customerName`, `customerEmail`, `customerPhone`, `status`: PENDING/CONFIRMED/CANCELLED, `personId`, `customResponses` JSON).

## 4. UI / UX Esperada
- **Panel Admin:** `/site/[tenant]/dashboard/appointments` (Calendario/Lista de citas agendadas) y `/dashboard/appointments/event-types` (Gestor de servicios).
- **Portal Público:** `/site/[tenant]/book/[eventSlug]` -> Un flujo paso a paso:
  1. Seleccionar Día (Calendario mensual).
  2. Seleccionar Hora (Lista de botones de slots).
  3. Confirmar Datos (Formulario).
  4. Pantalla de Éxito.

## 5. Criterios de Éxito
- Un usuario administrador (peluquero, doctor) puede entrar, crear el servicio "Corte de Pelo", compartir el link, y yo, como cliente, puedo reservar un martes a las 10:00 am.
- El sistema NO me deja reservar el martes a las 10:00 am si ya hay una cita confirmada que choca con ese horario.
