<script lang="ts" setup>
defineProps<{
  title: string
  description: string
}>()
</script>

<template>
  <UAuthForm
    :title
    :description
    align="bottom"
    :providers="[
      { label: 'GitHub', icon: 'i-simple-icons-github', color: 'gray', external: true, to: '/auth/github' },
    ]"
  >
    <template #footer>
      <slot />
    </template>
  </UAuthForm>
</template>
