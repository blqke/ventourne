<script lang="ts" setup>
const { $csrfFetch } = useNuxtApp()
const { loggedIn, session, user } = useUserSession()

const items = [
  [
    { label: `Logged in as ${user.value?.githubUsername}` },
    {
      label: 'Logout',
      icon: 'i-ph-sign-out-duotone',
      click: async () => {
        await $csrfFetch('/api/_auth/session', {
          method: 'DELETE',
        })

        session.value = {}

        window.location.reload()
      },
    },
  ],
]

const title = useRuntimeConfig().app.name
const icon = useAppConfig().app.logo
const isReadmeOpen = ref(!loggedIn.value)

await queryContent('/docs/readme').findOne()
</script>

<template>
  <UHeader
    :title
    :ui="{ logo: 'items-center' }"
  >
    <template #logo>
      <img
        class="h-6 w-6"
        :src="icon"
        aria-hidden
      >

      <span> {{ title }} </span>
    </template>

    <template #right>
      <UButton
        color="gray"
        variant="ghost"
        size="sm"
        icon="i-heroicons-question-mark-circle"
        square
        padded
        @click="isReadmeOpen = true"
      />
      <USlideover
        v-model="isReadmeOpen"
        :ui="{ width: 'w-screen max-w-3xl' }"
        class="h-full scroll-y-auto"
      >
        <div class="p-4 flex-1">
          <UButton
            color="gray"
            variant="ghost"
            size="sm"
            icon="i-heroicons-x-mark-20-solid"
            class="flex sm:hidden absolute end-5 top-5 z-10"
            square
            padded
            @click="isReadmeOpen = false"
          />
          <div class="prose prose-primary dark:prose-invert max-w-none prose-sm overflow-y-auto h-[100vh]">
            <ContentDoc path="/docs/readme" />
          </div>
        </div>
      </USlideover>
      <UColorModeButton />
      <template v-if="loggedIn && user">
        <UDropdown
          :items="items"
          :popper="{ placement: 'bottom-end' }"
        >
          <UButton
            color="gray"
            aria-label="Profile picture of connected user"
            variant="ghost"
            square
          >
            <AppAvatar :src="user.avatar" />
          </UButton>
        </UDropdown>
      </template>
    </template>
  </UHeader>
</template>
