import { defineHealthcheckEventHandler } from '~~/server/utils/healthcheck'

export default defineHealthcheckEventHandler(
  async () => {
    return 'Successfully did nothing'
  },
  {
    description: 'cached for 15 seconds',
    maxAge: 15, // cached for 15 seconds
  },
)
