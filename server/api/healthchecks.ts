import { handlersMeta } from '#internal/nitro/virtual/server-handlers'

export default defineEventHandler(async () => {
  const healthcheckRoutes = handlersMeta.filter(route => route.route.startsWith('/healthchecks'))
  return healthcheckRoutes.map(hc => hc.route)
})
