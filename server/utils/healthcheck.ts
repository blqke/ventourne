import type { EventHandler, H3Event } from 'h3'
import { H3Error } from 'h3'
import type { CachedEventHandlerOptions } from 'nitropack'
import { kebabCase } from 'scule'

export interface HealthcheckOptions extends Omit<CachedEventHandlerOptions, 'getKey' | 'shouldBypassCache' | 'shouldInvalidateCache'> {
  description: string
}

type MakeSureHandler = (event?: H3Event) => string | boolean | Promise<boolean> | Promise<string>

const handler = async (
  event: H3Event,
  condition: MakeSureHandler,
): Promise<{ status: number, statusText: string }> => {
  const result = await condition(event)
  if (!result) {
    throw createError({
      statusCode: 500,
      statusMessage: typeof result === 'string' ? result : 'Check failed',
    })
  }
  return {
    status: 200,
    statusText: typeof result === 'string' ? result : 'Check passed',
  }
}

export const defineHealthcheckEventHandler = (makeSure: MakeSureHandler, options: HealthcheckOptions): EventHandler => {
  // cached for 2 minutes by default
  const { description, maxAge = 60 * 2, ...cacheOptions } = options

  return defineCachedEventHandler(
    async (event: H3Event) => {
      const start = performance.now()
      let result: { status: number, statusText: string } = { status: 200, statusText: 'Check passed' }
      try {
        result = await handler(
          event,
          makeSure,
        )
      }
      catch (error) {
        if (error instanceof H3Error) {
          result = {
            status: error.statusCode,
            statusText: error.statusMessage ?? 'Check failed',
          }
        }
        else {
          result = {
            status: 500,
            statusText: (error as Error).message,
          }
        }
      }

      const end = performance.now()
      const time = Number((end - start).toFixed(2))

      return {
        description,
        time,
        status: result.status,
        message: result.statusText,
        timestamp: new Date().toISOString(),
      }
    },
    {
      getKey: () => `healthcheck:${kebabCase(description)}`,
      shouldBypassCache: () => false,
      shouldInvalidateCache: () => false,
      swr: false,
      maxAge,
      ...cacheOptions,
    },
  )
}
