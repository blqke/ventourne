<script setup lang="ts">
const title = 'Le Vent tourne'

useSeoMeta({
  title,
})

const {
  healthChecks,
  healthChecksRoutes,
  fetchHealthChecks,
} = await useHealthchecks()
const rte = useRoute()
const fetchFromServer = rte.query.ssr === undefined ? false : true

if (fetchFromServer) {
  await Promise.all(fetchHealthChecks())
}
else {
  onMounted(async () => {
    if (healthChecksRoutes.length > 0) {
      await Promise.any(fetchHealthChecks())
    }
  })
}
const isAllGood = computed(() => Object.values(healthChecks.value).every(check => check?.data?.status === 200))
const isPending = computed(() => Object.values(healthChecks.value).some(check => check?.pending))

const statusInfo = computed(() => {
  if (isPending.value) {
    return { class: 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800', message: '⏳ Checks are pending' }
  }
  if (isAllGood.value) {
    return { class: 'text-white dark:text-green-600 bg-green-500 dark:bg-green-900', message: '👍 It\'s all good' }
  }
  return { class: 'text-white dark:text-red-200 bg-red-600 dark:bg-red-900', message: '☠️ Some checks failed' }
})

const event = useRequestEvent()
// Set 503 status code if checks fail, this is used by UptimeRobot & alternative
// to check if the site is down
// this only works server side, not on client
if (event && !isAllGood.value && !isPending.value) {
  setResponseStatus(event, 503)
}

const isGrid = ref(false)
</script>

<template>
  <UContainer>
    <UPage>
      <UPageBody class="space-y-8">
        <template v-if="healthChecksRoutes.length > 0">
          <div
            class="p-8 text-center rounded-lg mb-8"
            :class="statusInfo.class"
          >
            <h2 class="text-3xl font-bold mb-2">
              {{ statusInfo.message }}
            </h2>
          </div>

          <UCard>
            <ul
              v-if="isGrid"
              class="grid grid-cols-12 gap-2"
            >
              <HealthCheckItemIcon
                v-for="route in healthChecksRoutes"
                :key="route"
                :route="route"
                :check-data="healthChecks[route]"
              >
                <HealthCheckItem
                  :route="route"
                  :check-data="healthChecks[route]"
                />
              </HealthCheckItemIcon>
            </ul>
            <ul
              v-else
              class="space-y-4"
            >
              <HealthCheckItem
                v-for="route in healthChecksRoutes"
                :key="route"
                :route="route"
                :check-data="healthChecks[route]"
              />
            </ul>
          </UCard>
        </template>
        <template v-else>
          <UCard class="p-8">
            <div class="text-center">
              <p class="mb-4">
                Please log in to view healthchecks.
              </p>
              <UButton
                to="/login"
                color="black"
              >
                Login
              </UButton>
            </div>
          </UCard>
        </template>
      </UPageBody>
    </UPage>
  </UContainer>
</template>
