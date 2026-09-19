import { Hono } from 'hono'
import { sValidator } from '@hono/standard-validator'
import { authMiddleware, type AuthVars } from '../../middleware/auth.middleware'
import { addAllowedEmailSchema } from './admin.schema'
import * as adminService from './admin.service'

const app = new Hono<{ Variables: AuthVars }>()

app.use('*', authMiddleware)

app.use('*', async (c, next) => {
  const roles = c.get('user').role?.split(',') ?? []
  if (!roles.includes('admin')) return c.json({ error: 'Forbidden' }, 403)
  await next()
})

app.get('/allowlist', async (c) => {
  const rows = await adminService.listAllowedEmails()
  return c.json(rows)
})

app.post('/allowlist', sValidator('json', addAllowedEmailSchema), async (c) => {
  const created = await adminService.addAllowedEmail(c.req.valid('json').email)
  if (!created) return c.json({ error: 'Email already in allowlist' }, 409)
  return c.json(created, 201)
})

app.delete('/allowlist/:id', async (c) => {
  const deleted = await adminService.removeAllowedEmail(c.req.param('id'))
  if (!deleted) return c.json({ error: 'Not found' }, 404)
  return c.json(deleted)
})

export default app
