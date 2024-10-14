<script lang="ts" setup>
const props = defineProps<{
  src: string | null
}>()

const src = computed(() => {
  if (!props.src) {
    return
  }
  if (props.src.startsWith('http') || props.src.startsWith('data')) {
    return props.src
  }
  return null
})
</script>

<template>
  <UAvatar
    size="xs"
    :src
  />
</template>
