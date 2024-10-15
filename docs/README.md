> [!NOTE]
> I made this primarily for my own needs: I am using it as a single entrypoint for all my side-projects, to make sure everything is working fine.
> Any monitoring service can use this endpoint to check if everything is ok.
> For example, when something goes wrong, I am directly pinged via Discord from [UptimeRobot](https://uptimerobot.com/).

# Ventourne

![Ventourne screenshot](/public/images/screenshot.png)

## Introduction
Ventourne is a simple [NuxtHub](https://hub.nuxt.com/) starter template that provides a simple healthcheck page for your needs. Inspired by [Levelsio's Podcast with Lex Friedman](https://www.youtube.com/watch?v=oFtjKbXKqbg) and based on [Allgood](https://github.com/rameerez/allgood) by [@rameerez](https://x.com/rameerez/status/1827024731133882390).

## How it works?
**It's a simple healthcheck page**: the goal is to check the health of everything you need to keep an eye on.

Just put your healthchecks in `server/routes/healthchecks/` and they will be automatically fetched and displayed on `{yoururl.com}/healthcheck`. You can give this URL `{yoururl.com}/healthcheck?ssr` to any monitoring service to check if everything is OK.
- (Optional) You can authorize only some users to access the healthchecks.
- (Optional) You can use token authentication to access this page.

It is also explained well [here](https://x.com/rameerez/status/1827024731133882390)

### Fully integrated with NuxtHub
This starter template is leveraging several NuxtHub features:
- 🗄️ [NuxtHub Cache](https://hub.nuxt.com/docs/features/cache) (to cache healthchecks results)
- 📦 [NuxtHub Database](https://hub.nuxt.com/docs/features/database) with [DrizzleORM](https://hub.nuxt.com/docs/recipes/drizzle) (to store users and some healthchecks examples)
- 💻 [NuxtHub Browser](https://hub.nuxt.com/docs/features/browser): You can easily use a Puppeteer instance in your healthchecks 🤯
- 🎨 [NuxtUI](https://ui.nuxt.com/) 
- 🔑 [Nuxt Auth Utils](https://github.com/atinux/nuxt-auth-utils)

### It is made to work like this:
1. You write simple checks you often need to make sure everything is working fine with your apps, businesses, etc.
  Some examples:
    - Check if you earned at least $1 in the last 12 hours on your Stripe account. If not, you probably have some issues.
    - Check you sent at least 1 mail to customers in the last 24 hours; if not, you probably have some issues.
    - Check your database is still working
    - Check your disk space usage is below 90% (if you are using a VPS instead of a Cloudflare worker)
    - Check if your third-party API integrations are responding within acceptable time limits
    - Check if SSL certificates are up to date and not expiring soon
    - Verify if API rate limits are not being exceeded
    - Verify that important scheduled tasks ran successfully (e.g., daily reports, backups)
    - Monitor for broken links on your website (Maybe with [NuxtSEO Link Checker](https://nuxtseo.com/link-checker/guides/live-inspections)?)
    - Check if search functionality is returning relevant results
    - Verify that backups are being created and stored correctly
    - Live integration tests with [Puppeteer](https://pptr.dev/)
    - etc.
2. When you go on the page, it runs all the checks and displays the results. Some healthchecks are cached via [Nitro's cache storage](https://nitro.unjs.io/guide/cache#customize-cache-storage), thanks to the [NuxtHub cache](https://hub.nuxt.com/docs/features/cache) feature. So it is fully working with [Cloudflare Workers KV](https://developers.cloudflare.com/kv)
3. This `/healthcheck?ssr` endpoint can be utilized for monitoring your application's health through services like UptimeRobot or Pingdom. These monitoring tools will periodically access your healthcheck page, typically every few minutes, triggering the execution of all your defined health checks each time the page is fetched. If you need authentication, you can give `/healthcheck?ssr&ventourne-token=token` to the monitoring service.

## Setup

Ensure to install the dependencies:

```bash
pnpm install
```

Next, set up a `.env` file based on the `.env.example` template. Modify the values as necessary.

## Development Server

Launch the development server at `http://localhost:3000`:

```bash
pnpm run dev
```

To make sure remote cloudflare services are working, you can run:
```bash
npx nuxt dev --remote
```

## Production

This application is intended for deployment on [Cloudflare](https://cloudflare.com). You can effortlessly utilize [NuxtHub Admin](https://hub.nuxt.com/docs/getting-started/deploy#nuxthub-admin) for a smooth deployment process or use the CLI:

```bash
npx nuxthub deploy
```

You will also need a [Nuxt UI Pro License](https://ui.nuxt.com/pro) to build the application for production.

## Configuration

### Simple start
If you don't want to use any authentication, you can set the following environment variable:
```bash
NUXT_ENABLE_OAUTH=false
```
No need to set any other variables.

### GitHub auth
You can log in with GitHub and authorize only specific users to access the healthchecks.

For this, you need to set the following environment variables:
```bash
NUXT_OAUTH_GITHUB_CLIENT_ID=
NUXT_OAUTH_GITHUB_CLIENT_SECRET=
NUXT_VENTOURNE_GITHUB_USERNAMES=username1,username2,etc # (if empty, every github user can access when authenticated)
```


### Token auth
Or you can use the token authentication system, with a token in query params or in headers.

For this, you need to set the following environment variable:
```bash
NUXT_VENTOURNE_TOKEN=use-this-token-in-request-query-params-or-headers-to-bypass-authentication
```

### Improvements

If you don't want to use external monitoring services such as [UptimeRobot](https://uptimerobot.com/) or [Pingdom](https://www.pingdom.com/), we could be able to leverage [Cloudflare Cron Triggers](https://developers.cloudflare.com/workers/configuration/cron-triggers/) in the future to run healthchecks at scheduled times.

## Some examples

Here are some examples of healthchecks you can create in `server/routes/healthchecks/`:

### 1. Simple GET check


```typescript
import { defineHealthcheckEventHandler } from '~~/server/utils/healthcheck'

export default defineHealthcheckEventHandler(
  async () => {
    await $fetch('https://www.google.com')
    return true
  },
  {
    description: 'Can ping www.google.com ?',
    maxAge: 1, // cached for 1 second
  },
)
```


### 2. Cached Check


```typescript
import { defineHealthcheckEventHandler } from '~~/server/utils/healthcheck'

export default defineHealthcheckEventHandler(
  async () => {
    return 'Successfully did nothing'
  },
  {
    description: 'cached for 15 seconds',
    maxAge: 15,
  },
)
```

### 3. Headless Browser Interaction Check

You can use Puppeteer to perform more complex checks in just a few lines of code.
```typescript
import { defineHealthcheckEventHandler } from '~~/server/utils/healthcheck'

export default defineHealthcheckEventHandler(
  async () => {
    const { page } = await hubBrowser()
    await page.setViewport({ width: 1920, height: 1080 })
    await page.goto('https://nuxt.com', { waitUntil: 'domcontentloaded' })
    return 'Successfully went to nuxt.com with an headless browser'
  },
  {
    description: 'Can use a browser ? Cached for 10 minutes',
    maxAge: 60 * 10, // cached for 10 minutes
  },
)
```
The page instance is automatically closed after the response is sent.


### 4. Intentional Failure Check

To fail, you can throw an error or simply return false.
```typescript
import { defineHealthcheckEventHandler } from '~~/server/utils/healthcheck'
export default defineHealthcheckEventHandler(
  async () => {
    await $fetch('https://www.google.com/404') // will automatically throw an Error here
    return true
  },
  {
    description: 'Can ping www.google.com/404 ?',
    maxAge: 1,
  },
)

import { defineHealthcheckEventHandler } from '~~/server/utils/healthcheck'
export default defineHealthcheckEventHandler(
  async () => {
    return false
  },
  {
    description: 'Will always fail',
    maxAge: 1,
  },
)
```


## Creating Your Own Healthchecks

To create a new healthcheck:

1. Create a new file in the `server/routes/healthchecks/` directory.
2. Use the `defineHealthcheckEventHandler` function to define your check.
3. Implement your check logic in the first argument function.
4. Provide options including a description and cache duration in the second argument.

Here's a template to get you started:

```typescript
import { defineHealthcheckEventHandler } from '~~/server/utils/healthcheck'

export default defineHealthcheckEventHandler(
  async () => {
    // Your check logic here
    // Return true if the check passes, or a string message for more detail
    // Throw an error or return false if the check fails
  },
  {
    description: 'Description of your healthcheck',
    maxAge: 60, // Cache duration in seconds
  },
)

```

## Inspirations / Thanks

- [Levelsio's Podcast with Lex Friedman](https://www.youtube.com/watch?v=oFtjKbXKqbg)
- [Allgood](https://github.com/rameerez/allgood) 
- [Gavarnie](https://github.com/barbapapazes/gavarnie)
- [Laravel Health Check](https://github.com/MRTSec/laravel-health-check)

## License

[MIT License](./LICENSE)
