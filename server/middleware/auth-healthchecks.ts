import type { H3Event } from 'h3'

const checkSession = async (event: H3Event): Promise<boolean> => {
  const config = useRuntimeConfig()
  if (!config.enable.oauth) {
    return true
  }
  const session = await getUserSession(event)
  if (!session.user) {
    return false
  }
  const authorizedUsernames = config.ventourne?.github?.usernames
    ?.split(',')
    ?.map((username: string) => username.trim())
    ?.filter((username: string) => username !== '') ?? []
  if (authorizedUsernames.length === 0) {
    return true
  }
  return authorizedUsernames.includes(session.user?.githubUsername)
}

const checkAuthorization = (event: H3Event): boolean => {
  const config = useRuntimeConfig()
  if (!config.ventourne.token) {
    return true
  }
  // check either for query params or headers
  const token = getQuery(event)?.['ventourne-token'] || getHeader(event, 'ventourne-token')
  return token === config.ventourne?.token
}

export default defineEventHandler(async (event) => {
  if (event.path?.startsWith('/healthchecks') || event.path?.startsWith('/api/healthchecks')) {
    const isSessionValid = await checkSession(event)
    const isAuthorizationValid = checkAuthorization(event)
    if (!isAuthorizationValid && !isSessionValid) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
      })
    }
  }
})
