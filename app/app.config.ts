export default defineAppConfig({
  ui: {
    primary: 'green',
    gray: 'stone',
    card: {
      ring: 'ring-0',
      shadow: 'shadow-none',
      background: 'bg-gray-50 dark:bg-gray-800',
    },
    variables: {
      header: {
        height: '3rem',
      },
    },
  },
  app: {
    logo: '/favicon.svg',
  },
  footer: {
    notice: 'A Starter Template by Jules LIBERT',
    smallLinks: [
      {
        label: 'Contact',
        to: 'mailto:jules@gmail.com',
      },
    ],
  },
  socials: [
    {
      title: 'GitHub',
      icon: 'i-simple-icons-github',
      to: 'https://github.com/blqke/ventourne',
      target: '_blank',
    },
    {
      title: 'X',
      icon: 'i-simple-icons-x',
      to: 'https://x.com/jules_libert',
      target: '_blank',
    },
    {
      title: 'LinkedIn',
      icon: 'i-simple-icons-linkedin',
      to: 'https://www.linkedin.com/in/jlibert/',
      target: '_blank',
    },
  ],
})
