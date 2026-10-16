import { and, asc, desc, eq, ilike } from 'drizzle-orm'
import { db } from '../../lib/database'
import { assignments, courses } from '../../lib/database/schema'
import type {
  CreateAssignmentInput,
  ListAssignmentsQuery,
  UpdateAssignmentInput,
} from './assignments.schema'

function escapeLike(value: string) {
  return value.replace(/[\\%_]/g, (ch) => `\\${ch}`)
}

export function listAssignments(userId: string, query: ListAssignmentsQuery) {
  const conditions = [eq(assignments.userId, userId)]
  if (query.status) conditions.push(eq(assignments.status, query.status))
  if (query.priority) conditions.push(eq(assignments.priority, query.priority))
  if (query.courseId) conditions.push(eq(assignments.courseId, query.courseId))
  if (query.search)
    conditions.push(ilike(assignments.title, `%${escapeLike(query.search)}%`))

  const direction = query.order === 'asc' ? asc : desc

  return db
    .select({
      id: assignments.id,
      courseId: assignments.courseId,
      courseName: courses.name,
      courseCode: courses.code,
      title: assignments.title,
      notes: assignments.notes,
      taskUrl: assignments.taskUrl,
      status: assignments.status,
      priority: assignments.priority,
      dueAt: assignments.dueAt,
      reminderAt: assignments.reminderAt,
      submittedAt: assignments.submittedAt,
      grade: assignments.grade,
      createdAt: assignments.createdAt,
      updatedAt: assignments.updatedAt,
    })
    .from(assignments)
    .leftJoin(courses, eq(assignments.courseId, courses.id))
    .where(and(...conditions))
    .orderBy(direction(assignments.createdAt), asc(assignments.id))
}

export async function getAssignment(userId: string, id: string) {
  const [row] = await db
    .select()
    .from(assignments)
    .where(and(eq(assignments.id, id), eq(assignments.userId, userId)))
  return row
}

export async function createAssignment(userId: string, data: CreateAssignmentInput) {
  const [created] = await db
    .insert(assignments)
    .values({ ...data, userId })
    .returning()
  return created
}

export async function updateAssignment(
  userId: string,
  id: string,
  data: UpdateAssignmentInput,
) {
  const values: UpdateAssignmentInput = { ...data }
  if (values.status !== undefined && values.status !== 'done') {
    values.grade = null
  }
  const [updated] = await db
    .update(assignments)
    .set({ ...values, updatedAt: new Date() })
    .where(and(eq(assignments.id, id), eq(assignments.userId, userId)))
    .returning()
  return updated
}

export async function deleteAssignment(userId: string, id: string) {
  const deleted = await db
    .delete(assignments)
    .where(and(eq(assignments.id, id), eq(assignments.userId, userId)))
    .returning({ id: assignments.id })
  return deleted.length > 0
}
