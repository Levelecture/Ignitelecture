import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { auth } from './auth'
import { env } from './lib/env'

const app = new Hono()

app.use('/api/*', cors({
	origin: (origin) => origin ?? env.FRONTEND_URL,
	credentials: true,
}))

app.on(['POST', 'GET'], '/api/auth/*', (c) => {
	return auth.handler(c.req.raw)
})

app.get('/', (c) => {
	return c.text('Hello Hono!')
})

export default app
