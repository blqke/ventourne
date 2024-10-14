import { defineHealthcheckEventHandler } from '~~/server/utils/healthcheck'

export default defineHealthcheckEventHandler(
  async () => {
    await $fetch('https://www.nuxt.com')
    return true
  },
  {
    description: 'Can GET www.nuxt.com ? cached 30 seconds',
    maxAge: 30, // cached for 30 seconds
  },
)
