<script setup lang="ts">
interface Props {
  route: string
  checkData: HealthCheckData
}

const { checkData } = defineProps<Props>()
const checkInfo = computed(() => {
  if (checkData.pending) {
    return {
      icon: 'i-mdi-loading',
      iconClass: 'text-orange-500 animate-spin',
    }
  }

  return checkData.data?.status === 200
    ? {
        icon: 'i-mdi-checkbox-marked',
        iconClass: 'text-green-500',
      }
    : {
        icon: 'i-mdi-close-circle',
        iconClass: 'text-red-500 animate-pulse',
      }
})
</script>

<template>
  <UPopover mode="hover">
    <UIcon
      :name="checkInfo.icon"
      class="size-6"
      :class="checkInfo.iconClass"
    />
    <template #panel>
      <slot />
    </template>
  </UPopover>
</template>
