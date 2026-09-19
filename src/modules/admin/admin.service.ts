import { desc, eq } from 'drizzle-orm'
import { db } from '../../lib/database'
import { allowedEmail } from '../../lib/database/schema'

export async function isEmailAllowed(email: string) {
  const [row] = await db
    .select({ id: allowedEmail.id })
    .from(allowedEmail)
    .where(eq(allowedEmail.email, email.toLowerCase()))
  return !!row
}

export function listAllowedEmails() {
  return db.select().from(allowedEmail).orderBy(desc(allowedEmail.createdAt))
}

export async function addAllowedEmail(email: string) {
  try {
    const [created] = await db
      .insert(allowedEmail)
      .values({ email: email.toLowerCase() })
      .returning()
    return created
  } catch (e) {
    const err = e as { code?: string; cause?: { code?: string } }
    const code = err.code ?? err.cause?.code
    if (code === '23505' || String(e).includes('allowed_email_email')) return null
    throw e
  }
}

export async function removeAllowedEmail(id: string) {
  const [deleted] = await db
    .delete(allowedEmail)
    .where(eq(allowedEmail.id, id))
    .returning()
  return deleted
}
