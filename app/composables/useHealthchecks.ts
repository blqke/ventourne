interface HealthCheckResponse {
  description: string
  status: number
  message: string
  time: number
  timestamp: number
}

export interface HealthCheckData {
  pending: boolean
  data?: HealthCheckResponse | null
}

export async function useHealthchecks() {
  const cookie = useCookie('nuxt-session')
  const route = useRoute()
  const ventourneToken = route.query['ventourne-token'] ?? useRequestHeaders(['ventourne-token'])['ventourne-token']
  const headers: Record<string, string> = {
    'Cookie': `nuxt-session=${cookie.value}`,
    'ventourne-token': ventourneToken as string || '',
  }
  let data: string[] = []
  try {
    data = await $fetch<string[]>('/api/healthchecks', { headers })
  }
  catch (e) {
    console.error('Failed to fetch healthchecks:', e)
  }
  const healthChecksRoutes = data ?? []
  const healthChecks = ref<Record<string, HealthCheckData>>(
    Object.fromEntries(
      healthChecksRoutes.map((route: string) => [
        route,
        { pending: true, data: null },
      ]),
    ),
  )
  const fetchHealthChecks = (): Promise<void>[] => {
    return healthChecksRoutes.map(async (hcRoute: string) => {
      try {
        const response = await $fetch<HealthCheckResponse>(hcRoute, { headers })
        healthChecks.value[hcRoute] = {
          pending: false,
          data: response,
        }
      }
      catch (error) {
        healthChecks.value[hcRoute] = {
          pending: false,
          data: null,
        }
      }
    })
  }

  return {
    healthChecks: toRef(healthChecks),
    healthChecksRoutes,
    fetchHealthChecks,
  }
}
