import { defineHealthcheckEventHandler } from '~~/server/utils/healthcheck'

export default defineHealthcheckEventHandler(
  async () => {
    const { page } = await hubBrowser()
    await page.setViewport({ width: 1920, height: 1080 })
    await page.goto('https://nuxt.com', { waitUntil: 'domcontentloaded' })

    return 'Successfully went to nuxt.com with an headless browser'
  },
  {
    description: 'Can use a browser ? Cached for 60 minutes',
    maxAge: 60 * 60, // cached for 60 minutes
  },
)
