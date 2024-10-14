import { defineHealthcheckEventHandler } from '~~/server/utils/healthcheck'

export default defineHealthcheckEventHandler(
  async () => {
    const users = await useDrizzle()
      .select()
      .from(tables.users)
      .all()
    return `Successfully fetched ${users.length} users with drizzle`
  },
  {
    description: 'Can get users with drizzle ?',
    maxAge: 1,
  },
)
