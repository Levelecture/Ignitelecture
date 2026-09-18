import { and, desc, eq } from 'drizzle-orm'
import { db } from '../../lib/database'
import { courses } from '../../lib/database/schema'
import type { CreateCourseInput, UpdateCourseInput } from './courses.schema'

export function listCourses(userId: string) {
  return db
    .select()
    .from(courses)
    .where(eq(courses.userId, userId))
    .orderBy(desc(courses.createdAt))
}

export async function getCourse(userId: string, id: string) {
  const [row] = await db
    .select()
    .from(courses)
    .where(and(eq(courses.id, id), eq(courses.userId, userId)))
  return row
}

export async function createCourse(userId: string, data: CreateCourseInput) {
  try {
    const [created] = await db
      .insert(courses)
      .values({ ...data, userId })
      .returning()
    return created
  } catch (e) {
    if (String(e).includes('course_userId_code_udx')) return null
    throw e
  }
}

export async function updateCourse(userId: string, id: string, data: UpdateCourseInput) {
  const [updated] = await db
    .update(courses)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(courses.id, id), eq(courses.userId, userId)))
    .returning()
  return updated
}

export async function deleteCourse(userId: string, id: string) {
  const [deleted] = await db
    .delete(courses)
    .where(and(eq(courses.id, id), eq(courses.userId, userId)))
    .returning()
  return deleted
}
