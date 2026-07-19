import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema'

export const db = (databaseUrl: string) => {
	const sql = neon(databaseUrl);
	return drizzle(sql, { schema });
}
