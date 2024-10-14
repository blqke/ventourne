import { defineHealthcheckEventHandler } from '~~/server/utils/healthcheck'

export default defineHealthcheckEventHandler(
  async () => {
    await $fetch('https://www.google.com/404') // use this to trigger 404 error from $fetch
    return 'Will never display this'
  },
  {
    description: 'Can I fetch google.com/404 ?',
    maxAge: 1,
  },
)
