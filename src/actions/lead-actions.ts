"use server"

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function updateLeadStatus(leadId: string, status: any) {
  try {
    await prisma.lead.update({
      where: { id: leadId },
      data: { status }
    })
    
    // Registrar la actividad del cambio de estatus
    await prisma.activity.create({
      data: {
        leadId,
        type: 'STATUS_CHANGE',
        subject: `Estatus cambiado a ${status}`,
        content: `El usuario actualizó el estatus del prospecto a ${status}.`
      }
    })

    revalidatePath(`/admin/leads/${leadId}`)
    return { success: true }
  } catch (error: any) {
    console.error('Error actualizando estatus:', error)
    return { success: false, error: error.message }
  }
}

export async function addManualActivity(leadId: string, type: string, subject: string, content: string) {
  try {
    await prisma.activity.create({
      data: {
        leadId,
        type, // Puede ser "MEETING", "CALL", "NOTE"
        subject,
        content
      }
    })

    revalidatePath(`/admin/leads/${leadId}`)
    return { success: true }
  } catch (error: any) {
    console.error('Error agregando actividad:', error)
    return { success: false, error: error.message }
  }
}

export async function updateLeadDetails(leadId: string, data: any) {
  try {
    await prisma.lead.update({
      where: { id: leadId },
      data
    })
    revalidatePath(`/admin/leads/${leadId}`)
    return { success: true }
  } catch (error: any) {
    console.error('Error actualizando lead:', error)
    return { success: false, error: error.message }
  }
}

export async function claimLead(leadId: string, userId: string) {
  try {
    await prisma.lead.update({
      where: { id: leadId },
      data: { assignedToId: userId }
    })
    revalidatePath('/admin/leads')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function blacklistLead(leadId: string) {
  try {
    await prisma.lead.update({
      where: { id: leadId },
      data: { isBlacklisted: true }
    })
    revalidatePath('/admin/leads')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function rateLead(leadId: string, rating: string) {
  try {
    await prisma.lead.update({
      where: { id: leadId },
      data: { rating }
    })
    revalidatePath('/admin/leads')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function createManualLead(data: {
  companyName: string
  name: string
  email: string
  phone: string
  industry: string
  city: string
  state: string
  assignedToId: string
}) {
  try {
    const newLead = await prisma.lead.create({
      data: {
        ...data,
        source: 'Manual',
        status: 'NEW'
      }
    })
    revalidatePath('/admin/leads')
    return { success: true, lead: newLead }
  } catch (error: any) {
    console.error('Error creando lead manual:', error)
    return { success: false, error: error.message }
  }
}
