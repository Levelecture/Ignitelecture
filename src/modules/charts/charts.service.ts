import { and, asc, count, eq, isNotNull } from 'drizzle-orm'
import { db } from '../../lib/database'
import { assignments } from '../../lib/database/schema'

export async function getAssignmentStatusCounts(userId: string) {
  const rows = await db
    .select({ status: assignments.status, count: count() })
    .from(assignments)
    .where(eq(assignments.userId, userId))
    .groupBy(assignments.status)

  const byStatus: Record<string, number> = { todo: 0, in_progress: 0, done: 0 }
  for (const row of rows) byStatus[row.status] = Number(row.count)
  return byStatus
}

export function getAssignmentGrades(userId: string) {
  return db
    .select({
      id: assignments.id,
      title: assignments.title,
      grade: assignments.grade,
    })
    .from(assignments)
    .where(and(eq(assignments.userId, userId), isNotNull(assignments.grade)))
    .orderBy(asc(assignments.createdAt))
}
