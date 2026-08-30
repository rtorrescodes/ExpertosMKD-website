"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth.config";
import { prisma } from "@/lib/prisma/client";
import { revalidatePath } from "next/cache";

async function requireTenantUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.tenantId) {
    throw new Error("No autenticado o sin tenant asignado.");
  }
  return session.user;
}

const DEFAULT_AVAILABILITY = {
  "1": { start: "09:00", end: "17:00" }, // Lunes
  "2": { start: "09:00", end: "17:00" }, // Martes
  "3": { start: "09:00", end: "17:00" }, // Miércoles
  "4": { start: "09:00", end: "17:00" }, // Jueves
  "5": { start: "09:00", end: "17:00" }, // Viernes
  "6": null, // Sábado (Cerrado)
  "0": null, // Domingo (Cerrado)
};

export async function createEventType(data: {
  title: string;
  description?: string;
  durationMinutes: number;
  price?: number;
}) {
  try {
    const user = await requireTenantUser();
    
    // Generate a simple slug
    const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Math.floor(Math.random() * 1000);

    const eventType = await prisma.apptEventType.create({
      data: {
        tenantId: user.tenantId!,
        title: data.title,
        slug,
        description: data.description,
        durationMinutes: data.durationMinutes,
        price: data.price || 0,
        availability: DEFAULT_AVAILABILITY,
      },
    });

    revalidatePath(`/site/[tenant]/dashboard/appointments`, "layout");
    return { success: true };
  } catch (error: any) {
    console.error(error);
    return { error: error.message || "Error al crear tipo de evento" };
  }
}

export async function updateAvailability(eventTypeId: string, availability: any) {
  try {
    const user = await requireTenantUser();
    await prisma.apptEventType.update({
      where: { id: eventTypeId, tenantId: user.tenantId! },
      data: { availability },
    });
    revalidatePath(`/site/[tenant]/dashboard/appointments`, "layout");
    return { success: true };
  } catch (error: any) {
    return { error: "Error al actualizar disponibilidad" };
  }
}

// ==========================================
// ====== MOTOR DE DISPONIBILIDAD (CORE) ====
// ==========================================

export async function getAvailableSlots(tenantSubdomain: string, eventSlug: string, dateString: string) {
  try {
    // 1. Fetch Tenant & Event Type
    const tenant = await prisma.tenant.findUnique({ where: { subdomain: tenantSubdomain } });
    if (!tenant) throw new Error("Tenant no encontrado");

    const eventType = await prisma.apptEventType.findUnique({
      where: { tenantId_slug: { tenantId: tenant.id, slug: eventSlug } },
    });
    if (!eventType || !eventType.isActive) throw new Error("Servicio no disponible");

    // 2. Determine Day of Week (0 = Sun, 1 = Mon, etc.)
    const dateObj = new Date(dateString + "T00:00:00");
    const dayOfWeek = dateObj.getDay().toString();

    const availability = eventType.availability as Record<string, { start: string, end: string } | null>;
    const daySchedule = availability[dayOfWeek];

    if (!daySchedule) {
      return { success: true, slots: [] }; // Business closed this day
    }

    // 3. Generate Time Slots
    const slots: string[] = [];
    const [startHour, startMin] = daySchedule.start.split(":").map(Number);
    const [endHour, endMin] = daySchedule.end.split(":").map(Number);

    let currentMin = startHour * 60 + startMin;
    const finalMin = endHour * 60 + endMin;
    const duration = eventType.durationMinutes;

    while (currentMin + duration <= finalMin) {
      const h = Math.floor(currentMin / 60).toString().padStart(2, "0");
      const m = (currentMin % 60).toString().padStart(2, "0");
      slots.push(`${h}:${m}`);
      currentMin += duration; // Simple consecutive slots (could be customized to allow padding)
    }

    // 4. Fetch Existing Bookings for this date to prevent Double-Booking
    const startOfDay = new Date(dateString + "T00:00:00.000Z");
    const endOfDay = new Date(dateString + "T23:59:59.999Z");

    const existingBookings = await prisma.apptBooking.findMany({
      where: {
        tenantId: tenant.id,
        status: { in: ["CONFIRMED", "PENDING"] },
        startTime: { gte: startOfDay, lte: endOfDay }
      }
    });

    // 5. Filter Slots
    const availableSlots = slots.filter(slotTime => {
      const [slotH, slotM] = slotTime.split(":").map(Number);
      const slotStart = new Date(dateString + `T${slotTime}:00.000Z`); // Assuming UTC for simplicity in this MVP
      const slotEnd = new Date(slotStart.getTime() + duration * 60000);

      const isConflict = existingBookings.some(booking => {
        const bStart = booking.startTime;
        const bEnd = booking.endTime;
        // Overlap condition: start < end_b AND end > start_b
        return (slotStart < bEnd && slotEnd > bStart);
      });

      return !isConflict;
    });

    return { 
      success: true, 
      slots: availableSlots, 
      eventType: {
        ...eventType,
        price: eventType.price ? Number(eventType.price) : 0
      }
    };
  } catch (error: any) {
    console.error(error);
    return { error: error.message || "Error al obtener disponibilidad" };
  }
}

export async function createBooking(data: {
  tenantSubdomain: string;
  eventSlug: string;
  dateString: string; // YYYY-MM-DD
  timeString: string; // HH:MM
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  notes?: string;
}) {
  try {
    const tenant = await prisma.tenant.findUnique({ where: { subdomain: data.tenantSubdomain } });
    if (!tenant) throw new Error("Tenant no encontrado");

    const eventType = await prisma.apptEventType.findUnique({
      where: { tenantId_slug: { tenantId: tenant.id, slug: data.eventSlug } },
    });
    if (!eventType) throw new Error("Servicio no encontrado");

    const startTime = new Date(`${data.dateString}T${data.timeString}:00.000Z`);
    const endTime = new Date(startTime.getTime() + eventType.durationMinutes * 60000);

    // Double Check Conflict
    const conflict = await prisma.apptBooking.findFirst({
      where: {
        tenantId: tenant.id,
        status: { in: ["CONFIRMED", "PENDING"] },
        startTime: { lt: endTime },
        endTime: { gt: startTime }
      }
    });

    if (conflict) {
      throw new Error("Lo sentimos, este horario acaba de ser reservado por alguien más.");
    }

    // Try to link to CRM Person
    const person = await prisma.crmPerson.findFirst({
      where: { tenantId: tenant.id, email: data.customerEmail }
    });

    const booking = await prisma.apptBooking.create({
      data: {
        tenantId: tenant.id,
        eventTypeId: eventType.id,
        startTime,
        endTime,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        notes: data.notes,
        personId: person?.id
      }
    });

    return { success: true, bookingId: booking.id };
  } catch (error: any) {
    console.error(error);
    return { error: error.message || "Error al procesar reserva" };
  }
}
export async function updateBookingStatus(bookingId: string, status: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.tenantId) throw new Error("No autorizado");
    
    await prisma.apptBooking.update({
      where: { id: bookingId },
      data: { status }
    });
    
    revalidatePath(/site/[tenant]/dashboard/appointments, "layout");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
export async function createManualBooking(data: {
  eventTypeId: string;
  startTime: string;
  endTime: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
}) {
  try {
    const user = await requireTenantUser();
    
    await prisma.apptBooking.create({
      data: {
        tenantId: user.tenantId!,
        eventTypeId: data.eventTypeId,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone || null,
        status: "CONFIRMED",
      }
    });

    revalidatePath("/site/[tenant]/dashboard/appointments", "page");
    return { success: true };
  } catch (error: any) {
    console.error(error);
    return { error: error.message || "Error al crear la cita manualmente" };
  }
}
