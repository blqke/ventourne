const isProd = process.env.NODE_ENV === 'production'

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  extends: ['@nuxt/ui-pro'],
  modules: [
    '@nuxt/eslint',
    '@nuxthub/core',
    'nuxt-auth-utils',
    '@nuxt/ui',
    'nuxt-security',
    '@vueuse/nuxt',
    '@nuxt/content',
    '@nuxt/image',
  ],
  routeRules: {
    '/': {
      prerender: false,
      redirect: '/healthcheck',
    },
    '/healthcheck': {
      prerender: false,
    },
    '/api/_hub/**': {
      csurf: false,
      security: {
        rateLimiter: false,
        corsHandler: false,
      },
    },
    '/**': {
      prerender: true,
      security: {
        rateLimiter: false,
      },
    },
  },
  runtimeConfig: {
    app: {
      name: 'Le Vent Tourne',
      url: '',
    },
    enable: {
      oauth: process.env.NUXT_ENABLE_OAUTH === 'true',
    },
    ventourne: {
      token: process.env.NUXT_VENTOURNE_TOKEN ?? '',
      github: {
        usernames: process.env.NUXT_VENTOURNE_GITHUB_USERS ?? '',
      },
    },
  },
  nitro: {
    experimental: {
      openAPI: true,
    },
  },
  hub: {
    database: true,
    blob: true,
    kv: true,
    cache: true,
    browser: true,
  },
  security: {
    csrf: true,
    rateLimiter: {
      driver: {
        name: 'cloudflare-kv-binding',
        options: {
          binding: 'KV',
        },
      },
    },
    headers: {
      contentSecurityPolicy: {
        'img-src': ['\'self\'', 'data:', 'https://avatars.githubusercontent.com', 'https://static-cdn.jtvnw.net/'],
        'script-src': ['\'self\'', 'https', '\'nonce-{{nonce}}\'', 'https://static.cloudflareinsights.com'],
      },
      crossOriginEmbedderPolicy: isProd ? 'credentialless' : false,
    },
  },
  csurf: {
    methodsToProtect: ['POST', 'PUT', 'PATCH', 'DELETE'],
  },
  colorMode: {
    preference: 'system',
  },
  eslint: {
    config: {
      stylistic: true,
    },
  },
  content: {
    // /docs/README.md is used via nuxt-content and via github
    sources: {
      docs: {
        prefix: '/docs',
        driver: 'fs',
        base: 'docs',
      },
    },
  },
  future: {
    compatibilityVersion: 4,
  },
  devtools: { enabled: true },
})
