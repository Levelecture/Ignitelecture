import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './lib/database';
import { env } from './lib/env';
import { admin, openAPI, bearer } from 'better-auth/plugins';
import { APIError } from 'better-auth/api';
import { createId } from '@paralleldrive/cuid2';
import { isEmailAllowed } from './modules/admin/admin.service';

export const auth = betterAuth({
	baseURL: env.BETTER_AUTH_URL,
	secret: env.BETTER_AUTH_SECRET,
	database: drizzleAdapter(db, { provider: 'pg' }),
	plugins: [
		openAPI(),
		admin({
			defaultRole: 'user',
			bannedUserMessage:
				'Akses kamu ke pilot ini sudah dicabut. Hubungi admin kalau ini keliru.'
		}),
		bearer()
	],
	databaseHooks: {
		user: {
			create: {
				before: async (user) => {
					if (!(await isEmailAllowed(user.email)))
						throw new APIError('FORBIDDEN', {
							message: 'Akun ini tidak diundang untuk pilot.'
						});
					return { data: user };
				}
			}
		}
	},
	onAPIError: {
		errorURL: `${env.SITE_URL}/auth/error`
	},
	trustedOrigins: [env.SITE_URL],
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
