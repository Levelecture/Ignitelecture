import { Hono } from 'hono'
import { authMiddleware, type AuthVars } from '../../middleware/auth.middleware'
import * as chartsService from './charts.service'

const app = new Hono<{ Variables: AuthVars }>()

app.use('*', authMiddleware)

app.get('/status', async (c) => {
  const counts = await chartsService.getAssignmentStatusCounts(c.get('user').id)
  return c.json({ data: counts })
})

app.get('/grades', async (c) => {
  const grades = await chartsService.getAssignmentGrades(c.get('user').id)
  return c.json({ data: grades })
})

export default app
