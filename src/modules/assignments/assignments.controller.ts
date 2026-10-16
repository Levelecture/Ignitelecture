import { Hono } from 'hono'
import { sValidator } from '@hono/standard-validator'
import { authMiddleware, type AuthVars } from '../../middleware/auth.middleware'
import {
  createAssignmentSchema,
  listAssignmentsQuerySchema,
  updateAssignmentSchema,
} from './assignments.schema'
import * as assignmentsService from './assignments.service'
import * as coursesService from '../courses/courses.service'

const app = new Hono<{ Variables: AuthVars }>()

app.use('*', authMiddleware)

app.get('/', sValidator('query', listAssignmentsQuerySchema), async (c) => {
  const rows = await assignmentsService.listAssignments(
    c.get('user').id,
    c.req.valid('query'),
  )
  return c.json({ data: rows })
})

app.get('/:id', async (c) => {
  const row = await assignmentsService.getAssignment(c.get('user').id, c.req.param('id'))
  if (!row) return c.json({ error: 'Not found' }, 404)
  return c.json(row)
})

app.post('/', sValidator('json', createAssignmentSchema), async (c) => {
  const userId = c.get('user').id
  const body = c.req.valid('json')
  const course = await coursesService.getCourse(userId, body.courseId)
  if (!course) return c.json({ error: 'Course not found' }, 404)
  if (body.grade != null && (body.status ?? 'todo') !== 'done')
    return c.json({ error: 'Grade hanya bisa diisi saat status done' }, 400)
  const created = await assignmentsService.createAssignment(userId, body)
  return c.json(created, 201)
})

app.patch('/:id', sValidator('json', updateAssignmentSchema), async (c) => {
  const userId = c.get('user').id
  const id = c.req.param('id')
  const body = c.req.valid('json')
  if (body.courseId) {
    const course = await coursesService.getCourse(userId, body.courseId)
    if (!course) return c.json({ error: 'Course not found' }, 404)
  }
  if (body.grade != null) {
    let status: string | undefined = body.status
    if (status === undefined) {
      const existing = await assignmentsService.getAssignment(userId, id)
      if (!existing) return c.json({ error: 'Not found' }, 404)
      status = existing.status
    }
    if (status !== 'done')
      return c.json({ error: 'Grade hanya bisa diisi saat status done' }, 400)
  }
  const updated = await assignmentsService.updateAssignment(userId, id, body)
  if (!updated) return c.json({ error: 'Not found' }, 404)
  return c.json(updated)
})

app.delete('/:id', async (c) => {
  const deleted = await assignmentsService.deleteAssignment(
    c.get('user').id,
    c.req.param('id'),
  )
  if (!deleted) return c.json({ error: 'Not found' }, 404)
  return c.json({ data: deleted })
})

export default app
