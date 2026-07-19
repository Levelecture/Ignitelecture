import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './lib/database';
import { env } from './lib/env';
import { admin, openAPI, bearer } from 'better-auth/plugins';
import { createId } from '@paralleldrive/cuid2';

export const auth = betterAuth({
	baseURL: env.BETTER_AUTH_URL,
	secret: env.BETTER_AUTH_SECRET,
	database: drizzleAdapter(db, { provider: 'pg' }),
	plugins: [openAPI(), admin(), bearer()],
	trustedOrigins: [
		env.FRONTEND_URL,
		env.BETTER_AUTH_URL,
	],
  emailAndPassword: { enabled: false },
	socialProviders: {
		google: {
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET
		}
	},
	session: {
		expiresIn: 60 * 60 * 24 * 7,
		updateAge: 60 * 60 * 24
	},
	user: {
		additionalFields: {
			role: {
				type: 'string',
				input: false
			},
			premium: {
				type: 'boolean',
				input: false
			}
		}
	},
	advanced: {
		database: {
			generateId: () => createId()
		},
		ipAddress: {
			ipAddressHeaders: ['cf-connecting-ip']
    }
    // backgroundTasks: {
    //    handler: (promise) => ctx.waitUntil(promise),
    // },
	}
});
