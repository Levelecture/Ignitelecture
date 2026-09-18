import type { Context, Next } from 'hono'
import { auth } from '../auth'

export type AuthVars = { user: { id: string } }

export async function authMiddleware(c: Context<{ Variables: AuthVars }>, next: Next) {
  const session = await auth.api.getSession({ headers: c.req.raw.headers })
  if (!session) return c.json({ error: 'Unauthorized' }, 401)
  c.set('user', session.user)
  await next()
}
