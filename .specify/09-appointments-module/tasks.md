# MVP 8: Tareas de Módulo de Citas (Appointments)

## Fase 1: Base de Datos y Schema
- [x] Editar `prisma/schema.prisma` y agregar `ApptEventType` y `ApptBooking`.
- [x] Enlazar las colecciones en el modelo `Tenant` y `CrmPerson`.
- [x] Ejecutar `prisma format`, `prisma db push` y generar el cliente.

## Fase 2: Configuración (Admin UI)
- [x] Crear la Server Action `src/actions/appointments.ts` con CRUD para EventTypes.
- [x] Construir `/dashboard/appointments/event-types/page.tsx`.
- [x] Crear modal/formulario para que el negocio defina un nuevo Servicio (Nombre, Duración) y su Disponibilidad Semanal (Lunes a Domingo con horas de inicio y fin).

## Fase 3: Visor de Citas (Admin UI)
- [x] Construir `/dashboard/appointments/page.tsx` para listar las citas recibidas, ordenadas por fecha más próxima (`startTime`).
- [x] Permitir cancelar citas (modificar estatus).

## Fase 4: Motor de Reservas y Disponibilidad (Core Logic)
- [x] Programar la lógica matemática `getAvailableSlots(date, eventTypeId)` que intersecte la disponibilidad declarada con las citas existentes.
- [x] Manejar zonas horarias de forma segura (idealmente todo en UTC, renderizado en LocalTime, o asumir zona horaria local del negocio).

## Fase 5: El Booking Portal Público (Frontend)
- [x] Crear la ruta `/site/[tenant]/book/[slug]/page.tsx` (Sin NextAuth).
- [x] Construir el `<BookingClient>` con su wizard de 3 pasos:
  - Calendario de meses.
  - Horarios disponibles generados dinámicamente.
  - Formulario final (Nombre, Correo, Teléfono).
- [x] Al guardar, conectar con la Server Action `createBooking`, mostrar mensaje de confirmación exitosa.

## Fase 6: QA e Integración
- [x] Validar prevención de doble reserva (Double-booking).
- [x] Probar link generado copiando a una pestaña de incógnito.
