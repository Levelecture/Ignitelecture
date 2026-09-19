import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { auth } from './auth'
import { env } from './lib/env'
import { Scalar } from '@scalar/hono-api-reference'
import courses from './modules/courses/courses.controller'
import admin from './modules/admin/admin.controller'

const app = new Hono()

app.use('/api/*', cors({
  origin: [env.SITE_URL],
  allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
	allowHeaders: ["Content-Type", "Authorization"],
  exposeHeaders: ["Content-Length", "X-Retry-After"],
	credentials: true,
	maxAge: 10 * 60,
}))

app.on(['POST', 'GET'], '/api/auth/*', (c) => {
	return auth.handler(c.req.raw)
})

app.route('/api/courses', courses)
app.route('/api/admin', admin)

app.get('/docs', Scalar({
	pageTitle: 'IgniteLecture API',
	url: '/api/auth/open-api/generate-schema',
}))

app.get('/', (c) => {
	return c.text('Hello Hono!')
})

export default app