import { defineHealthcheckEventHandler } from '~~/server/utils/healthcheck'

export default defineHealthcheckEventHandler(
  async () => {
    const db = hubDatabase()
    const res = await db.prepare('SELECT COUNT(*) FROM "users"').first()
    return `Successfully counted ${res?.['COUNT(*)']} row(s) in users table`
  },
  {
    description: 'Can select count from db ?',
    maxAge: 1,
  },
)
