import { Hono } from 'hono'
import { sValidator } from '@hono/standard-validator'
import { authMiddleware, type AuthVars } from '../../middleware/auth.middleware'
import { createCourseSchema, updateCourseSchema } from './courses.schema'
import * as coursesService from './courses.service'

const app = new Hono<{ Variables: AuthVars }>()

app.use('*', authMiddleware)

app.get('/', async (c) => {
  const rows = await coursesService.listCourses(c.get('user').id)
  return c.json(rows)
})

app.get('/:id', async (c) => {
  const row = await coursesService.getCourse(c.get('user').id, c.req.param('id'))
  if (!row) return c.json({ error: 'Not found' }, 404)
  return c.json(row)
})

app.post('/', sValidator('json', createCourseSchema), async (c) => {
  const created = await coursesService.createCourse(c.get('user').id, c.req.valid('json'))
  if (!created) return c.json({ error: 'Course code already exists' }, 409)
  return c.json(created, 201)
})

app.patch('/:id', sValidator('json', updateCourseSchema), async (c) => {
  const updated = await coursesService.updateCourse(
    c.get('user').id,
    c.req.param('id'),
    c.req.valid('json'),
  )
  if (!updated) return c.json({ error: 'Not found' }, 404)
  return c.json(updated)
})

app.delete('/:id', async (c) => {
  const deleted = await coursesService.deleteCourse(c.get('user').id, c.req.param('id'))
  if (!deleted) return c.json({ error: 'Not found' }, 404)
  return c.json(deleted)
})

export default app
