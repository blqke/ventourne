import { defineHealthcheckEventHandler } from '~~/server/utils/healthcheck'

export default defineHealthcheckEventHandler(
  async () => {
    const db = hubDatabase()
    const { count } = await db.exec('SELECT COUNT(*) FROM "users"')

    return `Successfully counted ${count} row(s) in users table`
  },
  {
    description: 'Can select count from db ?',
    maxAge: 1,
  },
)
