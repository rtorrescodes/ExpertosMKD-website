'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getIndustries() {
  try {
    const industries = await prisma.industry.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { leads: true }
        }
      }
    })
    return { success: true, industries }
  } catch (error: any) {
    console.error('Error fetching industries:', error)
    return { success: false, error: error.message }
  }
}

export async function createIndustry(name: string) {
  try {
    if (!name.trim()) throw new Error('El nombre es requerido')
    
    // Convert to title case for consistency
    const formattedName = name.trim().replace(/\b\w/g, l => l.toUpperCase())

    const existing = await prisma.industry.findUnique({
      where: { name: formattedName }
    })

    if (existing) {
      return { success: true, industry: existing }
    }

    const industry = await prisma.industry.create({
      data: { name: formattedName }
    })

    revalidatePath('/admin/settings/industries')
    return { success: true, industry }
  } catch (error: any) {
    console.error('Error creating industry:', error)
    return { success: false, error: error.message }
  }
}

export async function updateIndustry(id: string, name: string) {
  try {
    if (!name.trim()) throw new Error('El nombre es requerido')
    
    const formattedName = name.trim().replace(/\b\w/g, l => l.toUpperCase())

    const industry = await prisma.industry.update({
      where: { id },
      data: { name: formattedName }
    })

    revalidatePath('/admin/settings/industries')
    return { success: true, industry }
  } catch (error: any) {
    console.error('Error updating industry:', error)
    return { success: false, error: error.message }
  }
}

export async function deleteIndustry(id: string, fallbackIndustryId?: string) {
  try {
    // If fallback is provided, move leads to the new industry first
    if (fallbackIndustryId) {
      await prisma.lead.updateMany({
        where: { industryId: id },
        data: { industryId: fallbackIndustryId }
      })
    } else {
      // If no fallback, just set their industryId to null
      await prisma.lead.updateMany({
        where: { industryId: id },
        data: { industryId: null }
      })
    }

    // Now delete the industry
    await prisma.industry.delete({
      where: { id }
    })

    revalidatePath('/admin/settings/industries')
    return { success: true }
  } catch (error: any) {
    console.error('Error deleting industry:', error)
    return { success: false, error: error.message }
  }
}
