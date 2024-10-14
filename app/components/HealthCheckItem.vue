<script setup lang="ts">
interface Props {
  route: string
  checkData: HealthCheckData
}

const { route, checkData } = defineProps<Props>()
const checkInfo = computed(() => {
  if (checkData.pending) {
    return {
      icon: 'i-mdi-loading',
      iconClass: 'text-orange-500 animate-spin',
      messageClass: 'bg-orange-100 dark:bg-orange-900 text-orange-500',
    }
  }

  return checkData.data?.status === 200
    ? {
        icon: 'i-mdi-checkbox-marked',
        iconClass: 'text-green-500',
        messageClass: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300',
      }
    : {
        icon: 'i-mdi-close-circle',
        iconClass: 'text-red-500 animate-pulse',
        messageClass: 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300',
      }
})

const formattedDate = computed(() => {
  if (!checkData.data?.timestamp) {
    return ''
  }
  return useTimeAgo(new Date(checkData.data.timestamp), { showSecond: true, updateInterval: 1000 })
})
</script>

<template>
  <li class="flex items-center justify-between space-y-2 sm:space-y-0">
    <div class="flex items-start sm:items-center overflow-hidden">
      <UIcon
        :name="checkInfo.icon"
        class="mr-2 size-6 shrink-0"
        :class="checkInfo.iconClass"
      />
      <a
        v-if="!checkData.pending"
        :href="route"
        target="_blank"
        class="flex flex-col sm:flex-row sm:items-center gap-1 sm:space-x-1 grow"
      >
        <span class="shrink-0">{{ checkData.data?.description }}:</span>
        <span
          :class="[
            'font-mono text-sm px-1 rounded shrink truncate',
            checkInfo.messageClass,
          ]"
        >
          {{ checkData.data?.message }}
        </span>
      </a>
      <a
        v-else
        :href="route"
        target="_blank"
      >
        {{ route }}
      </a>
    </div>
    <div
      v-if="checkData.data"
      class="flex flex-col sm:flex-row items-end sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 shrink-0"
    >
      <ClientOnly>
        <span class="font-mono text-sm bg-gray-100 dark:bg-gray-800 rounded text-gray-700 dark:text-gray-400 px-1">
          {{ formattedDate }}
        </span>
      </ClientOnly>
      <span class="font-mono text-sm bg-gray-100 dark:bg-gray-800 rounded text-gray-500 dark:text-gray-600 px-1">{{ checkData.data?.time }}ms</span>
    </div>
  </li>
</template>
