'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createTask(data: {
  title: string
  description?: string
  dueDate: Date
  type: string
  userId: string
  leadId?: string
}) {
  try {
    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        dueDate: data.dueDate,
        type: data.type,
        userId: data.userId,
        leadId: data.leadId || null,
        status: 'PENDING'
      }
    })
    revalidatePath('/admin/tasks')
    if (data.leadId) {
      revalidatePath(`/admin/leads/${data.leadId}`)
    }
    return { success: true, task }
  } catch (error: any) {
    console.error('Error creating task:', error)
    return { success: false, error: error.message }
  }
}

export async function updateTaskStatus(taskId: string, status: string) {
  try {
    const task = await prisma.task.update({
      where: { id: taskId },
      data: { status }
    })
    revalidatePath('/admin/tasks')
    if (task.leadId) {
      revalidatePath(`/admin/leads/${task.leadId}`)
    }
    return { success: true, task }
  } catch (error: any) {
    console.error('Error updating task:', error)
    return { success: false, error: error.message }
  }
}

export async function deleteTask(taskId: string) {
  try {
    const task = await prisma.task.delete({
      where: { id: taskId }
    })
    revalidatePath('/admin/tasks')
    if (task.leadId) {
      revalidatePath(`/admin/leads/${task.leadId}`)
    }
    return { success: true }
  } catch (error: any) {
    console.error('Error deleting task:', error)
    return { success: false, error: error.message }
  }
}

export async function getUpcomingTasks(userId: string) {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        userId,
        status: 'PENDING'
      },
      include: {
        lead: {
          select: {
            id: true,
            name: true,
            companyName: true,
            email: true,
            phone: true
          }
        }
      },
      orderBy: {
        dueDate: 'asc'
      }
    })
    return { success: true, tasks }
  } catch (error: any) {
    console.error('Error fetching tasks:', error)
    return { success: false, error: error.message }
  }
}
