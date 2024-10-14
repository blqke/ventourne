<script lang="ts" setup>
useHead({
  titleTemplate: title => title ? `${title} - Ventourne` : 'Ventourne',
})
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
